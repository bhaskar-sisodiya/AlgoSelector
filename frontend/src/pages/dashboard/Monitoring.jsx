import React, { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { FaServer, FaCheckCircle, FaExclamationTriangle, FaClock, FaMemory, FaMicrochip, FaBolt } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from "../../api/axios";

// Helper for live data fetching
const fetchStats = async () => {
    const res = await api.get("/system/stats");
    return res.data;
};

const fetchLogs = async () => {
    const res = await api.get("/system/logs");
    return res.data;
};

const Monitoring = () => {
  // Poll for stats every 2 seconds
  const { data: stats } = useQuery({
    queryKey: ["systemStats"],
    queryFn: fetchStats,
    refetchInterval: 2000,
  });

  const { data: logs } = useQuery({
    queryKey: ["systemLogs"],
    queryFn: fetchLogs,
    refetchInterval: 5000,
  });

  // Keep a small history for the chart
  const [cpuHistory, setCpuHistory] = useState([]);

  useEffect(() => {
     if (stats) {
         setCpuHistory(prev => {
             const newHistory = [...prev, { time: new Date().toLocaleTimeString(), value: stats.cpu_usage }];
             return newHistory.slice(-20); // Keep last 20 points
         });
     }
  }, [stats]);


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-base-content">System Monitoring</h1>
            <p className="text-base-content/70 mt-1">Real-time health checks and resource tracking.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-bold animate-pulse">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Live
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Status */}
        <div className="bg-base-100 border border-base-content/10 p-5 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-green-500/20 text-green-500 rounded-lg text-2xl"><FaCheckCircle /></div>
          <div>
            <h3 className="text-base-content/60 text-xs font-bold uppercase">System Status</h3>
            <p className="text-green-500 font-bold text-lg">{stats?.status || "Unknown"}</p>
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-base-100 border border-base-content/10 p-5 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg text-2xl"><FaClock /></div>
          <div>
            <h3 className="text-base-content/60 text-xs font-bold uppercase">Uptime</h3>
            <p className="text-base-content font-bold text-lg">{stats?.uptime || "0h 0m"}</p>
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-base-100 border border-base-content/10 p-5 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-purple-500/20 text-purple-500 rounded-lg text-2xl"><FaBolt /></div>
          <div>
            <h3 className="text-base-content/60 text-xs font-bold uppercase">Total Requests</h3>
            <p className="text-base-content font-bold text-lg">{stats?.total_requests || 0}</p>
          </div>
        </div>

        {/* Active Models */}
        <div className="bg-base-100 border border-base-content/10 p-5 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-orange-500/20 text-orange-500 rounded-lg text-2xl"><FaServer /></div>
            <div>
              <h3 className="text-base-content/60 text-xs font-bold uppercase">Active Models</h3>
              <p className="text-base-content font-bold text-lg">{stats?.active_models || 0}</p>
            </div>
          </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CPU History Chart */}
          <div className="lg:col-span-2 bg-base-100 border border-base-content/10 p-6 rounded-xl shadow-sm">
              <h3 className="text-base-content font-bold mb-6 flex items-center gap-2">
                  <FaMicrochip className="text-primary"/> CPU Usage History
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cpuHistory}>
                        <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[0, 100]} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} 
                        />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorCpu)" />
                    </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Resource Gauges */}
          <div className="space-y-6">
              {/* CPU Gauge */}
              <div className="bg-base-100 border border-base-content/10 p-6 rounded-xl shadow-sm">
                 <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-bold text-base-content/70 flex items-center gap-2"><FaMicrochip/> CPU Load</span>
                     <span className="text-xl font-bold text-primary">{stats?.cpu_usage}%</span>
                 </div>
                 <progress className="progress progress-primary w-full h-3" value={stats?.cpu_usage || 0} max="100"></progress>
              </div>

              {/* RAM Gauge */}
               <div className="bg-base-100 border border-base-content/10 p-6 rounded-xl shadow-sm">
                 <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-bold text-base-content/70 flex items-center gap-2"><FaMemory/> RAM Usage</span>
                     <span className="text-xl font-bold text-secondary">{stats?.ram_usage}%</span>
                 </div>
                 <progress className="progress progress-secondary w-full h-3" value={stats?.ram_usage || 0} max="100"></progress>
              </div>
          </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-base-100 border border-base-content/10 rounded-xl p-6 shadow-sm overflow-hidden">
        <h3 className="text-base-content font-bold mb-4">Live System Logs</h3>
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="table table-zebra w-full shadow-none">
                <thead className="sticky top-0 bg-base-100 z-10">
                    <tr>
                        <th>Timestamp</th>
                        <th>Action</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {logs?.map((log, idx) => (
                        <tr key={idx} className="hover:bg-base-200/50">
                            <td className="font-mono text-xs opacity-70">{log.timestamp}</td>
                            <td className="font-medium">{log.action}</td>
                            <td>
                                <span className={`badge badge-sm ${log.status === 'Success' ? 'badge-success' : 'badge-error'}`}>
                                    {log.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {!logs && <tr><td colSpan="3" className="text-center opacity-50 py-4">Loading logs...</td></tr>}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;