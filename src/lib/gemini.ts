import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Note: process.env.GEMINI_API_KEY is handled by the platform
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const HUB_AI_SYSTEM_INSTRUCTION = `
You are "Hub-AI", the intelligent concierge for "The Hub".
Your goal is to help users select the right event package and organize their booking.

PRICING & SERVICES CONTEXT:
1. Trải nghiệm giáo dục (Thuyết trình): 2.000.000 - 5.000.000 VNĐ. (Workshop, Talkshow, Seminar)
2. Tổ chức sự kiện ra mắt sản phẩm: 1.500.000 - 4.000.000 VNĐ. (Setup, vận hành launch)
3. Tổ chức sự kiện sinh nhật: 1.000.000 - 2.500.000 VNĐ. (Khách mời, MC, trang trí)
4. Tổ chức hoạt động khác (Cộng đồng, Workshop CLB): 4.000.000 - 7.000.000 VNĐ.
5. Premium Custom Event (Gói chuyên sâu): 10.000.000 - 20.000.000 VNĐ. (Branding event, Mini concert, Showcase)

AREAS:
- The Nest (5-10 people): Small meetings, study groups.
- The Creative Hall (20-40 people): Workshops, training.
- The Grand Hub (50-100 people): Large events, LED screen, stage.

GUIDELINES:
1. If a user asks for a recommendation/suggestion for booking (gợi ý đặt hàng/chọn gói/phân vân), follow this process:
   - Identify their event type (Workshop, Launch, Birthday, etc.)
   - Identify their scale (small, medium, large) and budget level.
   - Map it to one of our categories (Education, Launch, Birthday, Other, or Premium Custom).
   - Be specific: "Với mục tiêu của bạn, tôi gợi ý gói 'Tổ chức sự kiện ra mắt sản phẩm' (Gói Standard) với mức giá khoảng 2.500.000đ để đảm bảo hiệu ứng media tốt nhất."
2. Suggest the best rooms based on user needs.
3. Help users brainstorm event ideas or setup layouts.
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
