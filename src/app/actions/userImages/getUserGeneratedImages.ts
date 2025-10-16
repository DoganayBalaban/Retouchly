import { supabase } from "@/lib/supabase";

// Tüm kullanıcı aktivitelerini getir
export const getUserGeneratedImages = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_activities")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Aktiviteler alınırken hata:", error.message);
    return [];
  }

  return data;
};

// Yeni aktivite ekleme fonksiyonu
export const addUserActivity = async (activity: {
  user_id: string;
  activity_type: string;
  input_image_url?: string;
  image_url: string; // output_image_url olarak kullanılacak
  prompt?: string;
  metadata?: any;
}) => {
  console.log("addUserActivity called with:", activity);

  const { data, error } = await supabase
    .from("user_activities")
    .insert([activity]);

  if (error) {
    console.error("Aktivite eklenirken hata:", error.message);
    console.error("Error details:", error);
    throw error;
  }

  console.log("Activity inserted successfully:", data);
  return data;
};

export const deleteUserGeneratedImage = async (imageId: string) => {
  const { error } = await supabase
    .from("user_activities")
    .delete()
    .eq("id", imageId);

  if (error) {
    console.error("Görsel silinirken hata:", error.message);
    return false;
  }

  return true;
};
export async function addFavorite(userId: string, imageId: string) {
  const { data, error } = await supabase.from("user_favorites").insert([
    {
      user_id: userId,
      activity_id: imageId, // Database şemasında activity_id olarak güncellendi
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
    .eq("activity_id", imageId); // Database şemasında activity_id olarak güncellendi

  if (error) throw error;
  return data;
}

// Kullanıcının favorilerini getir (activity detaylarıyla)
export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from("user_favorites")
    .select(
      `
     *, user_activities(*)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
