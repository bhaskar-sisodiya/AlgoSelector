import matplotlib
matplotlib.use("Agg")  # Must be set before pyplot import — prevents GUI/display errors in server context
import matplotlib.pyplot as plt
import io
import base64
import numpy as np


class Visualizer:
    @staticmethod
    def create_bar_chart(data: dict, title: str, xlabel: str, ylabel: str):
        """
        Creates a simple bar chart and returns it as a BytesIO object.
        data: dict where keys are labels and values are numeric
        """
        plt.figure(figsize=(10, 6))
        
        # Sort data if needed, or just plot
        labels = list(data.keys())
        values = list(data.values())
        
        # Create bar chart
        plt.bar(labels, values, color='skyblue')
        plt.title(title)
        plt.xlabel(xlabel)
        plt.ylabel(ylabel)
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        
        # Save to buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        plt.close()
        return buf

    @staticmethod
    def create_feature_importance_plot(feature_importance: list):
        """
        Expects list of dicts: [{'name': 'feat', 'value': 0.5}, ...]
        """
        if not feature_importance:
            return None
            
        # Sort by value
        sorted_feats = sorted(feature_importance, key=lambda x: x['value'], reverse=True)[:10]
        
        data = {item['name']: item['value'] for item in sorted_feats}
        return Visualizer.create_bar_chart(data, "Top 10 Feature Importance", "Feature", "Importance Score")

    @staticmethod
    def create_model_comparison_plot(models: list):
        """
        Expects list of dicts with 'name' and 'accuracy' (or other metric)
        """
        if not models:
            return None
            
        # Extract data
        data = {m['name']: m['accuracy'] for m in models if 'accuracy' in m}
        return Visualizer.create_bar_chart(data, "Model Comparison (Accuracy)", "Model", "Accuracy (%)")
