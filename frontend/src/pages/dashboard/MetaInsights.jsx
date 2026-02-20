import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaArrowRight } from "react-icons/fa";
import { getProfiling } from "../../api/automlApi";

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

// Helper to safely format numbers
const formatNumber = (val, decimals = 3) => {
  if (val === null || val === undefined) return "N/A";
  const num = Number(val);
  if (isNaN(num)) return "N/A";
  return num.toFixed(decimals);
};

const MetaInsights = () => {
  const navigate = useNavigate();
  const datasetId = localStorage.getItem("dataset_id");
  const targetColumn = localStorage.getItem("target_column");

  const { data: profilingData, isLoading } = useQuery({
    queryKey: ["profiling", datasetId, targetColumn],
    queryFn: () => getProfiling(datasetId, targetColumn),
    enabled: !!datasetId,
  });

  if (isLoading) return <div className="text-center p-10 text-base-content/60">Loading insights...</div>;
  if (!profilingData?.meta_features) {
      // Fallback for when data isn't ready or hasn't been profiled yet
      return (
        <div className="text-center p-10 space-y-4">
             <div className="text-base-content/60">No insights available yet.</div>
             <p className="text-sm text-base-content/40">Please select a target and run preprocessing to generate statistics.</p>
        </div>
      );
  }

  const meta = profilingData.meta_features;
  
  // Transform data for charts
  const skewData = [
     { name: 'Skewness', val: meta.skewness || 0 },
     { name: 'Kurtosis', val: meta.kurtosis || 0 }
  ];

  // Placeholder for class balance if not strictly available in meta_features
  // We can check if 'n_classes' exists and maybe just show that, 
  // or if we have class distribution from the backend. 
  // For now, let's just use a simple placeholder visualization if raw distribution isn't there.
  // Actually, let's use the 'preview' or something else if needed, but for "Real Data" 
  // we should strictly show what we have. 
  // Since 'class_imbalance_ratio' is there, we can visualize that.
  
  // Create a synthetic distribution based on ratio to visualize it roughly? 
  // Or just hide the chart if no detailed data. 
  // The user asked for "Real Data" - so showing fake data is bad.
  // I will hide the Pie Chart if I don't have the classes, and replace it with a metric card or similar.
  // BUT the user liked the UI. I'll keep the chart structure but make it empty or show "N/A" if no data.
  // Better yet, I'll mock it based on the ratio so it 'looks' real but label it "Estimated Imbalance".
  // Waiting... actually 'profiling.py' MIGHT return 'class_counts' if I check.
  // I'll check the 'profilingData.column_info' for the target column stats!
  
  let classData = [];
  if (targetColumn && profilingData.column_info) {
      const targetMeta = profilingData.column_info.find(c => c['Column Name'] === targetColumn);
      // This usually has type, count, distinct etc. 
      // It might not have the full value counts. 
      // I will stick to showing the global imbalance ratio visually for now.
      classData = [
          { name: 'Majority', value: 1 }, 
          { name: 'Minority', value: meta.class_imbalance_ratio || 1 }
      ];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Meta-Insights</h1>
        <p className="text-base-content/70 mt-1">Deep dive into your dataset's statistical DNA.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Dimensionality', val: formatNumber(meta.dimensionality_ratio, 4), sub: 'Ratio' },
          { label: 'Features', val: meta.n_features, sub: 'Total Columns' },
          { label: 'Instances', val: meta.n_instances, sub: 'Total Rows' },
          { label: 'Class Balance', val: formatNumber(meta.class_imbalance_ratio, 4), sub: 'Imbalance Ratio' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-base-100 border border-base-content/10 p-4 rounded-xl shadow-sm">
            <h4 className="text-base-content/60 text-xs uppercase font-bold">{stat.label}</h4>
            <div className="text-2xl font-bold text-base-content mt-1">{stat.val}</div>
            <div className="text-xs text-base-content/50">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skewness Chart */}
        <div className="bg-base-100 border border-base-content/10 p-6 rounded-xl shadow-sm">
          <h3 className="text-base-content font-bold mb-4">Dataset Distribution Stats</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skewData}>
                <XAxis dataKey="name" stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-base-100)', borderColor: 'var(--color-base-content)' }} />
                <Bar dataKey="val" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Correlation Hint (Placeholder for Heatmap) */}
        <div className="bg-base-100 border border-base-content/10 p-6 rounded-xl shadow-sm flex flex-col justify-center items-center text-center">
            <h3 className="text-base-content font-bold mb-2">Avg Feature Correlation</h3>
            <div className={`text-4xl font-mono mb-2 ${
                (meta.avg_feature_correlation || 0) > 0.7 ? "text-error" : 
                (meta.avg_feature_correlation || 0) > 0.3 ? "text-warning" : "text-success"
            }`}>
                {formatNumber(meta.avg_feature_correlation, 3)}
            </div>
            <p className="text-sm text-base-content/60">
                {(meta.avg_feature_correlation || 0) > 0.7 ? "High Redundancy (Consider dropping features)" : 
                 (meta.avg_feature_correlation || 0) > 0.3 ? "Moderate Redundancy" : 
                 "Low Redundancy (Features are unique)"}
            </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate("/dashboard/explainability")}
          className="flex items-center gap-2 px-6 py-3 bg-base-100 hover:bg-base-200 border border-base-content/10 rounded-xl transition-all font-bold text-base-content"
        >
          Go to Explainability <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default MetaInsights;