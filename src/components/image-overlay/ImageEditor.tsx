"use client";

import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import * as motion from "motion/react-client";
import { supabase } from "@/lib/supabase";
import { Upload, X, Sparkles, Wand2 } from "lucide-react";
import useGeneratedStore from "@/store/useGeneratedStore";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addUserActivity } from "@/app/actions/userImages/getUserGeneratedImages";

export default function ImageEditor() {
  const { editImage } = useGeneratedStore();

  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("match_input_image");
  const [outputFormat, setOutputFormat] = useState("jpg");

  const resizeImage = (file: File, maxSize = 1024): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const canvas = document.createElement("canvas");
        let width = image.width;
        let height = image.height;

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            blob ? resolve(blob) : reject("Could not create blob.");
          },
          "image/jpeg",
          0.9
        );
      };
      image.onerror = () => reject("Could not load image.");
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      const newUrls: string[] = [];
      const newPaths: string[] = [];
      const newPreviews: string[] = [];

      for (const file of acceptedFiles) {
        const resized = await resizeImage(file);
        const preview = URL.createObjectURL(resized);
        newPreviews.push(preview);

        const fileName = `edit-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}.jpeg`;
        const { error } = await supabase.storage
          .from("images")
          .upload(fileName, resized);

        if (error) throw new Error(error.message);

        const { data } = supabase.storage.from("images").getPublicUrl(fileName);
        newUrls.push(data.publicUrl);
        newPaths.push(fileName);
      }

      setUploadedUrls((prev) => [...prev, ...newUrls]);
      setUploadedPaths((prev) => [...prev, ...newPaths]);
      setPreviewUrls((prev) => [...prev, ...newPreviews]);

      toast.success(`${acceptedFiles.length} image(s) uploaded.`);
    } catch (err) {
      alert("Error: " + err);
    }
  }, []);

  const handleCancel = async () => {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from("images").remove(uploadedPaths);
    }
    setUploadedUrls([]);
    setUploadedPaths([]);
    setPreviewUrls([]);
    toast.success("All images deleted.");
  };

  const handleRemoveImage = async (index: number) => {
    const pathToRemove = uploadedPaths[index];
    if (pathToRemove) {
      await supabase.storage.from("images").remove([pathToRemove]);
    }

    setUploadedUrls((prev) => prev.filter((_, i) => i !== index));
    setUploadedPaths((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed.");
  };

  const handleImageEdit = async () => {
    if (uploadedUrls.length === 0)
      return alert("Cannot process without uploading at least one image.");
    if (!prompt.trim()) return alert("Please enter an editing prompt.");

    const startTime = Date.now();
    try {
      const result = await editImage({
        image_input: uploadedUrls,
        prompt: prompt.trim(),
        aspect_ratio: aspectRatio as
          | "match_input_image"
          | "1:1"
          | "16:9"
          | "9:16"
          | "4:3"
          | "3:4",
        output_format: outputFormat as "jpg" | "png" | "webp",
      });
      const processingTime = (Date.now() - startTime) / 1000;

      // Get user info
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          // Use result - edited image
          const resultUrl = result || uploadedUrls[0];

          await addUserActivity({
            user_id: user.id,
            activity_type: "image_overlay",
            input_image_url: uploadedUrls[0], // Primary image
            image_url: resultUrl, // Edited image
            metadata: {
              prompt: prompt,
              aspect_ratio: aspectRatio,
              output_format: outputFormat,
              processing_time: processingTime,
              model: "google/nano-banana",
              total_input_images: uploadedUrls.length,
            },
          });
        } catch (activityError) {
          console.error("Activity save error:", activityError);
          toast.error(
            "History save error: " + (activityError as Error).message
          );
        }
      } else {
        toast.error("User session not found");
      }

      toast.success("Image editing started.");
    } catch (error) {
      console.error("Image editing error:", error);
      toast.error("An error occurred during image editing.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    maxFiles: 5,
  });

  return (
    <div className="w-full p-3 sm:p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
          AI Image Editor
        </h2>
        <p className="text-gray-600 text-xs">
          Upload one or more images and describe how you want to edit them
        </p>
      </div>

      <div className="space-y-4">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50/50"
                }`}
              >
                <input {...getInputProps()} />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-1">
                      {isDragActive ? "Drop images here" : "Upload images"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Drag & drop or click to select
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      JPG, PNG, WebP supported • Multiple images allowed
                    </p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview */}
        {previewUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                📷 Uploaded Images ({previewUrls.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
                    <img
                      src={url}
                      alt={`Uploaded image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Image {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Editing Controls */}
        {uploadedUrls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4"
          >
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Editing Instructions
            </h3>

            <div className="space-y-3">
              <Textarea
                placeholder="Describe how you want to edit the image... (e.g., 'Change the background to a sunset', 'Add flowers around the person', 'Make it look like a painting')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="resize-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Aspect Ratio
                  </label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match_input_image">
                        Match Input
                      </SelectItem>
                      <SelectItem value="1:1">Square (1:1)</SelectItem>
                      <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                      <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                      <SelectItem value="4:3">Classic (4:3)</SelectItem>
                      <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Output Format
                  </label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpg">JPG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Button
            onClick={handleImageEdit}
            disabled={uploadedUrls.length === 0 || !prompt.trim()}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Edit Image with AI
            </motion.div>
          </Button>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-600">🤖</span>
              <span className="text-sm font-medium text-purple-800">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-purple-700">
              Uses Google's latest nano-banana model • Supports multiple images
            </p>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-pink-600">✨</span>
              <span className="text-sm font-medium text-pink-800">
                Natural Results
              </span>
            </div>
            <p className="text-xs text-pink-700">
              Creates realistic edits • Reference images for style transfer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
