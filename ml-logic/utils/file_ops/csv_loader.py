# ml-logic/utils/file_ops/csv_loader.py

import pandas as pd

def load_csv(uploaded_file):
    return pd.read_csv(uploaded_file)