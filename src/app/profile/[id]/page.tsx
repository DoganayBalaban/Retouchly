"use client";

import {
  getCommunityImages,
  getPublicProfile,
  incrementDownloadCount,
} from "@/app/actions/community-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  checkIfLikedClient,
  likeImageClient,
  unlikeImageClient,
} from "@/lib/community-client";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Clock,
  Download,
  Eye,
  Heart,
  ImageIcon,
  Loader,
  Scissors,
  Share2,
  Smile,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Activity icons and labels (matching explore page)
const getActivityIcon = (type: string) => {
  switch (type) {
    case "image_generation":
      return <ImageIcon className="w-4 h-4" />;
    case "face_restoration":
      return <Sparkles className="w-4 h-4" />;
    case "background_removal":
      return <Scissors className="w-4 h-4" />;
    case "image_overlay":
      return <Smile className="w-4 h-4" />;
    default:
      return <ImageIcon className="w-4 h-4" />;
  }
};

const getActivityLabel = (type: string) => {
  switch (type) {
    case "image_generation":
      return "AI Generated";
    case "face_restoration":
      return "Face Restored";
    case "background_removal":
      return "Background Removed";
    case "image_overlay":
      return "Overlay Added";
    default:
      return "AI Processed";
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "image_generation":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "face_restoration":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "background_removal":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "image_overlay":
      return "bg-orange-500/20 text-orange-300 border-orange-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
};

const isValidImageUrl = (url: any): boolean => {
  if (!url || typeof url !== "string" || url.trim() === "") return false;
  if (url === "{}" || url === "null" || url === "undefined") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return url.startsWith("/") || url.startsWith("./");
  }
};

