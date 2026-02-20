from sklearn.metrics import accuracy_score, r2_score, mean_squared_error, confusion_matrix, f1_score

class Evaluator:
    @staticmethod
    def evaluate(y_true, y_pred, task_type):
        """
        Returns performance metrics based on task type.
        """
        metrics = {}
        
        if task_type == "classification":
            metrics["accuracy"] = round(accuracy_score(y_true, y_pred) * 100, 2)
            # Calculate F1 score (weighted average for multi-class)
            try:
                metrics["f1_score"] = round(f1_score(y_true, y_pred, average='weighted') * 100, 2)
            except:
                metrics["f1_score"] = 0.0
            # metrics["confusion_matrix"] = confusion_matrix(y_true, y_pred).tolist()
            
        elif task_type == "regression":
            metrics["r2_score"] = round(r2_score(y_true, y_pred), 4)
            # metrics["rmse"] = round(mean_squared_error(y_true, y_pred, squared=False), 4)
            
        return metrics
