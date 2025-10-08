"use client";
import ImageUploader from "@/components/image-overlay/ImageUploader";
import OverlayEditor from "@/components/image-overlay/OverlayEditor";
import React from "react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

const ImageOverlay = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
          Görsel Düzenleyici
        </h1>
        <p className="text-gray-600 text-sm">
          Görsellerinize emoji, sticker ve AI overlay'ler ekleyin
        </p>
      </div>

      <section className="flex flex-col xl:flex-row gap-6 justify-center items-start">
        <div className="w-full xl:w-1/3 max-w-md">
          <ImageUploader />
        </div>

        <div className="w-full xl:w-2/3 flex items-center justify-center">
          <OverlayEditor />
        </div>
      </section>
    </div>
  );
};

export default ImageOverlay;
