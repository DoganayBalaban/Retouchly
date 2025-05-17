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