def handle_missing(df, method, categorical_cols):
    if method == "Drop Missing Rows":
        return df.dropna()
    
    elif method == "Fill with Mean (Numeric Only)":
        return df.fillna(df.mean(numeric_only=True))
    
    elif method == "Fill with Mode (Categorical Only)":
        for col in categorical_cols:
            if df[col].isnull().any():  # only process if there are missing values
                mode_values = df[col].mode()
                if not mode_values.empty:
                    df[col].fillna(mode_values[0], inplace=True)
        return df
    
    # if "None" or unknown method
    return df
