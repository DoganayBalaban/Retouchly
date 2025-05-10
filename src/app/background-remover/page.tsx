"use client";
import ImageUploader from "@/components/background-remove/ImageUploader";
import RemovedBackgrounds from "@/components/background-remove/RemovedBackgrounds";
import React from "react";

const BackgroundRemover = () => {
  return (
    <div>
      <div className="flex justify-center items-center">
        <ImageUploader />
        <RemovedBackgrounds />
      </div>
    </div>
  );
};

export default BackgroundRemover;
