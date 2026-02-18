import React from 'react';
import { FaDatabase, FaCheckCircle, FaClock, FaTrophy } from 'react-icons/fa';

const KPICards = () => {
  const metrics = [
    { label: "Dataset Shape", value: "12,400 x 48", icon: FaDatabase, color: "text-blue-400", sub: "Rows x Columns" },
    { label: "Missing Values", value: "0.02%", icon: FaCheckCircle, color: "text-green-400", sub: "Imputed via Mean" },
    { label: "Recommended Algo", value: "XGBoost", icon: FaTrophy, color: "text-yellow-400", sub: "Confidence: 98.4%" },
    { label: "Training Time", value: "~4.2s", icon: FaClock, color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {metrics.map((m, idx) => (
        <div key={idx} className="bg-gray-900 border border-white/10 p-4 rounded-xl flex items-center gap-4 hover:border-white/20 transition-colors">
          <div className={`p-3 rounded-lg bg-white/5 ${m.color} text-xl`}>
            <m.icon />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-semibold">{m.label}</p>
            <h3 className="text-xl font-bold text-white">{m.value}</h3>
            <p className="text-xs text-gray-500">{m.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;