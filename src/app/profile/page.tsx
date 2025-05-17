"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/background-remove/ImageUploader";
import { Loader } from "lucide-react";
import { getUserGeneratedImages } from "../actions/userImages/getUserGeneratedImages";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      setLoading(true);

      const data = await getUserGeneratedImages(user.id);
      setData(data);
      setLoading(false);
    };

    fetchImages();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-12 h-12 text-white" />
      </div>
    );
  }

  return (
    <div className="bg-[#000000]">
      <h2 className="text-3xl font-light text-white p-6 m-6">
        Üretilmiş Görsellerin
      </h2>
      <div className="grid grid-cols-3 gap-4 rounded-2xl p-6 m-6 border border-white">
        {data?.length === 0 && (
          <div className="col-span-3 flex justify-center items-center">
            <p>Henüz üretilmiş görsel yok.</p>
          </div>
        )}
        {data?.length > 0 &&
          data.map((item: any) => (
            <div key={item.id} className="relative">
              <img
                src={item.image_url}
                alt="Generated"
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <p className="absolute bottom-2 left-2 bg-white text-black p-2 rounded text-xl font-extralight">
                {item.prompt}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
