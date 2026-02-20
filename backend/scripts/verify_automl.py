import requests
import pandas as pd
import io

BASE_URL = "http://127.0.0.1:8000"

def create_dummy_csv():
    data = {
        "feature1": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5] * 10,
        "feature2": [5, 4, 3, 2, 1, 5, 4, 3, 2, 1] * 10,
        "target": [0, 1, 0, 1, 0, 0, 1, 0, 1, 0] * 10
    }
    df = pd.DataFrame(data)
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    return csv_buffer.getvalue()

def verify_automl():
    # 1. Upload
    print("Uploading dataset...")
    csv_content = create_dummy_csv()
    files = {'file': ('dummy.csv', csv_content, 'text/csv')}
    response = requests.post(f"{BASE_URL}/upload/", files=files)
    
    if response.status_code != 200:
        print("Upload failed:", response.text)
        return
    
    dataset_id = response.json()['dataset_id']
    print(f"Dataset uploaded. ID: {dataset_id}")

    # 2. Run AutoML
    print("Running AutoML...")
    payload = {
        "dataset_id": dataset_id,
        "target_column": "target",
        "use_meta_selection": True
    }
    
    try:
        response = requests.post(f"{BASE_URL}/automl/run", json=payload)
        
        if response.status_code == 200:
            print("AutoML Success!")
            print(response.json())
        else:
            print("AutoML Failed:", response.text)
            
    except Exception as e:
        print(f"Request Error: {e}")

if __name__ == "__main__":
    verify_automl()
