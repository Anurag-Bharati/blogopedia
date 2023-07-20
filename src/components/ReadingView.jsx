"use client";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { BiBookOpen, BiHeading, BiHeart, BiMenu, BiShare, BiSolidHeart, BiUser } from "react-icons/bi";

import { EditorState, convertFromRaw } from "draft-js";
// SSR is disabled for Editor component since it uses draft-js which is not compatible with SSR
const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false });
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/config/firebase/firebase";
import Image from "next/image";
import Moment from "react-moment";
import { getCleanPlainText, scrollIntoView } from "@/utils/blog.utils";
import BlogopediaUtterance from "./BlogopediaUtterance";
import Link from "next/link";
import ShareCard from "./ShareCard";
import UserOptionsBar from "./UserOptionsBar";

const ReadingView = ({ id, blog }) => {
  const { data: session, status } = useSession();
  const [state, setState] = useState({ hideAside: true });
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCounter, setLikeCounter] = useState(blog?.likes);
  const [isModalOpen, setIsModalOpen] = useState({ share: false });
  const toggleShareModal = () => setIsModalOpen({ hide: false, share: !isModalOpen.share });
  const [urlLink, setUrlLink] = useState("");

  const docRef = useMemo(() => doc(firestore, "blogs", id), [id]);
  const ttsText = useMemo(() => getCleanPlainText(blog?.content), [blog?.content]);

  const [editorState] = useState(EditorState.createWithContent(convertFromRaw(blog?.content)));
  const handlehideAside = () => setState({ ...state, hideAside: true });

  const handleLoveReact = () => {
    if (status !== "authenticated") return;
    if (hasLiked) {
      setHasLiked(false);
      setLikeCounter(likeCounter - 1);
      updateDoc(docRef, { likes: blog.likes - 1, likedBy: arrayRemove(session.user.email) }).then(() => console.log("Like removed"));
    } else {
      setHasLiked(true);
      setLikeCounter(likeCounter + 1);
      updateDoc(docRef, { likes: blog.likes + 1, likedBy: arrayUnion(session.user.email) }).then(() => console.log("Like added"));
    }
  };

  useEffect(() => {
    if (status !== "authenticated" || !session) return;
    updateDoc(docRef, { views: blog.views + 1 }).then(() => console.log("Views updated"));
    if (blog?.likedBy?.includes(session.user.email)) setHasLiked(true);
  }, [docRef, blog, status, session]);

  useEffect(() => {
    if (!window) return;
    setUrlLink(`${window.location.origin}/view?id=${id}`);
  }, [id]);

  return (
    <main className="w-full h-screen text-black ">
      <div className="w-full h-full flex">
        {/* Aside  */}
        <aside
          className={`absolute bg-[#000] h-full overflow-hidden  min-w-[250px] w-[20%] transition duration-500  ${
            state.hideAside ? "-translate-x-full opacity-0 ease-in scale-90" : "translate-x-0 opacity-100 ease-out "
          }`}
        >
          <TOC headers={blog?.toc} callback={handlehideAside} />
        </aside>
        {/* Main  */}
        <div
          className="relative bg-white grow flex flex-col h-full transition-all ease-in-out  duration-500 overflow-y-scroll override-scroll-bar-all "
          style={{ marginLeft: state.hideAside ? "0" : "max( 250px, 20%)" }}
        >
          <div className=" z-10 w-full h-fit">
            <div className="fixed top-2 ml-2 p-2 flex gap-2 items-center">
              <button className=" text-black" onClick={() => setState({ ...state, hideAside: !state.hideAside })}>
                <BiMenu className="w-6 h-6" />
              </button>
              <Link href="/" className="text-sm text-black">
                Home
              </Link>
              &gt;<span className="text-sm text-gray-400">Blog</span>
            </div>
            <div className="fixed top-4 right-4 ">
              {status === "authenticated" && <UserOptionsBar session={session} cardClassName="!top-10 !right-0" />}
              {status !== "authenticated" && (
                <Link passHref={true} href={`/auth?callbackUrl=/view?id=${id}`}>
                  <BiUser className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>

          <div className="max-w-3xl mx-auto sm:px-[5%] sm:pt-[5%] min-w-[300px] sm:min-w-min  overflow-x-hidden sm:overflow-x-visible  ">
            {/* Title */}
            <header className="flex flex-col gap-10">
              <Image src={blog?.cover} alt="Cover Image" width={800} height={400} className=" max-h-64 mx-auto object-cover" />
              <h1 className="text-3xl md:text-5xl font-bold  px-[5%] sm:px-0">{blog?.title}</h1>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-[5%] sm:px-0">
                <div className="flex items-center gap-4">
                  <Image src={blog?.author?.image} alt="Author Image" width={64} height={64} className="rounded-full" />
                  <div className="flex flex-col">
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
                    <div className="flex gap-1 items-center">
                      <span className="text-sm text-gray-400">Read time</span>
                      <span className="text-sm">{blog?.readTime} min</span>
                    </div>
                  </div>
                </div>
                <div className=" relative flex gap-3 items-center ">
                  <div className="flex gap-1 items-center">
                    <span className="text-2xl text-pink-600 cursor-pointer" onClick={handleLoveReact}>
                      {hasLiked ? <BiSolidHeart /> : <BiHeart />}
                    </span>
                    <span className="text-lg text-gray-500">{likeCounter ?? 0}</span>
                  </div>
                  <span className="text-2xl text-gray-600 cursor-pointer" aria-label="add to reading list" title="add to reading list">
                    <BiBookOpen />
                  </span>
                  <span className="text-2xl text-gray-600 cursor-pointer" aria-label="share blog" title="share">
                    <BiShare onClick={toggleShareModal} />
                    <div
                      className={`absolute left-0 right-0 w-full translate-y-2 -translate-x-1/2 select-none transition z-10 text-white text-sm ${
                        isModalOpen.share ? "scale-95 opacity-100" : "scale-90 opacity-0 pointer-events-none "
                      }`}
                    >
                      <ShareCard setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} id={id} urlLink={urlLink} />
                    </div>
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4 px-[5%] sm:px-0">
                <TLDR content={blog?.tldr} />
              </div>
              <div className="flex gap-4 items-center justify-between  px-[5%] sm:px-0">
                <div className="flex gap-1 items-center w-full pb-10">
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
        {/* Image of blogopedia centered */}
        <Link href="/" passHref={true} className="flex items-center h-16 pt-6 px-4">
          <Image src="/assets/svgs/logo-full.svg" alt="Blogopedia" width={128} height={64} />
        </Link>
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

const TLDR = ({ content }) => {
  return (
    <div className="flex flex-col gap-4 relative">
      <h1 className="text-5xl font-extrabold">
        TL;DR <span className="text-base font-normal hidden md:inline">Too long; didn&apos;t Read </span>
      </h1>
      <p className="text-gray-500 text-justify">{content}</p>
      <div className="absolute top-0 right-0 flex flex-col items-end gap-1">
        <span className="text-xs text-gray-400">generated by</span>
        <Image src="/assets/images/tldr-this.png" alt="TLDR" width={64} height={64} />
      </div>
    </div>
  );
};
