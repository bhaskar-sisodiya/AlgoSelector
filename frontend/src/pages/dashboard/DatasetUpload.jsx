import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaFileCsv, FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { uploadDataset } from "../../api/automlApi";

const DatasetUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "text/csv") handleUpload(dropped);
  };

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploading(true);
    setProgress(30);

    try {
      const data = await uploadDataset(selectedFile);

      // Save dataset ID
      localStorage.setItem("dataset_id", data.dataset_id);

      setProgress(100);
      setUploaded(true);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Dataset Upload</h1>
          <p className="text-base-content/60 mt-1">
            Upload your CSV to initialize the AutoML pipeline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dropzone */}
        <div className="lg:col-span-2">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="h-96 border-2 border-dashed border-base-content/20 rounded-2xl bg-base-100 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-base-200 transition-all cursor-pointer group relative"
          >
            <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FaCloudUploadAlt className="text-4xl text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-base-content">
              Drag & Drop CSV
            </h3>
            <p className="text-base-content/60 mt-2">
              or{" "}
              <label className="text-primary underline cursor-pointer">
                browse files
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files[0])}
                />
              </label>
            </p>
          </div>
        </div>

        {/* Status Panel */}
        <div className="bg-base-200 border border-base-content/10 rounded-2xl p-6 h-fit">
          <h3 className="text-lg font-bold text-base-content mb-4">
            Upload Status
          </h3>

          {!file ? (
            <div className="text-center py-10 text-base-content/60">
              No file selected
            </div>
          ) : (
            <div className="bg-base-100 rounded-xl p-4 border border-base-content/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-lg flex items-center justify-center">
                  <FaFileCsv />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base-content font-medium truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setUploaded(false);
                  }}
                  className="text-base-content/40 hover:text-red-400"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span
                    className={
                      uploading
                        ? "text-primary"
                        : uploaded
                        ? "text-green-400"
                        : "text-base-content/60"
                    }
                  >
                    {uploading
                      ? "Uploading..."
                      : uploaded
                      ? "Completed"
                      : "Pending"}
                  </span>
                  <span className="text-base-content">{progress}%</span>
                </div>

                <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${
                      uploading
                        ? "bg-primary"
                        : uploaded
                        ? "bg-green-500"
                        : "bg-base-content/20"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-base-content/10">
            <button
              disabled={!uploaded}
              onClick={() => navigate("/dashboard/preprocessing")}
              className="btn btn-primary w-full text-white font-bold disabled:opacity-50"
            >
              Next: Preprocessing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetUpload;
