
import pandas as pd
import numpy as np

def remove_outliers_iqr(df: pd.DataFrame, target_column: str = None) -> pd.DataFrame:
    """
    Removes outliers from numerical columns using the IQR method.
    Ignores the target column to preserve labels.
    """
    df_clean = df.copy()
    
    # Select numerical columns
    numeric_cols = df_clean.select_dtypes(include=[np.number]).columns.tolist()
    
    # Exclude target column if present
    if target_column and target_column in numeric_cols:
        numeric_cols.remove(target_column)

    # Exclude ID columns
    numeric_cols = [
        c for c in numeric_cols 
        if not c.lower().endswith("id") 
        and c.lower() not in ["id", "index", "row_id", "observation_id"]
    ]
        
    for col in numeric_cols:
        Q1 = df_clean[col].quantile(0.25)
        Q3 = df_clean[col].quantile(0.75)
        IQR = Q3 - Q1
        
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        # Filter outliers
        df_clean = df_clean[(df_clean[col] >= lower_bound) & (df_clean[col] <= upper_bound)]
        
    return df_clean
