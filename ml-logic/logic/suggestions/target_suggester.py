# ml-logic/logic/suggestions/target_suggester.py

def suggest_target_column(df):
    """
    Suggests a likely target column based on common names and position.

    Heuristics:
    1. Looks for common target-like names (case-insensitive).
    2. If no common name is found, it defaults to the last column.
    """
    cols = df.columns.str.lower()
    common_targets = ['target', 'class', 'label', 'output', 'prediction', 'result', 'y']

    # 1. Check for common target names
    for target_name in common_targets:
        if target_name in cols:
            # Find the original column name with its correct casing
            original_col_name = df.columns[cols.tolist().index(target_name)]
            return original_col_name

    # 2. If no common name is found, suggest the last column as a fallback
    return df.columns[-1]