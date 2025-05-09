"use server";

import Replicate from "replicate";



const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
  useFileOutput: false,
});

interface ImageResponse {
  error: string | null;
  success: boolean;
  data: any | null;
}

export async function removeBackground(
  input: {image:string}
): Promise<ImageResponse> {
   
  const modelInput = {
    image: input.image,
  };

  try {
    const output = await replicate.run("lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1", {
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
