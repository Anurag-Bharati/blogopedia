import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard } from "swiper";
import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/a11y";
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
        speed={3000}
        slidesPerView={1}
        centeredSlides={true}
        modules={[Autoplay, A11y, Keyboard]}
        keyboard={{ enabled: true, onlyInViewport: false }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        a11y={{
          prevSlideMessage: "Previous slide",
          nextSlideMessage: "Next slide",
        }}
        spaceBetween={30}
        loop={true}
        breakpoints={{ 684: { slidesPerView: 2 } }}
      >
        <SwiperSlide>
          <Image
            src="/assets/images/hero-background.jpg"
            className="object-cover w-full h-full pointer-events-none -hue-rotate-15"
            height={1000}
            width={1500}
            alt="..."
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/assets/images/hero-background.jpg"
            className="object-cover w-full h-full pointer-events-none hue-rotate-0"
            height={1000}
            width={1500}
            alt="..."
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/assets/images/hero-background.jpg"
            className="object-cover w-full h-full pointer-events-none hue-rotate-15"
            height={1000}
            width={1500}
            alt="..."
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/assets/images/hero-background.jpg"
            className="object-cover w-full h-full pointer-events-none hue-rotate-30"
            height={1000}
            width={1500}
            alt="..."
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            src="/assets/images/hero-background.jpg"
            className="object-cover w-full h-full pointer-events-none hue-rotate-60"
            height={1000}
            width={1500}
            alt="..."
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousel;
