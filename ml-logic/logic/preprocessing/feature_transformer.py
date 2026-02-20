# ml-logic/logic/preprocessing/feature_transformer.py

from sklearn.preprocessing import LabelEncoder, StandardScaler
import pandas as pd
import numpy as np

def encode_data(df, categorical_cols, target_column=None):
    """Encodes categorical features and target column."""
    df_processed = df.copy()

    # --- Step 1: Encode Categorical Columns ---
    for col in categorical_cols:
        # Check if column exists and is not an ID column
        if (col in df_processed.columns and 
            not col.lower().endswith("id") and 
            col.lower() not in ["id", "index", "row_id", "observation_id"]):
            
            df_processed[col] = df_processed[col].astype(str)
            le = LabelEncoder()
            df_processed[col] = le.fit_transform(df_processed[col])

    # --- Step 2: Encode Target Column if Categorical ---
    if target_column and target_column in df_processed.columns:
        if df_processed[target_column].dtype == 'object' or df_processed[target_column].dtype.name == 'category':
            le_target = LabelEncoder()
            df_processed[target_column] = le_target.fit_transform(df_processed[target_column].astype(str))
            
    return df_processed

def scale_data(df, target_column=None):
    """Scales numeric features using StandardScaler."""
    df_processed = df.copy()
    
    numeric_cols = df_processed.select_dtypes(include=[np.number]).columns
    # Exclude target and likely ID columns
    features_to_scale = [
        col for col in numeric_cols 
        if col != target_column 
        and not col.lower().endswith("id") 
        and not col.lower() in ["id", "index", "row_id", "observation_id"]
    ]

    if features_to_scale:
        scaler = StandardScaler()
        df_processed[features_to_scale] = scaler.fit_transform(df_processed[features_to_scale])
        
    return df_processed

def encode_and_scale(df, categorical_cols, target_column):
    """Combined function for backward compatibility."""
    df_encoded = encode_data(df, categorical_cols, target_column)
    df_scaled = scale_data(df_encoded, target_column)
    return df_scaled
