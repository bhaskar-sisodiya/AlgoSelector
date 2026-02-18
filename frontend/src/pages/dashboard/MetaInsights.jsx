import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const MetaInsights = () => {
  const skewData = [
    { name: 'Income', val: 0.8 },
    { name: 'Age', val: 0.2 },
    { name: 'Loan', val: 1.2 },
    { name: 'Score', val: -0.5 },
  ];

  const classData = [
    { name: 'Approved', value: 70 },
    { name: 'Rejected', value: 30 },
  ];
  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Meta-Insights</h1>
        <p className="text-gray-400 mt-1">Deep dive into your dataset's statistical DNA.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Dimensionality', val: '48', sub: 'Features' },
          { label: 'Instances', val: '12.4k', sub: 'Rows' },
          { label: 'Sparsity', val: '12%', sub: 'Zero values' },
          { label: 'Class Balance', val: '0.42', sub: 'Imbalance Ratio' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-gray-900 border border-white/10 p-4 rounded-xl">
            <h4 className="text-gray-500 text-xs uppercase font-bold">{stat.label}</h4>
            <div className="text-2xl font-bold text-white mt-1">{stat.val}</div>
            <div className="text-xs text-gray-600">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skewness Chart */}
        <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
          <h3 className="text-white font-bold mb-4">Feature Skewness</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skewData}>
                <XAxis dataKey="name" stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                <Bar dataKey="val" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Class Balance Chart */}
        <div className="bg-gray-900 border border-white/10 p-6 rounded-xl">
          <h3 className="text-white font-bold mb-4">Target Class Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={classData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {classData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-sm text-gray-400">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaInsights;