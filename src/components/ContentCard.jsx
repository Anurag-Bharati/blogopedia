import { BiBlock, BiHeart, BiPurchaseTag, BiShare, BiTime } from "react-icons/bi";

const ContentCard = () => {
  return (
    <div className="relative flex pb-6 justify-center">
      <div className="break-words flex-auto md:flex-[0.6] ">
        <a href="#" title="">
          <h1 className="pb-2 text-xl sm:text-2xl whitespace-wrap">Lorem ipsum dolor sit amet</h1>
          <p className="truncate pb-2 text-sm text-[#999] hidden sm:block">By Anurag Bharati • Student • an hour ago</p>
          <p className="truncate pb-2 text-sm text-[#999] sm:hidden">By Anurag Bharati • an hour ago</p>
          <p className="line-clamp-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos enim blanditiis vitae cupiditate, laboriosam quae repellat voluptate
            nobis, sequi, voluptatibus praesentium excepturi rerum officiis ducimus nihil asperiores consectetur? Quia, repellendus. voluptatem
            tenetur doloremque non asperiores, modi porro cumque vitae culpa laboriosam! Ipsa enim quasi quam, nisi adipisci repellendus saepe ad
            officiis beatae, at doloremque quas accusantium. Dicta!
          </p>
        </a>
        <div className="py-6">
          <div className="flex justify-between">
            <div className="flex-[1_0_auto] items-center flex">
              <span className="rounded-full bg-red-900 px-3 py-1 flex gap-2 items-center">
                <BiPurchaseTag />
                <p className="w-8 sm:w-auto truncate">Software Engineering</p>
              </span>
              <span className=" px-3 py-1 flex gap-2 items-center">
                <BiTime />
                <p>5 min read</p>
              </span>
            </div>
            <div className="flex-[0_0_0px] justify-end items-center flex gap-4">
              <BiHeart className="w-5 h-5 cursor-pointer" aria-label="love" title="love" />
              <BiBlock className="w-5 h-5 cursor-pointer" aria-label="show less" title="show less" />
              <BiShare className="w-5 h-5 cursor-pointer" aria-label="share" title="share" />
            </div>
          </div>
        </div>
      </div>
      <div className="ml-2 sm:ml-14 block flex-auto md:flex-[0.25]">
        <a>
          <div className="rounded-xl bg-[#222] h-full "></div>
        </a>
      </div>
    </div>
  );
};

export default ContentCard;
