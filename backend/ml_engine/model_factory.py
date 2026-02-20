from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from xgboost import XGBClassifier, XGBRegressor
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.svm import SVC, SVR

class ModelFactory:
    @staticmethod
    def get_model(algorithm_name, task_type):
        """
        Returns an instance of the requested model.
        """
        if task_type == "classification":
            if "Logistic Regression" in algorithm_name:
                return LogisticRegression(max_iter=1000)
            elif "Random Forest" in algorithm_name:
                return RandomForestClassifier(n_estimators=100, random_state=42)
            elif "XGBoost" in algorithm_name:
                return XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
            elif "Decision Tree" in algorithm_name:
                return DecisionTreeClassifier(random_state=42)
            elif "SVM" in algorithm_name:
                return SVC(probability=True, random_state=42)
        
        elif task_type == "regression":
            if "Linear Regression" in algorithm_name:
                return LinearRegression()
            elif "Random Forest" in algorithm_name:
                return RandomForestRegressor(n_estimators=100, random_state=42)
            elif "XGBoost" in algorithm_name:
                return XGBRegressor(random_state=42)
            elif "Decision Tree" in algorithm_name:
                return DecisionTreeRegressor(random_state=42)
            elif "SVR" in algorithm_name or "SVM" in algorithm_name: # Handle SVR naming variations
                return SVR()
        
        raise ValueError(f"Unknown algorithm: {algorithm_name} for task: {task_type}")
