
import pandas as pd
import numpy as np
from scipy.stats import skew, kurtosis

# Create sample dataset
data = {
    'A': [1, 2, 3, 4, 5],                 # Clean
    'B': [1, 2, np.nan, 4, 5],            # Requires omit
    'C': [3, 3, 3, 3, 3],                 # Constant (kurtosis error)
    'D': [np.nan, np.nan, np.nan, np.nan, np.nan] # All NaNs
}
df = pd.DataFrame(data)

# Simulate current logic (using apply without omit)
def run_current_logic(df):
    numeric_df = df.select_dtypes(include=[np.number])
    # Apply skew on each SERIES (which has NaNs unless cleaned)
    skewness = numeric_df.apply(skew)
    kurt = numeric_df.apply(kurtosis)
    
    print("--- Current Logic Output PER COLUMN ---")
    print("Skewness:\n", skewness)
    print("Kurtosis:\n", kurt)
    
    print("\n--- Current Logic MEAN ---")
    print("Skew Mean:", skewness.mean())
    print("Kurt Mean:", kurt.mean())

# Simulate fixed logic (using omit)
def run_fixed_logic(df):
    numeric_df = df.select_dtypes(include=[np.number])
    # Apply skew with nan_policy='omit'
    skewness = numeric_df.apply(lambda col: skew(col, nan_policy='omit'))
    kurt = numeric_df.apply(lambda col: kurtosis(col, nan_policy='omit'))
    
    print("\n--- Fixed Logic Output PER COLUMN ---")
    print("Skewness:\n", skewness)
    print("Kurtosis:\n", kurt)
    
    print("\n--- Fixed Logic MEAN ---")
    print("Skew Mean:", skewness.mean())
    print("Kurt Mean:", kurt.mean())

print("Testing with sample data...")
run_current_logic(df)
run_fixed_logic(df)
