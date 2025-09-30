# ml-logic/logic/selection/imbalance_checker.py

def check_class_imbalance(df, target_column):
    counts = df[target_column].value_counts()
    ratio = counts.max() / counts.min()
    return ratio