"use client";
import React from "react";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import useGeneratedStore from "@/store/useGeneratedStore";
import { Loader, Download, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const GeneratedImages = () => {
  const { images, loading } = useGeneratedStore();

  const downloadImage = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `generated-image-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl">
          <CardContent className="flex aspect-square items-center justify-center p-8">
            <div className="text-center">
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader className="animate-spin text-blue-400 w-12 h-12" />
                  <div className="text-white text-lg font-medium">
                    Görsel üretiliyor...
                  </div>
                  <div className="text-gray-400 text-sm">
                    Bu işlem birkaç saniye sürebilir
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                    <span className="text-3xl">🎨</span>
                  </div>
                  <div className="text-white text-xl font-semibold mb-2">
                    Görselleriniz burada görünecek
                  </div>
                  <div className="text-gray-400 text-sm max-w-sm text-center">
                    Bir prompt girin ve "Görseli Üret" butonuna tıklayarak AI
                    ile görsel oluşturmaya başlayın
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
            ✨ Üretilen Görseller
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium">
              {images.length}
            </span>
          </h3>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
                    <Image
                      src={image.url}
                      alt={`Generated image ${index + 1}`}
                      width={1024}
                      height={1024}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
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
                            onClick={() => downloadImage(image.url, index)}
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

                  {/* Image info */}
                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600">
                      Görsel {index + 1} / {images.length}
                    </p>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-2 bg-white/90 hover:bg-white border-gray-200" />
              <CarouselNext className="right-2 bg-white/90 hover:bg-white border-gray-200" />
            </>
          )}
        </Carousel>

        {/* Image grid view for multiple images */}
        {images.length > 1 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Tüm Görseller
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <motion.div
                  key={`grid-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                >
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GeneratedImages;
