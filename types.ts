// MCP & Server Types
export interface MCPServer {
  id: string;
  name: string;
  type: 'etl' | 'monitoring' | 'database' | 'other';
  status: 'connected' | 'disconnected' | 'error';
  url: string;
  capabilities: string[];
}

export interface MetricData {
  name: string;
  value: number;
  time: string;
}

// Chat & Agent Types
export type MessageRole = 'user' | 'model' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
  toolResponses?: ToolResponse[];
  images?: string[]; // Base64 strings
}

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
}

export interface ToolResponse {
  id: string;
  name: string;
  result: any;
}

// Image Generation Types
export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface ImageGenConfig {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  prompt: string;
}

// Navigation
export type View = 'dashboard' | 'chat' | 'studio' | 'settings';
