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
  const [data, setData] = useState<any>(null);
  const [favorites, setFavorites] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const isFavorite = (imageId: string) => {
    return favorites?.some((fav: any) => fav.image_id === imageId);
  };
  useEffect(() => {
    const fetchImages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      setLoading(true);

      const data = await getUserGeneratedImages(user.id);
      setData(data);
      setLoading(false);
    };
    const getFavorites = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const favorites = await getUserFavorites(user.id);
      setFavorites(favorites);
    };
    getFavorites();
    fetchImages();
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

    const isDeleted = await deleteUserGeneratedImage(imageId);
    if (isDeleted) {
      toast.success("Görsel silindi");
      setData((prevData: any) =>
        prevData.filter((item: any) => item.id !== imageId)
      );
    }
    if (!isDeleted) {
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

      // Dosya adını url’den tahmin et
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1].split("?")[0];
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
      toast.success("Görsel indiriliyor...");
    } catch (error) {
      console.error("İndirme hatası:", error);
    }
  };
  const handleAddToFavorites = async (imageId: string) => {
    console.log("Favorilere ekle");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await addFavorite(user.id, imageId);
      setFavorites((prev: any) => [...prev, { image_id: imageId }]);
      toast.success("Favorilere eklendi");
    } catch (error) {
      console.error("Favorilere ekleme hatası:", error);
      toast.error("Favorilere eklenirken hata oluştu");
    }
  };
  const handleRemoveFromFavorites = async (imageId: string) => {
    console.log("Favorilerden kaldır");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      await removeFavorite(user.id, imageId);
      setFavorites((prev: any) =>
        prev.filter((fav: any) => fav.image_id !== imageId)
      );
      toast.success("Favorilerden kaldırıldı");
    } catch (error) {
      console.error("Favorilerden kaldırma hatası:", error);
      toast.error("Favorilerden kaldırılırken hata oluştu");
    }
  };

  return (
    <div className="bg-[#121212 ]">
      <h2 className="text-3xl font-light text-white p-6 m-6">
        Üretilmiş Görsellerin
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-2xl p-6 m-6 border border-white">
        {data?.length === 0 && (
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
                <DropdownMenuTrigger className="text-white p-3 absolute">
                  <Settings />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
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
              <p className="absolute bottom-2 left-2 bg-white text-black p-2 rounded text-xl font-extralight hidden lg:block">
                {item.prompt}
              </p>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
