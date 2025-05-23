"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import useGeneratedStore from "@/store/useGeneratedStore";
import { Loader } from "lucide-react";

const GeneratedImages = () => {
  const { images, loading } = useGeneratedStore();
  if (images.length === 0) {
    return (
      <Card className="w-full max-w-2xl bg-[#121212] m-5 ">
        <CardContent className="flex aspect-square items-center justify-center p-6 ">
          <div className="text-2xl text-white p-6 flex-1">
            {loading ? (
              <Loader className="animate-spin text-white w-10 h-10" />
            ) : (
              "Görsel üretmek için prompt giriniz."
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="">
            <div className="flex items-center justify-center rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={"generated image"}
                width={1024}
                height={1024}
                className="object-cover w-full h-full"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default GeneratedImages;
