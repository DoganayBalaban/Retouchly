"use client";

import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { ImagePlus, Loader } from "lucide-react";
import useGeneratedStore from "@/store/useGeneratedStore";
import toast from "react-hot-toast";

export default function ImageUploader() {
  const { faceRestoration } = useGeneratedStore();
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
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Sol */}
      <div className="flex-1 space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
            isDragActive ? "bg-gray-100" : "bg-white"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <ImagePlus className="size-8 text-gray-500" />
            <p>Bir görseli buraya sürükle veya tıkla</p>
          </div>
        </div>

        {uploadedUrl && (
          <div className="space-y-2">
            <img src={uploadedUrl} alt="Yüklendi" className="max-w-xs border" />
            <button
              onClick={handleCancel}
              className="text-red-600 underline text-sm"
            >
              ❌ Vazgeç
            </button>
          </div>
        )}

        <button
          onClick={handleFaceRestoration}
          className="bg-blue-600 text-white px-4 py-2 w-full rounded"
        >
          <span>Yüz Restorasyonu Başlat</span>
        </button>
      </div>
    </div>
  );
}
