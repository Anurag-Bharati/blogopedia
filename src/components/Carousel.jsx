import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper";
import "swiper/css";
import Image from "next/image";

const Carousel = () => {
  return (
    <div className="">
      <Image
        src="/assets/svgs/wave-curve-invert.svg"
        height={100}
        width={100}
        className="absolute -top-1 w-full z-10 pointer-events-none"
        alt="..."
      />
      <Image src="/assets/svgs/wave-curve.svg" height={100} width={100} className="absolute -bottom-1  w-full z-10 pointer-events-none" alt="..." />
      <Swiper
        slidesPerView={1}
        centeredSlides={true}
        modules={[Autoplay, A11y]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        spaceBetween={30}
        loop={true}
        breakpoints={{ 684: { slidesPerView: 2 } }}
      >
        <SwiperSlide>
          <Image
            src="/assets/images/hero-background.jpg"
            className="object-cover w-full h-full pointer-events-none"
            height={2000}
            width={3000}
            alt="..."
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/assets/images/hero-background.jpg"
            className="object-cover w-full h-full pointer-events-none"
            height={2000}
            width={3000}
            alt="..."
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/assets/images/hero-background.jpg"
            className="object-cover w-full h-full pointer-events-none"
            height={2000}
            width={3000}
            alt="..."
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/assets/images/hero-background.jpg"
            className="object-cover w-full h-full pointer-events-none"
            height={2000}
            width={3000}
            alt="..."
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/assets/images/hero-background.jpg"
            className="object-cover w-full h-full pointer-events-none"
            height={2000}
            width={3000}
            alt="..."
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;
