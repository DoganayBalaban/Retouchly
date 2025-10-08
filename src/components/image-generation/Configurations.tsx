"use client";

import * as motion from "motion/react-client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Info, Bot, Sparkles } from "lucide-react";
import useGeneratedStore from "@/store/useGeneratedStore";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import SignInDialog from "../SignInDialog";
import AIAssistant from "../ai-assistant/AIAssistant";

export const imageFormSchema = z.object({
  prompt: z.string({ required_error: "Prompt giriniz" }),
  guidance: z
    .number({ invalid_type_error: "Yönlendirme değeri sayı olmalı" })
    .min(1)
    .max(10),
  num_outputs: z
    .number({ invalid_type_error: "Sayı giriniz" })
    .min(1, { message: "En az 1 çıktı olmalı" })
    .max(4, { message: "Maksimum 4 çıktı olabilir" }),
  aspect_ratio: z.string({ required_error: "En-boy oranı seçiniz" }),
  output_format: z.string({ required_error: "Çıktı formatı seçiniz" }),
  output_quality: z
    .number({ invalid_type_error: "Kalite sayı olmalı" })
    .min(1)
    .max(100),
  num_inference_steps: z
    .number({ invalid_type_error: "Adım sayı olmalı" })
    .min(1)
    .max(50),
});

const Configurations = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
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

  const { generateImages } = useGeneratedStore();

  const form = useForm<z.infer<typeof imageFormSchema>>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: "",
      guidance: 5,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "jpg",
      output_quality: 80,
      num_inference_steps: 28,
    },
  });

  async function onSubmit(values: z.infer<typeof imageFormSchema>) {
    await generateImages(values);
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
                Görsel Ayarları
              </h2>
              <p className="text-gray-600 text-xs">
                İstediğiniz görseli oluşturmak için ayarları yapılandırın
              </p>
            </div>

            {/* Prompt Section - En üstte ve vurgulu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel className="text-base font-semibold text-gray-800">
                        {renderLabelWithTooltip(
                          "✨ Komut (Prompt)",
                          "Modelin görsel üretmesi için kullanacağı metin komutu. Detaylı açıklamalar daha iyi sonuçlar verir."
                        )}
                      </FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // AI asistan zaten her zaman render ediliyor, sadece minimize durumunu değiştiriyoruz
                          window.dispatchEvent(
                            new CustomEvent("openAIAssistant")
                          );
                        }}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Sparkles className="w-3 h-3" />
                        AI Yardım
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm"
                        placeholder="Örnek: Güneşin battığı bir sahilde, mor ve turuncu tonlarında gökyüzü..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            {/* Basic Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
            >
              <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
                🎨 Temel Ayarlar
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="aspect_ratio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        {renderLabelWithTooltip(
                          "📐 En-Boy Oranı",
                          "Görselin en-boy oranını belirler. Sosyal medya paylaşımları için uygun oranları seçebilirsiniz."
                        )}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 rounded-lg border-gray-300 focus:border-blue-500">
                            <SelectValue placeholder="Oran seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            { value: "1:1", label: "1:1 (Kare - Instagram)" },
                            { value: "16:9", label: "16:9 (Yatay - YouTube)" },
                            { value: "9:16", label: "9:16 (Dikey - Stories)" },
                            { value: "4:3", label: "4:3 (Klasik)" },
                            { value: "3:4", label: "3:4 (Portre)" },
                            { value: "21:9", label: "21:9 (Ultra Geniş)" },
                          ].map((ratio) => (
                            <SelectItem key={ratio.value} value={ratio.value}>
                              {ratio.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="num_outputs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        {renderLabelWithTooltip(
                          "🔢 Görsel Sayısı",
                          "Aynı anda üretilecek görsel sayısı. Daha fazla seçenek için sayıyı artırabilirsiniz."
                        )}
                      </FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            min={1}
                            max={4}
                            className="h-10 w-16 rounded-lg border-gray-300 focus:border-blue-500 text-center font-semibold"
                          />
                        </FormControl>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => field.onChange(num)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                field.value === num
                                  ? "bg-blue-500 text-white shadow-md"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            {/* Advanced Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="advanced" className="border-none">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      ⚙️ Gelişmiş Seçenekler
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (İsteğe bağlı)
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <FormField
                        control={form.control}
                        name="guidance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center justify-between text-sm font-medium text-gray-700">
                              {renderLabelWithTooltip(
                                "🎯 Yönlendirme Gücü",
                                "Modelin komuta ne kadar sadık kalacağını belirler. Yüksek değerler daha sadık, düşük değerler daha yaratıcı sonuçlar verir."
                              )}
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-semibold">
                                {field.value}
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="px-3">
                                <Slider
                                  value={[field.value]}
                                  min={1}
                                  max={10}
                                  step={1}
                                  onValueChange={(value) =>
                                    field.onChange(value[0])
                                  }
                                  className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Yaratıcı</span>
                                  <span>Sadık</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="num_inference_steps"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center justify-between text-sm font-medium text-gray-700">
                              {renderLabelWithTooltip(
                                "🔄 İşlem Adımları",
                                "Modelin görseli üretmek için kaç adım kullanacağını belirler. Daha fazla adım daha kaliteli ama daha yavaş sonuç verir."
                              )}
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-semibold">
                                {field.value}
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="px-3">
                                <Slider
                                  value={[field.value]}
                                  min={10}
                                  max={50}
                                  step={2}
                                  onValueChange={(value) =>
                                    field.onChange(value[0])
                                  }
                                  className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Hızlı</span>
                                  <span>Kaliteli</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="output_quality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center justify-between text-sm font-medium text-gray-700">
                              {renderLabelWithTooltip(
                                "✨ Görsel Kalitesi",
                                "Çıktı görselinin sıkıştırma kalitesi. Yüksek değerler daha büyük dosya boyutu ama daha iyi kalite sağlar."
                              )}
                              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-xs font-semibold">
                                {field.value}%
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="px-3">
                                <Slider
                                  value={[field.value]}
                                  min={50}
                                  max={100}
                                  step={5}
                                  onValueChange={(value) =>
                                    field.onChange(value[0])
                                  }
                                  className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Küçük dosya</span>
                                  <span>Yüksek kalite</span>
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="output_format"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              {renderLabelWithTooltip(
                                "📁 Dosya Formatı",
                                "Görselin kaydedileceği dosya formatı. PNG şeffaflık destekler, JPG daha küçük dosya boyutu sağlar."
                              )}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl border-gray-300 focus:border-blue-500">
                                  <SelectValue placeholder="Format seçiniz" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[
                                  { value: "jpg", label: "JPG (Küçük dosya)" },
                                  { value: "png", label: "PNG (Şeffaflık)" },
                                  { value: "webp", label: "WebP (Modern)" },
                                ].map((format) => (
                                  <SelectItem
                                    key={format.value}
                                    value={format.value}
                                  >
                                    {format.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
              onClick={form.handleSubmit(onSubmit)}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2"
              >
                🎨 Görseli Üret
              </motion.div>
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Görsel üretmek için giriş yapmanız gerekiyor
              </p>
              <SignInDialog />
            </div>
          )}
        </motion.div>
      </TooltipProvider>

      {/* AI Assistant */}
      <AIAssistant
        toolType="image-generation"
        currentPrompt={form.watch("prompt")}
        onPromptSuggestion={(suggestion) => {
          form.setValue("prompt", suggestion);
        }}
      />
    </div>
  );
};

export default Configurations;
