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

  const handleShare = async (image: any) => {
    const url = window.location.origin + `/explore?image=${image.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
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
    </div>
  );
}
