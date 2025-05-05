"use client";

import React from "react";
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

const formSchema = z.object({
  model: z.string({ required_error: "Model seçiniz" }),
  prompt: z.string({ required_error: "Prompt giriniz" }),
  guidance: z
    .number({ invalid_type_error: "Guidance Scale sayı olmalı" })
    .min(1)
    .max(100),
  num_outputs: z
    .number({ invalid_type_error: "Sayı giriniz" })
    .min(1, { message: "En az 1 çıktı olmalı" })
    .max(4, { message: "Maksimum 4 çıktı olabilir" }),
  aspect_ratio: z.string({ required_error: "Aspect Ratio seçiniz" }),
  output_format: z.string({ required_error: "Output Format seçiniz" }),
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "black-forest-labs/flux-dev",
      prompt: "",
      guidance: 50,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: "jpg",
      output_quality: 80,
      num_inference_steps: 28,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <fieldset className="grid gap-6 p-4 bg-background rounded-lg border">
            <legend className="text-2xl font-bold">Ayarlar</legend>

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {renderLabelWithTooltip(
                      "Model",
                      "Kullanılacak yapay zeka modelini seçin."
                    )}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Model seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="black-forest-labs/flux-dev">
                        Flux Dev
                      </SelectItem>
                      <SelectItem value="black-forest-labs/flux-schnell">
                        Flux Schnell
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="aspect_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {renderLabelWithTooltip(
                        "Aspect Ratio",
                        "Görselin en-boy oranını belirler."
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                        "Number of Outputs",
                        "Üretilmesini istediğiniz görsel sayısı."
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guidance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      {renderLabelWithTooltip(
                        "Guidance",
                        "Modelin prompt'a ne kadar sadık kalacağını belirler."
                      )}
                      <span>{field.value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => field.onChange(value[0])}
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
                        "Inference Steps",
                        "Modelin çıktıyı üretmek için kaç adım kullanacağını belirler."
                      )}
                      <span>{field.value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(value) => field.onChange(value[0])}
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
                        "Output Quality",
                        "Görselin kalite seviyesini belirler (1-100)."
                      )}
                      <span>{field.value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        min={50}
                        max={100}
                        step={1}
                        onValueChange={(value) => field.onChange(value[0])}
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
                        "Output Format",
                        "Çıktı görselinin dosya formatı."
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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

              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      {renderLabelWithTooltip(
                        "Prompt",
                        "Modelin görsel üretmesi için kullanacağı metin."
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

            <Button type="submit">Generate</Button>
          </fieldset>
        </form>
      </Form>
    </TooltipProvider>
  );
};

export default Configurations;
