import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
const getAIClient = () => {
  const primaryKey = process.env.GEMINI_API_KEY;
  const secondaryKey = process.env.GEMINI_API_KEY_SECONDARY;
  
  const apiKey = primaryKey || secondaryKey || "";
  
  if (!apiKey && typeof window !== 'undefined') {
    console.warn("Hub-AI: API Key not found. Check your GitHub Secrets (VITE_GEMINI_API_KEY).");
  }

  return new GoogleGenAI({ apiKey });
};

const ai = getAIClient();

export const HUB_AI_SYSTEM_INSTRUCTION = `
You are "Hub-AI", the fast concierge for "The Hub". Be concise.
PRICING:
1. EDU: 2M-5M VNĐ (Workshop/Talkshow)
2. LAUNCH: 1.5M-4M VNĐ (Product Launch)
3. BIRTHDAY: 1M-2.5M VNĐ (Party/Birthday)
4. OTHER: 4M-7M VNĐ (Community/Club)
5. PREMIUM: 10M-20M VNĐ (Branding/Showcase)

AREAS: The Nest (5-10p), Creative Hall (20-40p), Grand Hub (50-100p).

RESPONSE RULE:
- For booking suggestions: Recommend a category and conclude with: {"action": "recommend", "packageId": "ID"}.
- IDs: edu-experience, product-launch, birthday-event, other-activity, premium-custom.
- Example: "Với 25 người sinh nhật giá rẻ, bạn nên chọn gói 'Birthday Event' tại Creative Hall. GIÁ: ~2M VNĐ. {"action": "recommend", "packageId": "birthday-event"}"
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
        temperature: 0.7,
        maxOutputTokens: 500, // Keep it fast
      },
    });

    if (!response.text) {
      throw new Error("Empty response from AI");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Detailed error for debugging live on GitHub Pages
    const errorMessage = error?.message || "Unknown Connection Error";
    
    if (errorMessage.includes("API_KEY_INVALID")) {
      return "Hub-AI: Lỗi API Key không hợp lệ. Hãy kiểm tra lại GitHub Secrets.";
    }
    
    return `The Hub's digital brain is resting. (Lỗi: ${errorMessage})`;
  }
}

/**
 * AI Event Config Suggestion
 */
export async function suggestEventLayout(eventDetails: string, conceptTitle: string = "") {
  const prompt = `Based on these event details: "${eventDetails}" and chosen Concept: "${conceptTitle}", suggest the best Room, Layout (U-shape, Theater, Classroom, Standing), and Vibe (color/style) for this event at The Hub. Return your suggestion in a friendly, encouraging way.`;
  return await askHubAI(prompt);
}

/**
 * AI Community Matching
 */
export async function suggestConnection(userSkills: string, projectNeeds: string) {
  const prompt = `User Skills: "${userSkills}". Project Needs: "${projectNeeds}". Based on "The Hub" community ethos, suggest how this user can best find a partner or what kind of "Huber" skillsets they should look for.`;
  return await askHubAI(prompt);
}
