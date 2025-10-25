import React from "react";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Download, Share2, Heart, Sparkles } from "lucide-react";
import Image from "next/image";
import useGeneratedStore from "@/store/useGeneratedStore";
import BeforeAfterSlider from "./BeforeAfterSlider";

const RestoredFace = () => {
  const { restoredFace, originalFaceImage, loading } = useGeneratedStore();

  const downloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `restored-face-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (restoredFace === null) {
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
                  <Loader className="animate-spin text-green-400 w-12 h-12" />
                  <div className="text-white text-lg font-medium">
                    Restoring face...
                  </div>
                  <div className="text-gray-400 text-sm">
                    AI algorithm is working, please wait
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-white text-xl font-semibold mb-2">
                    Restored face will appear here
                  </div>
                  <div className="text-gray-400 text-sm max-w-sm text-center">
                    Upload an image and click "Start Face Restoration" button
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Eğer orijinal resim varsa BeforeAfterSlider kullan, yoksa eski görünümü göster
  if (originalFaceImage && restoredFace) {
    return (
      <BeforeAfterSlider
        beforeImage={originalFaceImage}
        afterImage={restoredFace}
        onDownload={downloadImage}
      />
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
            ✨ Restored Face
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-medium">
              Completed
            </span>
          </h3>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
            <Image
              src={restoredFace}
              alt="Restored face"
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
                    onClick={() => downloadImage(restoredFace)}
                    className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
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
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <span className="text-sm font-medium text-green-800">
                Face successfully restored!
              </span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              AI algorithm analyzed your face and enhanced the quality
            </p>
          </div>
        </motion.div>

        {/* Quality comparison info */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
            <div className="text-blue-600 font-semibold text-sm">Before</div>
            <div className="text-blue-800 text-xs">Original quality</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
            <div className="text-green-600 font-semibold text-sm">After</div>
            <div className="text-green-800 text-xs">AI enhanced</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestoredFace;
