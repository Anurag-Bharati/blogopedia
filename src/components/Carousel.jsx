import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard } from "swiper";
import "swiper/css";
import "swiper/css/keyboard";
import "swiper/css/a11y";
import Image from "next/image";
import Moment from "react-moment";

const Carousel = ({ recentBlogs }) => {
  const initSwitch = (e) => console.log(e.target.offsetParent.id);
  return (
    <div className="color-auto">
      <Image
        src="/assets/svgs/wave-curve-invert.svg"
        height={100}
        width={100}
        className="absolute -top-1 w-full z-10 pointer-events-none fill-auto"
        alt="..."
      />
      <Image
        src="/assets/svgs/wave-curve.svg"
        height={100}
        width={100}
        className="absolute -bottom-1  w-full z-10 pointer-events-none fill-auto"
        alt="..."
      />
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
        className=""
      >
        {recentBlogs?.map((blog, i) => (
          <SwiperSlide key={i} onClick={() => console.log(blog?.id)}>
            <CarouselItem blog={blog} initSwitch={initSwitch} />
          </SwiperSlide>
        ))}

        {recentBlogs.length < 5 && (
          <>
            <SwiperSlide>
              <CarouselItem />
            </SwiperSlide>
            <SwiperSlide>
              <CarouselItem />
            </SwiperSlide>
            <SwiperSlide>
              <CarouselItem />
            </SwiperSlide>
            <SwiperSlide>
              <CarouselItem />
            </SwiperSlide>
          </>
        )}
      </Swiper>
    </div>
  );
};

export default Carousel;

const CarouselItem = ({ blog = null, initSwitch }) => {
  return (
    <>
      <div className="absolute w-full h-full z-10 flex flex-col justify-center items-center px-4" id="1">
        <h1
          className="text-2xl bg-[#ffffff55] rounded-full px-3 py-2 max-w-full truncate mt-5 cursor-pointer min-w-[400px] text-center"
          onClick={blog ? initSwitch : null}
        >
          {blog?.title ?? "Introduction to Software Design Patterns"}
        </h1>
        <p className="truncate text-sm  bg-[#ffffff55] rounded-b-full  px-5 pb-3 inline-block cursor-pointer" onClick={blog ? initSwitch : null}>
          By {blog ? blog.author?.name : "John Doe"} • {blog ? <Moment fromNow>{blog?.createdAt?.seconds * 1000}</Moment> : "2 days ago"}
        </p>
      </div>
      <Image
        src={blog?.coverImage ?? "/assets/images/hero-background.jpg"}
        className="object-cover w-full h-full pointer-events-none -hue-rotate-15"
        height={1000}
        width={1500}
        alt="..."
      />
    </>
  );
};
