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
        systemPrompt = `You are a creative AI assistant specialized in helping users write effective prompts for image generation. 
        Always respond in English and provide 3-5 different prompt suggestions. Prompts should be detailed, creative, and include technical terms.`;

        userPrompt = `User wants to generate "${
          request.context?.currentPrompt || "an image"
        }". 
        ${request.context?.userGoal ? `Goal: ${request.context.userGoal}` : ""}
        Please provide better prompt suggestions.`;
        break;

      case "image_analysis":
        systemPrompt = `You are an image analysis expert. You analyze uploaded images and provide appropriate editing suggestions.
        Respond in English and give practical recommendations.`;

        userPrompt = `User uploaded an image. They are using ${request.context?.toolType} tool. 
        Provide editing suggestions suitable for this image.`;
        break;

      case "creative_guidance":
        systemPrompt = `You are a creative guide AI assistant. You exist to inspire and guide users in their artistic projects.
        Respond in English and suggest creative ideas.`;

        userPrompt = request.message || "Give me creative project ideas.";
        break;

      case "general_help":
        systemPrompt = `You are an expert assistant for Retouchly AI tools. You explain platform features and help users.
        Respond in English with a friendly tone.`;

        userPrompt = request.message || "Tell me about the platform.";
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
      throw new Error("AI did not respond");
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
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default openai;
