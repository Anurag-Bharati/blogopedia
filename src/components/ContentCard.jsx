import { BiBlock, BiBookOpen, BiPurchaseTag, BiShare, BiTime } from "react-icons/bi";

const ContentCard = ({ varient = "blog", data }) => {
  return (
    <div className="relative flex pb-6 justify-center">
      <div className={`break-words flex-auto md:flex-[0.6] ${varient === "article" ? "order-2" : ""}`}>
        <a href="#" title="">
          <h1 className="pb-2 text-xl sm:text-2xl whitespace-wrap">{data.title}</h1>
          {varient === "blog" && (
            <>
              <p className="truncate pb-2 text-sm text-[#999] hidden sm:block">
                By {data.user.name} • {data.user.profession} • an hour ago
              </p>
              <p className="truncate pb-2 text-sm text-[#999] sm:hidden">By {data.user.name} • an hour ago</p>
            </>
          )}
          <p className={`${varient === "blog" ? "line-clamp-3" : "line-clamp-4"}`}>{data.overview}</p>
        </a>
        <div className="py-6">
          <div className="flex justify-between">
            <div className="flex-[1_0_auto] items-center flex">
              <span className="rounded-full bg-red-900 px-3 py-1 flex gap-2 items-center">
                <BiPurchaseTag />
                <p className="w-8 sm:w-auto truncate">{data.tag}</p>
              </span>
              <span className=" px-3 py-1 flex gap-2 items-center">
                <BiTime />
                <p>{data.ttr} read</p>
              </span>
            </div>
            <div className="flex-[0_0_0px] justify-end items-center flex gap-4">
              <BiBookOpen className="w-5 h-5 cursor-pointer" aria-label="add to reading list" title="add to reading list" />
              <BiBlock className="w-5 h-5 cursor-pointer" aria-label="show less" title="show less" />
              <BiShare className="w-5 h-5 cursor-pointer" aria-label="share" title="share" />
            </div>
          </div>
        </div>
      </div>
      <div className={` block flex-auto md:flex-[0.25] ${varient === "blog" ? "ml-2 sm:ml-14" : "mr-2 sm:mr-14"}`}>
        <a>
          <div className="rounded-xl bg-[#222] h-full "></div>
        </a>
      </div>
    </div>
  );
};

export default ContentCard;
