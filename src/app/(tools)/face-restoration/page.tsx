"use client";
import ImageUploader from "@/components/face-restoration/ImageUploader";
import React from "react";
import RestoredFace from "@/components/face-restoration/RestoredFace";

const FaceRestoration = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Yüz İyileştirme
        </h1>
        <p className="text-gray-600 text-sm">
          AI ile eski, bulanık veya hasarlı yüzleri restore edin
        </p>
      </div>

      <section className="flex flex-col lg:flex-row gap-6 justify-center items-start">
        <div className="w-full lg:w-1/2 max-w-2xl">
          <ImageUploader />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <RestoredFace />
        </div>
      </section>
    </div>
  );
};

export default FaceRestoration;
