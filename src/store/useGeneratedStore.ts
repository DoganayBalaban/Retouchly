import {create} from 'zustand';
import { z } from "zod";
import { imageFormSchema } from "@/components/image-generation/Configurations";
import { generateImages } from '@/app/actions/image-actions';
import { removeBackground } from '@/app/actions/background-actions';
import { restoreFace } from '@/app/actions/restore-actions';
import { supabase } from '@/lib/supabase';
import { saveGeneratedImages } from '@/app/actions/savedImages';
interface GeneratedStore {
    loading: boolean;
    images: Array<{url: string}>;
    bgImage: string | null;
    restoredFace: string | null;
    error: string | null;
    generateImages: (values: z.infer<typeof imageFormSchema>) => Promise<void>;
    removeBackground: (input: {image:string}) => Promise<void>;
    faceRestoration: (input: {image:string}) => Promise<void>;
}
const useGeneratedStore = create<GeneratedStore>((set) => ({
    loading: false,
    images: [],
    bgImage: null,
    restoredFace: null,
    error: null,
    generateImages: async (values: z.infer<typeof imageFormSchema>) => {
        set({ loading: true, error: null });
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) {
  throw new Error("Kullanıcı oturumu bulunamadı.");
}
        try {
            const {error, success, data} = await generateImages(values);
            if (!success) {
                set({ loading: false, error });
                return
            }
            const dataWithUrl = data.map((url: string) => {
                return {
                    url
                }
        })
         await saveGeneratedImages(data, values.prompt, user?.id);
            set({ loading: false, images: dataWithUrl });
        } catch (error) {
            console.error("Replicate API Hatası:", error);
            set({ loading: false, error: (error as Error).message });
            
        }
      
    },
    removeBackground: async (input: {image:string}) => {
        set({ loading: true, error: null });
        try {
            const {error, success, data} = await removeBackground(input);
            console.log("removeBackground", data);
            if (!success) {
                set({ loading: false, error });
                return
            }
            
            set({ loading: false, bgImage: data });
            
        } catch (error) {
            console.error("Replicate API Hatası:", error);
            set({ loading: false, error: (error as Error).message });
            
        }
    },
    faceRestoration: async (input: {image:string}) => {
        set({ loading: true, error: null });
        try {
            const {error, success, data} = await restoreFace(input);
            console.log("removeBackground", data);
            if (!success) {
                set({ loading: false, error });
                return
            }
            
            set({ loading: false, restoredFace: data });
        } catch (error) {
            console.error("Replicate API Hatası:", error);
            set({ loading: false, error: (error as Error).message });
            
        }
    }

}))
export default useGeneratedStore;