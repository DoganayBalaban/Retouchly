"use client";

import React, { useState, useRef, useEffect } from "react";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Heart, RotateCcw, Eye } from "lucide-react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  onDownload?: (url: string) => void;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  onDownload,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateSliderPosition(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateSliderPosition(e.touches[0]);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    updateSliderPosition(e.touches[0]);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const updateSliderPosition = (
    e: MouseEvent | Touch | React.MouseEvent | { clientX: number }
  ) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  const downloadImage = async (url: string) => {
    if (onDownload) {
      onDownload(url);
      return;
    }

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `restored-face-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const resetSlider = () => {
    setSliderPosition(50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            ✨ Before / After Comparison
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-medium">
              Completed
            </span>
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={resetSlider}
            className="flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Before/After Slider Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <div
            ref={containerRef}
            className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square cursor-col-resize select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
              <Image
                src={afterImage}
                alt="After"
                width={1024}
                height={1024}
                className="object-cover w-full h-full"
                draggable={false}
              />
            </div>

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 transition-all duration-75 ease-out"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              }}
            >
              <Image
                src={beforeImage}
                alt="Before"
                width={1024}
                height={1024}
                className="object-cover w-full h-full"
                draggable={false}
              />
            </div>

            {/* Labels on top of images */}
            <div className="absolute top-4 left-4 bg-red-500/90 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
              Before
            </div>
            <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
              After
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-75 ease-out"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Slider Handle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center cursor-col-resize hover:scale-110 transition-transform">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
                  <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Hover Instructions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Drag to compare
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2 justify-center">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => downloadImage(afterImage)}
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
            >
              <Download className="w-4 h-4 mr-1" />
              Download After
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => downloadImage(beforeImage)}
              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
            >
              <Download className="w-4 h-4 mr-1" />
              Download Before
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Success message */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span className="text-sm font-medium text-green-800">
              Face successfully restored!
            </span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Drag the slider to see the difference between before and after
          </p>
        </div>

        {/* Quality comparison info */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
            <div className="text-green-600 font-semibold text-sm">After</div>
            <div className="text-green-800 text-xs">AI enhanced</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center">
            <div className="text-red-600 font-semibold text-sm">Before</div>
            <div className="text-red-800 text-xs">Original quality</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BeforeAfterSlider;
