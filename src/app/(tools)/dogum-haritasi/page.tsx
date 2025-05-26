"use client";
import ImageUploader from "@/components/dogum-haritasi/ImageUploader";
import DogumHaritasi from "@/components/dogum-haritasi/dogumHaritasi";

import React from "react";

const DogumHaritasiPage = () => {
  return (
    <div className="flex justify-center items-center">
      <div>
        <ImageUploader />
      </div>
      <div>
        <DogumHaritasi />
      </div>
    </div>
  );
};

export default DogumHaritasiPage;
