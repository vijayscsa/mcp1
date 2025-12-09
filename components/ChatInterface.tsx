import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageRole } from '../types';
import { generateAgentResponse } from '../services/geminiService';
import { Send, Bot, User, Terminal, Loader2, Sparkles } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      content: "Hello! I am your Reliability Engineering Agent. I am connected to the Ab Initio ETL Controller and PagerDuty. I can help you check job statuses, investigate graph failures, and manage incidents. How can I help you triage today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Convert history for API (simplified)
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await generateAgentResponse(history, userMsg.content);
      const text = response.text || "No response generated.";
      
      // Simulate Tool Calls visualization if any (Mocking the visual aspect for this demo)
      // In a real generic MCP client, we would parse response.functionCalls
      // For this demo, if the response contains specific keywords, we add a mock tool call visual
      let toolCalls = undefined;
      const lowerText = text.toLowerCase();
      if (lowerText.includes("pagerduty") && lowerText.includes("incident")) {
         toolCalls = [{ id: 'call_1', name: 'list_incidents', args: { urgency: 'high' }}];
      } else if (lowerText.includes("etl") || lowerText.includes("job") || lowerText.includes("graph")) {
         toolCalls = [{ id: 'call_2', name: 'get_etl_job_status', args: { jobName: 'graph_daily_sales_agg.mp' }}];
      }

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: text,
        timestamp: new Date(),
        toolCalls
      };

      setMessages(prev => [...prev, modelMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        content: "I encountered an error connecting to the AI service. Please check your network or API key.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="text-indigo-400" size={18} />
            SRE Agent
          </h2>
          <p className="text-xs text-slate-400">Ab Initio & PagerDuty Connected</p>
        </div>
        <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-mono border border-green-500/20">
          MCP: ACTIVE
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>

            {/* Content */}
            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-slate-800 text-slate-100 rounded-tr-none' 
                  : 'bg-indigo-900/20 text-indigo-50 border border-indigo-900/30 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
              
              {/* Tool Execution Visualization (Mock) */}
              {msg.toolCalls && (
                <div className="mt-2 space-y-2 w-full">
                    {msg.toolCalls.map(call => (
                        <div key={call.id} className="bg-slate-900 rounded-lg border border-slate-800 p-3 font-mono text-xs w-full">
                            <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-800 pb-2">
                                <Terminal size={12} />
                                <span>MCP Tool Execution</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-400">function</span>
                                <span className="text-yellow-400">{call.name}</span>
                            </div>
                            <div className="text-slate-500 mt-1">
                                {JSON.stringify(call.args, null, 2)}
                            </div>
                             <div className="mt-2 pt-2 border-t border-slate-800/50 text-green-500 flex items-center gap-1">
                                <Loader2 size={10} className="animate-spin" />
                                <span>Querying backend system...</span>
                            </div>
                        </div>
                    ))}
                </div>
              )}
              
              <span className="text-[10px] text-slate-600 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="E.g. 'Check failures in the daily_sales graph' or 'List high urgency incidents'"
            className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};