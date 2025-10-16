"use client";
import * as motion from "motion/react-client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Loader,
  Settings,
  Download,
  Heart,
  Trash2,
  Grid3X3,
  List,
  Search,
  Filter,
  Calendar,
  Image as ImageIcon,
  Star,
  MoreVertical,
  Sparkles,
  Scissors,
  Smile,
} from "lucide-react";
import {
  getUserGeneratedImages,
  deleteUserGeneratedImage,
  addFavorite,
  removeFavorite,
  getUserFavorites,
} from "../actions/userImages/getUserGeneratedImages";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

// Activity tiplerini gösterecek yardımcı fonksiyonlar
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
      return "bg-blue-100 text-blue-800";
    case "face_restoration":
      return "bg-green-100 text-green-800";
    case "background_removal":
      return "bg-purple-100 text-purple-800";
    case "image_overlay":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function HistoryPage() {
  const [showState, setShowState] = useState("generated"); // "generated" or "favorites"
  const [data, setData] = useState<any>(null);
  const [favorites, setFavorites] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "prompt">(
    "newest"
  );

  const isFavorite = (imageId: string) => {
    return favorites?.some((fav: any) => fav.user_activities?.id === imageId);
  };

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      setLoading(true);

      try {
        // Paralel olarak hem görselleri hem favorileri çek
        const [imagesData, favoritesData] = await Promise.all([
          getUserGeneratedImages(user.id),
          getUserFavorites(user.id),
        ]);

        setData(imagesData);
        setFavorites(favoritesData);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
        toast.error("Veriler yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-12 h-12 text-white" />
      </div>
    );
  }

  const handleDelete = async (imageId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const isDeleted = await deleteUserGeneratedImage(imageId);
      if (isDeleted) {
        toast.success("Görsel silindi");
        setData((prevData: any) =>
          prevData.filter((item: any) => item.id !== imageId)
        );
        // Favorilerden de kaldır
        setFavorites((prev: any) =>
          prev.filter((fav: any) => fav.generated_images?.id !== imageId)
        );
      } else {
        toast.error("Görsel silinirken hata oluştu");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      toast.error("Görsel silinirken hata oluştu");
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("Dosya indirilemiyor");

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;

      // Dosya adını url'den tahmin et
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1].split("?")[0];
      link.download = filename || "image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
      toast.success("Görsel indiriliyor...");
    } catch (error) {
      console.error("İndirme hatası:", error);
      toast.error("Görsel indirilirken hata oluştu");
    }
  };

  const handleAddToFavorites = async (imageId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await addFavorite(user.id, imageId);
      // Yeni eklenen favorinin tamamını almak için API'yi tekrar çağır
      const updatedFavorites = await getUserFavorites(user.id);
      setFavorites(updatedFavorites);
      toast.success("Favorilere eklendi");
    } catch (error) {
      console.error("Favorilere ekleme hatası:", error);
      toast.error("Favorilere eklenirken hata oluştu");
    }
  };

  const handleRemoveFromFavorites = async (imageId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await removeFavorite(user.id, imageId);
      setFavorites((prev: any) =>
        prev.filter((fav: any) => fav.generated_images?.id !== imageId)
      );
      toast.success("Favorilerden kaldırıldı");
    } catch (error) {
      console.error("Favorilerden kaldırma hatası:", error);
      toast.error("Favorilerden kaldırılırken hata oluştu");
    }
  };

  // Favoriler için görselleri filtrele
  const getFavoriteImages = () => {
    if (!favorites || !data) return [];
    return favorites
      .map((favItem: any) => {
        const imageData = data.find(
          (item: any) => item.id === favItem.activity_id
        );
        return imageData;
      })
      .filter(Boolean); // null/undefined olanları filtrele
  };

  const favoriteImages = getFavoriteImages();

  // Filter and sort functions
  const filterAndSortImages = (images: any[]) => {
    if (!images) return [];

    let filtered = images.filter(
      (item: any) =>
        item.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.image_url?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "prompt":
        filtered.sort((a: any, b: any) =>
          (a.prompt || "").localeCompare(b.prompt || "")
        );
        break;
    }

    return filtered;
  };

  const filteredData = filterAndSortImages(data || []);
  const filteredFavorites = filterAndSortImages(favoriteImages);

  const renderImageCard = (item: any, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <Card className="py-0! overflow-hidden bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={item.image_url || "/placeholder-image.svg"}
            alt={item.prompt || "Generated image"}
            width={500}
            height={500}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-image.svg";
            }}
            unoptimized={item.image_url?.includes("replicate.delivery")}
          />

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
            <div className="w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2 justify-center">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDownload(item.image_url)}
                  className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (isFavorite(item.id)) {
                      handleRemoveFromFavorites(item.id);
                    } else {
                      handleAddToFavorites(item.id);
                    }
                  }}
                  className={`backdrop-blur-sm ${
                    isFavorite(item.id)
                      ? "bg-red-500/90 hover:bg-red-600 text-white"
                      : "bg-white/90 hover:bg-white text-gray-800"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 mr-1 ${
                      isFavorite(item.id) ? "fill-current" : ""
                    }`}
                  />
                  {isFavorite(item.id) ? "Unfavorite" : "Favorite"}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:bg-gray-700 focus:bg-gray-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Favorite indicator */}
          {isFavorite(item.id) && (
            <div className="absolute top-2 right-2">
              <div className="bg-red-500 rounded-full p-1">
                <Heart className="w-4 h-4 text-white fill-current" />
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            {item.prompt && (
              <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(item.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <Badge
                variant="secondary"
                className={`text-xs border-0 ${getActivityColor(
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
        </CardContent>
      </Card>
    </motion.div>
  );

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Your Creative History
          </h1>
          <p className="text-gray-300 text-lg">
            Explore your AI-generated masterpieces and favorites
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-700">
            <div className="flex gap-2">
              <Button
                variant={showState === "generated" ? "default" : "ghost"}
                onClick={() => setShowState("generated")}
                className={`rounded-xl px-6 py-3 transition-all duration-300 ${
                  showState === "generated"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Generated Images
                {data && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-gray-700 text-gray-200"
                  >
                    {data.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant={showState === "favorites" ? "default" : "ghost"}
                onClick={() => setShowState("favorites")}
                className={`rounded-xl px-6 py-3 transition-all duration-300 ${
                  showState === "favorites"
                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Star className="w-4 h-4 mr-2" />
                Favorites
                {favorites && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-gray-700 text-gray-200"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between"
        >
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by prompt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-gray-800/80 backdrop-blur-sm border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:bg-gray-800"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800/80 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-700"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Sort:{" "}
                  {sortBy === "newest"
                    ? "Newest"
                    : sortBy === "oldest"
                    ? "Oldest"
                    : "Prompt"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                <DropdownMenuItem
                  onClick={() => setSortBy("newest")}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("oldest")}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("prompt")}
                  className="hover:bg-gray-700 focus:bg-gray-700"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  By Prompt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="bg-gray-800/80 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-700"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="bg-gray-800/80 backdrop-blur-sm border-gray-600 text-white hover:bg-gray-700"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="animate-spin w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-300">Loading your creative history...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {showState === "favorites" ? (
              <div>
                {filteredFavorites.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-900/30 to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-800/30">
                      <Star className="w-12 h-12 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Start adding images to your favorites to see them here
                    </p>
                    <Button
                      onClick={() => setShowState("generated")}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    >
                      Browse Generated Images
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1 md:grid-cols-2"
                    }`}
                  >
                    {filteredFavorites.map((item: any, index: number) =>
                      renderImageCard(item, index)
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {filteredData.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-800/30">
                      <ImageIcon className="w-12 h-12 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {searchTerm
                        ? "No images found"
                        : "No generated images yet"}
                    </h3>
                    <p className="text-gray-300 mb-6">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Start creating amazing AI-generated images to see them here"}
                    </p>
                    {!searchTerm && (
                      <Button
                        onClick={() =>
                          (window.location.href = "/image-generation")
                        }
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Create Your First Image
                      </Button>
                    )}
                  </div>
                ) : (
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1 md:grid-cols-2"
                    }`}
                  >
                    {filteredData.map((item: any, index: number) =>
                      renderImageCard(item, index)
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
