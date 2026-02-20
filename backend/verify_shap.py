
import pandas as pd
import numpy as np
import shap
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
from ml_engine.shap_engine import ShapEngine

def verify_shap():
    print("--- Verifying SHAP Logic ---")
    
    # 1. Create Synthetic Dataset (XOR-like or Linear)
    # y = 10*x1 + x2. x3 is noise.
    df = pd.DataFrame({
        'x1': np.random.rand(100),
        'x2': np.random.rand(100),
        'x3': np.random.rand(100)
    })
    y = 10 * df['x1'] + df['x2']
    
    print("Dataset: Regression (y = 10*x1 + x2)")
    
    # 2. Train Linear Model
    model = LinearRegression()
    model.fit(df, y)
    
    print("Model coefficients:", model.coef_)
    
    # 3. Shape Engine
    print("\n--- SHAP Engine (Linear) ---")
    shap_res = ShapEngine.get_feature_importance(model, df, "regression")
    print(shap_res)
    
    # Check if correct order x1 > x2 > x3
    names = [x['name'] for x in shap_res]
    print(f"Order: {names} (Expected: ['x1', 'x2', 'x3'])")
    
    # 4. Classification Test
    # x1 > 0.5 -> Class 1, else Class 0
    y_cls = (df['x1'] > 0.5).astype(int)
    print("\nDataset: Classification (x1 > 0.5)")
    
    rf = RandomForestClassifier(n_estimators=10, random_state=42)
    rf.fit(df, y_cls)
    
    print("\n--- SHAP Engine (Tree/Classification) ---")
    shap_res_cls = ShapEngine.get_feature_importance(rf, df, "classification")
    print(shap_res_cls)
    
    names_cls = [x['name'] for x in shap_res_cls]
    print(f"Order: {names_cls} (Expected x1 to be top)")
    
    # 5. Check Proxy Logic (from recommendation.py)
    print("\n--- Proxy Logic (RF Feature Importance) ---")
    importances = rf.feature_importances_
    proxy_res = [{"name": n, "value": round(i*100, 2)} for n, i in zip(df.columns, importances)]
    proxy_res = sorted(proxy_res, key=lambda x: x['value'], reverse=True)
    print(proxy_res)

if __name__ == "__main__":
    verify_shap()
