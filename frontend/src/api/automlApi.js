const BASE_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const uploadDataset = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  return response.json();
};

export const getProfiling = async (datasetId) => {
  const response = await fetch(`${BASE_URL}/profiling/${datasetId}`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const preprocessDataset = async (datasetId, payload) => {
  const response = await fetch(`${BASE_URL}/preprocess/${datasetId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};

// ✅ FIXED — matches your FastAPI route
export const getRecommendation = async (datasetId) => {
  const targetColumn = localStorage.getItem("target_column");

  const response = await fetch(`${BASE_URL}/recommend/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      dataset_id: datasetId,
      target_column: targetColumn,
    }),
  });

  if (!response.ok) {
    throw new Error("Recommendation failed");
  }

  return response.json();
};
