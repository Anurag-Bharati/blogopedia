import { BiSearch, BiSolidTagX } from "react-icons/bi";
import UserOptionsBar from "./UserOptionsBar";
import { CiFaceSmile } from "react-icons/ci";

const EditorRightAside = ({ tags = [], session, handleSave, saving, blogMeta }) => {
  return (
    <aside className="relative bg-[#000] min-w-[250px] w-[250px] md:min-w-min h-full overflow-hidden hidden sm:block">
      <div
        className={`absolute w-full h-full bg-[#000000ee] z-30 transition duration-300 ${
          saving ? "opacity-100" : "opacity-0 pointer-events-none"
        } flex flex-col justify-center items-center gap-2`}
      ></div>
      <div className="flex flex-col h-full ">
        <header className="p-4 flex gap-4">
          <form>
            <div className="relative">
              <input
                className="block w-full px-2 py-1 pl-10 pr-10 bg-[#222] rounded-xl text-[#ddd] placeholder:text-[#999] truncate"
                placeholder="Search..."
                disabled
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 ">
                <BiSearch className="text-xl text-[#999]" />
              </div>
            </div>
          </form>
          <UserOptionsBar session={session} cardClassName="!top-16 !md:top-16" />
        </header>
        <div className="px-4">
          <p className="text-white">Tags</p>
          <div className="p-2 rounded-md  h-[150px] bg-[#111] mt-2 ">
            <div className="overflow-y-scroll h-full w-full truncate override-scroll-bar-all flex gap-2  flex-wrap items-start content-start">
              {tags.length === 0 && (
                <div className=" bg-[#111] flex flex-col h-full w-full justify-center items-center rounded-md text-sm">
                  <BiSolidTagX className="w-6 h-6 text-gray-400" />
                  <span className="text-gray-400">No tags found</span>
                  <span className="text-gray-400">
                    Try adding{" "}
                    <span className="border-2 border-gray-400 rounded-full px-1 text-xs hover:bg-gray-400 hover:text-[#000] text-gray-400 cursor-pointer">
                      #new
                    </span>
                  </span>
                </div>
              )}
              {tags.map((tag, i) => (
                <a
                  href="#"
                  className="py-0.5 border-2 border-[#a3e635] rounded-full px-1 text-xs hover:bg-[#a3e635] hover:text-[#000] text-white"
                  key={i}
                >
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <p className="text-white">Metadata</p>
          <div className="p-2 rounded-md  bg-[#111] mt-2 ">
            <div className="overflow-y-scroll h-full w-full truncate override-scroll-bar-all flex  flex-col items-start content-start text-white text-sm">
              <p className="">
                Title: <span className="text-gray-200">{blogMeta?.title}</span>
              </p>
              <p className="pb-1">
                Readtime: <span className="text-gray-200">{blogMeta?.readTime} min</span>
              </p>

              <p className="">
                Filename: <span className="text-gray-200">{blogMeta?.filename}</span>
              </p>
              <p className="">
                {/* // change created to Date */}
                Created: <span className="text-gray-200">{blogMeta?.createdAt}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-4 grow justify-end mb-6 text-sm">
          <p className="text-white text-base">Actions</p>

          <button
            className="border-2 border-gray-200 hover:bg-gray-200 hover:text-black text-white  py-2 px-4 rounded"
            onClick={() => handleSave(blogMeta?.status ?? "draft", true)}
          >
            Save and Exit
          </button>
          {blogMeta?.status === "draft" ? (
            <button className="bg-[#a3e635] hover:bg-[#6b9c1c] text-white  py-2 px-4 rounded" onClick={() => handleSave("published", true)}>
              Publish Now
            </button>
          ) : (
            <button
              className="border-2 border-gray-200 hover:bg-gray-200 hover:text-black text-white  py-2 px-4 rounded"
              onClick={() => handleSave()}
            >
              Mark as Draft
            </button>
          )}
          <p className="text-xs  text-gray-400 flex gap-1 items-center justify-center">
            <CiFaceSmile className="text-gray-400 " />
            Changes are auto saved.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default EditorRightAside;
