
import pandas as pd
import numpy as np
from scipy.stats import entropy
from ml_engine.meta_feature_extractor import MetaFeatureExtractor

def verify_meta_features():
    print("--- Verifying Meta-Feature Extraction ---")
    
    # 1. Create Synthetic Dataset
    # Numeric 1: [1, 2, 3] -> Mean=2.0, Std=1.0, Skew=0, Kurt=-1.5
    # Numeric 2: [2, 4, 6] -> Mean=4.0, Std=2.0, Skew=0, Kurt=-1.5
    # Categorical 1: ['X', 'Y', 'X']
    # Target: ['A', 'A', 'B'] -> Counts: A=2, B=1. Imbalance=2.0
    
    df = pd.DataFrame({
        'num1': [1, 2, 3],
        'num2': [2, 4, 6],
        'cat1': ['X', 'Y', 'X'],
        'target': ['A', 'A', 'B']
    })
    
    print(f"Dataset Shape: {df.shape}")
    
    # 2. Extract Features
    extractor = MetaFeatureExtractor()
    features = extractor.extract(df, target_column='target')
    
    # 3. Define Expectations
    expected = {
        "n_instances": 3,
        "n_features": 4,
        "n_continuous": 2,
        "n_categorical": 2, # cat1 + target (since target is in df when passed)
        "dimensionality_ratio": round(4/3, 4),
        
        # Numeric Stats
        # Mean of means: (2.0 + 4.0) / 2 = 3.0
        "mean_features": 3.0,
        # Mean of stds: (1.0 + 2.0) / 2 = 1.5
        "std_features": 1.5,
        # Mean skew: (0 + 0) / 2 = 0.0
        "skewness": 0.0,
        # Mean kurtosis: (-1.5 + -1.5) / 2 = -1.5 (scipy kurtosis is Fisher by default, normal=0, uniform < 0)
        "kurtosis": -1.5,
        
        # Correlation
        # num1 vs num2 is perfectly correlated (y = 2x). Corr = 1.0.
        "avg_feature_correlation": 1.0,
        
        # Target
        "n_classes": 2,
        "class_imbalance_ratio": 2.0,
        # Entropy of [2/3, 1/3]
        "target_entropy": round(entropy([2/3, 1/3]), 4),
        
        # SNR: Mean / Std
        "signal_to_noise_ratio": round(3.0 / 1.5, 4) if 1.5 != 0 else 0
    }
    
    # 4. Compare
    all_passed = True
    print(f"{'Feature':<25} | {'Actual':<10} | {'Expected':<10} | {'Status':<6}")
    print("-" * 60)
    
    for key, val in expected.items():
        actual = features.get(key)
        # loose comparison for floats
        if isinstance(val, float):
            match = abs(actual - val) < 0.001
        else:
            match = actual == val
            
        status = "PASS" if match else "FAIL"
        if not match: all_passed = False
        
        print(f"{key:<25} | {actual:<10} | {val:<10} | {status:<6}")
        
    print("-" * 60)
    if all_passed:
        print("✅ All meta-features verified successfully!")
    else:
        print("❌ Some meta-features do not match expectations.")

if __name__ == "__main__":
    verify_meta_features()
