# routes/profiling.py

from fastapi import APIRouter, HTTPException
import pandas as pd
import os

# Import your existing profiling utility
from utils.profiling.profile_summary import get_column_info
from ml_engine.meta_feature_extractor import MetaFeatureExtractor
from ml_engine.preprocessing_suggester import PreprocessingSuggester

router = APIRouter(
    prefix="/profiling",
    tags=["Profiling"]
)

# 📁 Locate stored datasets
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "storage", "datasets")


@router.get("/{dataset_id}")
def get_profiling_info(dataset_id: str, target_column: str = None):
    file_path = os.path.join(DATASET_DIR, f"{dataset_id}.csv")

    # Check if dataset exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found.")

    try:
        # Load dataset
        df = pd.read_csv(file_path)

        # Column info (using your existing utility)
        column_info = get_column_info(df).to_dict(orient="records")

        # Descriptive statistics
        descriptive_stats = df.describe(include="all").fillna("").to_dict()

        # Missing values summary
        total_missing = int(df.isnull().sum().sum())

        # Meta-features
        # Validate target_column exists in dataframe
        if target_column and target_column not in df.columns:
            print(f"Warning: target_column '{target_column}' not found in dataset. Ignoring.")
            target_column = None

        meta_features = MetaFeatureExtractor.extract(df, target_column)
        
        # Generate suggestions
        suggestions = PreprocessingSuggester.get_suggestions(df, meta_features)

        from utils.json_sanitizer import sanitize_for_json

        response_data = {
            "rows": df.shape[0],
            "columns": df.shape[1],
            "total_missing_values": total_missing,
            "column_info": column_info,
            "descriptive_statistics": descriptive_stats,
            "meta_features": meta_features,
            "preprocessing_suggestions": suggestions,
            "preview": df.head().to_dict(orient="records")
        }
        
        return sanitize_for_json(response_data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
