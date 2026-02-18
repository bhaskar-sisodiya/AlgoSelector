# routes/upload.py

from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import os
import uuid

# Import from your existing ML logic
from logic.suggestions.target_suggester import suggest_target_column

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

# 📁 Directory to store uploaded datasets
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "storage", "datasets")
os.makedirs(DATASET_DIR, exist_ok=True)


@router.post("/")
async def upload_csv(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")

    # Generate unique dataset ID
    dataset_id = str(uuid.uuid4())
    file_path = os.path.join(DATASET_DIR, f"{dataset_id}.csv")

    # Save file
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    # Load into pandas
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Invalid CSV file: {str(e)}")

    # Auto-detect categorical columns
    categorical_cols = df.select_dtypes(
        include=["object", "category"]
    ).columns.tolist()

    # Suggest target column
    suggested_target = suggest_target_column(df)

    # Return structured response
    return {
        "dataset_id": dataset_id,
        "rows": df.shape[0],
        "columns": df.shape[1],
        "categorical_columns": categorical_cols,
        "suggested_target": suggested_target,
        "preview": df.head().to_dict(orient="records")
    }
