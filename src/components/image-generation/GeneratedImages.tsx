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
const images = [
  {
    src: "/showcase1.png",
    alt: "foto",
  },
  {
    src: "/showcase2.png",
    alt: "foto",
  },
  {
    src: "/showcase3.png",
    alt: "foto",
  },
  {
    src: "/showcase4.png",
    alt: "foto",
  },
];
const GeneratedImages = () => {
  if (images.length === 0) {
    return (
      <Card className="w-full max-w-2xl bg-muted">
        <CardContent className="flex aspect-square items-center justify-center p-6">
          <p className="text-2xl">Henüz oluşturulmuş bir görsel yok.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="flex items-center justify-center rounded-lg overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                width={512}
                height={512}
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
