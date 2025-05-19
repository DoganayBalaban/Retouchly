"use client";
import ImageUploader from "@/components/face-restoration/ImageUploader";
import React from "react";
import RestoredFace from "@/components/face-restoration/RestoredFace";

const FaceRestoration = () => {
  return (
    <div className="flex flex-col mt-3 md:flex-row justify-center items-center h-screen">
      <div>
        <ImageUploader />
      </div>
      <div>
        <RestoredFace />
      </div>
    </div>
  );
};

export default FaceRestoration;
