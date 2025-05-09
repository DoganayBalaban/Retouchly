import ImageUploader from "@/components/ImageUploader";
import React from "react";

const BackgroundRemover = () => {
  return (
    <div>
      <div className="max-w-xl mx-auto mt-10">
        <h1 className="text-xl font-bold mb-4">Görsel Yükle</h1>
        <ImageUploader />
      </div>
    </div>
  );
};

export default BackgroundRemover;
