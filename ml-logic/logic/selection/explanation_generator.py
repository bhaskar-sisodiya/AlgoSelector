# ml-logic/logic/preprocessing/explanation_generator.py

def get_explanation(algo_name, task_type, n_rows, is_imbalanced):
    if "Logistic Regression" in algo_name:
        explanation = (
            "Logistic Regression is a simple and interpretable algorithm best suited for "
            "binary or multi-class classification tasks. It works well on smaller, linearly separable datasets."
        )
    elif "Random Forest" in algo_name:
        explanation = (
            "Random Forest is an ensemble of decision trees that captures complex, non-linear patterns. "
            "It performs well on mixed-type data and requires minimal preprocessing."
        )
    elif "XGBoost" in algo_name:
        explanation = (
            "XGBoost is a gradient boosting algorithm optimized for speed and accuracy, "
            "ideal for large datasets and high-stakes predictive modeling."
        )
    elif "LightGBM" in algo_name:
        explanation = (
            "LightGBM is similar to XGBoost but much faster on large datasets. "
            "It’s best when you have millions of rows and need quick iteration."
        )
    elif "SVM" in algo_name:
        explanation = (
            "Support Vector Machines work well with high-dimensional small datasets "
            "and can model complex boundaries using kernels."
        )
    elif "Linear Regression" in algo_name:
        explanation = (
            "Linear Regression models relationships assuming linearity. "
            "It’s the best starting point for numeric prediction tasks with continuous targets."
        )
    elif "Decision Tree" in algo_name:
        explanation = (
            "Decision Trees are easy to interpret and capture non-linear relationships. "
            "They can overfit on small datasets but are powerful for exploratory analysis."
        )
    elif "Neural Network" in algo_name or "MLP" in algo_name:
        explanation = (
            "Neural Networks (MLPs) can model highly complex relationships but require large datasets "
            "and longer training time. They excel in large-scale predictive tasks."
        )
    else:
        explanation = "This algorithm is recommended based on your dataset size and target type."

    if is_imbalanced:
        explanation += " Since class imbalance was detected, sampling or weighting techniques should be applied."

    return explanation
