# create_clean_data.py

import pandas as pd
from sklearn.datasets import make_classification
from sklearn.preprocessing import StandardScaler
import os  # <-- 1. Import the os library

print("Generating a new, perfectly scaled dataset...")

# --- Define the output directory and filename ---
output_dir = os.path.join("dummy_datasets", "processed_datasets")
output_filename = "Cleaned_Data_Perfect.csv"
full_output_path = os.path.join(output_dir, output_filename)

# --- 2. Create the directory if it doesn't exist ---
os.makedirs(output_dir, exist_ok=True)
print(f"Ensuring directory exists: '{output_dir}'")

# Generate synthetic data
X, y = make_classification(
    n_samples=500,
    n_features=10,
    n_informative=5,
    n_redundant=2,
    n_classes=2,
    weights=[0.5, 0.5],
    flip_y=0.01,
    random_state=42
)

# Scale the features with perfect precision
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Create a DataFrame
feature_names = [f'feature_{i+1}' for i in range(X_scaled.shape[1])]
df = pd.DataFrame(X_scaled, columns=feature_names)
df['target'] = y

# --- 3. Save the file to the specified path ---
df.to_csv(full_output_path, index=False)

print(f"✅ Success! A new file has been created at: '{full_output_path}'")
print("Please use this new file in your Streamlit app.")