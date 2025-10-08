"use client";

import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import * as motion from "motion/react-client";
import { supabase } from "@/lib/supabase";
import { ImagePlus, Loader, Upload, X, Sparkles } from "lucide-react";
import useGeneratedStore from "@/store/useGeneratedStore";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AIAssistant, { AIAssistantButton } from "../ai-assistant/AIAssistant";

export default function ImageUploader() {
  const { faceRestoration, aiAssistantVisible, setAIAssistantVisible } =
    useGeneratedStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);

  const resizeImage = (file: File, maxSize = 512): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const canvas = document.createElement("canvas");
        let width = image.width;
        let height = image.height;

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            blob ? resolve(blob) : reject("Blob oluşturulamadı.");
          },
          "image/jpeg",
          0.9
        );
      };
      image.onerror = () => reject("Görsel yüklenemedi.");
    });
  };
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const resized = await resizeImage(file);
      const preview = URL.createObjectURL(resized);
      setPreviewUrl(preview);

      const fileName = `${Date.now()}.jpeg`;
      const { error } = await supabase.storage
        .from("images")
        .upload(fileName, resized);

      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from("images").getPublicUrl(fileName);
      setUploadedUrl(data.publicUrl);
      setUploadedPath(fileName);
      toast.success("Görsel yüklendi.");
    } catch (err) {
      alert("Hata: " + err);
    } finally {
    }
  }, []);
  const handleCancel = async () => {
    if (uploadedPath) {
      await supabase.storage.from("images").remove([uploadedPath]);
    }
    setUploadedUrl(null);
    setUploadedPath(null);
    setPreviewUrl(null);
    toast.success("Görsel silindi.");
  };
  const handleFaceRestoration = async () => {
    if (!uploadedUrl) return alert("Görsel yüklenmeden işlem yapılamaz.");

    try {
      await faceRestoration({ image: uploadedUrl });
      toast.success("Yüz restorasyonu başlatıldı.");
    } catch (error) {
      console.error("Yüz restorasyonu hatası:", error);
      toast.error("Yüz restorasyonu sırasında hata oluştu.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div className="w-full p-3 sm:p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-1">
          Görsel Yükle
        </h2>
        <p className="text-gray-600 text-xs">
          İyileştirmek istediğiniz yüz görselini yükleyin
        </p>
      </div>

      <div className="space-y-4">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50"
                }`}
              >
                <input {...getInputProps()} />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-1">
                      {isDragActive ? "Görseli buraya bırak" : "Görsel yükle"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Sürükle & bırak veya tıklayarak seç
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      JPG, PNG, WebP desteklenir
                    </p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview */}
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                📷 Yüklenen Görsel
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <img
                src={previewUrl}
                alt="Yüklenen görsel"
                className="w-full h-auto max-h-64 object-contain"
              />
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button
            onClick={handleFaceRestoration}
            disabled={!uploadedUrl}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Yüz İyileştirmesini Başlat
            </motion.div>
          </Button>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-600">💡</span>
              <span className="text-sm font-medium text-blue-800">İpucu</span>
            </div>
            <p className="text-xs text-blue-700">
              En iyi sonuçlar için yüksek çözünürlüklü görseller kullanın
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-600">⚡</span>
              <span className="text-sm font-medium text-green-800">Hızlı</span>
            </div>
            <p className="text-xs text-green-700">
              İşlem genellikle 10-30 saniye sürer
            </p>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      {aiAssistantVisible && (
        <AIAssistant
          toolType="face-restoration"
          imageUrl={uploadedUrl || undefined}
        />
      )}

      {/* AI Assistant Button */}
      {!aiAssistantVisible && (
        <AIAssistantButton onClick={() => setAIAssistantVisible(true)} />
      )}
    </div>
  );
}
