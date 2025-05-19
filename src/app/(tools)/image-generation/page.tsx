import Configurations from "@/components/image-generation/Configurations";
import GeneratedImages from "@/components/image-generation/GeneratedImages";
import React from "react";

const page = () => {
  return (
    <section className="flex flex-col mt-3 md:flex-row justify-center items-center h-screen ">
      {/* Sol: Ayarlar paneli */}
      <div className="w-full max-w-sm p-3 rounded-xl flex items-center justify-center shadow">
        <Configurations />
      </div>

      {/* Sağ: Görsel çıktısı */}
      <main className="rounded-xl  flex items-center justify-center">
        <GeneratedImages />
      </main>
    </section>
  );
};

export default page;
