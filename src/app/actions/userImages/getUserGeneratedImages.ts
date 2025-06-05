import { supabase } from "@/lib/supabase";

export const getUserGeneratedImages = async (userId: string) => {
  const { data, error } = await supabase
    .from("generated_images")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Görseller alınırken hata:", error.message);
    return [];
  }

  return data;
};

export const deleteUserGeneratedImage = async (imageId: string) => {
  const { error } = await supabase
    .from("generated_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    console.error("Görsel silinirken hata:", error.message);
    return false;
  }

  return true;
}
export async function addFavorite(userId: string, imageId: string) {
  const { data, error } = await supabase.from("user_favorites").insert([
    {
      user_id: userId,
      image_id: imageId,
    },
  ]);

  if (error) throw error;
  return data;
}
export async function removeFavorite(userId: string, imageId: string) {
  const { data, error } = await supabase
    .from("user_favorites")
    .delete()
    .eq("user_id", userId)
    .eq("image_id", imageId);

  if (error) throw error;
  return data;
}

// Kullanıcının favorilerini getir (image detaylarıyla)
export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from("user_favorites")
    .select(`
     *, generated_images(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  

  if (error) throw error;
  return data;
}