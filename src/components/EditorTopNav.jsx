import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BiLoader } from "react-icons/bi";
import { CiCircleAlert, CiCircleCheck, CiCircleInfo, CiSaveDown1, CiStickyNote } from "react-icons/ci";

const EditorTopNav = ({ discardDocument, blogMeta }) => {
  const [confirmDiscardDialog, setConfirmDiscardDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDiscard = async () => {
    setLoading(true);
    await discardDocument();
    setLoading(false);
  };
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
              className="m-2 px-1 py-0.5 grow cursor-pointer bg-red-400 rounded-full hover:bg-red-500 hover:text-white text-center flex gap-1 items-center justify-center"
              onClick={handleDiscard}
            >
              <BiLoader className={`animate-spin ${loading ? "inline-block" : "hidden"}`} />
              {loading ? "Discarding..." : "Discard"}
            </div>
            <div className="m-2 px-1 py-0.5 grow cursor-pointer rounded-full  text-center  " onClick={() => setConfirmDiscardDialog(false)}>
              Cancel
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center ">
        <div className="flex justify-start items-center text-sm">
          <Image src="/assets/svgs/logo.svg" width={64} height={64} alt="Logo" className="hidden sm:block h-10 py-2 invert" />
          <div className="px-3 py-2 cursor-pointer hover:bg-[#ffffff99] text-sm flex  gap-2">
            <Link href="/" className="text-center   focus:bg-white  hover:underline transition duration-300">
              Home
            </Link>
            &gt;<span className="pointer-events-none text-cyan-400 hidden sm:inline">Editor</span>
          </div>
        </div>
        <div className="flex justify-end items-center text-sm gap-2">
          {/* blog status indicator */}
          {blogMeta?.status === "published" && (
            <span
              className="flex gap-1 justify-center items-center  px-1 py-px border border-green-400 rounded-full text-xs cursor-pointer "
              title={`Status: ${blogMeta?.status}`}
            >
              <CiCircleCheck className="w-3 h-3 text-green-400" />
              <p className="text-green-400 uppercase hidden sm:block">{blogMeta?.status}</p>
              <p className="text-green-400 uppercase block sm:hidden">{blogMeta?.status?.charAt(0)}</p>
            </span>
          )}
          {blogMeta?.status === "draft" && (
            <span
              className="flex gap-1 justify-center items-center  px-1 py-px border border-cyan-400 rounded-full text-xs cursor-pointer "
              title={`Status: ${blogMeta?.status}`}
            >
              <CiStickyNote className="w-3 h-3 text-cyan-400" />
              <p className="text-cyan-400 uppercase hidden sm:block">{blogMeta?.status}</p>
              <p className="text-cyan-400 uppercase block sm:hidden">{blogMeta?.status?.charAt(0)}</p>
            </span>
          )}
          {blogMeta?.status === "unsaved" && (
            <span
              className="flex gap-1 justify-center items-center  px-1 py-px border  rounded-full text-xs cursor-pointer "
              title={`Status: ${blogMeta?.status}`}
            >
              <CiCircleInfo className="w-3 h-3 text-black" />
              <p className=" uppercase hidden sm:block">{blogMeta?.status}</p>
              <p className=" uppercase block sm:hidden">{blogMeta?.status?.charAt(0)}</p>
            </span>
          )}
          <span
            className={`flex gap-1 justify-center items-center  px-1 py-px border  rounded-full text-xs cursor-pointer whitespace-nowrap  ${
              blogMeta?.autosaving === "saving"
                ? " border-amber-400 text-amber-400"
                : blogMeta?.autosaving === "error"
                ? "animate-pulse border-red-400 text-red-400"
                : blogMeta?.autosaving === "saved" && " border-green-400 text-green-400"
            }`}
            title={` ${
              blogMeta?.autosaving === "error" ? "Autosave failed, try saving manually." : `Doc Saved ${blogMeta?.lastSaved ?? blogMeta?.updatedAt}`
            } `}
          >
            {blogMeta?.autosaving === "error" && <CiCircleAlert className="w-3 h-3 " />}
            {blogMeta?.autosaving === "saving" && <CiSaveDown1 className="w-3 h-3 animate animate-spin" />}
            {blogMeta?.autosaving === "saved" && <CiCircleCheck className="w-3 h-3 " />}
            {blogMeta?.autosaving === "saving" || blogMeta?.autosaving === "error" ? (
              <p className="uppercase">{blogMeta?.autosaving}</p>
            ) : (
              <p className="uppercase">{blogMeta?.lastSaved ?? blogMeta?.updatedAt}</p>
            )}
          </span>
          <div
            className="m-2 px-2 py-0.5  cursor-pointer bg-red-400 rounded-full hover:bg-red-500 hover:text-white"
            onClick={() => setConfirmDiscardDialog(true)}
          >
            {blogMeta.status === "published" ? "Delete" : "Discard"}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default EditorTopNav;
