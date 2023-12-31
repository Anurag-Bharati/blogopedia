import { useRouter } from "next/navigation";
import React from "react";
import { BiCheckCircle, BiDetail, BiDotsVerticalRounded, BiHeart, BiTime } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import Moment from "react-moment";

const BlogFileCard = ({ blog, i }) => {
  const router = useRouter();
  const handleSwitch = () => router.push(`/editor/${blog.id}`);
  return (
    <div
      className="w-full flex justify-between p-4 rounded-xl cursor-pointer hover:bg-[#ffffff22] bg-transparent transition duration-300 ease-in-out"
      onClick={handleSwitch}
    >
      <div className="w-full flex flex-col gap-2">
        <div className="flex gap-2 content-center items-center w-full justify-between">
          <h2 className="text-xl capitalize truncate whitespace-nowrap">
            {i + 1}. {blog.data.fileName}
          </h2>
          <div className="flex gap-2">
            <span className="py-0.5  rounded-full px-1 text-md text-gray-400 font-light  items-center gap-1 hidden sm:flex ">
              <BiTime className="text-md text-gray-400" />
              <Moment fromNow className="truncate sm:max-w-sm">
                {blog.data.updatedAt.seconds * 1000}
              </Moment>
            </span>
            <span
              className={`py-0.5  rounded-full px-1 text-md  font-light flex items-center gap-1 ${
                blog.data.status === "published" ? "text-[#a3e635]" : "text-cyan-400"
              }`}
            >
              {blog.data.status === "published" ? <BiCheckCircle className="text-md" /> : <BiDetail className="text-md" />}
              <span className="hidden sm:inline">{blog.data.status}</span>
            </span>
          </div>
        </div>
        <p className="text-md truncate max-w-2xl">{blog.data.tldr ?? <span className="text-gray-400">No text content to display</span>}</p>
        <div className="flex  py-1 justify-between">
          {blog.data.tags.length === 0 && <span className="py-0.5  px-1 text-xs   text-gray-400 rounded-full w-12 whitespace-nowrap">no tags</span>}
          <div className="flex gap-2">
            {blog.data.tags.map((tag, i) => (
              <span className="py-0.5 border-2 border-[#a3e635] rounded-full px-1 text-xs hover:bg-[#a3e635] hover:text-[#000] text-white" key={i}>
                {tag}
              </span>
            ))}
          </div>
          <div className="flex">
            <span className="text-base text-gray-400 ml-2 rounded-full px-1 flex items-center gap-1">
              <AiOutlineEye />
              {blog.data.views}
            </span>
            <span className="text-base text-gray-400 ml-2 rounded-full px-1 flex items-center gap-1">
              <BiHeart />
              {blog.data.likes}
            </span>
          </div>
        </div>
      </div>
      <div>
        <BiDotsVerticalRounded className="text-2xl " />
      </div>
    </div>
  );
};

export default BlogFileCard;

export const DummyBlogCard = () => {
  return (
    <div
      className="w-full flex justify-between p-4 rounded-xl cursor-pointer hover:bg-[#ffffff22] bg-transparent transition duration-300 ease-in-out"
      title="loading files"
    >
      <div className="w-full flex flex-col gap-2">
        <div className="flex gap-2 content-center items-center w-full justify-between">
          <span className="text-transparent shimmer w-1/3 text-xl rounded-md">.</span>
          <div className="flex gap-2 w-1/2 justify-between ">
            <span className="py-0.5  rounded-md px-1 text-md text-transparent font-light w-1/2 shimmer">.</span>
            <span className="py-0.5  rounded-md  px-1 text-md text-transparent font-light w-1/2 shimmer">.</span>
          </div>
        </div>
        <p className="text-md rounded-md shimmer text-transparent">.</p>
        <div className="flex gap-2 py-1">
          <span className="py-0.5  px-1 text-xs   text-transparent shimmer rounded-md w-12">.</span>
          <span className="py-0.5  px-1 text-xs   text-transparent shimmer rounded-md w-12">.</span>
          <span className="py-0.5  px-1 text-xs   text-transparent shimmer rounded-md w-12">.</span>
          <span className="py-0.5  px-1 text-xs   text-transparent shimmer rounded-md w-12">.</span>
        </div>
      </div>
      <div>
        <span className="text-xl text-transparent shimmer ml-2 rounded-md px-1">.</span>
      </div>
    </div>
  );
};
