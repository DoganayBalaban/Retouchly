import HowToUse from "@/components/image-generation/HowToUse";
import Configurations from "@/components/image-generation/Configurations";
import GeneratedImages from "@/components/image-generation/GeneratedImages";
import React from "react";

const page = () => {
  return (
    <div className="">
      <section className="flex flex-col mt-3 md:flex-row justify-center items-center">
        <div className="w-full max-w-sm p-3 rounded-xl flex items-center justify-center shadow">
          <Configurations />
        </div>

        <main className="rounded-xl  flex items-center justify-center">
          <GeneratedImages />
        </main>
      </section>
      <div>
        <HowToUse />
      </div>
    </div>
  );
};

export default page;
