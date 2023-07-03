"use client";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { BiHeading, BiHeart, BiMenu } from "react-icons/bi";

import { EditorState, convertFromRaw } from "draft-js";
// SSR is disabled for Editor component since it uses draft-js which is not compatible with SSR
const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false });
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase/firebase";
import Image from "next/image";
import Moment from "react-moment";
import { getCleanPlainText, scrollIntoView } from "@/utils/blog.utils";
import BlogopediaUtterance from "./BlogopediaUtterance";

const ReadingView = ({ id, blog }) => {
  const { data: session, status } = useSession();
  const [state, setState] = useState({ hideAside: false });

  const docRef = useMemo(() => doc(firestore, "blogs", id), [id]);
  const ttsText = useMemo(() => getCleanPlainText(blog?.content), [blog?.content]);

  const [editorState] = useState(EditorState.createWithContent(convertFromRaw(blog?.content)));
  const handlehideAside = () => setState({ ...state, hideAside: true });

  useEffect(() => {
    if (status !== "authenticated") return;
    updateDoc(docRef, { views: blog.views + 1 }).then(() => console.log("Views updated"));
  }, [docRef, blog, status]);

  return (
    <main className="w-full h-screen text-black ">
      <div className="w-full h-full flex">
        {/* Aside  */}
        <aside
          className={`absolute bg-[#000] h-full overflow-hidden  min-w-[250px] w-[20%] transition duration-500  ${
            state.hideAside ? "-translate-x-full opacity-0 ease-in scale-75" : "translate-x-0 opacity-100 ease-out "
          }`}
        >
          <TOC headers={blog?.toc} callback={handlehideAside} />
        </aside>
        {/* Main  */}
        <div
          className="relative bg-white grow flex flex-col h-full transition-all ease-in-out  duration-500 overflow-y-scroll override-scroll-bar-all "
          style={{ marginLeft: state.hideAside ? "0" : "max( 250px, 20%)" }}
        >
          <div className="fixed z-10">
            <div className="absolute top-2 left-2 ">
              <button className=" text-black" onClick={() => setState({ ...state, hideAside: !state.hideAside })}>
                <BiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="max-w-3xl mx-auto sm:px-[5%] sm:pt-[5%] min-w-[300px] sm:min-w-min  overflow-x-hidden sm:overflow-x-visible  ">
            {/* Title */}
            <header className="flex flex-col gap-10">
              <Image src={blog?.cover} alt="Cover Image" width={800} height={400} className=" max-h-64 mx-auto object-cover" />
              <h1 className="text-3xl md:text-5xl font-bold  px-[5%] sm:px-0">{blog?.title}</h1>
              <div className="flex flex-col md:flex-row  items-center gap-4 px-[5%] sm:px-0">
                <Image src={blog?.author?.image} alt="Author Image" width={64} height={64} className="rounded-full" />
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1 items-center sm:justify-center md:justify-start ">
                    <span className="text-sm text-gray-400">By</span>
                    <span className="text-md font-bold">{blog?.author?.name}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-sm text-gray-400">Published on</span>
                    <Moment format="MMM DD, YYYY" className="text-sm">
                      {blog?.updatedAt * 1000}
                    </Moment>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-center justify-between  px-[5%] sm:px-0">
                <div className="flex gap-1 items-center w-full pb-3">
                  <BlogopediaUtterance text={ttsText} />
                </div>
              </div>
            </header>
            <article className="px-[5%] sm:px-0">
              {/* Tags */}
              {/* TLDR */}
              <Editor
                editorState={editorState}
                wrapperClassName="h-full w-full  flex flex-col [&>.rdw-editor-main]:flex-1 !overflow-visible "
                editorClassName="bg-white  !overflow-visible [&>div>div>div>div]:!pb-10 "
                placeholder={"Loading data..."}
                hashtag={{
                  separator: " ",
                  trigger: "#",
                }}
                readOnly={true}
                toolbarHidden={true}
              />
            </article>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReadingView;

const TOC = ({ headers, callback = null }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-scroll override-scroll-bar-all h-full ">
        <h1 className=" p-4 pt-6 text-lg text-white">Table of Contents</h1>
        <div className="flex flex-col px-4 text-sm gap-2">
          {headers.length === 0 && (
            <div className="h-32 bg-[#111] flex flex-col justify-center items-center rounded-md">
              <BiHeading className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400">No headers found</span>
              <span className="text-gray-400">This blog lacks headers</span>
            </div>
          )}
          {headers &&
            headers.map((h, i) => {
              if (h.text.trim() === "") return;
              if (h.type === "header-one")
                return (
                  <a onClick={() => scrollIntoView(h.key, callback)} className="line-clamp-2  text-gray-400 hover:text-white cursor-pointer" key={i}>
                    {h.text}
                  </a>
                );
              else if (h.type === "header-two")
                return (
                  <a
                    onClick={() => scrollIntoView(h.key, callback)}
                    className="line-clamp-1 truncate  text-gray-400 hover:text-white ml-2 cursor-pointer"
                    key={i}
                  >
                    {h.text}
                  </a>
                );
              else if (h.type === "header-three")
                return (
                  <a
                    onClick={() => scrollIntoView(h.key, callback)}
                    className="line-clamp-1 truncate  text-gray-400 hover:text-white ml-4 cursor-pointer"
                    key={i}
                  >
                    {h.text}
                  </a>
                );
            })}
        </div>
      </div>
    </div>
  );
};
