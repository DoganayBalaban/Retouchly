"use client";

import * as motion from "motion/react-client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import {
  Heart,
  Download,
  Share2,
  Filter,
  TrendingUp,
  Clock,
  Sparkles,
  Scissors,
  Smile,
  ImageIcon,
  Loader,
  Search,
  Users,
  Eye,
  X,
  Copy,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getCommunityImages,
  incrementDownloadCount,
} from "../actions/community-actions";
import {
  likeImageClient,
  unlikeImageClient,
  checkIfLikedClient,
} from "@/lib/community-client";
import toast from "react-hot-toast";

// Activity icons and labels
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

// URL validation helper
const isValidImageUrl = (url: any): boolean => {
  if (!url) return false;
  if (typeof url !== "string") return false;
  if (url.trim() === "") return false;
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
  if (isValidImageUrl(url)) {
    return url;
  }
  return "/placeholder-image.svg";
};

export default function ExplorePage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<
    "newest" | "most_liked" | "most_downloaded"
  >("newest");
  const [activityType, setActivityType] = useState<string | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [imageToShare, setImageToShare] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  // Load liked status when images or user changes
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

  const loadImages = useCallback(
    async (currentPage: number = 0, reset: boolean = false) => {
      setLoading(true);
      try {
        const result = await getCommunityImages({
          sortBy,
          activityType,
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
    [sortBy, activityType]
  );

  useEffect(() => {
    setPage(0);
    loadImages(0, true);
  }, [sortBy, activityType, loadImages]);

  useEffect(() => {
    if (page > 0) {
      loadImages(page, false);
    }
  }, [page, loadImages]);

  const handleLike = async (imageId: string) => {
    if (!user) {
      toast.error("Please sign in to like images");
      return;
    }

    const isLiked = likedImages.has(imageId);

    try {
      if (isLiked) {
        const result = await unlikeImageClient(imageId);
        if (!result.success) {
          toast.error(result.error || "Failed to unlike image");
          return;
        }
        setLikedImages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? { ...img, like_count: Math.max(0, (img.like_count || 0) - 1) }
              : img
          )
        );
        // Update selected image if it's the same
        if (selectedImage?.id === imageId) {
          setSelectedImage((prev: any) => ({
            ...prev,
            like_count: Math.max(0, (prev.like_count || 0) - 1),
          }));
        }
        toast.success("Removed from likes");
      } else {
        const result = await likeImageClient(imageId);
        if (!result.success) {
          toast.error(result.error || "Failed to like image");
          return;
        }
        setLikedImages((prev) => new Set([...prev, imageId]));
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? { ...img, like_count: (img.like_count || 0) + 1 }
              : img
          )
        );
        // Update selected image if it's the same
        if (selectedImage?.id === imageId) {
          setSelectedImage((prev: any) => ({
            ...prev,
            like_count: (prev.like_count || 0) + 1,
          }));
        }
        toast.success("Added to likes");
      }
    } catch (error: any) {
      console.error("Error toggling like:", error);
      toast.error(error.message || "Failed to like image");
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
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1].split("?")[0];
      link.download = filename || "image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);

      // Increment download count
      await incrementDownloadCount(imageId);
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, download_count: (img.download_count || 0) + 1 }
            : img
        )
      );
      // Update selected image if it's the same
      if (selectedImage?.id === imageId) {
        setSelectedImage((prev: any) => ({
          ...prev,
          download_count: (prev.download_count || 0) + 1,
        }));
      }

      toast.success("Downloading image...");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  const handleShare = (image: any) => {
    setImageToShare(image);
    setShareModalOpen(true);
  };

  const copyLink = async () => {
    if (!imageToShare) return;
    const url = window.location.origin + `/explore?image=${imageToShare.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const shareToSocial = (platform: string) => {
    if (!imageToShare) return;

    const url = window.location.origin + `/explore?image=${imageToShare.id}`;
    const text =
      imageToShare.prompt || "Check out this amazing AI-generated image!";
    const imageUrl = imageToShare.image_url;

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          text + " " + url
        )}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text)}`;
        break;
      case "reddit":
        shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(text)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const filteredImages = images.filter((item: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.prompt?.toLowerCase().includes(searchLower) ||
      item.profiles?.full_name?.toLowerCase().includes(searchLower) ||
      item.profiles?.email?.toLowerCase().includes(searchLower)
    );
  });

  const renderImageCard = (item: any, index: number) => {
    const imageUrl = getImageUrl(item);
    const isLiked = likedImages.has(item.id);
    const profile = item.profiles;

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group"
      >
        <Card className="overflow-hidden bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div
            className="relative aspect-square overflow-hidden cursor-pointer"
            onClick={() => {
              setSelectedImage(item);
              setImageDialogOpen(true);
            }}
          >
            <Image
              src={imageUrl}
              alt={item.prompt || "Community image"}
              width={500}
              height={500}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.svg";
              }}
              unoptimized={
                imageUrl.includes("replicate.delivery") ||
                imageUrl.startsWith("http://") ||
                imageUrl.startsWith("https://")
              }
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
              <div className="w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(item.id);
                    }}
                    className={`backdrop-blur-sm ${
                      isLiked
                        ? "bg-red-500/90 hover:bg-red-600 text-white"
                        : "bg-white/90 hover:bg-white text-gray-800"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 mr-1 ${
                        isLiked ? "fill-current" : ""
                      }`}
                    />
                    {item.like_count || 0}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item.image_url, item.id);
                    }}
                    className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(item);
                    }}
                    className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute top-2 left-2">
              <Badge
                variant="secondary"
                className={`text-xs border ${getActivityColor(
                  item.activity_type || "image_generation"
                )}`}
              >
                <span className="mr-1">
                  {getActivityIcon(item.activity_type || "image_generation")}
                </span>
                {getActivityLabel(item.activity_type || "image_generation")}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="space-y-3">
              {item.prompt && (
                <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
              )}

              {/* User info */}
              {profile && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Users className="w-3 h-3" />
                  <span>
                    {profile.full_name ||
                      profile.email?.split("@")[0] ||
                      "Anonymous"}
                  </span>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
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
                  {new Date(item.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Explore Community
          </h1>
          <p className="text-gray-300 text-lg">
            Discover amazing AI-generated art from our community
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between"
        >
          <div className="flex gap-4 items-center flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by prompt or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:bg-gray-800"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800/80 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-700"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {activityType || "All Types"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                <DropdownMenuItem
                  onClick={() => setActivityType(undefined)}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActivityType("image_generation")}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  AI Generated
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActivityType("face_restoration")}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  Face Restoration
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActivityType("background_removal")}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  Background Removal
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActivityType("image_overlay")}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  Image Overlay
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800/80 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-700"
                >
                  {sortBy === "newest" && <Clock className="w-4 h-4 mr-2" />}
                  {sortBy === "most_liked" && (
                    <TrendingUp className="w-4 h-4 mr-2" />
                  )}
                  {sortBy === "most_downloaded" && (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Sort:{" "}
                  {sortBy === "newest"
                    ? "Newest"
                    : sortBy === "most_liked"
                    ? "Most Liked"
                    : "Most Downloaded"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                <DropdownMenuItem
                  onClick={() => setSortBy("newest")}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("most_liked")}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Most Liked
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("most_downloaded")}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Most Downloaded
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && images.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="animate-spin w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-300">Loading community images...</p>
            </div>
          </div>
        )}

        {/* Images Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredImages.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-800/30">
                  <Eye className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {searchTerm ? "No images found" : "No public images yet"}
                </h3>
                <p className="text-gray-300">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Be the first to share your creations with the community!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((item: any, index: number) =>
                  renderImageCard(item, index)
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Load More */}
        {!loading && hasMore && filteredImages.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => {
                setPage((prev) => prev + 1);
              }}
              variant="outline"
              className="bg-gray-800/80 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-700"
              disabled={loading}
            >
              Load More
            </Button>
          </div>
        )}

        {loading && images.length > 0 && (
          <div className="flex justify-center mt-8">
            <Loader className="animate-spin w-6 h-6 text-blue-400" />
          </div>
        )}
      </div>

      {/* Custom Image Modal */}
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
            className="relative w-full max-w-7xl h-[95vh] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setImageDialogOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/90 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200 backdrop-blur-sm border border-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-700">
              <div className="flex items-start justify-between gap-4 pr-12">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2 text-white">
                    {selectedImage.prompt || "Community Image"}
                  </h2>
                  <div className="text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Created by</span>
                    <span className="font-medium text-gray-300">
                      {selectedImage.profiles?.full_name ||
                        selectedImage.profiles?.email?.split("@")[0] ||
                        "Anonymous"}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-sm border ${getActivityColor(
                    selectedImage.activity_type || "image_generation"
                  )}`}
                >
                  <span className="mr-1">
                    {getActivityIcon(
                      selectedImage.activity_type || "image_generation"
                    )}
                  </span>
                  {getActivityLabel(
                    selectedImage.activity_type || "image_generation"
                  )}
                </Badge>
              </div>
            </div>

            {/* Image Content */}
            <div className="flex-1 overflow-hidden p-4 md:p-6 flex items-center justify-center">
              <div className="relative w-full h-full max-h-[calc(95vh-200px)] rounded-lg overflow-hidden bg-gray-800/50 flex items-center justify-center">
                <Image
                  src={getImageUrl(selectedImage)}
                  alt={selectedImage.prompt || "Image"}
                  width={1920}
                  height={1920}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium text-gray-300">
                      {selectedImage.like_count || 0}
                    </span>
                    <span className="hidden sm:inline">likes</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    <span className="font-medium text-gray-300">
                      {selectedImage.download_count || 0}
                    </span>
                    <span className="hidden sm:inline">downloads</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium text-gray-300">
                      {new Date(selectedImage.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => handleLike(selectedImage.id)}
                    variant={
                      likedImages.has(selectedImage.id) ? "default" : "outline"
                    }
                    className={`flex-1 sm:flex-none ${
                      likedImages.has(selectedImage.id)
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "border-gray-600 hover:bg-gray-800"
                    }`}
                    size="lg"
                  >
                    <Heart
                      className={`w-5 h-5 mr-2 ${
                        likedImages.has(selectedImage.id) ? "fill-current" : ""
                      }`}
                    />
                    {likedImages.has(selectedImage.id) ? "Unlike" : "Like"}
                  </Button>
                  <Button
                    onClick={() =>
                      handleDownload(selectedImage.image_url, selectedImage.id)
                    }
                    variant="outline"
                    className="flex-1 sm:flex-none border-gray-600 hover:bg-gray-800"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => handleShare(selectedImage)}
                    variant="outline"
                    className="flex-1 sm:flex-none border-gray-600 hover:bg-gray-800"
                    size="lg"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && imageToShare && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShareModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/90 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-2">
                Share Image
              </h3>
              <p className="text-gray-400 text-sm">
                Share this amazing creation with your friends
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Twitter/X */}
                <button
                  onClick={() => shareToSocial("twitter")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">X</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => shareToSocial("facebook")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    Facebook
                  </span>
                </button>

                {/* LinkedIn */}
                <button
                  onClick={() => shareToSocial("linkedin")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    LinkedIn
                  </span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => shareToSocial("whatsapp")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    WhatsApp
                  </span>
                </button>

                {/* Telegram */}
                <button
                  onClick={() => shareToSocial("telegram")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    Telegram
                  </span>
                </button>

                {/* Reddit */}
                <button
                  onClick={() => shareToSocial("reddit")}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FF4500] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    Reddit
                  </span>
                </button>
              </div>

              {/* Copy Link Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Link2 className="w-4 h-4" />
                  <span>Or copy link</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-sm text-gray-300 truncate">
                    {window.location.origin}/explore?image={imageToShare.id}
                  </div>
                  <Button
                    onClick={copyLink}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Copy
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
