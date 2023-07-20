"use client";
import { useEffect, useState } from "react";
import ContentCard, { ContentCardShimmer } from "./ContentCard";
import Image from "next/image";
import ReactPaginate from "react-paginate";

const itemsPerPage = 6;

const Featured = ({ blogs }) => {
  const [featuredBlogs, setFeaturedBlogs] = useState(blogs?.reverse() ?? []);
  const [urlLink, setUrlLink] = useState("");
  useEffect(() => {
    setFeaturedBlogs(blogs?.reverse() ?? []);
  }, [blogs]);

  useEffect(() => {
    setUrlLink(window.location.origin);
  }, []);

  // Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = featuredBlogs.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(featuredBlogs.length / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % featuredBlogs.length;
    setItemOffset(newOffset);
  };

  const hideBlog = (id) => setFeaturedBlogs(featuredBlogs.filter((blog) => blog.id !== id));

  return (
    <section id="featured" className="relative isolate px-4 pt-10 md:pt-0 mx-auto md:px-10 max-w-7xl lg:px-8 scroll-mt-32">
      <div className="mx-auto max-w-5xl text-start mb-8 lg:mb-12 mt-0">
        <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl tracking-tight ">Insightful Perspectives</h2>
        <p className="mb-5 font-light text-[#999] sm:text-xl ">
          Discover new perspectives, gain valuable knowledge, and find inspiration in the words of passionate writers and experts who share their
          experiences and expertise.
        </p>
      </div>
      <div className="absolute left-0 top-0 blur-3xl z-[-1] opacity-20 pointer-events-none overflow-hidden">
        <Image src="/assets/svgs/blob.svg" width={600} height={600} alt="..." />
      </div>
      <div className="flex flex-col gap-1 max-w-5xl mx-auto">
        {featuredBlogs?.length === 0 && (
          <>
            <ContentCardShimmer />
          </>
        )}
        <Blogs currentItems={currentItems} hideBlog={hideBlog} urlLink={urlLink} />
        <div className="mb-4">
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={1}
            pageCount={pageCount}
            previousLabel="< prev"
            renderOnZeroPageCount={null}
            marginPagesDisplayed={1}
          />
        </div>
      </div>
      {featuredBlogs?.length === 0 && <p className="text-center">No blogs found</p>}
    </section>
  );
};

function Blogs({ currentItems, hideBlog, urlLink }) {
  return (
    <>
      {currentItems.map((blog, i) => (
        <ContentCard varitent="blog" data={blog} key={i} hideBlog={hideBlog} urlLink={urlLink} />
      ))}
    </>
  );
}

export default Featured;
