# ml-logic/logic/preprocessing/missing_handler.py

def handle_missing(df, method, categorical_cols):
    if method == "Drop Missing Rows":
        return df.dropna()
    elif method == "Fill with Mean (Numeric Only)":
        return df.fillna(df.mean(numeric_only=True))
    elif method == "Fill with Mode (Categorical Only)":
        for col in categorical_cols:
            df[col].fillna(df[col].mode()[0], inplace=True)
    return df