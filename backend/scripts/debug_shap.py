
import pandas as pd
import numpy as np
import os
import sys

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from logic.selection.imbalance_checker import check_class_imbalance

# MOCK REQUEST
DATASET_ID = "c2b7c96c-fb7c-463e-bc73-3b6b7d84f245" # From previous logs
TARGET_COLUMN = "Observed Length (m)" # From previous logs

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(BASE_DIR, "storage", "datasets")
SHAP_DIR = os.path.join(BASE_DIR, "storage", "shap")

def debug_feature_importance():
    file_path = os.path.join(DATASET_DIR, f"{DATASET_ID}.csv")
    print(f"Reading file: {file_path}")
    
    if not os.path.exists(file_path):
        print("Dataset not found!")
        return

    df = pd.read_csv(file_path)
    print(f"Columns: {df.columns.tolist()}")
    
    if TARGET_COLUMN not in df.columns:
        print(f"Target '{TARGET_COLUMN}' not found in df")
        return

    # LOGIC FROM recommendation.py
    try:
        from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
        from sklearn.preprocessing import LabelEncoder
        from sklearn.impute import SimpleImputer
        
        # helper to check if regression or classification
        # Replicating logic from recommendation.py
        is_regression = df[TARGET_COLUMN].dtype in [np.float64, np.float32] or (df[TARGET_COLUMN].nunique() > 20 and df[TARGET_COLUMN].dtype in [np.int64, np.int32])
        print(f"Is Regression: {is_regression}")
        print(f"Target Type: {df[TARGET_COLUMN].dtype}")
        print(f"Unique Targets: {df[TARGET_COLUMN].nunique()}")

        # Prepare data for RF
        X = df.drop(columns=[TARGET_COLUMN])
        y = df[TARGET_COLUMN]
        
        print("Preprocessing X...")
        # Simple encoding for this auxiliary step
        for c in X.select_dtypes(include=['object', 'category']).columns:
            print(f"Encoding {c}...")
            X[c] = LabelEncoder().fit_transform(X[c].astype(str))
            
        print("Imputing X...")
        X = SimpleImputer(strategy='mean').fit_transform(X)
        
        if not is_regression:
             print("Preprocessing Y (Classification)...")
             le_y = LabelEncoder()
             y = le_y.fit_transform(y.astype(str))
             rf = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
        else:
             print("Preprocessing Y (Regression)...")
             # Try to cast y to float, drop NaNs if any? 
             # recommendation.py doesn't handle NaNs in target explicitly?
             # Let's see if it crashes here.
             y = pd.to_numeric(y, errors='coerce')
             # Drop rows where y is NaN? Scikit-learn doesn't like NaN targets.
             # The existing logic did NOT clean y NaNs. This might be the bug.
             rf = RandomForestRegressor(n_estimators=50, max_depth=5, random_state=42)
             
        print("Fitting RF...")
        # Check for NaNs in y if regression
        if is_regression and np.isnan(y).any():
             print("WARNING: Target contains NaNs!")
             # We need to handle this.
        
        rf.fit(X, y)
        importances = rf.feature_importances_
        feature_names = df.drop(columns=[TARGET_COLUMN]).columns
        
        feature_importance_list = [
            {"name": name, "value": round(imp * 100, 2)} 
            for name, imp in zip(feature_names, importances)
        ]
        
        feature_importance = sorted(feature_importance_list, key=lambda x: x["value"], reverse=True)[:10]
        print("SUCCESS! Feature Importance:")
        print(feature_importance)
        
        # Try saving
        shap_path = os.path.join(SHAP_DIR, f"{DATASET_ID}_shap.json")
        print(f"Saving to {shap_path}")
        import json
        with open(shap_path, "w") as f:
            json.dump(feature_importance, f)
        print("Saved successfully.")

    except Exception as e:
        print(f"ERROR in Feature Importance Logic: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_feature_importance()
