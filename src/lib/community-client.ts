"use client";

import { supabase } from "@/lib/supabase";

// Client-side like function (works with RLS)
export async function likeImageClient(activityId: string) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please sign in to like images" };
    }

    // Check if already liked
    const { data: existingLike, error: checkError } = await supabase
      .from("community_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("activity_id", activityId)
      .maybeSingle();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking like status:", checkError);
      return { success: false, error: checkError.message };
    }

    if (existingLike) {
      return { success: false, error: "You have already liked this image" };
    }

    // Add like (RLS will check auth.uid() = user_id)
    const { error: likeError } = await supabase.from("community_likes").insert({
      user_id: user.id,
      activity_id: activityId,
    });

    if (likeError) {
      console.error("Error liking image:", likeError);
      if (likeError.code === "23505") {
        return { success: false, error: "You have already liked this image" };
      }
      return { success: false, error: likeError.message };
    }

    // Increment like count
    const { data: currentData } = await supabase
      .from("user_activities")
      .select("like_count")
      .eq("id", activityId)
      .maybeSingle();

    const newCount = ((currentData?.like_count as number) || 0) + 1;

    await supabase
      .from("user_activities")
      .update({ like_count: newCount })
      .eq("id", activityId);

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Unexpected error in likeImageClient:", error);
    return {
      success: false,
      error: error?.message || "Failed to like image",
    };
  }
}

// Client-side unlike function (works with RLS)
export async function unlikeImageClient(activityId: string) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please sign in" };
    }

    // Remove like (RLS will check auth.uid() = user_id)
    const { error: likeError } = await supabase
      .from("community_likes")
      .delete()
      .eq("user_id", user.id)
      .eq("activity_id", activityId);

    if (likeError) {
      console.error("Error unliking image:", likeError);
      return { success: false, error: likeError.message };
    }

    // Decrement like count
    const { data: currentData } = await supabase
      .from("user_activities")
      .select("like_count")
      .eq("id", activityId)
      .maybeSingle();

    const newCount = Math.max(
      ((currentData?.like_count as number) || 0) - 1,
      0
    );

    await supabase
      .from("user_activities")
      .update({ like_count: newCount })
      .eq("id", activityId);

    return { success: true, error: null };
  } catch (error: any) {
    console.error("Unexpected error in unlikeImageClient:", error);
    return {
      success: false,
      error: error?.message || "Failed to unlike image",
    };
  }
}

// Client-side check if liked
export async function checkIfLikedClient(activityId: string): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase
      .from("community_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("activity_id", activityId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking like status:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Error in checkIfLikedClient:", error);
    return false;
  }
}
