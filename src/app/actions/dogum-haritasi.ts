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

export async function dogumHaritasi(
  input: {image:string}
): Promise<ImageResponse> {
   
  const modelInput = {
    image: input.image,
    top_p: 1,
      prompt: "Bu görsel bir kişinin astrolojik doğum haritasını içermektedir.Lütfen bu haritayı analiz ederek, kişinin karakter özelliklerini, güçlü ve zayıf yönlerini, ilişkilerdeki tavrını, kariyer potansiyelini ve hayat amacını yorumla. Burçlar, gezegenler, evler ve açıları göz önünde bulundurarak kapsamlı bir astrolojik analiz yaz.",
      max_tokens: 1024,
      temperature: 0.2
  };

  try {
    const output = await replicate.run("yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb", {
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
