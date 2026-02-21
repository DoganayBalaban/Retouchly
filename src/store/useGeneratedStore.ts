import { removeBackground } from "@/app/actions/background-actions";
import { generateImages } from "@/app/actions/image-actions";
import { editImageWithAI } from "@/app/actions/image-edit-actions";
import { restoreFace } from "@/app/actions/restore-actions";
import { saveImagesToBucket } from "@/app/actions/savedImages";
import { generateSpeechWithAI } from "@/app/actions/voice-actions";
import { imageFormSchema } from "@/components/image-generation/Configurations";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { create } from "zustand";
interface Overlay {
  id: string;
  type: "emoji" | "sticker" | "text";
  content: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface GeneratedStore {
  loading: boolean;
  images: Array<{ url: string }>;
  bgImage: string | null;
  restoredFace: string | null;
  originalFaceImage: string | null;
  editedImage: string | null;
  originalEditImage: string | null;
  generatedAudio: string | null;
  error: string | null;
  // Overlay states
  uploadedImage: string | null;
  overlays: Overlay[];
  selectedOverlay: string | null;
  // AI Assistant states
  aiAssistantVisible: boolean;
  aiSuggestions: string[];
  generateImages: (values: z.infer<typeof imageFormSchema>) => Promise<void>;
  removeBackground: (input: { image: string }) => Promise<string | null>;
  faceRestoration: (input: { image: string }) => Promise<string | null>;
  setOriginalFaceImage: (url: string | null) => void;
  editImage: (input: {
    image_input: string[];
    prompt: string;
    aspect_ratio?:
      | "match_input_image"
      | "1:1"
      | "16:9"
      | "9:16"
      | "4:3"
      | "3:4";
    output_format?: "jpg" | "png" | "webp";
  }) => Promise<string | null>;
  setOriginalEditImage: (url: string | null) => void;
  generateSpeech: (input: {
    text: string;
    voice?: string;
    speed?: number;
  }) => Promise<string | null>;
  // Overlay actions
  setUploadedImage: (url: string | null) => void;
  addOverlay: (overlay: Omit<Overlay, "id">) => void;
  updateOverlay: (id: string, updates: Partial<Overlay>) => void;
  removeOverlay: (id: string) => void;
  setSelectedOverlay: (id: string | null) => void;
  clearOverlays: () => void;
  // AI Assistant actions
  setAIAssistantVisible: (visible: boolean) => void;
  setAISuggestions: (suggestions: string[]) => void;
}
const useGeneratedStore = create<GeneratedStore>((set, get) => ({
  loading: false,
  images: [],
  bgImage: null,
  dogumHaritasiText: null,
  restoredFace: null,
  originalFaceImage: null,
  editedImage: null,
  originalEditImage: null,
  generatedAudio: null,
  error: null,
  // Overlay states
  uploadedImage: null,
  overlays: [],
  selectedOverlay: null,
  // AI Assistant states
  aiAssistantVisible: false,
  aiSuggestions: [],
  generateImages: async (values: z.infer<typeof imageFormSchema>) => {
    set({ loading: true, error: null });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id) {
      throw new Error("Kullanıcı oturumu bulunamadı.");
    }
    try {
      const { error, success, data } = await generateImages(values);
      if (!success) {
        set({ loading: false, error });
        return;
      }
      const dataWithUrl = data.map((url: string) => {
        return {
          url,
        };
      });

      await saveImagesToBucket(data, user.id, values.prompt);
      set({ loading: false, images: dataWithUrl });
    } catch (error) {
      console.error("Replicate API Hatası:", error);
      set({ loading: false, error: (error as Error).message });
    }
  },
  removeBackground: async (input: { image: string }) => {
    set({ loading: true, error: null });
    try {
      const { error, success, data } = await removeBackground(input);
      console.log("removeBackground", data);
      if (!success) {
        set({ loading: false, error });
        return null;
      }

      set({ loading: false, bgImage: data });
      return data; // Sonucu döndür
    } catch (error) {
      console.error("Replicate API Hatası:", error);
      set({ loading: false, error: (error as Error).message });
      return null;
    }
  },
  faceRestoration: async (input: { image: string }) => {
    set({ loading: true, error: null, originalFaceImage: input.image });
    try {
      const { error, success, data } = await restoreFace(input);
      console.log("faceRestoration", data);
      if (!success) {
        set({ loading: false, error });
        return null;
      }

      set({ loading: false, restoredFace: data });
      return data; // Sonucu döndür
    } catch (error) {
      console.error("Replicate API Hatası:", error);
      set({ loading: false, error: (error as Error).message });
      return null;
    }
  },
  setOriginalFaceImage: (url: string | null) => {
    set({ originalFaceImage: url });
  },
  editImage: async (input: {
    image_input: string[];
    prompt: string;
    aspect_ratio?:
      | "match_input_image"
      | "1:1"
      | "16:9"
      | "9:16"
      | "4:3"
      | "3:4";
    output_format?: "jpg" | "png" | "webp";
  }) => {
    set({
      loading: true,
      error: null,
      originalEditImage: input.image_input[0],
    });
    try {
      const { error, success, data } = await editImageWithAI(input);
      console.log("editImage", data);
      if (!success) {
        set({ loading: false, error });
        return null;
      }

      set({ loading: false, editedImage: data });
      return data; // Return result
    } catch (error) {
      console.error("Image editing error:", error);
      set({ loading: false, error: (error as Error).message });
      return null;
    }
  },
  setOriginalEditImage: (url: string | null) => {
    set({ originalEditImage: url });
  },
  generateSpeech: async (input: {
    text: string;
    voice?: string;
    speed?: number;
  }) => {
    set({ loading: true, error: null, generatedAudio: null });
    try {
      const { error, success, data } = await generateSpeechWithAI(input);
      console.log("generateSpeech", data);
      if (!success || typeof data !== "string") {
        set({
          loading: false,
          error: error || "Generated audio URL is missing",
        });
        return null;
      }

      set({ loading: false, generatedAudio: data });
      return data;
    } catch (error) {
      console.error("Voice generation error:", error);
      set({ loading: false, error: (error as Error).message });
      return null;
    }
  },

  // Overlay actions
  setUploadedImage: (url: string | null) => {
    set({ uploadedImage: url });
  },
  addOverlay: (overlay: Omit<Overlay, "id">) => {
    const newOverlay = {
      ...overlay,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    set((state) => ({ overlays: [...state.overlays, newOverlay] }));
  },
  updateOverlay: (id: string, updates: Partial<Overlay>) => {
    set((state) => ({
      overlays: state.overlays.map((overlay) =>
        overlay.id === id ? { ...overlay, ...updates } : overlay,
      ),
    }));
  },
  removeOverlay: (id: string) => {
    set((state) => ({
      overlays: state.overlays.filter((overlay) => overlay.id !== id),
      selectedOverlay:
        state.selectedOverlay === id ? null : state.selectedOverlay,
    }));
  },
  setSelectedOverlay: (id: string | null) => {
    set({ selectedOverlay: id });
  },
  clearOverlays: () => {
    set({ overlays: [], selectedOverlay: null });
  },
  // AI Assistant actions
  setAIAssistantVisible: (visible: boolean) => {
    set({ aiAssistantVisible: visible });
  },
  setAISuggestions: (suggestions: string[]) => {
    set({ aiSuggestions: suggestions });
  },
}));
export default useGeneratedStore;
