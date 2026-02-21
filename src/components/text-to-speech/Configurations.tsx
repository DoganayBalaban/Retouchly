"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import * as motion from "motion/react-client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import useGeneratedStore from "@/store/useGeneratedStore";
import type { User } from "@supabase/supabase-js";
import { Info, Volume2 } from "lucide-react";
import SignInDialog from "../SignInDialog";
import { Textarea } from "../ui/textarea";

export const textToSpeechSchema = z.object({
  text: z
    .string({ required_error: "Metin giriniz" })
    .min(2, "En az 2 karakter giriniz")
    .max(500, "Maksimum 500 karakter"),
  voice: z.string({ required_error: "Ses seçiniz" }),
  speed: z.number({ invalid_type_error: "Hız sayı olmalı" }).min(0.5).max(2.0),
});

const Configurations = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data.user);
    })();
  }, []);

  const { generateSpeech, loading } = useGeneratedStore();

  const form = useForm<z.infer<typeof textToSpeechSchema>>({
    resolver: zodResolver(textToSpeechSchema),
    defaultValues: {
      text: "",
      voice: "af_nicole",
      speed: 1.0,
    },
  });

  async function onSubmit(values: z.infer<typeof textToSpeechSchema>) {
    await generateSpeech(values);
  }

  const renderLabelWithTooltip = (label: string, tooltipText: string) => (
    <div className="flex items-center gap-1">
      {label}
      <Tooltip>
        <TooltipTrigger>
          <Info size={16} className="inline" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <div className="w-full p-3 sm:p-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
      <TooltipProvider>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4"
          >
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                Voice Settings
              </h2>
              <p className="text-gray-600 text-xs">
                Configure settings to generate speech
              </p>
            </div>

            {/* Text Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
            >
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel className="text-base font-semibold text-gray-800">
                        {renderLabelWithTooltip(
                          "📝 Text (Metin)",
                          "Type the text you want to convert to speech.",
                        )}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm"
                        placeholder="Hello, welcome to our application..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Voice and Speed Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4"
            >
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                🎤 Voice Settings
              </h3>

              <FormField
                control={form.control}
                name="voice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {renderLabelWithTooltip(
                        "🗣️ Voice Actor",
                        "Select the voice model. Different models have different tones and accents.",
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 rounded-lg border-gray-300 focus:border-blue-500">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Kokoro voices roughly categorized based on their names */}
                        <SelectItem value="af_nicole">
                          Nicole (American Female)
                        </SelectItem>
                        <SelectItem value="af_bella">
                          Bella (American Female)
                        </SelectItem>
                        <SelectItem value="am_adam">
                          Adam (American Male)
                        </SelectItem>
                        <SelectItem value="am_michael">
                          Michael (American Male)
                        </SelectItem>
                        <SelectItem value="bf_emma">
                          Emma (British Female)
                        </SelectItem>
                        <SelectItem value="bm_george">
                          George (British Male)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between text-sm font-medium text-gray-700 mt-4">
                      {renderLabelWithTooltip(
                        "⚡ Reading Speed",
                        "Adjust how fast the text is read.",
                      )}
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-semibold">
                        {field.value}x
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="px-3 pb-2 pt-1">
                        <Slider
                          value={[field.value]}
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Slow (0.5x)</span>
                          <span>Normal (1.0x)</span>
                          <span>Fast (2.0x)</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </form>
        </Form>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8"
        >
          {user ? (
            <Button
              type="submit"
              disabled={loading}
              onClick={form.handleSubmit(onSubmit)}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                {loading ? "Generating Audio..." : "Generate Audio"}
              </motion.div>
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                You need to sign in to use text-to-speech
              </p>
              <SignInDialog />
            </div>
          )}
        </motion.div>
      </TooltipProvider>
    </div>
  );
};

export default Configurations;
