
import React, { useState } from "react";
import { FaMagic, FaEraser, FaSlidersH, FaCheckCircle, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProfiling, preprocessDataset } from "../../api/automlApi";
import { useNavigate } from "react-router-dom";

const ActionCard = ({ icon: Icon, title, desc, action, loading, onClick, status }) => (
  <div className="p-6 rounded-xl border border-base-content/10 bg-base-100 hover:border-base-content/20 transition-all shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-lg bg-base-200 text-base-content/60">
        <Icon className="text-xl" />
      </div>
      {status === "success" && <FaCheckCircle className="text-green-500 text-xl" />}
      {status === "error" && <FaExclamationTriangle className="text-red-500 text-xl" />}
    </div>
    <h3 className="text-lg font-bold text-base-content mb-2">{title}</h3>
    <p className="text-sm text-base-content/70 mb-4">{desc}</p>
    
    <button
      onClick={() => onClick(action)}
      disabled={loading || status === "success"}
      className={`
        w-full py-2 rounded-lg font-medium transition-all
        ${status === "success" 
          ? "bg-green-500/20 text-green-400 border border-green-500/20 cursor-default"
          : "bg-primary text-white hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        }
      `}
    >
      {loading ? "Processing..." : status === "success" ? "Applied" : "Apply"}
    </button>
  </div>
);

const MetaStat = ({ label, value }) => (
  <div className="bg-base-200/50 p-2 md:p-3 rounded-lg border border-base-content/5 h-full flex flex-col justify-center">
    <p className="text-[10px] md:text-xs text-base-content/60 uppercase font-semibold break-words">{label}</p>
    <p className="text-sm md:text-lg font-mono text-primary break-words">
      {typeof value === "object" && value !== null ? JSON.stringify(value) : value}
    </p>
  </div>
);

