# ml-logic/preprocessing/feature_transformer.py

from sklearn.preprocessing import LabelEncoder, StandardScaler

def encode_and_scale(df, categorical_cols, target_column):
    df_processed = df.copy()

    # --- Step 1: Encode Categorical Columns (including the target if it's categorical) ---
    le = LabelEncoder()
    for col in categorical_cols:
        # This will correctly handle feature columns like 'gender' or 'education'
        # If the target is 'Yes'/'No', it will also be correctly encoded to 0/1
        df_processed[col] = le.fit_transform(df_processed[col])

    # --- Step 2: Scale ONLY the Numeric FEATURE Columns ---
    
    # Get all numeric columns
    numeric_cols = df_processed.select_dtypes(include=['int64', 'float64']).columns
    
    # Create a list of feature columns to scale by EXCLUDING the target column
    features_to_scale = [col for col in numeric_cols if col != target_column]
    
    # Apply scaling only to the selected features
    if features_to_scale: # Only run if there are numeric features to scale
        scaler = StandardScaler()
        df_processed[features_to_scale] = scaler.fit_transform(df_processed[features_to_scale])

    return df_processed