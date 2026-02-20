
import pandas as pd

class PreprocessingSuggester:
    @staticmethod
    def get_suggestions(df: pd.DataFrame, meta_features: dict) -> list[dict]:
        """
        Analyzes the dataframe and meta-features to suggest preprocessing steps.
        Returns a list of dicts: {"action": "missing", "reason": "..."}
        """
        suggestions = []
        
        # 1. Missing Values
        # Check meta_features first if available, else sum df
        # (Assuming meta_features extraction logic might have sum, 
        # but let's re-check DF to be safe/granular if needed)
        total_missing = df.isnull().sum().sum()
        if total_missing > 0:
            suggestions.append({
                "action": "missing",
                "reason": f"Dataset has {total_missing} missing values.",
                "recommended": True
            })
            
        # 2. Encoding (Categorical Variables)
        # Check if there are object/category columns (excluding target ideally, but user selects target)
        # For simplicity, if n_categorical > 0, suggest encoding.
        if meta_features.get("n_categorical", 0) > 0:
             suggestions.append({
                "action": "encoding",
                "reason": f"Dataset has {meta_features['n_categorical']} categorical features.",
                "recommended": True
            })

        # 3. Scaling (Continuous Variables)
        # Standard practice for most ML algos (SVM, KNN, Neural Nets, Linear Models)
        if meta_features.get("n_continuous", 0) > 0:
             suggestions.append({
                "action": "scaling",
                "reason": "Scaling improves performance for many algorithms (SVM, KNN, etc.).",
                "recommended": True
            })

        # 4. Outliers
        # Suggest if skewness or kurtosis is high
        skew = meta_features.get("skewness", 0)
        kurt = meta_features.get("kurtosis", 0)
        
        # Thresholds are heuristic
        if abs(skew) > 1.0 or abs(kurt) > 3.0:
            suggestions.append({
                "action": "outliers",
                "reason": f"High skewness ({skew}) or kurtosis ({kurt}) detected.",
                "recommended": True
            })

        return suggestions
