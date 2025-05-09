"use server";

import Replicate from "replicate";
import { z } from "zod";
import { imageFormSchema } from "@/components/image-generation/Configurations";


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
  useFileOutput: false,
});

interface ImageResponse {
  error: string | null;
  success: boolean;
  data: any | null;
}

export async function generateImages(
  input: z.infer<typeof imageFormSchema>
): Promise<ImageResponse> {
   
  const modelInput = {
    prompt: input.prompt,
    go_fast: true,
    guidance: input.guidance,
    megapixels: "1",
    num_outputs: input.num_outputs,
    aspect_ratio: input.aspect_ratio,
    output_format: input.output_format,
    output_quality: input.output_quality,
    prompt_strength: 0.8,
    num_inference_steps: input.num_inference_steps,
  };

  try {
    const output = await replicate.run("black-forest-labs/flux-dev", {
      input: modelInput,
    });

    return {
      error: null,
      success: true,
      data: output,
    };
  } catch (err: any) {
    console.error("Replicate API Hatası:", err);
    return {
      error: err?.message || "Görsel üretimi sırasında hata oluştu.",
      success: false,
      data: null,
    };
  }
}
