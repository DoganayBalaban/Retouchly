"use client";
import * as motion from "motion/react-client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader, Settings } from "lucide-react";
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
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [showState, setShowState] = useState("generated"); // "generated" or "favorites"
  const [data, setData] = useState<any>(null);
  const [favorites, setFavorites] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const isFavorite = (imageId: string) => {
    return favorites?.some((fav: any) => fav.generated_images?.id === imageId);
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
          (item: any) => item.id === favItem.image_id
        );
        return imageData;
      })
      .filter(Boolean); // null/undefined olanları filtrele
  };

  const favoriteImages = getFavoriteImages();

  return (
    <div className="bg-[#121212]">
      <div className="text-white flex gap-4 items-center justify-items-center m-6">
        <div>
          <h2
            className={`${
              showState === "generated"
                ? "text-3xl"
                : "text-2xl font-thin cursor-pointer"
            } transition-all duration-200`}
            onClick={() => setShowState("generated")}
          >
            Üretilmiş Görsellerin
          </h2>
        </div>
        <div>
          <h3
            className={`${
              showState === "favorites"
                ? "text-3xl"
                : "text-2xl font-thin cursor-pointer"
            } transition-all duration-200`}
            onClick={() => setShowState("favorites")}
          >
            Favorilerin
          </h3>
        </div>
      </div>

      {showState === "favorites" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-2xl p-6 m-6 border border-white">
          {favoriteImages.length === 0 && (
            <div className="col-span-3 flex justify-center items-center">
              <p className="text-xl font-extralight text-white">
                Henüz favori görsel yok.
              </p>
            </div>
          )}
          {favoriteImages.map((item: any) => (
            <motion.div
              key={item.id}
              className="relative"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.1,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
              }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white p-3 absolute z-10">
                  <Settings />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full h-full">
                  <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                    Sil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (isFavorite(item.id)) {
                        handleRemoveFromFavorites(item.id);
                      } else {
                        handleAddToFavorites(item.id);
                      }
                    }}
                  >
                    {isFavorite(item.id)
                      ? "Favorilerden Kaldır"
                      : "Favorilere Ekle"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDownload(item.image_url)}
                  >
                    İndir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Image
                src={item.image_url}
                alt="Generated"
                width={500}
                height={500}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-2xl p-6 m-6 border border-white">
          {(!data || data.length === 0) && (
            <div className="col-span-3 flex justify-center items-center">
              <p className="text-xl font-extralight text-white">
                Henüz üretilmiş görsel yok.
              </p>
            </div>
          )}
          {data?.length > 0 &&
            data.map((item: any) => (
              <motion.div
                key={item.id}
                className="relative"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.1,
                  scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
                }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-white p-3 absolute z-10">
                    <Settings />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full h-full">
                    <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                      Sil
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        if (isFavorite(item.id)) {
                          handleRemoveFromFavorites(item.id);
                        } else {
                          handleAddToFavorites(item.id);
                        }
                      }}
                    >
                      {isFavorite(item.id)
                        ? "Favorilerden Kaldır"
                        : "Favorilere Ekle"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownload(item.image_url)}
                    >
                      İndir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Image
                  src={item.image_url}
                  alt="Generated"
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}
