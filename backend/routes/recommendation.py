# routes/recommendation.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random
import numpy as np
import pandas as pd
import os

# Import your existing ML logic
from logic.selection.algorithm_recommender import recommend_algorithm
from logic.selection.imbalance_checker import check_class_imbalance

router = APIRouter(
    prefix="/recommend",
    tags=["Recommendation"]
)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "storage", "datasets")


# 📦 Request schema
class RecommendationRequest(BaseModel):
    dataset_id: str
    target_column: str


@router.post("/")
# def get_recommendation(req: RecommendationRequest):
#     file_path = os.path.join(DATASET_DIR, f"{req.dataset_id}.csv")

#     # Check dataset exists
#     if not os.path.exists(file_path):
#         raise HTTPException(status_code=404, detail="Dataset not found.")

#     # Load dataset
#     df = pd.read_csv(file_path)

#     # Validate target column
#     if req.target_column not in df.columns:
#         raise HTTPException(status_code=400, detail="Invalid target column.")

#     # --- Check Class Imbalance ---
#     try:
#         imbalance_ratio = check_class_imbalance(df, req.target_column)
#     except Exception:
#         imbalance_ratio = 1.0  # For regression cases

#     # --- Get Recommendation ---
#     results = recommend_algorithm(
#         df,
#         req.target_column,
#         imbalance_ratio
#     )

#     return {
#         "dataset_id": req.dataset_id,
#         "imbalance_ratio": imbalance_ratio,
#         "top_algorithm": results["top_algorithm"],
#         "recommendations": results["recommendations"],
#         "simple_explanation": results["simple_explanation"],
#         "reason_parts": results["reason_parts"]
#     }

@router.post("/")
def get_recommendation(req: RecommendationRequest):
    file_path = os.path.join(DATASET_DIR, f"{req.dataset_id}.csv")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found.")

    df = pd.read_csv(file_path)

    if req.target_column not in df.columns:
        raise HTTPException(status_code=400, detail="Invalid target column.")

    # -------------------------
    # Dataset characteristics
    # -------------------------
    rows = df.shape[0]
    cols = df.shape[1] - 1
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    categorical_cols = df.select_dtypes(exclude=np.number).columns.tolist()

    # -------------------------
    # Class imbalance check
    # -------------------------
    try:
        imbalance_ratio = check_class_imbalance(df, req.target_column)
    except Exception:
        imbalance_ratio = 1.0

    # -------------------------
    # Meta-learning recommendation (real logic)
    # -------------------------
    results = recommend_algorithm(
        df,
        req.target_column,
        imbalance_ratio
    )

    # -------------------------
    # 🔥 Smart Pseudo Metrics
    # -------------------------

    # Accuracy base influenced by:
    # - dataset size
    # - imbalance
    # - feature count

    size_factor = min(rows / 1000, 1.0)
    feature_factor = min(cols / 20, 1.0)
    imbalance_penalty = 0.05 if imbalance_ratio > 2 else 0.0

    base_accuracy = 0.80 + (size_factor * 0.08) + (feature_factor * 0.05)
    base_accuracy -= imbalance_penalty

    demo_algorithms = []
    for i, algo in enumerate(results["recommendations"]):
        accuracy = round((base_accuracy - i * 0.03) * 100, 2)

        # Training time based on rows
        training_time = round((rows / 1000) * random.uniform(0.5, 1.5), 2)

        demo_algorithms.append({
            "name": algo["name"],
            "accuracy": accuracy,
            "training_time": training_time
        })

    # -------------------------
    # Feature Importance (Smart)
    # -------------------------
    candidate_features = [col for col in df.columns if col != req.target_column]

    feature_importance = []
    for col in candidate_features[:6]:
        importance_score = random.uniform(40, 95)

        if col in numeric_cols:
            importance_score += 5  # slight boost

        feature_importance.append({
            "name": col,
            "value": round(min(importance_score, 100), 2)
        })

    # Sort by importance
    feature_importance = sorted(
        feature_importance,
        key=lambda x: x["value"],
        reverse=True
    )

    return {
        "dataset_id": req.dataset_id,
        "rows": rows,
        "columns": cols,
        "imbalance_ratio": imbalance_ratio,
        "top_algorithm": results["top_algorithm"],
        "algorithms": demo_algorithms,
        "feature_importance": feature_importance,
        "simple_explanation": results["simple_explanation"],
        "reason_parts": results["reason_parts"]
    }
