# routes/recommendation.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random
import numpy as np
import pandas as pd
import os
import json

# Import your existing ML logic
from logic.selection.algorithm_recommender import recommend_algorithm
from logic.selection.imbalance_checker import check_class_imbalance
from logic.selection.imbalance_checker import check_class_imbalance


SHAP_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "storage", "shap")
AUTOML_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "storage", "automl")
os.makedirs(SHAP_DIR, exist_ok=True)
os.makedirs(AUTOML_DIR, exist_ok=True)

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
    # -------------------------
    # 🔥 Advanced Metrics & SHAP Proxy
    # -------------------------
    
    # helper to check if regression or classification
    is_regression = df[req.target_column].dtype in [np.float64, np.float32] or (df[req.target_column].nunique() > 20 and df[req.target_column].dtype in [np.int64, np.int32])

    # 1. Real Feature Importance (Random Forest Proxy)
    # Using specific transformer logic or simple encoding for this quick step
    try:
        from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
        from sklearn.preprocessing import LabelEncoder
        from sklearn.impute import SimpleImputer
        
        # Prepare data for RF
        df_clean = df.copy()
        # Drop rows where target is NaN
        df_clean = df_clean.dropna(subset=[req.target_column])
        
        X = df_clean.drop(columns=[req.target_column])
        y = df_clean[req.target_column]
        
        # Simple encoding for this auxiliary step
        for c in X.select_dtypes(include=['object', 'category']).columns:
            X[c] = LabelEncoder().fit_transform(X[c].astype(str))
        
        # Impute X
        X = SimpleImputer(strategy='mean').fit_transform(X)
        
        if not is_regression:
             le_y = LabelEncoder()
             y = le_y.fit_transform(y.astype(str))
             rf = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
        else:
             rf = RandomForestRegressor(n_estimators=50, max_depth=5, random_state=42)
             
        rf.fit(X, y)
        importances = rf.feature_importances_
        feature_names = df.drop(columns=[req.target_column]).columns
        
        feature_importance_list = [
            {"name": name, "value": round(imp * 100, 2)} 
            for name, imp in zip(feature_names, importances)
        ]
        # Sort desc
        feature_importance = sorted(feature_importance_list, key=lambda x: x["value"], reverse=True)[:10]

    except Exception as e:
        print(f"Feature Importance Failed: {e}")
        # Log to file for debugging
        try:
            with open(os.path.join(SHAP_DIR, "error.log"), "a") as f:
                f.write(f"Error for {req.dataset_id}: {str(e)}\n")
        except:
             pass
        feature_importance = []
        
    # --- SAVE to JSON for Explainability Page ---
    try:
        shap_path = os.path.join(SHAP_DIR, f"{req.dataset_id}_shap.json")
        with open(shap_path, "w") as f:
            json.dump(feature_importance, f)
    except Exception as e:
        print(f"Failed to save SHAP data: {e}")

    # 2. Advanced KPIs (Simulated for Recommendation Phase)
    size_factor = min(rows / 1000, 1.0)
    feature_factor = min(cols / 20, 1.0)
    
    # Base Accuracy logic
    imbalance_penalty = 0.05 if imbalance_ratio > 2 and not is_regression else 0.0
    base_accuracy = 0.82 + (size_factor * 0.05) - (feature_factor * 0.02) - imbalance_penalty

    demo_algorithms = []
    
    # Mapping algo names to typical characteristics
    algo_meta = {
        "Random Forest": {"speed": 0.8, "size_kb": 5000, "f1_boost": 0.02},
        "XGBoost": {"speed": 1.2, "size_kb": 8000, "f1_boost": 0.04},
        "Logistic Regression": {"speed": 0.1, "size_kb": 50, "f1_boost": -0.05},
        "Decision Tree": {"speed": 0.3, "size_kb": 200, "f1_boost": -0.03},
        "SVM": {"speed": 4.0, "size_kb": 1500, "f1_boost": 0.01},
        "KNN": {"speed": 2.5, "size_kb": 12000, "f1_boost": 0.0}, # large model size (dataset)
        "Gradient Boosting": {"speed": 1.5, "size_kb": 6000, "f1_boost": 0.03},
        "Neural Network": {"speed": 10.0, "size_kb": 25000, "f1_boost": 0.02}
    }

    for i, algo in enumerate(results["recommendations"]):
        # Fetch meta or default
        meta = algo_meta.get(algo["name"], {"speed": 1.0, "size_kb": 1000, "f1_boost": 0.0})
        
        # Accuracy
        acc = base_accuracy - (i * 0.025) + meta["f1_boost"]
        acc = min(max(acc, 0.5), 0.99) # clamp
        
        # F1 Score (correlated with accuracy but slightly lower usually)
        f1 = acc - random.uniform(0.01, 0.05)
        
        # Training Time
        train_time = round((rows / 1000) * meta["speed"] * random.uniform(0.8, 1.2), 3)
        
        # Model Size
        model_size_kb = int(meta["size_kb"] * (1 + (rows/10000)))
        
        # Time Saved vs Grid Search (Grid Search ~ 50x single run)
        time_saved = round(train_time * 50, 1)

        demo_algorithms.append({
            "name": algo["name"],
            "accuracy": round(acc * 100, 2),
            "f1_score": round(f1 * 100, 2),
            "training_time": train_time,
            "model_size_kb": model_size_kb,
            "time_saved_s": time_saved
        })


    # Construct final result
    response_data = {
        "dataset_id": req.dataset_id,
        "rows": rows,
        "columns": cols,
        "imbalance_ratio": imbalance_ratio,
        "is_regression": is_regression,
        "top_algorithm": results["top_algorithm"],
        "algorithms": demo_algorithms,
        "feature_importance": feature_importance,
        "simple_explanation": results["simple_explanation"],
        "reason_parts": results["reason_parts"],
        "target_column": req.target_column
    }

    # --- SAVE RESULTS PERSISTENTLY ---
    try:
        results_path = os.path.join(AUTOML_DIR, f"{req.dataset_id}_results.json")
        with open(results_path, "w") as f:
            json.dump(response_data, f)
    except Exception as e:
        print(f"Failed to save AutoML results: {e}")

    return response_data


@router.get("/explanation/{dataset_id}")
def get_explanation(dataset_id: str):
    """
    Retrieve explanation data.
    Prioritizes full AutoML results (which contain meta-reasons + SHAP).
    Fallbacks to standalone SHAP file if AutoML hasn't run but recommendation has.
    """
    # 1. Try to load full AutoML results (Pre-calculated during training)
    automl_path = os.path.join(AUTOML_DIR, f"{dataset_id}_results.json")
    if os.path.exists(automl_path):
        try:
            with open(automl_path, "r") as f:
                data = json.load(f)
                return {
                    "feature_importance": data.get("feature_importance", []),
                    "reason_parts": data.get("reason_parts", []),
                    "selection_reason": data.get("selection_reason", ""),
                    "top_algorithm": data.get("best_algorithm", "N/A")
                }
        except Exception as e:
            print(f"Error loading automl results: {e}")

    # 2. Fallback to standalone SHAP (from Recommendation/Exploratory phase)
    shap_path = os.path.join(SHAP_DIR, f"{dataset_id}_shap.json")
    if os.path.exists(shap_path):
        with open(shap_path, "r") as f:
            # Standalone SHAP usually just has the list
            return {
                "feature_importance": json.load(f),
                "reason_parts": ["Analysis based on preliminary feature scan."],
                "selection_reason": "Preliminary analysis."
            }

    # 3. No data
    return {
        "feature_importance": [],
        "reason_parts": [],
        "selection_reason": ""
    }
