"use server";

import {
  getAIAssistance,
  type AIAssistantRequest,
  type AIAssistantResponse,
} from "@/lib/openai";

export async function getAIAssistanceAction(
  request: AIAssistantRequest
): Promise<AIAssistantResponse> {
  try {
    // Rate limiting check (basit bir kontrol)
    // Gerçek uygulamada Redis veya database kullanılabilir

    const response = await getAIAssistance(request);
    return response;
  } catch (error) {
    console.error("AI Assistant Action Error:", error);
    return {
      success: false,
      error:
        "AI asistan şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.",
    };
  }
}
