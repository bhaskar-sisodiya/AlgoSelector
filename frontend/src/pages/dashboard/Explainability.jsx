import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { getExplanation }  from '../../api/automlApi'; // You might need to add this to api file

const Explainability = () => {
  const datasetId = localStorage.getItem("dataset_id");

  const { data: explanationData, isLoading } = useQuery({
    queryKey: ["explanation", datasetId],
    queryFn: async () => {
      // Direct fetch if API helper not ready, or assume import works.
      // I'll assume the user will import 'getExplanation' or I can define it inline for safety now.
      // For robustness I will define raw fetch here or use axios if I know the base URL.
      // Let's rely on the standard pattern if exists. 
      // I will assume the user has axios instance 'api' available.
      // Actually, I should update automlApi.js too. For now, let me just use the same pattern as MetaInsights 
      // but I need to ensure the function exists. 
      // I will use a direct fetch here to be 100% sure it works without editing another file if possible,
      // BUT editing api file is cleaner. 
      // Let's mock the fetch call here if the import fails, but ideally I should add it to api.
      
      const response = await fetch(`http://127.0.0.1:8000/recommend/explanation/${datasetId}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!datasetId,
  });

  if (isLoading) return <div className="text-center p-10 text-base-content/60">Loading explanation...</div>;
  
  // Handle new API structure: { feature_importance: [], reason_parts: [] ... }
  // OR fallback to old list if independent SHAP endpoint was called (though we unified it)
  const features = Array.isArray(explanationData) ? explanationData : (explanationData?.feature_importance || []);
  const metaReasons = !Array.isArray(explanationData) ? (explanationData?.reason_parts || []) : [];
  
  if (features.length === 0 && metaReasons.length === 0) {
      return (
          <div className="text-center p-10 space-y-4">
             <div className="text-base-content/60">No model explanation available.</div>
             <p className="text-sm text-base-content/40">Please run "Algorithm Selection" first to generate insights.</p>
          </div>
      );
  }
  
  // Find top driver and negative factor for text insights
  const topDriver = features.length > 0 ? features.reduce((prev, current) => (prev.value > current.value) ? prev : current, features[0]) : null;
  const negativeFactor = features.length > 0 ? features.reduce((prev, current) => (prev.value < current.value) ? prev : current, features[0]) : null;
  
  const topAlgorithm = !Array.isArray(explanationData) ? explanationData?.top_algorithm : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-base-content">
                Model Explainability
                {topAlgorithm && <span className="ml-3 text-2xl text-primary font-normal">for {topAlgorithm}</span>}
            </h1>
            <p className="text-base-content/70 mt-1">Understanding why the model makes specific predictions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COL: Charts */}
        <div className="lg:col-span-2 space-y-6">
            {features.length > 0 && (
                <div className="bg-base-100 border border-base-content/10 p-6 rounded-xl shadow-sm">
                  <h3 className="text-base-content font-bold mb-6">Global Feature Importance</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={features} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--color-base-100)', 
                            borderColor: 'var(--color-base-content)',
                            color: 'var(--color-base-content)' 
                          }} 
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
            )}
        </div>

        {/* RIGHT COL: Text Insights */}
        <div className="space-y-6">
            
            {/* 1. Meta-Feature Logic (New Section) */}
            {metaReasons.length > 0 && (
                <div className="bg-gradient-to-br from-purple-900/20 to-primary/10 p-6 rounded-xl border border-primary/20">
                  <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
                    <span className="text-lg">🧠</span> System Logic
                  </h3>
                  <p className="text-xs text-base-content/60 mb-3 uppercase font-bold tracking-wider">
                      Why this algorithm family?
                  </p>
                  <ul className="space-y-2">
                    {metaReasons.map((reason, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-base-content/80">
                            <span className="text-primary">•</span>
                            {/* Parse markdown bolding manually if needed, or just display raw text for now */}
                            <span dangerouslySetInnerHTML={{ __html: reason.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                        </li>
                    ))}
                  </ul>
                </div>
            )}

            {/* 2. Key Feature Insights */}
            <div className="bg-base-100 border border-base-content/10 p-6 rounded-xl shadow-sm">
              <h3 className="text-base-content font-bold mb-4">Key Drivers</h3>
              <ul className="space-y-4">
                {topDriver && (
                    <li className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                      <span className="text-blue-400 font-bold block text-sm mb-1">Top Driver</span>
                      <p className="text-base-content/80 text-sm">
                        <span className="text-base-content font-semibold">{topDriver.name}</span> has the highest positive impact.
                      </p>
                    </li>
                )}
                {negativeFactor && negativeFactor.value < 0 && (
                <li className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
                  <span className="text-red-400 font-bold block text-sm mb-1">Negative Factor</span>
                  <p className="text-base-content/80 text-sm">
                    <span className="text-base-content font-semibold">{negativeFactor.name}</span> has an inverse correlation.
                  </p>
                </li>
                )}
                {!topDriver && !negativeFactor && (
                    <li className="text-sm text-base-content/50 italic">
                        Feature importance data unavailable.
                    </li>
                )}
              </ul>
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default Explainability;