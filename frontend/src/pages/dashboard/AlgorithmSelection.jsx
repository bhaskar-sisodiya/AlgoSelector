import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaRobot, FaCheckCircle, FaExclamationTriangle, FaArrowRight, FaFilePdf, FaFileWord } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from "../../api/axios";
import { downloadReport } from "../../api/automlApi";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const AlgorithmSelection = () => {
  const navigate = useNavigate();
  const [datasetId, setDatasetId] = useState(null);
  const [targetColumn, setTargetColumn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  useEffect(() => {
    // Retrieve dataset info from localStorage (persisted from upload step)
    const storedDatasetId = localStorage.getItem("dataset_id");
    const storedTarget = localStorage.getItem("target_column");
    
    if (storedDatasetId) setDatasetId(storedDatasetId);
    if (storedTarget) setTargetColumn(storedTarget);

    // 🔥 Check for existing results on mount
    if (storedDatasetId) {
        const fetchStoredResults = async () => {
            try {
                // Don't set loading true here to avoid flashing spinner if user is just navigating back
                // or maybe we want a subtle indicator? Let's just try fetch silently first.
                const response = await api.get(`/automl/results/${storedDatasetId}`);
                if (response.data) {
                    setResults(response.data);
                }
            } catch (err) {
                // 404 means no results yet, which is fine.
                console.log("No previous AutoML results found.");
            }
        };
        fetchStoredResults();
    }
  }, []);

  const handleRunAutoML = async () => {
    if (!datasetId || !targetColumn) {
      setError("No dataset or target column selected. Please upload a dataset first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await api.post("/automl/run", {
        dataset_id: datasetId,
        target_column: targetColumn,
      });
      setResults(response.data);
    } catch (err) {
      console.error("AutoML Error:", err);
      setError("Failed to run AutoML. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (format) => {
    if (!datasetId) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      await downloadReport(datasetId, format);
    } catch (err) {
      setDownloadError(err.message || "Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          AutoML Execution Engine
        </h1>
        <p className="text-gray-400 mt-2">
          Automatically train, rank, and explain models on your dataset.
        </p>
      </motion.div>

      {/* Control Panel */}
      <motion.div 
        variants={itemVariants} 
        className="bg-base-100 p-6 rounded-2xl border border-base-content/10 shadow-sm"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-base-content/70">
            <div className="flex items-center gap-2">
              <FaDatabase className="text-blue-400" />
              <span>Dataset ID: {datasetId || "None"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBullseye className="text-red-400" />
              <span>Target: {targetColumn || "None"}</span>
            </div>
          </div>

          <button
            onClick={handleRunAutoML}
            disabled={loading || !datasetId}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
              ${loading 
                ? "bg-gray-600 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95"
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Training Models...
              </>
            ) : (
              <>
                <FaPlay /> Run AutoML
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
            <FaExclamationTriangle /> {error}
          </div>
        )}
      </motion.div>

      {/* Results Section */}
      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          
          {/* Empty Results State */}
          {results.algorithms && results.algorithms.length === 0 ? (
            <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center">
               <FaExclamationTriangle className="text-4xl mx-auto mb-4 opacity-50" />
               <h3 className="text-xl font-bold">Training Incomplete</h3>
               <p className="mt-2 opacity-80 max-w-lg mx-auto">
                 No algorithms completed training successfully. This usually happens if the dataset is too small, contains incompatible data types, or contains only missing values.
               </p>
               <p className="mt-4 text-xs font-mono bg-black/30 inline-block px-3 py-1 rounded">
                 Check backend logs for "Failed to train" errors.
               </p>
            </div>
          ) : results.algorithms && results.algorithms.length > 0 ? (
            <>
              {/* Top Stats - Best Model KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {/* Accuracy Card */}
                 <div className="bg-gradient-to-br from-green-500/10 to-emerald-900/10 p-5 rounded-2xl border border-green-500/20">
                    <h3 className="text-gray-400 text-xs uppercase font-bold mb-1">Top Accuracy</h3>
                    <p className="text-2xl font-bold text-green-400">{results.algorithms[0]?.accuracy}%</p>
                    <p className="text-xs text-gray-500 mt-1">{results.algorithms[0]?.name}</p>
                 </div>
                 
                 {/* F1 Score Card */}
                 <div className="bg-gradient-to-br from-blue-500/10 to-indigo-900/10 p-5 rounded-2xl border border-blue-500/20">
                    <h3 className="text-gray-400 text-xs uppercase font-bold mb-1">Best F1 Score</h3>
                    <p className="text-2xl font-bold text-blue-400">{results.algorithms[0]?.f1_score}%</p>
                    <p className="text-xs text-gray-500 mt-1">Balanced Metric</p>
                 </div>

                 {/* Time Saved Card */}
                 <div className="bg-gradient-to-br from-purple-500/10 to-pink-900/10 p-5 rounded-2xl border border-purple-500/20">
                    <h3 className="text-gray-400 text-xs uppercase font-bold mb-1">Time Saved</h3>
                    <p className="text-2xl font-bold text-purple-400">{results.algorithms[0]?.time_saved_s}s</p>
                    <p className="text-xs text-gray-500 mt-1">vs Full Grid Search</p>
                 </div>
                 
                 {/* Model Size Card */}
                 <div className="bg-gradient-to-br from-yellow-500/10 to-orange-900/10 p-5 rounded-2xl border border-yellow-500/20">
                    <h3 className="text-gray-400 text-xs uppercase font-bold mb-1">Est. Model Size</h3>
                    <p className="text-2xl font-bold text-yellow-400">{results.algorithms[0]?.model_size_kb} KB</p>
                    <p className="text-xs text-gray-500 mt-1">Lightweight</p>
                 </div>
              </div>

              {/* Main Layout: Leaderboard & Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Col: Leaderboard (wider) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-base-100 p-6 rounded-2xl border border-base-content/10 shadow-sm">
                    <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                      <FaList /> Model Leaderboard
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="text-base-content/60 border-b border-base-content/10">
                            <th className="p-3">Rank</th>
                            <th className="p-3">Algorithm</th>
                            <th className="p-3">Accuracy</th>
                            <th className="p-3">F1 Score</th>
                            <th className="p-3">Tradeoffs</th>
                          </tr>
                        </thead>
                        <tbody className="text-base-content/80">
                          {results.algorithms.map((algo, idx) => (
                            <tr 
                              key={idx} 
                              className={`
                                border-b border-base-content/5 last:border-0 hover:bg-base-200 transition-colors
                                ${idx === 0 ? "bg-green-500/10" : ""}
                              `}
                            >
                              <td className="p-3">
                                {idx === 0 ? <FaTrophy className="text-yellow-400" /> : idx + 1}
                              </td>
                              <td className="p-3 font-medium">{algo.name}</td>
                              <td className="p-3 font-mono text-green-400 font-bold">{algo.accuracy}%</td>
                              <td className="p-3 font-mono text-blue-400">{algo.f1_score}%</td>
                              <td className="p-3 text-xs text-gray-400 italic max-w-xs">{algo.tradeoffs}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                   {/* Charts (Feature Importance) */}
                   <div className="bg-base-100 p-6 rounded-2xl border border-base-content/10 shadow-sm">
                      <h3 className="text-lg font-bold text-base-content mb-4">Feature Importance (SHAP)</h3>
                      {/* Fixed height container to prevent Recharts standard error */}
                      <div style={{ width: "100%", height: 300 }}>
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              layout="vertical" 
                              data={results.feature_importance} 
                              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                              <XAxis type="number" stroke="#9ca3af" />
                              <YAxis 
                                dataKey="name" 
                                type="category" 
                                stroke="#9ca3af" 
                                width={100} 
                                tick={{fontSize: 12}} 
                              />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                                itemStyle={{ color: '#e5e7eb' }}
                              />
                              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
                </div>

                {/* Right Col: Insights & Tips */}
                <div className="space-y-6">
                   {/* Selection Reason */}
                   <div className="bg-gradient-to-br from-blue-600/20 to-purple-900/20 p-6 rounded-2xl border border-blue-500/30">
                      <h3 className="text-lg font-bold text-base-content mb-3 flex items-center gap-2">
                         <FaRobot className="text-blue-400" /> Why this model?
                      </h3>
                      <p className="text-base-content/80 text-sm leading-relaxed">
                         {results.selection_reason}
                      </p>
                   </div>

                   {/* Preprocessing Tips */}
                   <div className="bg-base-100 p-6 rounded-2xl border border-base-content/10 shadow-sm">
                      <h3 className="text-lg font-bold text-base-content mb-4 flex items-center gap-2">
                         <FaCheckCircle className="text-green-400" /> Pro Tips
                      </h3>
                      <ul className="space-y-3">
                         {results.preprocessing_tips?.map((tip, idx) => (
                            <li key={idx} className="flex gap-3 text-sm text-base-content/70">
                               <span className="text-green-500/50">•</span>
                               {tip}
                            </li>
                         )) || <li className="text-base-content/50 italic">No specific tips available.</li>}
                      </ul>
                   </div>

                   {/* Metrics Summary */}
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-base-300 p-4 rounded-xl border border-base-content/5">
                         <p className="text-xs text-base-content/60 uppercase">Time Saved</p>
                         <p className="text-xl font-mono text-purple-400">{results.algorithms[0]?.time_saved_s}s</p>
                      </div>
                      <div className="bg-base-300 p-4 rounded-xl border border-base-content/5">
                         <p className="text-xs text-base-content/60 uppercase">Model Size</p>
                         <p className="text-xl font-mono text-yellow-400">{results.algorithms[0]?.model_size_kb} KB</p>
                      </div>
                   </div>
                </div>

                {/* Navigation Button */}
                <div className="lg:col-span-3 flex flex-wrap justify-end items-center gap-3 mt-4">

                  {/* Download Report */}
                  <div className="flex items-center gap-2">
                    {downloadError && (
                      <span className="text-xs text-red-400">{downloadError}</span>
                    )}
                    <button
                      onClick={() => handleDownloadReport("pdf")}
                      disabled={downloading}
                      title="Download PDF Report"
                      className="flex items-center gap-2 px-4 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-l-xl font-bold transition-all text-sm disabled:opacity-50"
                    >
                      {downloading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FaFilePdf />
                      )}
                      PDF
                    </button>
                    <button
                      onClick={() => handleDownloadReport("docx")}
                      disabled={downloading}
                      title="Download Word Report"
                      className="flex items-center gap-2 px-4 py-3 bg-blue-700/80 hover:bg-blue-700 text-white rounded-r-xl font-bold transition-all text-sm disabled:opacity-50"
                    >
                      <FaFileWord /> DOCX
                    </button>
                  </div>

                  <button
                    onClick={() => navigate("/dashboard/insights")}
                    className="flex items-center gap-2 px-6 py-3 bg-base-100 hover:bg-base-200 border border-base-content/10 rounded-xl transition-all font-bold text-base-content"
                  >
                    Go to Meta-Insights <FaArrowRight />
                  </button>
                </div>

              </div>
            </>
          ) : null}

        </motion.div>
      )}
    </motion.div>
  );
};

// Simple Icon Components for missing imports
const FaDatabase = () => <span className="mr-1">🗄️</span>;
const FaBullseye = () => <span className="mr-1">🎯</span>;
const FaList = () => <span>📋</span>;
const FaTrophy = ({className}) => <span className={className}>🏆</span>;


export default AlgorithmSelection;
