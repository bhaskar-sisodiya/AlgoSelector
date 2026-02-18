import React from 'react';
import { FaServer, FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';

const Monitoring = () => {
  const alerts = [
    { type: 'warning', msg: 'Data Drift detected in "Income" feature (p-value < 0.05)', time: '2h ago' },
    { type: 'success', msg: 'Model retraining completed successfully.', time: '5h ago' },
    { type: 'error', msg: 'API Latency spiked to 500ms.', time: '1d ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">System Monitoring</h1>
        <p className="text-gray-400 mt-1">Real-time health checks and model performance tracking.</p>
      </div>

      {/* Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-900/10 border border-green-500/30 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-green-500/20 text-green-500 rounded-lg text-2xl"><FaCheckCircle /></div>
          <div>
            <h3 className="text-white font-bold">System Status</h3>
            <p className="text-green-400 text-sm">Operational</p>
          </div>
        </div>
        <div className="bg-gray-900 border border-white/10 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg text-2xl"><FaServer /></div>
          <div>
            <h3 className="text-white font-bold">API Requests</h3>
            <p className="text-gray-400 text-sm">12,450 / day</p>
          </div>
        </div>
        <div className="bg-gray-900 border border-white/10 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-500 rounded-lg text-2xl"><FaClock /></div>
          <div>
            <h3 className="text-white font-bold">Avg Latency</h3>
            <p className="text-gray-400 text-sm">45ms</p>
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-bold mb-6">Recent Alerts</h3>
        <div className="space-y-4">
          {alerts.map((alert, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-black/20 border border-white/5">
              <div className={`mt-1 ${
                alert.type === 'warning' ? 'text-yellow-500' : 
                alert.type === 'error' ? 'text-red-500' : 'text-green-500'
              }`}>
                {alert.type === 'warning' ? <FaExclamationTriangle /> : 
                 alert.type === 'error' ? <FaExclamationTriangle /> : <FaCheckCircle />}
              </div>
              <div className="flex-1">
                <p className="text-gray-200 text-sm">{alert.msg}</p>
                <p className="text-gray-600 text-xs mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Monitoring;