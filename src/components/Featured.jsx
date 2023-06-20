import React from "react";
import Tabbar from "./TabBar";
import ContentCard from "./ContentCard";
import articles from "@/config/data/articles.data.json";
import blogs from "@/config/data/blogs.data.json";

const Featured = () => {
  return (
    <section id="featured" className="px-4 pt-10 md:pt-0 mx-auto md:px-10 max-w-7xl lg:px-8 scroll-mt-32">
      <Tabbar />
      <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12 mt-6  md:mt-16">
        <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl tracking-tight ">Insightful Perspectives</h2>
        <p className="mb-5 font-light text-[#999] sm:text-xl ">
          Discover new perspectives, gain valuable knowledge, and find inspiration in the words of passionate writers and experts who share their
          experiences and expertise.
        </p>
      </div>
      {blogs.blogs.map((e, i) => (
        <ContentCard varient="blog" key={i} data={e} />
      ))}
    </section>
  );
};

export default Featured;
