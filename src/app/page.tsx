"use client";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import ImageShowcase from "../components/ImageShowcase";
import Testimonials from "@/components/testimonials";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StatsSection from "@/components/StatsSections";
const page = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        console.error(error);
      } else {
        setUser(data.user);
      }
      setLoading(false);
    }

    checkUser();
  }, [router]);
  const testimonials = [
    {
      author: {
        name: "Emma Thompson",
        handle: "@emmaai",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      },
      text: "My photos are incredible! They became perfect instantly thanks to AI.",
    },
    {
      author: {
        name: "David Park",
        handle: "@davidtech",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      text: "Great experience! I easily edited my photo and the result was much better than I expected.",
    },
    {
      author: {
        name: "Sofia Rodriguez",
        handle: "@sofiaml",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      },
      text: "I shared my images immediately, my friends were shocked! I definitely recommend it.",
    },
  ];

  return (
    <div className="bg-[#030304]">
      <div className="w-full ">
        <HeroGeometric
          title1="Give Your Photos a Magical Touch!"
          title2="Try for Free"
        />
      </div>
      <div>
        <ImageShowcase />
      </div>
      <div className="bg-[#030304]">
        <Testimonials />
      </div>
      <div>
        <StatsSection />
      </div>
    </div>
  );
};

export default page;
