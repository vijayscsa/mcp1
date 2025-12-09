import React from 'react';
import { DEFAULT_MCP_SERVERS, ETL_METRICS, INCIDENT_METRICS } from '../constants';
import { Activity, Database, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full bg-slate-950">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Ops Control Center</h2>
          <p className="text-slate-400 mt-1">Real-time monitoring of ETL Pipelines and Incident Response.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700">
          <RefreshCw size={16} />
          Refresh Status
        </button>
      </header>

      {/* Server Status Cards - Grid simplified for 2 items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEFAULT_MCP_SERVERS.map((server) => (
          <div key={server.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {server.type === 'etl' ? <Activity size={120} /> : <AlertTriangle size={120} />}
            </div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-lg transition-colors ${
                  server.type === 'etl' 
                    ? 'bg-blue-900/20 text-blue-400 group-hover:bg-blue-900/30' 
                    : 'bg-orange-900/20 text-orange-400 group-hover:bg-orange-900/30'
              }`}>
                {server.type === 'etl' && <Activity size={24} />}
                {server.type === 'monitoring' && <AlertTriangle size={24} />}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                server.status === 'connected' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
              }`}>
                {server.status === 'connected' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                {server.status.toUpperCase()}
              </div>
            </div>
            
            <div className="relative z-10">
                <h3 className="font-semibold text-xl text-slate-100">{server.name}</h3>
                <p className="text-sm text-slate-500 font-mono mt-1">{server.url}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 relative z-10">
              <p className="text-xs text-slate-400 mb-2 font-medium">MCP CAPABILITIES</p>
              <div className="flex flex-wrap gap-2">
                {server.capabilities.map((cap) => (
                  <span key={cap} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-400">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ab Initio Throughput */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Activity size={18} className="text-blue-400" />
              Ab Initio: Records Processed
            </h3>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ETL_METRICS}>
                <defs>
                  <linearGradient id="colorEtl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorEtl)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PagerDuty Incidents */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-400" />
              PagerDuty: Active Incidents
            </h3>
             <select className="bg-slate-800 border-none text-xs text-slate-400 rounded px-2 py-1">
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INCIDENT_METRICS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{fill: '#1e293b'}}
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};