import React from 'react';
import { View } from '../types';
import { LayoutDashboard, MessageSquare, Image as ImageIcon, Settings, Server, Activity } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'chat', label: 'Agent Chat', icon: <MessageSquare size={20} /> },
    { id: 'dashboard', label: 'System Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'studio', label: 'Visual Aids', icon: <ImageIcon size={20} /> },
    { id: 'settings', label: 'Configuration', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Activity className="text-white" size={20} />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 tracking-tight">ETL Nexus</h1>
          <p className="text-xs text-slate-500">SRE Edition</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Server size={14} className="text-green-400" />
            <span className="text-xs font-medium text-slate-300">MCP Bridge Status</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Ab Initio</span>
            <span className="text-green-400">● Connected</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>PagerDuty</span>
            <span className="text-green-400">● Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};