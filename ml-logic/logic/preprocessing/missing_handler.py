# ml-logic/logic/preprocessing/missing_handler.
        
def handle_missing(df, method, categorical_cols):
    if method == "Drop Missing Rows":
        return df.dropna()
    
    elif method == "Fill with Mean (Numeric Only)":
        # Calculate mean only for non-ID numeric columns
        numeric_cols = df.select_dtypes(include='number').columns
        cols_to_fill = [
            c for c in numeric_cols 
            if not c.lower().endswith("id") 
            and c.lower() not in ["id", "index", "row_id", "observation_id"]
        ]
        if cols_to_fill:
            df[cols_to_fill] = df[cols_to_fill].fillna(df[cols_to_fill].mean())
        return df
    
    elif method == "Fill with Mode (Categorical Only)":
        for col in categorical_cols:
            # Skip ID columns
            if (col.lower().endswith("id") or 
                col.lower() in ["id", "index", "row_id", "observation_id"]):
                continue

            if col in df.columns and df[col].isnull().any():
                mode_values = df[col].mode()
                if not mode_values.empty:
                    df[col] = df[col].fillna(mode_values[0])
        return df
    
    # if "None" or unknown method
    return df
