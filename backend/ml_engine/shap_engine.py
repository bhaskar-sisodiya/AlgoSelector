import shap
import pandas as pd
import numpy as np

class ShapEngine:
    @staticmethod
    def get_feature_importance(model, X_train, task_type):
        """
        Computes SHAP values and returns feature importance.
        """
        try:
            # Select Explainer using auto-selection (modern API)
            # This handles Tree, Linear, etc. automatically
            # We pass a background sample for Linear/Kernel/Partition explainers
            background = X_train.iloc[:10, :] # Small background for speed
            
            try:
                explainer = shap.Explainer(model, background)
            except:
                # Fallback if auto-fails (e.g. some complex pipelines)
                explainer = shap.Explainer(model.predict, background)

            # Compute SHAP values
            # shap_values_obj is an Explanation object
            shap_values_obj = explainer(X_train.iloc[:50, :]) # Use 50 samples
            
            # Extract values (numpy array)
            vals = shap_values_obj.values

            # Handle output shape
            # If classification, vals might be (N_samples, N_features, N_classes) or list
            if vals.ndim == 3:
                # (Samples, Features, Classes) -> Mean abs over classes -> Mean over samples
                # We want feature importance, so avg magnitude across classes
                vals = np.mean(np.abs(vals), axis=2) # Collapse classes
                vals = np.mean(vals, axis=0) # Collapse samples
            elif vals.ndim == 2:
                # (Samples, Features) -> Mean over samples
                vals = np.mean(np.abs(vals), axis=0)
            else:
                 # Fallback
                 vals = np.mean(np.abs(vals), axis=0)

            # Normalize to 0-100% (Relative Importance)
            # Handle potential zeros to avoid NaN
            total_impact = np.sum(vals)
            if total_impact > 1e-9:
                normalized_vals = (vals / total_impact) * 100
            else:
                normalized_vals = vals 

            # Create DataFrame
            feature_importance = pd.DataFrame(list(zip(X_train.columns, normalized_vals)), columns=['name', 'value'])
            feature_importance['value'] = feature_importance['value'].round(2)
            feature_importance.sort_values(by=['value'], ascending=False, inplace=True)
            
            return feature_importance.head(10).to_dict(orient='records')

        except Exception as e:
            print(f"SHAP Error: {e}")
            return []
