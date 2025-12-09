import React, { useState } from 'react';
import { View } from './types';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { ImageGenerator } from './components/ImageGenerator';

function App() {
  const [currentView, setCurrentView] = useState<View>('chat');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <ChatInterface />;
      case 'studio':
        return <ImageGenerator />;
      case 'settings':
        return (
            <div className="flex items-center justify-center h-full text-slate-500 bg-slate-950">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Configuration</h2>
                    <p>MCP settings are managed via <code>mcp_settings.json</code> in the container root.</p>
                </div>
            </div>
        );
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <main className="flex-1 relative">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;