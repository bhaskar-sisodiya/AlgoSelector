
import pandas as pd
import numpy as np
from scipy.stats import skew, kurtosis, entropy

class MetaFeatureExtractor:
    @staticmethod
    def extract(df: pd.DataFrame, target_column: str = None) -> dict:
        """
        Extracts meta-features from the dataframe.
        """
        n_instances = df.shape[0]
        n_features = df.shape[1]
        
        # Feature types
        numeric_df = df.select_dtypes(include=[np.number])
        categorical_df = df.select_dtypes(exclude=[np.number])
        
        n_continuous = numeric_df.shape[1]
        n_categorical = categorical_df.shape[1]
        
        # Dimensionality
        dimensionality_ratio = round(n_features / n_instances, 4) if n_instances > 0 else 0
        
        # Statistical Properties (Numeric)
        if not numeric_df.empty:
            mean_features = round(numeric_df.mean().mean(), 4)
            std_features = round(numeric_df.std().mean(), 4)
            skewness = round(numeric_df.apply(lambda x: skew(x, nan_policy='omit')).mean(), 4)
            kurt = round(numeric_df.apply(lambda x: kurtosis(x, nan_policy='omit')).mean(), 4)
            
            # Correlation
            try:
                corr_matrix = numeric_df.corr().abs()
                # Exclude diagonal
                mask = np.ones(corr_matrix.shape, dtype=bool)
                np.fill_diagonal(mask, 0)
                # Calculate mean of off-diagonal elements (scalar)
                avg_corr = corr_matrix.values[mask].mean()
                
                # Handle NaN (e.g., if matrix is empty or all NaN)
                if pd.isna(avg_corr):
                    avg_corr = 0
                else:
                    avg_corr = round(float(avg_corr), 4)
            except Exception as e:
                print(f"Correlation calculation failed: {e}")
                avg_corr = 0
        else:
            mean_features, std_features, skewness, kurt, avg_corr = 0, 0, 0, 0, 0

        # Target Analysis
        n_classes = 0
        imbalance_ratio = 0
        target_entropy = 0
        
        if target_column and target_column in df.columns:
            target_series = df[target_column]
            # Check if classification (categorical or low unique count logic as before)
            is_classification = target_series.dtype == 'object' or target_series.nunique() < 20
            
            if is_classification:
                class_counts = target_series.value_counts()
                n_classes = len(class_counts)
                if n_classes > 1:
                    imbalance_ratio = round(class_counts.max() / class_counts.min(), 2)
                    # Entropy
                    probs = class_counts / n_instances
                    target_entropy = round(entropy(probs), 4)

        # Approximate Signal-to-Noise Ratio (Mean / Std)
        snr = round(mean_features / std_features, 4) if std_features != 0 else 0

        return {
            "n_instances": int(n_instances),
            "n_features": int(n_features),
            "n_continuous": int(n_continuous),
            "n_categorical": int(n_categorical),
            "dimensionality_ratio": float(dimensionality_ratio) if not pd.isna(dimensionality_ratio) else 0.0,
            "mean_features": float(mean_features) if not pd.isna(mean_features) else 0.0,
            "std_features": float(std_features) if not pd.isna(std_features) else 0.0,
            "skewness": float(skewness) if not pd.isna(skewness) else 0.0,
            "kurtosis": float(kurt) if not pd.isna(kurt) else 0.0,
            "avg_feature_correlation": float(avg_corr) if not pd.isna(avg_corr) else 0.0,
            "n_classes": int(n_classes),
            "class_imbalance_ratio": float(imbalance_ratio) if not pd.isna(imbalance_ratio) else 0.0,
            "target_entropy": float(target_entropy) if not pd.isna(target_entropy) else 0.0,
            "signal_to_noise_ratio": float(snr) if not pd.isna(snr) else 0.0
        }
