const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

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

export const getProfiling = async (datasetId, targetColumn = null) => {
  let url = `${BASE_URL}/profiling/${datasetId}`;
  if (targetColumn) {
    url += `?target_column=${encodeURIComponent(targetColumn)}`;
  }
  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const preprocessDataset = async (datasetId, payload) => {
  const response = await fetch(`${BASE_URL}/preprocess/`, {
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

export const getExplanation = async (datasetId) => {
  const response = await fetch(`${BASE_URL}/recommend/explanation/${datasetId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    // It's okay if it fails (e.g. 404), return empty
    return []; 
  }

  return response.json();
};

/**
 * Download an AutoML report for the given dataset.
 * @param {string} datasetId
 * @param {'pdf'|'docx'} format
 */
export const downloadReport = async (datasetId, format = "pdf") => {
  const response = await fetch(
    `${BASE_URL}/report/download/${datasetId}?format=${format}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "Download failed" }));
    throw new Error(err.detail || "Failed to download report");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `AlgoSelector_Report_${datasetId}.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
