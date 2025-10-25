"use server";

import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface ImageEditInput {
  image_input: string[];
  prompt: string;
  aspect_ratio?: "match_input_image" | "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  output_format?: "jpg" | "png" | "webp";
}

export async function editImageWithAI(input: ImageEditInput) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return {
        success: false,
        error: "Replicate API token is not configured",
        data: null,
      };
    }

    const output = await replicate.run("google/nano-banana", {
      input: {
        prompt: input.prompt,
        image_input: input.image_input,
        aspect_ratio: input.aspect_ratio || "match_input_image",
        output_format: input.output_format || "jpg",
      },
    });

    return {
      success: true,
      error: null,
      data: output as unknown as string,
    };
  } catch (error) {
    console.error("Image editing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    };
  }
}
