# ml-logic/logic/selection/explanation_generator.py

def get_explanation(algorithm, task_type, n_rows, is_imbalanced):
    """Generates a simple, non-technical explanation for the algorithm choice."""
    
    explanation = ""

    # Part 1: Define the goal based on task type
    if task_type == "classification":
        goal = "predicting a category (like 'Yes' or 'No')."
    else:
        goal = "predicting a number (like a price or a score)."

    # Part 2: Explain the choice based on dataset size and algorithm
    if "Logistic Regression" in algorithm:
        explanation = f"Your dataset is relatively small, and your goal is {goal} For this kind of task, **Logistic Regression** is a straightforward and reliable model that often gives great results."
    
    elif "Linear Regression" in algorithm:
        explanation = f"Your dataset is relatively small, and your goal is {goal} For this kind of task, **Linear Regression** is a classic and effective model for finding relationships in your data."

    elif "Random Forest" in algorithm:
        explanation = f"Your dataset is quite large, and your goal is {goal} To handle this much data effectively, **Random Forest** is a powerful model that combines many decision trees to make a strong prediction."

    elif "XGBoost" in algorithm:
        explanation = f"Your dataset is quite large, and your goal is {goal} For a large-scale task like this, **XGBoost** is a highly efficient and powerful model known for its top-tier performance."

    # Part 3: Add a note about imbalance if needed
    if is_imbalanced:
        explanation += " We also recommend using a **Sampling Technique** because some of your categories have far fewer examples than others, and this helps the model learn fairly."

    return explanation