const Preprocessing = () => {
  const [targetColumn, setTargetColumn] = useState(() => {
    const saved = localStorage.getItem("target_column");
    // Sanitize: invalid if it contains semicolons, quotes, or is abnormally long (>50 chars likely not a column name)
    if (saved && (saved.includes(";") || saved.includes('"') || saved.length > 100)) {
       console.warn("Cleared invalid target_column from storage");
       localStorage.removeItem("target_column");
       return "";
    }
    return saved || "";
  });
  // Track status for each action: "idle", "loading", "success", "error"
  const [actionStatus, setActionStatus] = useState({
    missing: "idle",
    cardinality: "idle", // Not implemented yet but good placeholder
    dict_vectorizer: "idle",
    scaling: "idle",
    encoding: "idle",
    outliers: "idle"
  });

  const navigate = useNavigate();
  const datasetId = localStorage.getItem("dataset_id");

  // Fetch profiling data
  const { data: profilingData, refetch: refetchProfiling } = useQuery({
    queryKey: ["profiling", datasetId, targetColumn], // invalidates when target changes
    queryFn: () => getProfiling(datasetId, targetColumn),
    enabled: !!datasetId,
  });

  const mutation = useMutation({
    mutationFn: (payload) => preprocessDataset(datasetId, payload),
    onSuccess: (data, variables) => {
      setActionStatus(prev => ({ ...prev, [variables.action]: "success" }));
      refetchProfiling(); // Refresh data to show changes
    },
    onError: (error, variables) => {
      console.error(error);
      setActionStatus(prev => ({ ...prev, [variables.action]: "error" }));
      alert(`Failed to apply ${variables.action}: ${error.message}`);
    },
  });

  const handleAction = (action) => {
    if (!targetColumn) {
      alert("Please select a target column first.");
      return;
    }
    // Set loading
    setActionStatus(prev => ({ ...prev, [action]: "loading" }));

    const payload = {
      dataset_id: datasetId,
      target_column: targetColumn,
      action: action,
      categorical_columns: [] 
      // Note: Ideally we pass specific columns, but current backend 
      // logic might infer them or we should allow user selection.
      // For V1, the backend helper 'handle_missing' etc. often re-detects 
      // or we can pass all cats from profiling if strictly needed. 
      // Let's rely on backend detection or pass empty if not manually selected.
    };

    mutation.mutate(payload);
  };

  // Helper to check if action is suggested
  const getSuggestion = (actionKey) => {
    return profilingData?.preprocessing_suggestions?.find(s => s.action === actionKey);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Data Preprocessing</h1>
          <p className="text-base-content/70 mt-1">
            Applying recommended transformations based on dataset analysis.
          </p>
        </div>
        
        <button
          onClick={() => navigate("/dashboard/algorithms")}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95"
        >
          Go to Algorithm Selection <FaArrowRight />
        </button>
      </div>

      {/* META-FEATURES PANEL */}
      {profilingData?.meta_features && (
         <div className="bg-base-100 p-6 rounded-2xl border border-base-content/10 shadow-sm">
            <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
               📊 Dataset Meta-Features
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
               <MetaStat label="Rows" value={profilingData.meta_features.n_instances} />
               <MetaStat label="Columns" value={profilingData.meta_features.n_features} />
               <MetaStat label="Continuous" value={profilingData.meta_features.n_continuous} />
               <MetaStat label="Categorical" value={profilingData.meta_features.n_categorical} />
               <MetaStat label="Dim. Ratio" value={profilingData.meta_features.dimensionality_ratio} />
               <MetaStat label="Classes" value={profilingData.meta_features.n_classes || "N/A"} />
               <MetaStat label="Imbalance" value={profilingData.meta_features.class_imbalance_ratio || "N/A"} />
               <MetaStat label="Avg Corr" value={profilingData.meta_features.avg_feature_correlation} />
               <MetaStat label="Skewness" value={profilingData.meta_features.skewness} />
               <MetaStat label="Kurtosis" value={profilingData.meta_features.kurtosis} />
               <MetaStat label="Target Entropy" value={profilingData.meta_features.target_entropy || "N/A"} />
               <MetaStat label="SNR" value={profilingData.meta_features.signal_to_noise_ratio} />
               <MetaStat label="Mean Features" value={profilingData.meta_features.mean_features} />
               <MetaStat label="Std Features" value={profilingData.meta_features.std_features} />
            </div>
         </div>
      )}

      {/* PREVIEW TABLE */}
      <div className="bg-base-100 border border-base-content/10 rounded-xl p-6 shadow-sm overflow-hidden">
        <h3 className="text-base-content font-bold mb-4">Dataset Preview (First 5 Rows)</h3>
        {profilingData?.preview ? (
             <div className="w-full">
                <table className="table w-full text-left text-[8px] sm:text-[10px] md:text-xs table-fixed">
                   <thead>
                      <tr className="text-base-content/60 border-b border-base-content/10">
                         {Object.keys(profilingData.preview[0]).map((key) => (
                            <th key={key} className="whitespace-normal break-words p-0.5 md:p-1 align-top">{key}</th>
                         ))}
                      </tr>
                   </thead>
                   <tbody className="text-base-content/80">
                      {profilingData.preview.map((row, idx) => (
                         <tr key={idx} className="border-b border-base-content/5 hover:bg-base-200/50">
                            {Object.values(row).map((val, i) => (
                               <td key={i} className="whitespace-normal break-words p-0.5 md:p-1 align-top">{
                                 typeof val === 'number' && !Number.isInteger(val) ? val.toFixed(4) : 
                                 (typeof val === 'object' && val !== null ? JSON.stringify(val) : val)
                               }</td>
                            ))}
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
        ) : (
            <p className="text-gray-500 italic">No preview available.</p>
        )}
      </div>

      {/* TARGET COLUMN SELECTOR */}
      <div className="bg-base-100 border border-base-content/10 rounded-xl p-6 shadow-sm">
        <h3 className="text-base-content font-bold mb-4">Target Column (Required)</h3>
        <select
          value={targetColumn}
          onChange={(e) => {
             setTargetColumn(e.target.value);
             localStorage.setItem("target_column", e.target.value);
          }}
          className="select select-bordered w-full bg-base-200 text-base-content border-base-content/20"
        >
          <option value="">-- Select Target --</option>
          {profilingData?.column_info?.map((col, index) => (
            <option key={index} value={col["Column Name"]}>
              {col["Column Name"]}
            </option>
          ))}
        </select>
      </div>

      {/* SUGGESTED ACTIONS GRID */}
      {profilingData?.preprocessing_suggestions && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
            <FaMagic className="text-primary" /> Recommended Actions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Render Missing Values if suggested */}
            {getSuggestion("missing") && (
              <ActionCard
                icon={FaEraser}
                title="Handle Missing"
                desc={getSuggestion("missing").reason}
                action="missing"
                loading={actionStatus.missing === "loading"}
                status={actionStatus.missing}
                onClick={handleAction}
              />
            )}
            
            {/* Render Outliers if suggested */}
            {getSuggestion("outliers") && (
              <ActionCard
                icon={FaExclamationTriangle} 
                title="Remove Outliers"
                desc={getSuggestion("outliers").reason}
                action="outliers"
                loading={actionStatus.outliers === "loading"}
                status={actionStatus.outliers}
                onClick={handleAction}
              />
            )}

            {/* Render Scaling if suggested */}
            {getSuggestion("scaling") && (
              <ActionCard
                icon={FaSlidersH}
                title="Scaling"
                desc={getSuggestion("scaling").reason}
                action="scaling"
                loading={actionStatus.scaling === "loading"}
                status={actionStatus.scaling}
                onClick={handleAction}
              />
            )}

            {/* Render Encoding if suggested */}
            {getSuggestion("encoding") && (
              <ActionCard
                icon={FaMagic}
                title="Encoding"
                desc={getSuggestion("encoding").reason}
                action="encoding"
                loading={actionStatus.encoding === "loading"}
                status={actionStatus.encoding}
                onClick={handleAction}
              />
            )}
          </div>
          
          {/* Fallback if no suggestions */}
          {profilingData.preprocessing_suggestions.length === 0 && (
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 flex items-center gap-3">
              <FaCheckCircle className="text-2xl" />
              <div>
                <h4 className="font-bold">Data looks clean!</h4>
                <p className="text-sm opacity-80">No specific preprocessing steps are strongly recommended. You can proceed to algorithm selection.</p>
              </div>
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default Preprocessing;
