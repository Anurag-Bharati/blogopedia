import Image from "next/image";
import { useState } from "react";
import { BiBlock, BiBookOpen, BiPurchaseTag, BiShare, BiTime } from "react-icons/bi";
import Moment from "react-moment";
import ShareCard from "./ShareCard";
import ConfirmCard from "./ConfirmCard";

const ContentCard = ({ varient = "blog", data, hideBlog }) => {
  const [isModalOpen, setIsModalOpen] = useState({ share: false, hide: false });
  const toggleShareModal = () => setIsModalOpen({ hide: false, share: !isModalOpen.share });
  const toggleHideModal = () => setIsModalOpen({ share: false, hide: !isModalOpen.hide });
  return (
    <div className="relative flex pb-6 justify-center">
      <div className={`break-words  w-fit ${varient === "article" ? "order-2" : ""}`}>
        <a href="#" title="">
          <h1 className="pb-2 text-xl sm:text-2xl whitespace-wrap">{data?.title}</h1>
          {varient === "blog" && (
            <>
              <p className="truncate pb-2 text-sm text-[#999]">
                By {data?.author.name} • <Moment fromNow>{data?.createdAt?.seconds * 1000}</Moment>
              </p>
            </>
          )}
          <p className={`${varient === "blog" ? "line-clamp-3" : "line-clamp-4"}`}>{data?.tldr}</p>
        </a>
        <div className="py-6">
          <div className="flex justify-between">
            <div className="flex-[1_0_auto] items-center flex gap-1">
              {data?.tags.map((tag, i) => {
                if (i > 1) return null;
                else
                  return (
                    <span className="rounded-full bg-red-900 px-3 py-1 flex gap-2 items-center" key={i}>
                      <BiPurchaseTag />
                      <p className="w-8 sm:w-auto truncate">{tag}</p>
                    </span>
                  );
              })}
              <span className=" px-3 py-1 flex gap-2 items-center">
                <BiTime />
                <p>{data?.readTime}m read</p>
              </span>
            </div>
            <div className="relative flex-[0_0_0px] justify-end items-center flex gap-4">
              <BiBookOpen className="w-5 h-5 cursor-pointer" aria-label="add to reading list" title="add to reading list" />
              <div>
                <BiBlock className="w-5 h-5 cursor-pointer" aria-label="show less" title="show less" onClick={toggleHideModal} />
                <div
                  className={`absolute left-0 right-0 w-full translate-y-2 -translate-x-1/2 select-none transition z-10 ${
                    isModalOpen.hide ? "scale-95 opacity-100" : "scale-90 opacity-0 pointer-events-none "
                  }`}
                >
                  <ConfirmCard setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} action={() => hideBlog(data?.id)} />
                </div>
              </div>
              <div>
                <BiShare className="w-5 h-5 cursor-pointer select-none" aria-label="share" title="share" onClick={toggleShareModal} />
                <div
                  className={`absolute left-0 right-0 w-full translate-y-2 -translate-x-1/2 select-none transition z-10 ${
                    isModalOpen.share ? "scale-95 opacity-100" : "scale-90 opacity-0 pointer-events-none "
                  }`}
                >
                  <ShareCard setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} id={data?.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={` block py-5 ${varient === "blog" ? "pl-2 sm:pl-14" : "pr-2 sm:pr-14"}`}>
        <a>
          <div className="rounded-xl bg-[#222] h-full w-[200px] overflow-clip   hidden md:block">
            <Image src={data?.cover} width={300} height={300} alt="..." className="w-full h-full object-cover " />
          </div>
        </a>
      </div>
    </div>
  );
};

export default ContentCard;

export const ContentCardShimmer = () => {
  return (
    <div className="relative flex pb-6 justify-center">
      <div className="break-words  w-full">
        <a href="#" title="">
          <h1 className="pb-2 text-xl whitespace-wrap text-start  shimmer text-transparent my-1 max-w-lg rounded-md">.</h1>

          <div className="flex gap-2 max-w-xl">
            <p className="truncate pb-2 text-sm text-transparent px-8 shimmer my-1 rounded-md max-w-[200px]">.</p>
            <p className="truncate pb-2 text-sm text-transparent px-8 shimmer my-1 rounded-md max-w-[200px]">.</p>
            <p className="truncate pb-2 text-sm text-transparent px-8 shimmer my-1 rounded-md max-w-[200px]">.</p>
          </div>

          <p className="line-clamp-3 w-full shimmer text-transparent my-1 rounded-md">.</p>
          <p className="line-clamp-3 w-full shimmer text-transparent my-1 rounded-md">.</p>
        </a>
        <div className="py-5">
          <div className="flex justify-between">
            <div className="flex-[1_0_auto] items-center flex gap-1">
              <span className="rounded-full  px-8 py-1 flex gap-2 items-center h-full shimmer w-16" />
              <span className="rounded-full  px-8 py-1 flex gap-2 items-center h-full shimmer w-16" />

              <span className=" px-8 py-1 flex gap-2 items-center">
                <p className="text-transparent shimmer w-24 rounded-md">.</p>
              </span>
            </div>
            <div className="relative flex-[0_0_0px] justify-end items-center flex gap-4 ">
              <span className="w-6 h-6 rounded-md cursor-pointer shimmer" aria-label="add to reading list" title="add to reading list " />
              <span className="w-6 h-6 rounded-md cursor-pointer shimmer" aria-label="show less" title="show less" />
              <span className="w-6 h-6  rounded-md cursor-pointer select-none shimmer" aria-label="share" title="share" />
            </div>
          </div>
        </div>
      </div>
      <div className="block py-5 pl-2 sm:pl-14">
        <div className="rounded-xl bg-[#222]  overflow-clip  hidden md:block  w-[200px] h-full shimmer"></div>
      </div>
    </div>
  );
};
