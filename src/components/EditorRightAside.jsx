import { BiSearch, BiSolidPurchaseTag } from "react-icons/bi";
import UserOptionsBar from "./UserOptionsBar";

const EditorRightAside = ({ tags = [], session, handleSave, saving }) => {
  return (
    <aside className="relative bg-[#000] w-[250px] h-full overflow-hidden">
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
        <div className="p-4">
          <p className="text-white">Tags</p>
          <div className="p-4 rounded-md  h-[200px] bg-[#111] mt-2 ">
            <div className="overflow-y-scroll h-full w-full truncate override-scroll-bar-all flex gap-2  flex-wrap items-start content-start">
              {tags.length === 0 && (
                <div className=" bg-[#111] flex flex-col h-full w-full justify-center items-center rounded-md text-sm">
                  <BiSolidPurchaseTag className="w-6 h-6 text-gray-400" />
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
                  className="py-1 border-2 border-[#a3e635] rounded-full px-2 text-sm hover:bg-[#a3e635] hover:text-[#000] text-white"
                  key={i}
                >
                  #{tag}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-4 grow justify-end mb-6 text-sm">
          <button className="border-2 border-gray-200 hover:bg-gray-200 hover:text-black text-white  py-2 px-4 rounded" onClick={() => handleSave()}>
            Save as Draft
          </button>
          <button className="bg-[#a3e635] hover:bg-[#6b9c1c] text-white  py-2 px-4 rounded" onClick={() => handleSave("publish")}>
            Publish Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default EditorRightAside;
