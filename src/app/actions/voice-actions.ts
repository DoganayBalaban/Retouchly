"use server";

import Replicate from "replicate";
import { supabase } from "@/lib/supabase";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface VoiceGenerationInput {
  text: string;
  voice?: string;
  speed?: number;
}

export async function generateSpeechWithAI(input: VoiceGenerationInput) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return {
        success: false,
        error: "Replicate API token is not configured",
        data: null,
      };
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "User not authenticated",
        data: null,
      };
    }

    // Default parameters based on user instructions
    const voice = input.voice || "af_nicole";
    const speed = input.speed || 1;

    console.log("Starting voice generation with Replicate...");
    const output = await replicate.run(
      "jaaari/kokoro-82m:f559560eb822dc509045f3921a1921234918b91739db4bf3daab2169b71c7a13",
      {
        input: {
          text: input.text,
          speed: speed,
          voice: voice,
        },
      },
    );

    const audioUrl =
      typeof output === "object" && output !== null && "url" in output
        ? (output as any).url()
        : output; // handle potential ReadableStream or string response

    // Save to user_activities
    if (audioUrl) {
      const { error: insertError } = await supabase
        .from("user_activities")
        .insert({
          user_id: user.id,
          activity_type: "voice_generation",
          prompt: input.text,
          image_url: String(audioUrl), // Store audio URL in image_url field for schema compatibility
          metadata: {
            voice: voice,
            speed: speed,
          },
        });

      if (insertError) {
        console.error("Error saving activity:", insertError);
      }
    }

    return {
      success: true,
      error: null,
      data: String(audioUrl), // Return the generated audio URL
    };
  } catch (error) {
    console.error("Voice generation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    };
  }
}
