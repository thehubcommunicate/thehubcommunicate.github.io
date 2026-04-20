import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Initialize the Gemini API client
const getAIClient = () => {
  // Use exact strings to match Vite's define replacement
  const primary = process.env.GEMINI_API_KEY;
  const secondary = process.env.GEMINI_SECONDARY_KEY;
  
  const apiKey = primary || secondary || "";
  
  if (!apiKey && typeof window !== 'undefined') {
    console.error("Hub-AI Configuration Error: Gemini API Key is missing.");
  }

  return new GoogleGenAI({ apiKey });
};

const ai = getAIClient();

export const HUB_AI_SYSTEM_INSTRUCTION = `
You are "Hub-AI", the fast and intelligent concierge for "The Hub". 
PRICING & SERVICES:
1. Trải nghiệm giáo dục (Thuyết trình): 2.000.000 - 5.000.000 VNĐ. Nội dung: Workshop, Talkshow, Seminar.
2. Tổ chức sự kiện ra mắt sản phẩm: 1.500.000 - 4.000.000 VNĐ. Nội dung: Setup và vận hành sự kiện launch sản phẩm.
3. Tổ chức sự kiện sinh nhật: 1.000.000 - 2.500.000 VNĐ. Bao gồm: Khách mời, MC, Dụng cụ tổ chức.
4. Tổ chức hoạt động khác: 4.000.000 - 7.000.000 VNĐ. Nội dung: CLB, hoạt động cộng đồng, workshop...
5. Premium Custom Event (Chuyên sâu): 10.000.000 - 20.000.000 VNĐ. Phù hợp: Branding event, Mini concert, Showcase, Sự kiện cá nhân cao cấp.

AREAS: The Nest (5-10p), Creative Hall (20-40p), Grand Hub (50-100p).

RESPONSE RULE:
- For booking suggestions: Recommend a category based on event type, scale, and budget. 
- ALWAYS conclude with a JSON block: {"action": "recommend", "packageId": "ID"}.
- IDs: edu-experience, product-launch, birthday-event, other-activity, premium-custom.
- Example: "Với yêu cầu sinh nhật cho 25 người giá rẻ, bạn nên chọn gói 'Sự kiện sinh nhật' tại Creative Hall. Giá dao động 1.000.000 - 2,500,000 VNĐ. {"action": "recommend", "packageId": "birthday-event"}"
`;

/**
 * FAST STREAMING CHAT
 */
export async function* askHubAIStream(prompt: string, history: { role: "user" | "model", parts: [{ text: string }] }[] = []) {
  if (!ai) {
    yield "Hub-AI is currently offline. (Initialization failed)";
    return;
  }
  
  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: HUB_AI_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 500,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      },
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error: any) {
    console.error("Gemini Streaming Error:", error);
    const errorMessage = error?.message || "Unknown Connection Error";
    const status = error?.status || error?.code || 500;
    
    if (status === 503) {
      yield "Hub-AI: Máy chủ đang quá tải (Code 503). Bạn vui lòng đợi 30 giây rồi thử lại nhé!";
    } else {
      yield `Hub-AI: ${errorMessage} (Code: ${status})`;
    }
  }
}

export async function askHubAI(prompt: string, history: { role: "user" | "model", parts: [{ text: string }] }[] = []) {
  if (!ai) return "Hub-AI is currently offline. (Initialization failed)";
  
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
        maxOutputTokens: 500,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      },
    });

    if (!response.text) {
      if (response.candidates?.[0]?.finishReason) {
        return `Hub-AI: I cannot answer that due to ${response.candidates[0].finishReason}.`;
      }
      throw new Error("Empty response from AI");
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    // Extract meaningful error info
    const errorMessage = error?.message || "Unknown Connection Error";
    const status = error?.status || error?.code || "No Status";
    
    if (errorMessage.includes("API_KEY_INVALID") || status === 403 || status === 401) {
      return "Hub-AI: Lỗi xác thực (API Key không chính xác). Hãy kiểm tra lại GitHub Secrets.";
    }
    
    if (errorMessage.includes("quota") || status === 429) {
      return "Hub-AI: Đã hết hạn mức sử dụng (Quota exceeded). Thử lại sau nhé!";
    }

    if (status === 503) {
      return "Hub-AI: Máy chủ AI đang quá tải (Code 503). Hãy thử lại sau 30 giây nhé!";
    }
    
    return `Hub-AI đang nghỉ ngơi một chút. (Lỗi: ${errorMessage} - Code: ${status})`;
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
