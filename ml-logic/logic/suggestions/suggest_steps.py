# ml-logic/logic/suggestions/suggest_steps.py

def is_scaled(df, numeric_cols):
    """
    Check if numeric columns are approximately scaled.
    For StandardScaler: mean ~ 0, std ~ 1
    For MinMaxScaler: values between 0 and 1
    """
    if len(numeric_cols) == 0:
        return True  # no numeric columns → nothing to scale

    stats = df[numeric_cols].describe()

    # Check if mean is near 0 (StandardScaler property)
    mean_close_to_zero = all(abs(stats.loc["mean"]) < 0.1)

    # Check if std is near 1 (StandardScaler property)
    std_close_to_one = all(abs(stats.loc["std"] - 1) < 0.1)

    # Check if values are between 0 and 1 (MinMaxScaler property)
    min_non_negative = all(stats.loc["min"] >= 0)
    max_not_exceed_one = all(stats.loc["max"] <= 1.0)

    # Return True if dataset looks like it’s scaled by either method
    return (mean_close_to_zero and std_close_to_one) or (min_non_negative and max_not_exceed_one)


def generate_suggestions(df, categorical_cols, imbalance_ratio, target_column=None):
    suggestions = []

    # 1. Missing values
    missing_count = df.isnull().sum().sum()
    if missing_count > 0:
        suggestions.append(f"Dataset contains {missing_count} missing values → "
                           f"Use imputation (mean/median for numeric, mode for categorical) "
                           f"or drop rows if the missing proportion is small.")

    # 2. Categorical encoding
    if len(categorical_cols) > 0:
        suggestions.append(f"Detected {len(categorical_cols)} categorical columns → "
                           "Apply encoding (Label Encoding for ordinal, One-Hot Encoding for nominal).")

    # 3. Numeric scaling
    numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns
    
    # --- THIS IS THE FIX ---
    # Exclude the target column from the list of columns to check for scaling
    if target_column and target_column in numeric_cols:
        numeric_cols_to_check = numeric_cols.drop(target_column)
    else:
        numeric_cols_to_check = numeric_cols
    # -----------------------

    if len(numeric_cols_to_check) > 0 and not is_scaled(df, numeric_cols_to_check):
        suggestions.append(f"Dataset has {len(numeric_cols_to_check)} numeric feature columns → "
                           "Scaling (StandardScaler or MinMaxScaler) is recommended "
                           "to normalize feature ranges and help models converge.")

    # 4. Class imbalance
    if target_column and imbalance_ratio and imbalance_ratio > 2:
        suggestions.append(f"Target column '{target_column}' is imbalanced "
                           f"(majority-to-minority ratio = {imbalance_ratio:.2f}) → "
                           "Use SMOTE, oversampling, undersampling, or class weights.")

    # 5. High dimensionality
    if df.shape[1] > 50:
        suggestions.append("High number of features detected → "
                           "Consider dimensionality reduction (PCA, feature selection).")

    # 6. Skewed distributions
    if len(numeric_cols_to_check) > 0:
        skewed = df[numeric_cols_to_check].skew().abs() > 1
        if skewed.any():
            suggestions.append("Some numeric features are highly skewed → "
                               "Apply log-transform or normalization to stabilize distribution.")

    return suggestions