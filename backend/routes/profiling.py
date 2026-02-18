# routes/profiling.py

from fastapi import APIRouter, HTTPException
import pandas as pd
import os

# Import your existing profiling utility
from utils.profiling.profile_summary import get_column_info

router = APIRouter(
    prefix="/profiling",
    tags=["Profiling"]
)

# 📁 Locate stored datasets
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "storage", "datasets")


@router.get("/{dataset_id}")
def get_profiling_info(dataset_id: str):
    file_path = os.path.join(DATASET_DIR, f"{dataset_id}.csv")

    # Check if dataset exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found.")

    # Load dataset
    df = pd.read_csv(file_path)

    # Column info (using your existing utility)
    column_info = get_column_info(df).to_dict(orient="records")

    # Descriptive statistics
    descriptive_stats = df.describe(include="all").fillna("").to_dict()

    # Missing values summary
    total_missing = int(df.isnull().sum().sum())

    return {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "total_missing_values": total_missing,
        "column_info": column_info,
        "descriptive_statistics": descriptive_stats
    }
