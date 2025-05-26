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
// "use server";

// import Replicate from "replicate";
// import { z } from "zod";
// import { imageFormSchema } from "@/components/image-generation/Configurations";
// import { supabase } from "@/lib/supabase";


// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN!,
//   useFileOutput: false,
// });

// interface ImageResponse {
//   error: string | null;
//   success: boolean;
//   data: any | null;
// }

// export async function generateImages(
//   userId: string,
//   input: z.infer<typeof imageFormSchema>
// ): Promise<ImageResponse> {
  
//   // 1️⃣ Kullanım hakkı kontrolü
//   const { data, error } = await supabase
//     .from("profiles")
//     .select("daily_usage_count, daily_usage_reset_at")
//     .eq("id", userId)
//     .single();

//   if (error) {
//     console.error("Supabase Kullanıcı Hatası:", error);
//     return {
//       error: "Kullanıcı bulunamadı.",
//       success: false,
//       data: null,
//     };
//   }

//   // 2️⃣ 24 saat kontrolü
//   const now = new Date();
//   const lastReset = new Date(data.daily_usage_reset_at);
//   const diffHours = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60);

//   if (diffHours >= 24) {
//     const { error: resetError } = await supabase
//       .from("profiles")
//       .update({
//         daily_usage_count: 3,
//         daily_usage_reset_at: now.toISOString(),
//       })
//       .eq("id", userId);

//     if (resetError) {
//       console.error("Reset hatası:", resetError);
//       return {
//         error: "Kullanım sıfırlanamadı. Lütfen tekrar deneyin.",
//         success: false,
//         data: null,
//       };
//     }
//     data.daily_usage_count = 3; // Reset sonrası kullanım
//   }

//   // 3️⃣ Kullanım hakkı kontrol
//   if (data.daily_usage_count <= 0) {
//     return {
//       error: "Günlük kullanım hakkınız doldu. 24 saat sonra tekrar deneyin.",
//       success: false,
//       data: null,
//     };
//   }

//   // 4️⃣ daily_usage -1 azalt
//   const { error: updateError } = await supabase
//     .from("profiles")
//     .update({ daily_usage_count: data.daily_usage_count - 1 })
//     .eq("id", userId);

//   if (updateError) {
//     console.error("Kullanım güncellenemedi:", updateError);
//     return {
//       error: "Kullanım hakkı güncellenemedi.",
//       success: false,
//       data: null,
//     };
//   }

//   // 5️⃣ AI modeline istek
//   const modelInput = {
//     prompt: input.prompt,
//     go_fast: true,
//     guidance: input.guidance,
//     megapixels: "1",
//     num_outputs: input.num_outputs,
//     aspect_ratio: input.aspect_ratio,
//     output_format: input.output_format,
//     output_quality: input.output_quality,
//     prompt_strength: 0.8,
//     num_inference_steps: input.num_inference_steps,
//   };

//   try {
//     const output = await replicate.run("black-forest-labs/flux-dev", {
//       input: modelInput,
//     });

//     return {
//       error: null,
//       success: true,
//       data: output,
//     };
//   } catch (err: any) {
//     console.error("Replicate API Hatası:", err);
//     return {
//       error: err?.message || "Görsel üretimi sırasında hata oluştu.",
//       success: false,
//       data: null,
//     };
//   }
// }