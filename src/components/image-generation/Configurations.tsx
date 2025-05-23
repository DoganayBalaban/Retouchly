"use client";

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
import { Info } from "lucide-react";
import useGeneratedStore from "@/store/useGeneratedStore";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import SignUpDialog from "../SignUpDialog";
import SignInDialog from "../SignInDialog";

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
    <div className="flex w-full flex-col p-4 sm:p-8 bg-[#FFFFFF] rounded-2xl justify-center items-center">
      <TooltipProvider>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <fieldset className="gap-3 w-full p-4 bg-background rounded-lg border">
              <legend className="text-2xl font-bold">Görsel Ayarları</legend>

              <div
                className="
              flex flex-col space-y-4"
              >
                <FormField
                  control={form.control}
                  name="aspect_ratio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {renderLabelWithTooltip(
                          "En-Boy Oranı",
                          "Görselin en-boy oranını belirler."
                        )}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seçiniz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "1:1",
                            "16:9",
                            "9:16",
                            "21:9",
                            "9:21",
                            "4:5",
                            "5:4",
                            "4:3",
                            "3:4",
                            "2:3",
                          ].map((ratio) => (
                            <SelectItem key={ratio} value={ratio}>
                              {ratio}
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
                      <FormLabel>
                        {renderLabelWithTooltip(
                          "Görsel Sayısı",
                          "Üretilmesini istediğiniz görsel sayısı."
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          min={1}
                          max={4}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Gelişmiş Seçenekler</AccordionTrigger>
                    <AccordionContent className="flex flex-col space-y-4">
                      <FormField
                        control={form.control}
                        name="guidance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center justify-between">
                              {renderLabelWithTooltip(
                                "Yönlendirme",
                                "Modelin komuta ne kadar sadık kalacağını belirler."
                              )}
                              <span>{field.value}</span>
                            </FormLabel>
                            <FormControl>
                              <Slider
                                value={[field.value]}
                                min={1}
                                max={10}
                                step={1}
                                onValueChange={(value) =>
                                  field.onChange(value[0])
                                }
                              />
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
                            <FormLabel className="flex items-center justify-between">
                              {renderLabelWithTooltip(
                                "Üretim Adımı Sayısı",
                                "Modelin görseli üretmek için kaç adım kullanacağını belirler."
                              )}
                              <span>{field.value}</span>
                            </FormLabel>
                            <FormControl>
                              <Slider
                                value={[field.value]}
                                min={1}
                                max={50}
                                step={1}
                                onValueChange={(value) =>
                                  field.onChange(value[0])
                                }
                              />
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
                            <FormLabel className="flex items-center justify-between">
                              {renderLabelWithTooltip(
                                "Görsel Kalitesi",
                                "Çıktı görselinin kalite düzeyi (1–100)."
                              )}
                              <span>{field.value}</span>
                            </FormLabel>
                            <FormControl>
                              <Slider
                                value={[field.value]}
                                min={50}
                                max={100}
                                step={1}
                                onValueChange={(value) =>
                                  field.onChange(value[0])
                                }
                              />
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
                            <FormLabel>
                              {renderLabelWithTooltip(
                                "Çıktı Formatı",
                                "Görselin dosya formatını seçin."
                              )}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Format seçiniz" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["jpg", "png", "webp"].map((format) => (
                                  <SelectItem key={format} value={format}>
                                    {format}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-1 sm:col-span-2">
                      <FormLabel>
                        {renderLabelWithTooltip(
                          "Komut (Prompt)",
                          "Modelin görsel üretmesi için kullanacağı metin komutu."
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={6} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>
          </form>
        </Form>

        <div className="mt-4">
          {user ? (
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              className="w-full rounded font-bold p-2 transition duration-200"
            >
              Görseli Üret
            </Button>
          ) : (
            <SignInDialog />
          )}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Configurations;
