import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Note: process.env.GEMINI_API_KEY is handled by the platform
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const HUB_AI_SYSTEM_INSTRUCTION = `
You are "Hub-AI", the intelligent concierge for "The Hub" - a flexible event space system.
Your goal is to help users make the most of the space and the community.

THE HUB CONTEXT:
- Areas:
  - The Nest (5-10 people): Best for study groups, small meetings. High-speed Wi-Fi 6, 55" TV.
  - The Creative Hall (20-40 people): Best for workshops, training. 4K projector, surround sound.
  - The Grand Hub (50-100 people): Best for large events, LED screen, stage lighting, Livestream system.
- Specialties: Birthday packages, Product Launches, Live Music.
- Community (Hub Connect): A place for "Hubers" (Designer, Coder, Singer, etc.) to connect.
- Features: AI Matching, AR experiences (simulated), all-in-one support.

GUIDELINES:
1. Be helpful, professional, and slightly "Gen Z" in style (modern, energetic).
2. Suggest the best rooms based on user needs.
3. Help users brainstorm event ideas or setup layouts.
4. If asked about connections, simulate a professional recommendation based on "The Hub" spirit.
5. Keep responses concise and formatted for a chat interface.
`;

export async function askHubAI(prompt: string, history: { role: "user" | "model", parts: [{ text: string }] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: HUB_AI_SYSTEM_INSTRUCTION,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The Hub's digital brain is resting. Please try again in a moment.";
  }
}

/**
 * AI Event Config Suggestion
 */
export async function suggestEventLayout(eventDetails: string) {
  const prompt = `Based on these event details: "${eventDetails}", suggest the best Room, Layout (U-shape, Theater, Classroom, Standing), and Vibe (color/style) for this event at The Hub. Return your suggestion in a friendly, encouraging way.`;
  return await askHubAI(prompt);
}

/**
 * AI Community Matching
 */
export async function suggestConnection(userSkills: string, projectNeeds: string) {
  const prompt = `User Skills: "${userSkills}". Project Needs: "${projectNeeds}". Based on "The Hub" community ethos, suggest how this user can best find a partner or what kind of "Huber" skillsets they should look for.`;
  return await askHubAI(prompt);
}