const getImageUrl = (item: any): string => {
  const url = item.image_url;
  return isValidImageUrl(url) ? url : "/placeholder-image.svg";
};

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: profileId } = use(params);

  const [profile, setProfile] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Fetch profile
      const { data: profileData, error: profileErr } =
        await getPublicProfile(profileId);
      if (profileErr) {
        toast.error("Profile not found");
        setLoading(false);
        return;
      }
      setProfile(profileData);

      await loadImages(0, true);
    };
    init();
  }, [profileId]);

  const loadImages = useCallback(
    async (currentPage: number = 0, reset: boolean = false) => {
      try {
        const result = await getCommunityImages({
          userId: profileId,
          sortBy: "newest",
          limit: 24,
          offset: currentPage * 24,
        });

        if (result.error) {
          toast.error("Failed to load images");
          return;
        }

        if (reset || currentPage === 0) {
          setImages(result.data);
        } else {
          setImages((prev) => [...prev, ...result.data]);
        }

        setHasMore(result.data.length === 24);
      } catch (error) {
        console.error("Error loading images:", error);
        toast.error("Failed to load images");
      } finally {
        setLoading(false);
      }
    },
    [profileId],
  );

  // Load more trigger
  useEffect(() => {
    if (page > 0) {
      loadImages(page, false);
    }
  }, [page, loadImages]);

  // Load liked status
  useEffect(() => {
    const loadLikedStatus = async () => {
      if (!user || images.length === 0) return;

      const likedSet = new Set<string>();
      for (const image of images) {
        try {
          const isLiked = await checkIfLikedClient(image.id);
          if (isLiked) {
            likedSet.add(image.id);
          }
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      }
      setLikedImages(likedSet);
    };

    loadLikedStatus();
  }, [images, user]);

  const handleLike = async (imageId: string) => {
    if (!user) {
      toast.error("Please sign in to like images");
      return;
    }

    const isLiked = likedImages.has(imageId);

    try {
      if (isLiked) {
        const result = await unlikeImageClient(imageId);
        if (!result.success)
          throw new Error(result.error || "Failed to unlike image");

        setLikedImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
        updateImageState(imageId, { like_count: -1 }, true);
        toast.success("Removed from likes");
      } else {
        const result = await likeImageClient(imageId);
        if (!result.success)
          throw new Error(result.error || "Failed to like image");

        setLikedImages((prev) => new Set([...prev, imageId]));
        updateImageState(imageId, { like_count: 1 }, true);
        toast.success("Added to likes");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateImageState = (
    id: string,
    updates: any,
    relative: boolean = false,
  ) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          const updated = { ...img };
          for (const key in updates) {
            updated[key] = relative
              ? Math.max(0, (img[key] || 0) + updates[key])
              : updates[key];
          }
          return updated;
        }
        return img;
      }),
    );
    if (selectedImage?.id === id) {
      setSelectedImage((prev: any) => {
        const updated = { ...prev };
        for (const key in updates) {
          updated[key] = relative
            ? Math.max(0, (prev[key] || 0) + updates[key])
            : updates[key];
        }
        return updated;
      });
    }
  };

  const handleDownload = async (url: string, imageId: string) => {
    try {
      if (!isValidImageUrl(url)) {
        toast.error("Invalid image URL");
        return;
      }
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("File cannot be downloaded");

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop()?.split("?")[0] || "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      await incrementDownloadCount(imageId);
      updateImageState(imageId, { download_count: 1 }, true);
      toast.success("Downloading image...");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleShare = async (image: any) => {
    const url = window.location.origin + `/explore?image=${image.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <Loader className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );
  }

  if (!profile && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-center">
        <Users className="w-16 h-16 text-gray-500 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">
          Profile Not Found
        </h1>
        <p className="text-gray-400 mb-6">
          This creator might not exist or has no public images.
        </p>
        <Link href="/explore">
          <Button
            variant="outline"
            className="text-white border-gray-600 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explore
          </Button>
        </Link>
      </div>
    );
  }

  const displayName =
    profile?.full_name || profile?.email?.split("@")[0] || "Anonymous";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pb-12">
      {/* ─── Profile Header ────────────────────────────── */}
      <div className="w-full bg-gradient-to-b from-blue-900/20 to-transparent border-b border-gray-800 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <Link
            href="/explore"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Explore
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-6"
          >
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-gray-800 shadow-xl bg-gray-900">
              <AvatarImage src={profile?.avatar_url} alt={displayName} />
              <AvatarFallback className="text-3xl sm:text-4xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {displayName}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mb-6 flex items-center justify-center md:justify-start gap-2">
                Creator Profile
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-md">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Public Images</p>
                    <p className="text-lg font-bold text-white">
                      {profile?.stats?.totalPublicImages || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-2 flex items-center gap-3">
                  <div className="p-2 bg-pink-500/20 text-pink-400 rounded-md">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Likes</p>
                    <p className="text-lg font-bold text-white">
                      {profile?.stats?.totalLikesReceived || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Creator's Gallery ───────────────────────────── */}
      <div className="container mx-auto px-4 mt-12">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" /> Collection
        </h2>

        {images.length === 0 && !loading ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700/50">
            <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No public images yet
            </h3>
            <p className="text-gray-400">
              This creator hasn&apos;t shared any images to the community.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((item, index) => {
              const imageUrl = getImageUrl(item);
              const isLiked = likedImages.has(item.id);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group"
                >
                  <Card className="overflow-hidden bg-gray-800/80 backdrop-blur-sm border border-gray-700/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div
                      className="relative aspect-square overflow-hidden cursor-pointer"
                      onClick={() => {
                        setSelectedImage(item);
                        setImageDialogOpen(true);
                      }}
                    >
                      <Image
                        src={imageUrl}
                        alt={item.prompt || "Creation"}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-image.svg";
                        }}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                        <div className="flex justify-between items-start">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] w-fit border ${getActivityColor(item.activity_type || "image_generation")}`}
                          >
                            <span className="mr-1">
                              {getActivityIcon(
                                item.activity_type || "image_generation",
                              )}
                            </span>
                            {getActivityLabel(
                              item.activity_type || "image_generation",
                            )}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-center gap-2 mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(item.id);
                            }}
                            className={`h-8 w-8 rounded-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 ${isLiked ? "text-pink-500" : "text-white"}`}
                          >
                            <Heart
                              className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(item.image_url, item.id);
                            }}
                            className="h-8 w-8 rounded-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(item);
                            }}
                            className="h-8 w-8 rounded-full bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-3">
                      {item.prompt && (
                        <p className="text-xs text-gray-300 line-clamp-1 mb-2">
                          {item.prompt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {item.like_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {item.download_count || 0}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.created_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" },
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More Option */}
        {!loading && hasMore && images.length > 0 && (
          <div className="flex justify-center mt-10">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* ─── Image Dialog ──────────────────────────────────── */}
      {imageDialogOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setImageDialogOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImageDialogOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/90 text-gray-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 h-full">
              {/* Image Side */}
              <div className="lg:col-span-3 bg-black flex items-center justify-center min-h-[40vh] md:min-h-[70vh]">
                <Image
                  src={getImageUrl(selectedImage)}
                  alt={selectedImage.prompt || "Creation"}
                  width={800}
                  height={800}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>

              {/* Info Side */}
              <div className="lg:col-span-2 p-6 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[70vh]">
                <Badge
                  variant="secondary"
                  className={`w-fit mb-4 border ${getActivityColor(selectedImage.activity_type || "image_generation")}`}
                >
                  <span className="mr-1">
                    {getActivityIcon(
                      selectedImage.activity_type || "image_generation",
                    )}
                  </span>
                  {getActivityLabel(
                    selectedImage.activity_type || "image_generation",
                  )}
                </Badge>

                <h3 className="text-xl font-bold text-white mb-2">
                  {selectedImage.prompt || "Untitled Creation"}
                </h3>

                <p className="text-sm text-gray-400 mb-6 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Generated{" "}
                  {new Date(selectedImage.created_at).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" },
                  )}
                </p>

                <div className="mt-auto pt-6 flex flex-col gap-3">
                  <Button
                    variant={
                      likedImages.has(selectedImage.id) ? "default" : "outline"
                    }
                    className={`w-full justify-start ${likedImages.has(selectedImage.id) ? "bg-pink-600 hover:bg-pink-700 text-white border-0" : "border-gray-600 text-white hover:bg-gray-800"}`}
                    onClick={() => handleLike(selectedImage.id)}
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${likedImages.has(selectedImage.id) ? "fill-current" : ""}`}
                    />
                    {likedImages.has(selectedImage.id) ? "Liked" : "Like"} (
                    {selectedImage.like_count || 0})
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-600 text-white hover:bg-gray-800"
                    onClick={() =>
                      handleDownload(selectedImage.image_url, selectedImage.id)
                    }
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Original ({selectedImage.download_count || 0})
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-600 text-white hover:bg-gray-800"
                    onClick={() => handleShare(selectedImage)}
                  >
                    <Share2 className="w-4 h-4 mr-2" /> Share Link
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
