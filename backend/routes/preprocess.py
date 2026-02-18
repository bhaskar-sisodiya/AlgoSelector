# routes/preprocess.py 
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import os

# Import your existing ML logic
from logic.preprocessing.missing_handler import handle_missing
from logic.preprocessing.feature_transformer import encode_and_scale

router = APIRouter(
    prefix="/preprocess",
    tags=["Preprocess"]
)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "storage", "datasets")


# 📦 Request body schema
class PreprocessRequest(BaseModel):
    dataset_id: str
    target_column: str
    method: str
    categorical_columns: list[str]


@router.post("/")
def apply_preprocessing(req: PreprocessRequest):
    file_path = os.path.join(DATASET_DIR, f"{req.dataset_id}.csv")

    # Check dataset exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found.")

    # Load dataset
    df = pd.read_csv(file_path)

    # Validate target column
    if req.target_column not in df.columns:
        raise HTTPException(status_code=400, detail="Invalid target column.")

    # --- Step 1: Handle Missing Values ---
    if req.method != "None":
        df = handle_missing(df, req.method, req.categorical_columns)

    # --- Step 2: Encode + Scale ---
    df = encode_and_scale(df, req.categorical_columns, req.target_column)

    # Save updated dataset (overwrite)
    df.to_csv(file_path, index=False)

    return {
        "message": "Preprocessing applied successfully.",
        "rows_after_processing": df.shape[0],
        "preview": df.head().to_dict(orient="records")
    }
