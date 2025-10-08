import HowToUse from "@/components/image-generation/HowToUse";
import Configurations from "@/components/image-generation/Configurations";
import GeneratedImages from "@/components/image-generation/GeneratedImages";
import React from "react";

const page = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Fotoğraf Oluşturucu
        </h1>
        <p className="text-gray-600 text-sm">
          Fotoğraf oluşturmak için kullanılacak ayarları seçin ve fotoğrafı
          oluşturun.
        </p>
      </div>
      <section className="flex flex-col lg:flex-row gap-6 justify-center items-start">
        <div className="w-full lg:w-1/2 max-w-2xl">
          <Configurations />
        </div>

        <main className="w-full lg:w-1/2 flex items-center justify-center">
          <GeneratedImages />
        </main>
      </section>
      <div className="mt-12">
        <HowToUse />
      </div>
    </div>
  );
};

export default page;
