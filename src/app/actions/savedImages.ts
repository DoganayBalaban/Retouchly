import { supabase } from "@/lib/supabase";

export async function saveGeneratedImages(imageUrls: string[], prompt: string, userId: string) {
  const { error } = await supabase
    .from("generated_images")
    .insert(
      imageUrls.map((url) => ({
        user_id: userId,
        image_url: url,
        prompt,
      }))
    );

  if (error) {
    console.error("Veri kaydedilirken hata:", error.message);
  }
}