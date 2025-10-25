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

export async function restoreFace(input: {
  image: string;
}): Promise<ImageResponse> {
  const modelInput = {
    img: input.image,
    scale: 2,
    version: "v1.4",
  };

  try {
    const output = await replicate.run(
      "tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
      {
        input: modelInput,
      }
    );

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
