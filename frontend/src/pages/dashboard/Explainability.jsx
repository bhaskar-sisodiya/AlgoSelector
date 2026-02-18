import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Explainability = () => {
  const data = [
    { feature: 'Credit Score', impact: 0.45 },
    { feature: 'Debt Ratio', impact: 0.32 },
    { feature: 'Late Payments', impact: 0.28 },
    { feature: 'Annual Income', impact: -0.15 },
    { feature: 'Age', impact: 0.12 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Model Explainability</h1>
        <p className="text-gray-400 mt-1">Understanding why the model makes specific predictions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-white/10 p-6 rounded-xl">
          <h3 className="text-white font-bold mb-6">Global Feature Importance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="feature" type="category" stroke="#fff" width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333' }} />
                <Bar dataKey="impact" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Text Insight */}
        <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
          <h3 className="text-white font-bold mb-4">Key Insights</h3>
          <ul className="space-y-4">
            <li className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
              <span className="text-blue-400 font-bold block text-sm mb-1">Top Driver</span>
              <p className="text-gray-300 text-sm">
                <span className="text-white font-semibold">Credit Score</span> has the highest positive impact on approval probability.
              </p>
            </li>
            <li className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
              <span className="text-red-400 font-bold block text-sm mb-1">Negative Factor</span>
              <p className="text-gray-300 text-sm">
                <span className="text-white font-semibold">Annual Income</span> shows a surprising inverse correlation in the lower quartiles.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Explainability;