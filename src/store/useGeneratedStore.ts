import { create } from "zustand";
import { z } from "zod";
import { imageFormSchema } from "@/components/image-generation/Configurations";
import { generateImages } from "@/app/actions/image-actions";
import { removeBackground } from "@/app/actions/background-actions";
import { restoreFace } from "@/app/actions/restore-actions";
import { supabase } from "@/lib/supabase";
import { saveImagesToBucket } from "@/app/actions/savedImages";
import { dogumHaritasi } from "@/app/actions/dogum-haritasi";
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
  dogumHaritasiText: string | null;
  restoredFace: string | null;
  error: string | null;
  // Overlay states
  uploadedImage: string | null;
  overlays: Overlay[];
  selectedOverlay: string | null;
  generateImages: (values: z.infer<typeof imageFormSchema>) => Promise<void>;
  removeBackground: (input: { image: string }) => Promise<void>;
  faceRestoration: (input: { image: string }) => Promise<void>;
  dogumHaritasi: (input: { image: string }) => Promise<void>;
  // Overlay actions
  setUploadedImage: (url: string | null) => void;
  addOverlay: (overlay: Omit<Overlay, "id">) => void;
  updateOverlay: (id: string, updates: Partial<Overlay>) => void;
  removeOverlay: (id: string) => void;
  setSelectedOverlay: (id: string | null) => void;
  clearOverlays: () => void;
}
const useGeneratedStore = create<GeneratedStore>((set, get) => ({
  loading: false,
  images: [],
  bgImage: null,
  dogumHaritasiText: null,
  restoredFace: null,
  error: null,
  // Overlay states
  uploadedImage: null,
  overlays: [],
  selectedOverlay: null,
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
        return;
      }

      set({ loading: false, bgImage: data });
    } catch (error) {
      console.error("Replicate API Hatası:", error);
      set({ loading: false, error: (error as Error).message });
    }
  },
  faceRestoration: async (input: { image: string }) => {
    set({ loading: true, error: null });
    try {
      const { error, success, data } = await restoreFace(input);
      console.log("removeBackground", data);
      if (!success) {
        set({ loading: false, error });
        return;
      }

      set({ loading: false, restoredFace: data });
    } catch (error) {
      console.error("Replicate API Hatası:", error);
      set({ loading: false, error: (error as Error).message });
    }
  },
  dogumHaritasi: async (input: { image: string }) => {
    set({ loading: true, error: null });
    try {
      const { error, success, data } = await dogumHaritasi(input);

      if (!success) {
        set({ loading: false, error });
        return;
      }

      set({ loading: false, dogumHaritasiText: data });
    } catch (error) {
      console.error("Replicate API Hatası:", error);
      set({ loading: false, error: (error as Error).message });
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
        overlay.id === id ? { ...overlay, ...updates } : overlay
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
}));
export default useGeneratedStore;
