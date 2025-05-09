import {create} from 'zustand';
import { z } from "zod";
import { imageFormSchema } from "@/components/image-generation/Configurations";
import { generateImages } from '@/app/actions/image-actions';
import { removeBackground } from '@/app/actions/background-actions';
interface GeneratedStore {
    loading: boolean;
    images: Array<{url: string}>;
    bgImages: Array<{url: string}>;
    error: string | null;
    generateImages: (values: z.infer<typeof imageFormSchema>) => Promise<void>;
    removeBackground: (input: {image:string}) => Promise<void>;
}
const useGeneratedStore = create<GeneratedStore>((set) => ({
    loading: false,
    images: [],
    bgImages: [],
    error: null,
    generateImages: async (values: z.infer<typeof imageFormSchema>) => {
        set({ loading: true, error: null });
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
            if (!success) {
                set({ loading: false, error });
                return
            }
            const dataWithUrl = data.map((url: string) => {
                return {
                    url
                }
        })
            set({ loading: false, bgImages: dataWithUrl });
        } catch (error) {
            console.error("Replicate API Hatası:", error);
            set({ loading: false, error: (error as Error).message });
            
        }
    }

}))
export default useGeneratedStore;