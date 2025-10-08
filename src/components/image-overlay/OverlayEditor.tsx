"use client";

import React, { useState, useRef, useCallback } from "react";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  RotateCw,
  Trash2,
  Plus,
  Smile,
  Type,
  Sticker,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import useGeneratedStore from "@/store/useGeneratedStore";
import toast from "react-hot-toast";

const EMOJIS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "❣️",
  "💕",
  "💞",
  "💓",
  "💗",
  "💖",
  "💘",
  "💝",
  "💟",
  "☮️",
  "✨",
  "⭐",
  "🌟",
  "💫",
  "⚡",
  "🔥",
  "💥",
  "💢",
  "💨",
  "💦",
  "🎉",
  "🎊",
  "🎈",
  "🎁",
  "🏆",
  "🥇",
  "🥈",
  "🥉",
  "🏅",
  "🎖️",
];

const STICKERS = [
  "🌈",
  "☀️",
  "⭐",
  "🌙",
  "☁️",
  "⚡",
  "🔥",
  "💎",
  "🎯",
  "🎪",
  "🎨",
  "🎭",
  "🎪",
  "🎡",
  "🎢",
  "🎠",
  "🎪",
  "🎨",
  "🖼️",
  "🎬",
];

export default function OverlayEditor() {
  const {
    uploadedImage,
    overlays,
    selectedOverlay,
    addOverlay,
    updateOverlay,
    removeOverlay,
    setSelectedOverlay,
  } = useGeneratedStore();

  const [textInput, setTextInput] = useState("");
  const [activeTab, setActiveTab] = useState("emoji");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddEmoji = (emoji: string) => {
    addOverlay({
      type: "emoji",
      content: emoji,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    });
    toast.success("Emoji eklendi!");
  };

  const handleAddSticker = (sticker: string) => {
    addOverlay({
      type: "sticker",
      content: sticker,
      x: 50,
      y: 50,
      scale: 1.5,
      rotation: 0,
    });
    toast.success("Sticker eklendi!");
  };

  const handleAddText = () => {
    if (!textInput.trim()) {
      toast.error("Metin giriniz!");
      return;
    }

    addOverlay({
      type: "text",
      content: textInput,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    });
    setTextInput("");
    toast.success("Metin eklendi!");
  };

  const handleOverlayClick = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedOverlay(selectedOverlay === id ? null : id);
  };

  const handleOverlayDrag = useCallback(
    (id: string, event: React.MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      const overlay = overlays.find((o) => o.id === id);
      if (!overlay) return;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newX = Math.max(
          0,
          Math.min(100, overlay.x + (deltaX / rect.width) * 100)
        );
        const newY = Math.max(
          0,
          Math.min(100, overlay.y + (deltaY / rect.height) * 100)
        );

        updateOverlay(id, { x: newX, y: newY });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [overlays, updateOverlay]
  );

  const downloadImage = async () => {
    if (!uploadedImage || !canvasRef.current) {
      toast.error("İndirilecek görsel bulunamadı!");
      return;
    }

    try {
      toast.loading("Görsel hazırlanıyor...");

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error("Canvas desteklenmiyor!");
        return;
      }

      // Load the base image
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Clear canvas and draw base image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Draw overlays
        overlays.forEach((overlay) => {
          ctx.save();

          // Calculate position based on percentage
          const x = (overlay.x / 100) * canvas.width;
          const y = (overlay.y / 100) * canvas.height;

          // Apply transformations
          ctx.translate(x, y);
          ctx.rotate((overlay.rotation * Math.PI) / 180);
          ctx.scale(overlay.scale, overlay.scale);

          // Set font and style based on overlay type
          if (overlay.type === "text") {
            const fontSize = Math.max(24, canvas.width / 20); // Responsive font size
            ctx.font = `bold ${fontSize}px Arial, sans-serif`;
            ctx.fillStyle = "#000000";
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Draw text with outline for better visibility
            ctx.strokeText(overlay.content, 0, 0);
            ctx.fillText(overlay.content, 0, 0);
          } else {
            // For emojis and stickers
            const fontSize = Math.max(32, canvas.width / 15); // Responsive emoji size
            ctx.font = `${fontSize}px Arial, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(overlay.content, 0, 0);
          }

          ctx.restore();
        });

        // Convert to blob and download
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `edited-image-${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              toast.dismiss();
              toast.success("Görsel başarıyla indirildi!");
            } else {
              toast.dismiss();
              toast.error("Görsel oluşturulamadı!");
            }
          },
          "image/png",
          1.0
        );
      };

      img.onerror = () => {
        toast.dismiss();
        toast.error("Görsel yüklenemedi!");
      };

      img.src = uploadedImage;
    } catch (error) {
      toast.dismiss();
      toast.error("İndirme sırasında hata oluştu!");
      console.error("Download error:", error);
    }
  };

  if (!uploadedImage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl relative z-10">
          <CardContent className="flex aspect-video items-center justify-center p-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4">
                  <Smile className="w-10 h-10 text-white" />
                </div>
                <div className="text-white text-xl font-semibold mb-2">
                  Düzenleyici burada görünecek
                </div>
                <div className="text-gray-400 text-sm max-w-sm text-center">
                  Bir görsel yükleyin ve emoji, sticker, metin eklemeye başlayın
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-4"
    >
      {/* Editor Canvas */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div
            ref={containerRef}
            className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video cursor-crosshair"
            onClick={() => setSelectedOverlay(null)}
          >
            <img
              src={uploadedImage}
              alt="Düzenlenen görsel"
              className="w-full h-full object-contain"
            />

            {/* Overlays */}
            {overlays.map((overlay) => (
              <motion.div
                key={overlay.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute cursor-move select-none ${
                  selectedOverlay === overlay.id
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : ""
                }`}
                style={{
                  left: `${overlay.x}%`,
                  top: `${overlay.y}%`,
                  transform: `translate(-50%, -50%) scale(${overlay.scale}) rotate(${overlay.rotation}deg)`,
                  fontSize: overlay.type === "text" ? "24px" : "32px",
                  fontWeight: overlay.type === "text" ? "bold" : "normal",
                  color: overlay.type === "text" ? "#000" : "inherit",
                  textShadow:
                    overlay.type === "text"
                      ? "1px 1px 2px rgba(255,255,255,0.8)"
                      : "none",
                }}
                onClick={(e) => handleOverlayClick(overlay.id, e)}
                onMouseDown={(e) => handleOverlayDrag(overlay.id, e)}
              >
                {overlay.content}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Add Elements */}
        <Card>
          <CardContent className="p-4">
            <div className="w-full">
              {/* Custom Tab Headers */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  onClick={() => setActiveTab("emoji")}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    activeTab === "emoji"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Smile className="w-4 h-4 mr-1" />
                  Emoji
                </button>
                <button
                  onClick={() => setActiveTab("sticker")}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    activeTab === "sticker"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Sticker className="w-4 h-4 mr-1" />
                  Sticker
                </button>
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    activeTab === "text"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Type className="w-4 h-4 mr-1" />
                  Metin
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "emoji" && (
                <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                  {EMOJIS.map((emoji, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddEmoji(emoji)}
                      className="text-lg hover:bg-orange-50"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              )}

              {activeTab === "sticker" && (
                <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
                  {STICKERS.map((sticker, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddSticker(sticker)}
                      className="text-lg hover:bg-orange-50"
                    >
                      {sticker}
                    </Button>
                  ))}
                </div>
              )}

              {activeTab === "text" && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Metin girin..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddText()}
                  />
                  <Button onClick={handleAddText} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected Overlay Controls */}
        {selectedOverlay && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-sm">
                Seçili Öğe Kontrolü
              </h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const overlay = overlays.find(
                        (o) => o.id === selectedOverlay
                      );
                      if (overlay) {
                        updateOverlay(selectedOverlay, {
                          scale: Math.max(0.5, overlay.scale - 0.1),
                        });
                      }
                    }}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const overlay = overlays.find(
                        (o) => o.id === selectedOverlay
                      );
                      if (overlay) {
                        updateOverlay(selectedOverlay, {
                          scale: Math.min(3, overlay.scale + 0.1),
                        });
                      }
                    }}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const overlay = overlays.find(
                        (o) => o.id === selectedOverlay
                      );
                      if (overlay) {
                        updateOverlay(selectedOverlay, {
                          rotation: overlay.rotation + 15,
                        });
                      }
                    }}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeOverlay(selectedOverlay)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Download */}
        <Card>
          <CardContent className="p-4">
            <Button
              onClick={downloadImage}
              disabled={!uploadedImage}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              Görseli İndir
            </Button>
            {overlays.length > 0 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                {overlays.length} overlay ile birlikte indirilecek
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hidden canvas for download */}
      <canvas ref={canvasRef} className="hidden" style={{ display: "none" }} />
    </motion.div>
  );
}
