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
    if task_type == "classification":
        recommendations = [
            {
                "name": "Random Forest",
                "best_for": (
                    "Suitable for both small and large datasets. "
                    "Performs well with mixed feature types and handles missing values gracefully. "
                    "Useful when you want accuracy and stability without much tuning."
                )
            },
            {
                "name": "XGBoost",
                "best_for": (
                    "Excellent for complex datasets with many features. "
                    "Uses gradient boosting to capture subtle patterns and achieve high accuracy. "
                    "Ideal when you can afford slightly longer training times."
                )
            },
            {
                "name": "Logistic Regression",
                "best_for": (
                    "Provides interpretable results and works well on smaller datasets. "
                    "Helps understand feature influence and is easy to train and explain."
                )
            }
        ]
    else:
        recommendations = [
            {
                "name": "Linear Regression",
                "best_for": (
                    "Performs best when relationships between variables are roughly linear. "
                    "Simple, transparent, and efficient for smaller datasets."
                )
            },
            {
                "name": "Random Forest Regressor",
                "best_for": (
                    "Captures nonlinear relationships and interactions automatically. "
                    "Great when your data has complex patterns or missing values."
                )
            },
            {
                "name": "XGBoost Regressor",
                "best_for": (
                    "Highly optimized boosting algorithm that offers top-tier performance "
                    "on large and high-dimensional datasets. "
                    "Balances accuracy and efficiency effectively."
                )
            }
        ]

    # ✅ Return consistent structure
    return {
        "top_algorithm": base_algo,
        "recommendations": recommendations,
        "simple_explanation": simple_explanation,
        "reason_parts": reason_parts
    }
