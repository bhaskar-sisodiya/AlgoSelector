import React from 'react';
import { FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';

const RightPanel = () => {
  return (
    <div className="w-72 bg-gray-900 border-l border-white/10 hidden xl:flex flex-col h-full fixed right-0 top-16 z-30 p-4 overflow-y-auto">
      
      {/* Explanation Card */}
      <div className="mb-6">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <FaLightbulb className="text-yellow-400" /> Why XGBoost?
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-2">
          Based on the high dimensionality (48 features) and non-linear relationships detected in your data, Tree Ensemble methods outperform linear models.
        </p>
        <div className="text-xs text-primary bg-primary/10 p-2 rounded border border-primary/20">
          Match Score: 98.4%
        </div>
      </div>

      {/* Alerts */}
      <div className="mb-6">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <FaExclamationTriangle className="text-orange-400" /> Alerts
        </h3>
        <div className="space-y-3">
          <div className="bg-orange-900/20 border border-orange-500/30 p-3 rounded-lg">
            <p className="text-orange-200 text-xs font-semibold">Class Imbalance</p>
            <p className="text-gray-400 text-xs">Target variable is skewed (80/20). SMOTE applied automatically.</p>
          </div>
        </div>
      </div>

      <div className="mt-auto">
         <button className="btn btn-outline btn-sm w-full text-gray-400 hover:text-white">Give Feedback</button>
      </div>
    </div>
  );
};

export default RightPanel;