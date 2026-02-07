from sklearn.preprocessing import LabelEncoder, StandardScaler
import pandas as pd
import numpy as np

def encode_and_scale(df, categorical_cols, target_column):
    df_processed = df.copy()

    # --- Step 1: Encode Categorical Columns ---
    for col in categorical_cols:
        df_processed[col] = df_processed[col].astype(str)  # handle NaN as 'nan' strings safely
        le = LabelEncoder()
        df_processed[col] = le.fit_transform(df_processed[col])

    # --- Step 2: Encode Target Column if Categorical ---
    if df_processed[target_column].dtype == 'object' or df_processed[target_column].dtype.name == 'category':
        le_target = LabelEncoder()
        df_processed[target_column] = le_target.fit_transform(df_processed[target_column].astype(str))

    # --- Step 3: Scale Numeric Feature Columns ---
    numeric_cols = df_processed.select_dtypes(include=[np.number]).columns
    features_to_scale = [col for col in numeric_cols if col != target_column]

    if features_to_scale:
        scaler = StandardScaler()
        df_processed[features_to_scale] = scaler.fit_transform(df_processed[features_to_scale])

    return df_processed
