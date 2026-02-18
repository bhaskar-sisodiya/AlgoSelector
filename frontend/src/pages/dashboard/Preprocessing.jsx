import React, { useState } from "react";
import { FaMagic, FaEraser, FaSlidersH, FaCheckCircle } from "react-icons/fa";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProfiling, preprocessDataset } from "../../api/automlApi";
import { useNavigate } from "react-router-dom";

const OptionCard = ({ icon: Icon, title, desc, active, onClick }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-xl border cursor-pointer transition-all ${
      active
        ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(87,13,248,0.2)]"
        : "bg-gray-900 border-white/10 hover:border-white/20"
    }`}
  >
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-3 rounded-lg ${
          active ? "bg-primary text-white" : "bg-gray-800 text-gray-400"
        }`}
      >
        <Icon className="text-xl" />
      </div>
      {active && <FaCheckCircle className="text-primary text-xl" />}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

const Preprocessing = () => {
  const [selected, setSelected] = useState(["missing"]);
  const [status, setStatus] = useState("Pending");
  const [targetColumn, setTargetColumn] = useState(
    localStorage.getItem("target_column") || "",
  );

  const navigate = useNavigate();
  const datasetId = localStorage.getItem("dataset_id");

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Fetch profiling data (for columns)
  const { data: profilingData } = useQuery({
    queryKey: ["profiling", datasetId],
    queryFn: () => getProfiling(datasetId),
    enabled: !!datasetId,
  });

  const mutation = useMutation({
    mutationFn: (payload) => preprocessDataset(datasetId, payload),
    onSuccess: () => {
      setStatus("Completed");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    },
    onError: () => {
      setStatus("Error");
      alert("Preprocessing failed.");
    },
  });

  const handleApply = () => {
    if (!targetColumn) {
      alert("Please select target column");
      return;
    }

    localStorage.setItem("target_column", targetColumn);

    setStatus("Processing...");

    const payload = {
      handle_missing: selected.includes("missing"),
      scaling: selected.includes("scaling"),
      encoding: selected.includes("encoding"),
      remove_outliers: selected.includes("outliers"),
    };

    mutation.mutate(payload);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Data Preprocessing</h1>
        <p className="text-gray-400 mt-1">
          Select transformation pipelines to apply before training.
        </p>
      </div>

      {/* OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <OptionCard
          icon={FaEraser}
          title="Handle Missing Values"
          desc="Impute missing data using Mean for numerical and Mode for categorical columns."
          active={selected.includes("missing")}
          onClick={() => toggle("missing")}
        />
        <OptionCard
          icon={FaSlidersH}
          title="Feature Scaling"
          desc="Normalize numerical features to a standard scale (Z-score normalization)."
          active={selected.includes("scaling")}
          onClick={() => toggle("scaling")}
        />
        <OptionCard
          icon={FaMagic}
          title="Auto-Encoding"
          desc="Convert categorical variables using One-Hot or Label Encoding automatically."
          active={selected.includes("encoding")}
          onClick={() => toggle("encoding")}
        />
        <OptionCard
          icon={FaCheckCircle}
          title="Remove Outliers"
          desc="Detect and remove statistical outliers using the IQR method."
          active={selected.includes("outliers")}
          onClick={() => toggle("outliers")}
        />
      </div>

      {/* TARGET COLUMN SELECTOR */}
      <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-bold mb-4">Select Target Column</h3>

        <select
          value={targetColumn}
          onChange={(e) => setTargetColumn(e.target.value)}
          className="select select-bordered w-full bg-black text-white border-white/10"
        >
          <option value="">Choose target column</option>

          {profilingData?.column_info?.map((col, index) => (
            <option key={index} value={col["Column Name"]}>
              {col["Column Name"]}
            </option>
          ))}
        </select>
      </div>

      {/* PREVIEW TABLE */}
      <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-bold mb-4">Preview Transformation</h3>

        <div className="overflow-x-auto">
          <table className="table w-full text-left">
            <thead>
              <tr className="text-gray-500 border-b border-white/10">
                <th>Column</th>
                <th>Missing</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {profilingData?.column_info?.map((col, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td>{col["Column Name"]}</td>
                  <td>
                    {col["Missing Values"] > 0 ? (
                      <span className="text-red-400">
                        {col["Missing Values"]}
                      </span>
                    ) : (
                      <span className="text-green-400">0</span>
                    )}
                  </td>
                  <td>{col["Data Type"]}</td>
                  <td
                    className={`${
                      status === "Completed"
                        ? "text-green-400"
                        : status === "Processing..."
                          ? "text-yellow-400"
                          : "text-gray-400"
                    }`}
                  >
                    {status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleApply}
          disabled={mutation.isLoading}
          className="btn btn-primary px-8 text-white"
        >
          {mutation.isLoading ? "Processing..." : "Apply & Train"}
        </button>
      </div>
    </div>
  );
};

export default Preprocessing;
