# ml-logic/logic/preprocessing/algorithm_recommender.py

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

    # Reason parts
    reason_parts = [
        f"**Dataset Size**: {n_rows} rows.",
        f"**Target Type**: Inferred as {'Classification' if task_type == 'classification' else 'Regression'}."
    ]
    if is_imbalanced:
        reason_parts.append(f"**Class Imbalance**: Detected (Ratio > 2).")

    # Explanation
    from logic.selection.explanation_generator import get_explanation
    simple_explanation = get_explanation(base_algo, task_type, n_rows, is_imbalanced)

    # ✅ Enhanced secondary recommendations
    # ✅ Enhanced secondary recommendations (Limited to Top 3)
    if task_type == "classification":
        if n_rows < 1000:
            # Small Data: Prioritize simpler, low-overhead models
            recommendations = [
                {
                    "name": "Logistic Regression",
                    "best_for": "Provides interpretable results and works well on smaller datasets."
                },
                {
                    "name": "SVM",
                    "best_for": "Effective in high-dimensional spaces and best for smaller, complex datasets."
                },
                {
                    "name": "Decision Tree",
                    "best_for": "Simple, interpretable model that mimics human decision-making."
                }
            ]
        else:
            # Large Data: Prioritize robust ensemble methods
            recommendations = [
                {
                    "name": "Random Forest",
                    "best_for": "Suitable for large datasets, handles mixed features, and provides stability."
                },
                {
                    "name": "XGBoost",
                    "best_for": "Excellent for complex datasets, offering top-tier accuracy via gradient boosting."
                },
                {
                    "name": "Logistic Regression",
                    "best_for": "Included as a fast, interpretable baseline for comparison."
                }
            ]
    else:
        if n_rows < 1000:
            # Small Data (Regression)
            recommendations = [
                {
                    "name": "Linear Regression",
                    "best_for": "Simple, transparent, and efficient for smaller datasets with linear trends."
                },
                {
                    "name": "SVR",
                    "best_for": "Robust to outliers and effective in high-dimensional spaces."
                },
                {
                    "name": "Decision Tree Regressor",
                    "best_for": "Fast and interpretable, splitting data into segments."
                }
            ]
        else:
            # Large Data (Regression)
            recommendations = [
                {
                    "name": "XGBoost Regressor",
                    "best_for": "Highly optimized boosting for large, high-dimensional datasets."
                },
                {
                    "name": "Random Forest Regressor",
                    "best_for": "Captures nonlinear relationships and interactions automatically."
                },
                {
                    "name": "Linear Regression",
                    "best_for": "Included as a fast, interpretable baseline for comparison."
                }
            ]

    # ✅ Return consistent structure
    return {
        "top_algorithm": base_algo,
        "recommendations": recommendations,
        "simple_explanation": simple_explanation,
        "reason_parts": reason_parts
    }
