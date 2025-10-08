import React from "react";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Download, Share2, Heart, Scissors } from "lucide-react";
import Image from "next/image";
import useGeneratedStore from "@/store/useGeneratedStore";

const RemovedBackgrounds = () => {
  const { bgImage, loading } = useGeneratedStore();

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `background-removed-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (bgImage === null) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl relative z-10">
          <CardContent className="flex aspect-square items-center justify-center p-8">
            <div className="text-center">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader className="animate-spin text-purple-400 w-12 h-12" />
                  <div className="text-white text-lg font-medium">
                    Arka plan kaldırılıyor...
                  </div>
                  <div className="text-gray-400 text-sm">
                    AI algoritması çalışıyor, lütfen bekleyin
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                    <Scissors className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-white text-xl font-semibold mb-2">
                    İşlenmiş görsel burada görünecek
                  </div>
                  <div className="text-gray-400 text-sm max-w-sm text-center">
                    Bir görsel yükleyin ve "Arka Planı Kaldır" butonuna tıklayın
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            ✂️ Arka Plan Kaldırıldı
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-xs font-medium">
              Tamamlandı
            </span>
          </h3>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          {/* Checkered background for transparency */}
          <div
            className="relative rounded-xl overflow-hidden aspect-square bg-gradient-to-br from-gray-100 to-gray-200"
            style={{
              backgroundImage: `
                   linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                   linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                   linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                   linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                 `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          >
            <Image
              src={bgImage}
              alt="Arka planı kaldırılmış görsel"
              width={1024}
              height={1024}
              className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="w-full p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => downloadImage(bgImage)}
                    className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    İndir
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Paylaş
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Success message */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <span className="text-purple-600">✅</span>
              <span className="text-sm font-medium text-purple-800">
                Arka plan başarıyla kaldırıldı!
              </span>
            </div>
            <p className="text-xs text-purple-700 mt-1">
              Görseliniz şeffaf arka plana sahip PNG formatında hazır
            </p>
          </div>
        </motion.div>

        {/* Format info */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
            <div className="text-gray-600 font-semibold text-sm">Öncesi</div>
            <div className="text-gray-800 text-xs">Arka planlı görsel</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
            <div className="text-purple-600 font-semibold text-sm">Sonrası</div>
            <div className="text-purple-800 text-xs">Şeffaf arka plan</div>
          </div>
        </div>

        {/* Transparency indicator */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            🔍 Şeffaf alanlar damalı desen ile gösterilir
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RemovedBackgrounds;
