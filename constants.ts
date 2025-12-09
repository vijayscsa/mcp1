import { MCPServer } from "./types";

export const APP_NAME = "ETL & Ops Nexus";
export const APP_VERSION = "2.0.0-sre";

export const DEFAULT_MCP_SERVERS: MCPServer[] = [
  {
    id: 'mcp-abinitio-01',
    name: 'Ab Initio ETL Core',
    type: 'etl',
    status: 'connected',
    url: 'mcp://etl-controller:8080',
    capabilities: ['job_status', 'trigger_graph', 'data_lineage', 'error_log_retrieval']
  },
  {
    id: 'mcp-pagerduty-01',
    name: 'PagerDuty Ops',
    type: 'monitoring',
    status: 'connected',
    url: 'mcp://pd-gateway:3000',
    capabilities: ['list_incidents', 'acknowledge_incident', 'resolve_incident', 'on_call_users']
  }
];

export const ASPECT_RATIOS = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '16:9', label: 'Widescreen (16:9)' },
];

export const IMAGE_SIZES = [
  { value: '1K', label: 'Standard (1K)' },
];

// Mock Data for Charts
export const ETL_METRICS = [
  { time: '08:00', value: 450 },
  { time: '10:00', value: 1200 },
  { time: '12:00', value: 980 },
  { time: '14:00', value: 1600 },
  { time: '16:00', value: 2100 },
  { time: '18:00', value: 800 },
];

export const INCIDENT_METRICS = [
  { time: 'Mon', value: 12 },
  { time: 'Tue', value: 8 },
  { time: 'Wed', value: 15 },
  { time: 'Thu', value: 4 },
  { time: 'Fri', value: 9 },
  { time: 'Sat', value: 2 },
  { time: 'Sun', value: 3 },
];