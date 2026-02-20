from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import traceback
from ml_engine.automl_runner import AutoMLRunner

router = APIRouter(
    prefix="/automl",
    tags=["AutoML"]
)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "storage", "datasets")

class AutoMLRequest(BaseModel):
    dataset_id: str
    target_column: str
    use_meta_selection: bool = True

@router.post("/run")
def run_automl(req: AutoMLRequest):
    dataset_path = os.path.join(DATASET_DIR, f"{req.dataset_id}.csv")
    
    if not os.path.exists(dataset_path):
        raise HTTPException(status_code=404, detail="Dataset not found.")

    try:
        runner = AutoMLRunner(dataset_path, req.target_column)
        results = runner.run()
        results["target_column"] = req.target_column
        
        # --- PERSIST RESULTS ---
        # Save to storage/automl so Explainability page can access it later
        AUTOML_DIR = os.path.join(BASE_DIR, "storage", "automl")
        os.makedirs(AUTOML_DIR, exist_ok=True)
        
        results_path = os.path.join(AUTOML_DIR, f"{req.dataset_id}_results.json")
        import json
        with open(results_path, "w") as f:
            json.dump(results, f)
            
        return results
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/results/{dataset_id}")
def get_automl_results(dataset_id: str):
    """
    Retrieve persisted AutoML results for a given dataset.
    """
    AUTOML_DIR = os.path.join(BASE_DIR, "storage", "automl")
    results_path = os.path.join(AUTOML_DIR, f"{dataset_id}_results.json")
    
    if os.path.exists(results_path):
        import json
        try:
            with open(results_path, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading results file: {e}")
            raise HTTPException(status_code=500, detail="Failed to read results file.")
            
    # Return 404 if not found (frontend should handle this gracefully as "no results yet")
    raise HTTPException(status_code=404, detail="No results found for this dataset.")
