"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Tüm gerekli modülleri doğru şekilde import edin
import { Autoplay } from "swiper/modules";
// CSS dosyalarını doğru sırayla import edin
import "swiper/css";
import "swiper/css/autoplay";
import Image from "next/image";
const ImageShowcase = () => {
  return (
    <div className="container mx-auto px-4 py-16 bg-[#030304]">
      <div className="overflow-hidden rounded-lg ">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
          autoplay={{
            delay: 300,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          allowTouchMove={true}
          speed={2000}
        >
          <SwiperSlide>
            <Image
              src={"/showcase1.png"}
              alt="foto1"
              width={350}
              height={350}
              className="rounded-lg  object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/showcase2.png"}
              alt="foto2"
              width={350}
              height={350}
              className="rounded-lg  object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/showcase3.png"}
              alt="foto3"
              width={350}
              height={350}
              className="rounded-lg  object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <Image
              src={"/showcase4.png"}
              alt="foto4"
              width={350}
              height={350}
              className="rounded-lg  object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default ImageShowcase;
