import React from "react";
import { Card, CardContent } from "@/components/ui/card";

import { Loader } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useGeneratedStore from "@/store/useGeneratedStore";
const RemovedBackgrounds = () => {
  const { restoredFace, loading } = useGeneratedStore();
  console.log("bgImages[0]", restoredFace);
  if (restoredFace === null) {
    return (
      <Card className="w-full max-w-2xl bg-muted">
        <CardContent className="flex aspect-square items-center justify-center p-6">
          <p className="text-2xl">
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              "Görsel üretmek için prompt giriniz."
            )}
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div>
      <Carousel className="w-full max-w-2xl">
        <CarouselContent>
          <CarouselItem className="">
            <div className="flex items-center justify-center rounded-lg overflow-hidden">
              <Image
                src={restoredFace!}
                alt={"generated image"}
                width={1024}
                height={1024}
                className="object-cover w-full h-full"
              />
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default RemovedBackgrounds;
