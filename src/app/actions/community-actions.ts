"use server";

import { supabase } from "@/lib/supabase";

// Get public community images with filters
export async function getCommunityImages(options: {
  sortBy?: "newest" | "most_liked" | "most_downloaded";
  activityType?: string;
  limit?: number;
  offset?: number;
}) {
  const { sortBy = "newest", activityType, limit = 50, offset = 0 } = options;

  let query = supabase
    .from("user_activities")
    .select(
      `
      *
    `,
      { count: "exact" }
    )
    .eq("is_public", true)
    .range(offset, offset + limit - 1);

  // Filter by activity type if provided
  if (activityType) {
    query = query.eq("activity_type", activityType);
  }

  // Sort by
  switch (sortBy) {
    case "most_liked":
      query = query.order("like_count", { ascending: false });
      break;
    case "most_downloaded":
      query = query.order("download_count", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching community images:", error);
    return { data: [], count: 0, error: error.message };
  }

  // Fetch profiles separately and merge
  if (data && data.length > 0) {
    const userIds = [...new Set(data.map((item: any) => item.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);

    // Merge profiles with activities
    const dataWithProfiles = data.map((activity: any) => ({
      ...activity,
      profiles: profiles?.find((p: any) => p.id === activity.user_id) || null,
    }));

    return { data: dataWithProfiles, count: count || 0, error: null };
  }

  return { data: data || [], count: count || 0, error: null };
}

// Toggle image public/private status
export async function toggleImagePublic(
  activityId: string,
  userId: string,
  isPublic: boolean
) {
  try {
    console.log("toggleImagePublic called:", { activityId, userId, isPublic });

    // First check if we can see the image with current user context
    const { data: checkData, error: checkError } = await supabase
      .from("user_activities")
      .select("id, user_id, is_public")
      .eq("id", activityId)
      .maybeSingle();

    console.log("Initial check:", { checkData, checkError });

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking image:", checkError);
      return {
        success: false,
        error: `Failed to check image: ${checkError.message}`,
      };
    }

    if (!checkData) {
      console.error("Image not found in database:", activityId);
      return {
        success: false,
        error: "Image not found",
      };
    }

    // Verify ownership
    if (checkData.user_id !== userId) {
      console.error("User doesn't own image:", {
        imageUserId: checkData.user_id,
        currentUserId: userId,
      });
      return {
        success: false,
        error: "Unauthorized: You don't own this image",
      };
    }

    // Perform the update
    const { data: updatedData, error: updateError } = await supabase
      .from("user_activities")
      .update({ is_public: isPublic })
      .eq("id", activityId)
      .eq("user_id", userId)
      .select("id, user_id, is_public")
      .maybeSingle();

    console.log("Update result:", { updatedData, updateError });

    if (updateError) {
      console.error("Error updating image:", updateError);
      return {
        success: false,
        error: `Update failed: ${updateError.message}`,
      };
    }

    if (!updatedData) {
      console.error("Update succeeded but no data returned");
      // Return success anyway since we verified ownership and update didn't error
      return {
        success: true,
        data: { ...checkData, is_public: isPublic },
        error: null,
      };
    }

    // Update successful
    return {
      success: true,
      data: updatedData,
      error: null,
    };
  } catch (error: any) {
    console.error("Unexpected error in toggleImagePublic:", error);
    return {
      success: false,
      error: `Unexpected error: ${error?.message || "Unknown error"}`,
    };
  }
}

// Like an image
export async function likeImage(activityId: string, userId: string) {
  // Check if already liked
  const { data: existingLike, error: checkError } = await supabase
    .from("community_likes")
    .select("id")
    .eq("user_id", userId)
    .eq("activity_id", activityId)
    .maybeSingle();

  // If error and it's not "not found" error, return
  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking like status:", checkError);
    return { success: false, error: checkError.message };
  }

  if (existingLike) {
    return { success: false, error: "You have already liked this image" };
  }

  // Add like
  const { error: likeError } = await supabase.from("community_likes").insert({
    user_id: userId,
    activity_id: activityId,
  });

  if (likeError) {
    console.error("Error liking image:", likeError);
    // Check if it's a unique constraint violation (23505)
    if (likeError.code === "23505") {
      return { success: false, error: "You have already liked this image" };
    }
    return { success: false, error: likeError.message };
  }

  // Increment like count
  const { error: updateError } = await supabase.rpc("increment_like_count", {
    activity_id_param: activityId,
  });

  // If RPC doesn't exist, use direct update
  if (updateError) {
    const { data: currentData, error: fetchError } = await supabase
      .from("user_activities")
      .select("like_count")
      .eq("id", activityId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching like count for update:", fetchError);
    } else {
      const newCount = ((currentData?.like_count as number) || 0) + 1;

      await supabase
        .from("user_activities")
        .update({ like_count: newCount })
        .eq("id", activityId);
    }
  }

  return { success: true, error: null };
}

// Unlike an image
export async function unlikeImage(activityId: string, userId: string) {
  // Remove like
  const { error: likeError } = await supabase
    .from("community_likes")
    .delete()
    .eq("user_id", userId)
    .eq("activity_id", activityId);

  if (likeError) {
    console.error("Error unliking image:", likeError);
    return { success: false, error: likeError.message };
  }

  // Decrement like count
  const { data: currentData, error: fetchError } = await supabase
    .from("user_activities")
    .select("like_count")
    .eq("id", activityId)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching like count:", fetchError);
    return { success: false, error: fetchError.message };
  }

  const newCount = Math.max(((currentData?.like_count as number) || 0) - 1, 0);

  await supabase
    .from("user_activities")
    .update({ like_count: newCount })
    .eq("id", activityId);

  return { success: true, error: null };
}

// Check if user has liked an image
export async function checkIfLiked(
  activityId: string,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("community_likes")
    .select("id")
    .eq("user_id", userId)
    .eq("activity_id", activityId)
    .maybeSingle();

  // PGRST116 is "not found" error, which is fine
  if (error && error.code !== "PGRST116") {
    console.error("Error checking like status:", error);
    return false;
  }

  return !!data;
}

// Increment download count
export async function incrementDownloadCount(activityId: string) {
  const { data: currentData, error: fetchError } = await supabase
    .from("user_activities")
    .select("download_count")
    .eq("id", activityId)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching download count:", fetchError);
    return { success: false, error: fetchError.message };
  }

  const newCount = ((currentData?.download_count as number) || 0) + 1;

  const { error } = await supabase
    .from("user_activities")
    .update({ download_count: newCount })
    .eq("id", activityId);

  if (error) {
    console.error("Error incrementing download count:", error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

// Get user's liked images
export async function getUserLikedImages(userId: string) {
  const { data, error } = await supabase
    .from("community_likes")
    .select(
      `
      activity_id,
      user_activities (
        *,
        profiles:user_id (
          id,
          full_name,
          email
        )
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching liked images:", error);
    return { data: [], error: error.message };
  }

  return {
    data:
      data
        ?.map((item: any) => item.user_activities)
        .filter((item: any) => item && item.is_public) || [],
    error: null,
  };
}
