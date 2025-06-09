import { supabase } from "@/lib/supabase";


export const saveImagesToBucket = async (imageUrls: string[], userId: string, prompt: string) => {
  const response = await fetch(imageUrls[0]);
  const blob = await response.blob();

  const fileExt = imageUrls[0].split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(fileName, blob);

  if (uploadError) {
    console.error("Görsel kaydedilirken hata:", uploadError.message);
    throw uploadError;
  }

  const publicUrlData = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  if (!publicUrlData.data?.publicUrl) {
    console.error("Public URL alınamadı");
    throw new Error("Failed to get public URL");
  }

  const publicUrl = publicUrlData.data.publicUrl;

  const { error: insertError } = await supabase.from("generated_images").insert({
    user_id: userId,
    image_url: publicUrl,
    prompt: prompt,
    created_at: new Date().toISOString()
  });

  if (insertError) {
    console.error("Veritabanına kaydedilirken hata:", insertError.message);
    throw insertError;
  }

  return publicUrl;
}
