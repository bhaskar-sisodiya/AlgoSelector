
import math
import numpy as np
import pandas as pd

def sanitize_for_json(data):
    """
    Recursively sanitize data to ensure it is JSON serializable.
    - Converts NaN, Infinity, -Infinity to None.
    - Converts numpy types to native Python types.
    - Handles nested dicts and lists.
    """
    if isinstance(data, dict):
        return {k: sanitize_for_json(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_for_json(v) for v in data]
    elif isinstance(data, (float, np.float32, np.float64)):
        if pd.isna(data) or math.isnan(data) or math.isinf(data):
            return None #: JSON null
        return float(data)
    elif isinstance(data, (int, np.int32, np.int64)):
        return int(data)
    elif isinstance(data, (np.bool_, bool)):
        return bool(data)
    elif pd.isna(data): # General check for other pandas types like NaT
        return None
    else:
        return data
