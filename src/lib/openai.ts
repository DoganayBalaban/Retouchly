import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIAssistantRequest {
  type:
    | "prompt_suggestion"
    | "image_analysis"
    | "creative_guidance"
    | "general_help";
  context?: {
    imageUrl?: string;
    currentPrompt?: string;
    userGoal?: string;
    toolType?:
      | "image-generation"
      | "face-restoration"
      | "background-remover"
      | "image-overlay";
  };
  message?: string;
}

export interface AIAssistantResponse {
  success: boolean;
  data?: {
    suggestions: string[];
    explanation: string;
    tips?: string[];
  };
  error?: string;
}

export async function getAIAssistance(
  request: AIAssistantRequest
): Promise<AIAssistantResponse> {
  try {
    let systemPrompt = "";
    let userPrompt = "";

    switch (request.type) {
      case "prompt_suggestion":
        systemPrompt = `Sen yaratıcı bir AI asistanısın. Kullanıcıların görsel üretimi için en etkili prompt'ları yazmasına yardım ediyorsun. 
        Türkçe yanıt ver ve her zaman 3-5 farklı prompt önerisi sun. Prompt'lar detaylı, yaratıcı ve teknik terimler içermeli.`;

        userPrompt = `Kullanıcı "${
          request.context?.currentPrompt || "bir görsel"
        }" üretmek istiyor. 
        ${request.context?.userGoal ? `Amacı: ${request.context.userGoal}` : ""}
        Lütfen daha iyi prompt önerileri ver.`;
        break;

      case "image_analysis":
        systemPrompt = `Sen görsel analiz uzmanısın. Yüklenen görselleri analiz edip, o görsele uygun düzenleme önerileri veriyorsun.
        Türkçe yanıt ver ve pratik öneriler sun.`;

        userPrompt = `Kullanıcı bir görsel yükledi. ${request.context?.toolType} aracını kullanıyor. 
        Bu görsele uygun düzenleme önerileri ver.`;
        break;

      case "creative_guidance":
        systemPrompt = `Sen yaratıcı rehber bir AI asistanısın. Kullanıcıların sanatsal projelerinde ilham vermek ve yönlendirmek için varsın.
        Türkçe yanıt ver ve yaratıcı fikirler öner.`;

        userPrompt = request.message || "Yaratıcı bir proje için fikirler ver.";
        break;

      case "general_help":
        systemPrompt = `Sen Retouchly AI araçları konusunda uzman bir asistansın. Kullanıcılara platform özelliklerini açıklıyor ve yardım ediyorsun.
        Türkçe yanıt ver ve dostça bir ton kullan.`;

        userPrompt = request.message || "Platform hakkında bilgi ver.";
        break;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("AI yanıt vermedi");
    }

    // Parse response to extract suggestions and explanation
    const lines = response.split("\n").filter((line) => line.trim());
    const suggestions: string[] = [];
    let explanation = "";
    let tips: string[] = [];

    let currentSection = "explanation";

    for (const line of lines) {
      if (
        line.includes("öner") ||
        line.includes("Öneri") ||
        line.match(/^\d+\./)
      ) {
        currentSection = "suggestions";
        const suggestion = line
          .replace(/^\d+\.\s*/, "")
          .replace(/^[-*]\s*/, "")
          .trim();
        if (suggestion) suggestions.push(suggestion);
      } else if (line.includes("İpucu") || line.includes("Tip")) {
        currentSection = "tips";
      } else if (currentSection === "tips" && line.trim()) {
        tips.push(line.replace(/^[-*]\s*/, "").trim());
      } else if (currentSection === "explanation" && line.trim()) {
        explanation += line + " ";
      }
    }

    // If no structured suggestions found, treat whole response as explanation
    if (suggestions.length === 0) {
      explanation = response;
      // Extract potential suggestions from the response
      const sentences = response
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 20);
      suggestions.push(...sentences.slice(0, 3).map((s) => s.trim()));
    }

    return {
      success: true,
      data: {
        suggestions: suggestions.slice(0, 5),
        explanation: explanation.trim(),
        tips: tips.length > 0 ? tips : undefined,
      },
    };
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
}

export default openai;
