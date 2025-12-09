import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- Tool Definitions (Simulating MCP Capabilities) ---

const listIncidentsTool: FunctionDeclaration = {
  name: "list_incidents",
  description: "List active high-urgency incidents from PagerDuty MCP.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      urgency: { type: Type.STRING, description: "Filter by urgency (high/low)" },
      limit: { type: Type.NUMBER, description: "Max number of incidents to return" }
    }
  }
};

const getEtlStatusTool: FunctionDeclaration = {
  name: "get_etl_job_status",
  description: "Get the status and failure logs of a specific Ab Initio ETL job graph.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      jobName: { type: Type.STRING, description: "The name of the ETL job/graph (.mp)" }
    },
    required: ["jobName"]
  }
};

const tools: Tool[] = [{
  functionDeclarations: [listIncidentsTool, getEtlStatusTool]
}];

// --- Service Methods ---

export const generateAgentResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  currentMessage: string
) => {
  try {
    const model = "gemini-3-pro-preview";

    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history.map(h => ({
            role: h.role,
            parts: h.parts
        })),
        { role: 'user', parts: [{ text: currentMessage }] }
      ],
      config: {
        tools,
        systemInstruction: `You are an expert Site Reliability Engineering (SRE) Agent connected to Ab Initio ETL and PagerDuty via MCP. 
        
        Your goals are:
        1. Monitor Ab Initio graph execution and identify failures.
        2. Triage and manage PagerDuty incidents related to data pipelines.
        
        When a user asks about a job, check its status. If it failed, try to correlate it with PagerDuty incidents.
        Be concise, technical, and precise. Do not simulate capabilities outside of ETL and Incident Management.`,
      }
    });

    return response;
  } catch (error) {
    console.error("Gemini Agent Error:", error);
    throw error;
  }
};

export const generateCreativeImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  imageSize: ImageSize
): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio, 
          imageSize: imageSize
        }
      }
    });

    const images: string[] = [];
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
        }
      }
    }
    return images;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};