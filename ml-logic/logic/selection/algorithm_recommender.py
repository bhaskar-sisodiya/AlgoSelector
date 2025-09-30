# ml-logic/logic/selection/algorithm_recommender.py

# Import the new function from the file we just created
from logic.selection.explanation_generator import get_explanation

def recommend_algorithm(df, target_column, imbalance_ratio):
    n_rows = df.shape[0]
    target_dtype = df[target_column].dtype

    # Determine task type
    if 'object' in str(target_dtype) or 'category' in str(target_dtype) or df[target_column].nunique() < 20:
        task_type = "classification"
    else:
        task_type = "regression"

    # Base algorithm recommendation
    if n_rows < 10000:
        base_algo = "Logistic Regression" if task_type == "classification" else "Linear Regression"
    else:
        base_algo = "Random Forest" if task_type == "classification" else "XGBoost"
    
    is_imbalanced = task_type == "classification" and imbalance_ratio > 2
    
    # Imbalance adjustment
    if is_imbalanced:
        base_algo += " (with Sampling)"

    # Technical justification (we'll keep this for optional display)
    reason_parts = []
    reason_parts.append(f"**Dataset Size**: {n_rows} rows.")
    reason_parts.append(f"**Target Type**: Inferred as {'Classification' if task_type == 'classification' else 'Regression'}.")
    if is_imbalanced:
        reason_parts.append(f"**Class Imbalance**: Detected (Ratio > 2).")

    # Generate the simple explanation by calling the new function
    simple_explanation = get_explanation(base_algo, task_type, n_rows, is_imbalanced)

    # Return a dictionary with all the info
    return {
        "algorithm": base_algo,
        "reason_parts": reason_parts,
        "simple_explanation": simple_explanation
    }