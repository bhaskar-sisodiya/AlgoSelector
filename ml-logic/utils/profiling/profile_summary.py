# ml-logic/utils/profiling/profile_summary.py

import pandas as pd

def get_column_info(df):
    return pd.DataFrame({
        "Column Name": df.columns,
        "Data Type": df.dtypes.astype(str),
        "Missing Values": df.isnull().sum().values
    })

def get_categorical_summary(df):
    categorical_cols = df.select_dtypes(include=['object']).columns
    summary = {}
    for col in categorical_cols:
        summary[col] = {
            "unique": df[col].nunique(),
            "top_values": df[col].value_counts().head()
        }
    return categorical_cols, summary