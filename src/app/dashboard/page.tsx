"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/background-remove/ImageUploader";
import { Loader } from "lucide-react";
import { getUserGeneratedImages } from "../actions/userImages/getUserGeneratedImages";
import { set } from "zod";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const data = await getUserGeneratedImages(user.id);
      setData(data);
      console.log("Fetched images:", data);
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h2>Üretilmiş Görsellerin</h2>
      <div className="grid grid-cols-3 gap-4">
        {data?.length === 0 && (
          <div className="col-span-3">
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
              <p className="absolute bottom-2 left-2 bg-white text-black p-2 rounded">
                {item.prompt}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
