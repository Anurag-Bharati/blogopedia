import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const EditorTopNav = ({ discardDocument }) => {
  const [confirmDiscardDialog, setConfirmDiscardDialog] = useState(false);

  return (
    <nav className=" bg-white border-b">
      {/* Popup model */}
      <div
        className={`absolute h-full w-full bg-[#111111dd] z-50 grid place-items-center  transition duration-300 ${
          confirmDiscardDialog ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="rounded-xl bg-white ">
          <h1 className="border-b p-2">Are you sure?</h1>
          <p className="text-sm pt-2 px-2"> Once discarded, it cannot be recovered!</p>
          <div className="flex justify-evenly items-center p-2">
            <div
              className="m-2 px-1 py-0.5 grow cursor-pointer bg-red-400 rounded-full hover:bg-red-500 hover:text-white text-center"
              onClick={discardDocument}
            >
              Discard
            </div>
            <div className="m-2 px-1 py-0.5 grow cursor-pointer rounded-full  text-center  " onClick={() => setConfirmDiscardDialog(false)}>
              Cancel
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center ">
        <div className="flex justify-start items-center text-sm">
          <Image src="/assets/svgs/logo.svg" width={64} height={64} alt="Logo" className="h-10 py-2 invert" />
          <div className="px-3 py-2 cursor-pointer hover:bg-[#ffffff99] text-sm flex  gap-2">
            <Link href="/" className="text-center   focus:bg-white  hover:underline transition duration-300">
              Home
            </Link>
            &gt;<span className="pointer-events-none text-cyan-400">Editor</span>
          </div>
        </div>
        <div className="flex justify-end items-center text-sm">
          <div
            className="m-2 px-2 py-0.5  cursor-pointer bg-red-400 rounded-full hover:bg-red-500 hover:text-white"
            onClick={() => setConfirmDiscardDialog(true)}
          >
            Discard
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EditorTopNav;
