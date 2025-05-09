import Configurations from "@/components/image-generation/Configurations";
import GeneratedImages from "@/components/image-generation/GeneratedImages";
import React from "react";

const page = () => {
  return (
    <section className="container mx-auto flex gap-6 py-6">
      {/* Sol: Ayarlar paneli */}
      <aside className="w-full max-w-sm  p-6 rounded-xl border shadow">
        <Configurations />
      </aside>

      {/* Sağ: Görsel çıktısı */}
      <main className="flex-1 p-4  rounded-xl min-h-[400px] flex items-center justify-center">
        <GeneratedImages />
      </main>
    </section>
  );
};

export default page;
