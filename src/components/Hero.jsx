import Carousel from "./Carousel";

const Hero = ({ recentBlogs }) => {
  return (
    <section className="relative isolate text-white overflow-hidden">
      <Carousel recentBlogs={recentBlogs} />
    </section>
  );
};

export default Hero;
