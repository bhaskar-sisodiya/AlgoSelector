# routes/preprocess.py 
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import os

# Import your existing ML logic
from logic.preprocessing.missing_handler import handle_missing
from logic.preprocessing.missing_handler import handle_missing
from logic.preprocessing.feature_transformer import encode_and_scale, encode_data, scale_data
from ml_engine.outlier_detector import remove_outliers_iqr

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
    action: str  # "missing", "scaling", "encoding", "outliers"
    categorical_columns: list[str] = []


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

    try:
        if req.action == "missing":
            # Apply missing value handling
            df = handle_missing(df, "Fill with Mean (Numeric Only)", req.categorical_columns)
            df = handle_missing(df, "Fill with Mode (Categorical Only)", req.categorical_columns)
            
        elif req.action == "scaling":
             # Apply scaling ONLY
             df = scale_data(df, req.target_column)

        elif req.action == "encoding":
             # Apply encoding ONLY
             # Note: We need categorical columns. 
             # If req.categorical_columns is empty, we should probably auto-detect them or assume frontend passed them.
             # For now, relying on request. If empty, it might not do anything unless target needs encoding.
             df = encode_data(df, req.categorical_columns, req.target_column)

        elif req.action == "outliers":
            df = remove_outliers_iqr(df, req.target_column)

        else:
             raise HTTPException(status_code=400, detail="Invalid action.")

        # Save updated dataset (overwrite)
        df.to_csv(file_path, index=False)

        return {
            "message": f"Action '{req.action}' applied successfully.",
            "rows_after_processing": df.shape[0],
            "preview": df.head().to_dict(orient="records")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
