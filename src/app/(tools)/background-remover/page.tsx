"use client";
import ImageUploader from "@/components/background-remove/ImageUploader";
import RemovedBackgrounds from "@/components/background-remove/RemovedBackgrounds";
import React from "react";

const BackgroundRemover = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Arka Plan Kaldırıcı
        </h1>
        <p className="text-gray-600 text-sm">
          AI ile görsellerinizin arka planını otomatik olarak kaldırın
        </p>
      </div>

      <section className="flex flex-col lg:flex-row gap-6 justify-center items-start">
        <div className="w-full lg:w-1/2 max-w-2xl">
          <ImageUploader />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <RemovedBackgrounds />
        </div>
      </section>
    </div>
  );
};

export default BackgroundRemover;
