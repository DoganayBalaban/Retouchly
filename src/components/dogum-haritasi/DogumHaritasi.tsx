"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import useGeneratedStore from "@/store/useGeneratedStore";

const DogumHaritasi = () => {
  const { dogumHaritasiText, loading } = useGeneratedStore();

  if (dogumHaritasiText === null) {
    return (
      <Card className="bg-[#121212] m-5">
        <CardContent className="flex aspect-square items-center justify-center p-6">
          <div className="text-2xl text-white p-6 flex">
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              "Henüz bir görüntü yüklemediniz"
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Metni böl
  const sections = dogumHaritasiText
    .split(
      /(?=\d+\.)|(?=Ascendant|Sun Sign|Moon Sign|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Chiron)/g
    )
    .filter((s) => s.trim() !== "");

  return (
    <div className="space-y-4 p-4">
      {sections.map((section, index) => (
        <Card key={index} className="bg-[#1a1a1a] text-white">
          <CardContent>
            <p>{section.trim()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DogumHaritasi;
