"use client";
import ImageUploader from "@/components/background-remove/ImageUploader";
import RemovedBackgrounds from "@/components/background-remove/RemovedBackgrounds";
import React from "react";

const BackgroundRemover = () => {
  return (
    <div>
      <div className="flex flex-col mt-3 md:flex-row justify-center items-center h-screen">
        <div>
          <ImageUploader />
        </div>
        <div>
          <RemovedBackgrounds />
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemover;
