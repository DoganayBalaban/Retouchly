"use client";
import ImageUploader from "@/components/face-restoration/ImageUploader";
import React from "react";
import RestoredFace from "@/components/face-restoration/RestoredFace";

const FaceRestoration = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ImageUploader />
      <RestoredFace />
    </div>
  );
};

export default FaceRestoration;
