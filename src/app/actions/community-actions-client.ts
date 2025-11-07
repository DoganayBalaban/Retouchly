"use client";

import { supabase } from "@/lib/supabase";

// Client-side version of toggleImagePublic
export async function toggleImagePublicClient(
  activityId: string,
  userId: string,
  isPublic: boolean
) {
  try {
    // Perform the update directly - RLS will handle authorization
    const { data: updatedData, error: updateError } = await supabase
      .from("user_activities")
      .update({ is_public: isPublic })
      .eq("id", activityId)
      .eq("user_id", userId)
      .select("id, user_id, is_public")
      .maybeSingle();

    if (updateError) {
      return { 
        success: false, 
        error: `Update failed: ${updateError.message}` 
      };
    }

    if (!updatedData) {
      // Check if image exists
      const { data: checkData } = await supabase
        .from("user_activities")
        .select("id, user_id")
        .eq("id", activityId)
        .maybeSingle();

      if (!checkData) {
        return { 
          success: false, 
          error: "Image not found" 
        };
      }

      // Image exists but update returned no data (might be RLS issue)
      // Still try to verify the update worked by checking the image again
      const { data: verifyData } = await supabase
        .from("user_activities")
        .select("is_public")
        .eq("id", activityId)
        .eq("user_id", userId)
        .maybeSingle();

      if (verifyData && verifyData.is_public === isPublic) {
        return { 
          success: true, 
          data: { id: activityId, user_id: userId, is_public: isPublic }, 
          error: null 
        };
      }

      return { 
        success: false, 
        error: "Update failed: Could not verify update" 
      };
    }

    // Update successful
    return { 
      success: true, 
      data: updatedData, 
      error: null 
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: `Unexpected error: ${error?.message || "Unknown error"}` 
    };
  }
}
