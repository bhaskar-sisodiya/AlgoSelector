# routes/report.py

import os
import json
import pandas as pd
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from services.report_generator import ReportGenerator
from ml_engine.meta_feature_extractor import MetaFeatureExtractor

router = APIRouter(
    prefix="/report",
    tags=["Report"]
)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "storage", "datasets")
AUTOML_DIR = os.path.join(BASE_DIR, "storage", "automl")


def _load_automl_results(dataset_id: str) -> dict:
    """Load persisted AutoML/Recommendation results from JSON."""
    results_path = os.path.join(AUTOML_DIR, f"{dataset_id}_results.json")
    if not os.path.exists(results_path):
        raise HTTPException(
            status_code=404,
            detail="No AutoML results found for this dataset. Please run AutoML or Algorithm Recommendation first."
        )
    try:
        with open(results_path, "r") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read results: {e}")


def _assemble_report_data(dataset_id: str, automl_data: dict) -> dict:
    """
    Assemble the full data dict expected by ReportGenerator.
    Merges AutoML results with live dataset metadata.
    """
    # Load dataset for shape + meta features
    dataset_path = os.path.join(DATASET_DIR, f"{dataset_id}.csv")
    df = None
    rows, columns = 0, 0
    meta_features = {}

    if os.path.exists(dataset_path):
        try:
            df = pd.read_csv(dataset_path)
            rows = df.shape[0]
            columns = df.shape[1]
            # Extract meta-features (handles target_column being optional)
            target_col = automl_data.get("target_column")
            if target_col and target_col not in df.columns:
                target_col = None
            meta_features = MetaFeatureExtractor.extract(df, target_col)
        except Exception as e:
            print(f"Warning: Could not load dataset for report: {e}")

    # Determine dataset name from ID (strip UUID-like suffix if present, use raw ID)
    dataset_name = dataset_id

    # Determine task type
    task_type = "regression" if automl_data.get("is_regression") else "classification"

    # Build the automl_results sub-dict expected by ReportGenerator
    # Supports results from both /automl/run and /recommend/ endpoints
    algorithms = automl_data.get("algorithms", [])
    feature_importance = automl_data.get("feature_importance", [])

    # selection_reason may come from automl_runner (selection_reason key)
    # or from recommend route (simple_explanation key)
    selection_reason = (
        automl_data.get("selection_reason")
        or automl_data.get("simple_explanation")
        or "N/A"
    )

    best_algorithm = (
        automl_data.get("best_algorithm")
        or automl_data.get("top_algorithm")
        or (algorithms[0]["name"] if algorithms else "N/A")
    )

    reason_parts = automl_data.get("reason_parts", [])
    preprocessing_tips = automl_data.get("preprocessing_tips", [])

    return {
        "dataset_name": dataset_name,
        "dataset_id": dataset_id,
        "rows": rows or automl_data.get("rows", 0),
        "columns": columns or automl_data.get("columns", 0),
        "task_type": task_type,
        "target_column": automl_data.get("target_column", "N/A"),
        "meta_features": meta_features,
        "automl_results": {
            "algorithms": algorithms,
            "feature_importance": feature_importance,
            "selection_reason": selection_reason,
            "best_algorithm": best_algorithm,
            "reason_parts": reason_parts,
            "preprocessing_tips": preprocessing_tips,
        },
    }


@router.get("/download/{dataset_id}")
def download_report(dataset_id: str, format: str = "pdf"):
    """
    Download a generated report for the given dataset.

    Query params:
        format: 'pdf' (default) or 'docx'
    """
    format = format.lower().strip()
    if format not in ("pdf", "docx"):
        raise HTTPException(status_code=400, detail="Invalid format. Use 'pdf' or 'docx'.")

    # 1. Load persisted results
    automl_data = _load_automl_results(dataset_id)

    # 2. Assemble full report data
    report_data = _assemble_report_data(dataset_id, automl_data)

    # 3. Generate report
    try:
        if format == "pdf":
            buf = ReportGenerator.generate_pdf(report_data)
            media_type = "application/pdf"
            filename = f"AlgoSelector_Report_{dataset_id}.pdf"
        else:
            buf = ReportGenerator.generate_docx(report_data)
            media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            filename = f"AlgoSelector_Report_{dataset_id}.docx"
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {e}")

    return StreamingResponse(
        buf,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
