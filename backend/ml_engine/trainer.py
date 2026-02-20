import time
from ml_engine.model_factory import ModelFactory

class Trainer:
    def __init__(self, task_type):
        self.task_type = task_type

    def train_and_evaluate(self, algorithm_name, X_train, y_train, X_test):
        """
        Trains the model, measures time, and returns predictions.
        """
        model = ModelFactory.get_model(algorithm_name, self.task_type)
        
        start_time = time.time()
        model.fit(X_train, y_train)
        end_time = time.time()
        
        training_time = round(end_time - start_time, 4)
        predictions = model.predict(X_test)
        
        return {
            "model": model,
            "predictions": predictions,
            "training_time": training_time
        }
