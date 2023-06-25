import { BiSearch, BiX } from "react-icons/bi";
import UserOptionsBar from "./UserOptionsBar";

const EditorRightAside = ({ session }) => {
  return (
    <aside className="bg-[#111] w-[250px] h-full overflow-hidden">
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
      </div>
    </aside>
  );
};

export default EditorRightAside;
