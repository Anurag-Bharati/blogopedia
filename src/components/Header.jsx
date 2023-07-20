"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { BiChevronDown, BiLoader, BiPlus, BiRightArrowAlt, BiUser } from "react-icons/bi";

import NiceSearchBar from "./NiceSearchBar";
import UserOptionsBar from "./UserOptionsBar";
import AvatarShimmer from "./AvatarShimmer";

import data from "../config/data/categories.data.json";

import { firestore } from "../config/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [state, setState] = useState({ loading: false });
  const [showBooks, setShowCourses] = useState(false);
  const [write, setWrite] = useState(false);
  const toggleWrite = () => setWrite(!write);
  const [formError, setFormError] = useState(null);

  var hideDelay;

  const showAllBooks = () => {
    clearTimeout(hideDelay);
    setShowCourses(true);
  };

  const toggleShowBooks = () => setShowCourses(!showBooks);
  const hideAllBooks = () => (hideDelay = setTimeout(() => setShowCourses(false), 300));
  const handleSwitch = (slug) => setShowCourses(false);

  const createDocument = async (e) => {
    e.preventDefault();
    if (state.loading) return;
    var fileName = e.target.fileName.value;
    if (!fileName || fileName.trim() === "") return setFormError("Title cannot be empty");
    if (status !== "authenticated") return;
    setState({ loading: true });
    const blogsCollection = collection(firestore, "blogs");

    try {
      const addedDocRef = await addDoc(blogsCollection, {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        author: session.user,
        fileName: fileName.trim(),
        status: "draft",
        likes: 0,
        views: 0,
        tags: [],
        title: fileName.trim(),
        toc: [],
        cover: null,
        readTime: null,
      });
      router.push(`/editor/${addedDocRef.id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setState({ loading: false });
    }
  };

  return (
    <header id="header" className="relative w-full mt-[90px]">
      {/* Wrapper for top-header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-black border-b-[1px] border-[#222]">
        <div className="flex py-3 md:py-5 px-0 md:px-8 mx-auto max-w-[1280px]">
          <Link passHref={true} href="/" scroll={false} className=" py-1 whitespace-nowrap mr-2 w-40 text-center my-auto z-10 hidden sm:inline-block">
            <Image src="/assets/svgs/logo-full.svg" width={120} height={120} alt="Blogopedia logo; varient: full" />
          </Link>
          <div className="flex basis-full sm:justify-center">
            <div className="flex gap-4 items-center float-left  md:pl-7 md:px-7 py-1 w-full  md:justify-center justify-between isolate sm:px-0">
              <div className="absolute w-full h-full  bg-black z-0"></div>
              <ul
                className="flex flex-col list-none  hover:cursor-pointer ml-5 sm:ml-0"
                onMouseEnter={showAllBooks}
                onMouseLeave={hideAllBooks}
                onClick={toggleShowBooks}
              >
                <li className="relative">
                  <a className="flex items-center gap-2 px-2 py-2 text-md  pointer-events-none" type="button">
                    <p className=" text-sm md:text-base">Topics</p>
                    <BiChevronDown className={`text-2xl  transition ${showBooks ? "rotate-90" : "rotate-0"}`} />
                  </a>
                  <div
                    className={`absolute z-[-1] pt-6 transition duration-500 ease-out hidden md:block cursor-default ${
                      showBooks ? "translate-y-0" : "-translate-y-full"
                    }`}
                  >
                    <div className="relative w-auto  bg-black border-[1px] border-[#222]">
                      <div className="flex w-auto">
                        <ul className="py-2 text-md md:text-sm  max-h-72 overflow-y-scroll nice-scroll-bar w-80">
                          {data.categories.map((e, i) => (
                            <li key={`data:${i}:desktop`}>
                              <a href="#" className="block px-4 py-4 md:py-2 hover:bg-[#222]">
                                {e.name}
                              </a>
                            </li>
                          ))}
                          <div className="border-b-[1px] border-[#222] h-px my-2"></div>
                          <Link
                            passHref={true}
                            href="/#"
                            className="inline-flex flex-row py-2 opacity-100 mx-3 px-3 items-center hover:text-white"
                            type="button"
                          >
                            <p className="text-md uppercase  pointer-events-none">Show More</p>
                            <BiRightArrowAlt className="text-md ml-1 font-light pointer-events-none" />
                          </Link>
                        </ul>
                        <div className="flex flex-col p-4 gap-4">
                          <h2>Filters</h2>
                          <div className="inline-flex flex-wrap text-md md:text-sm text-gray-700 p-0 gap-4 w-96 h-fit whitespace-nowrap justify-start">
                            <a href="#" className="py-1 bg-zinc-100 rounded-full px-2 hover:brightness-75">
                              Popular
                            </a>
                            <a href="#" className="py-1 bg-zinc-100 rounded-full px-2 hover:brightness-75">
                              Trending
                            </a>
                            <a href="#" className="py-1 bg-zinc-100 rounded-full px-2 hover:brightness-75">
                              Recent
                            </a>

                            <a href="#" className="py-1 bg-zinc-100 rounded-full px-2 hover:brightness-75">
                              Featured
                            </a>
                          </div>
                          <h2>Hastags</h2>
                          <div className="inline-flex flex-wrap text-md md:text-sm text-white p-0 gap-4 w-96 h-fit whitespace-nowrap justify-start">
                            <a href="#" className="py-1 border-2 border-[#2DCDFF] rounded-full px-2  hover:bg-[#2DCDFF] hover:text-[#111]">
                              #technology
                            </a>
                            <a href="#" className="py-1 border-2 border-[#27f3f3] rounded-full px-2 hover:bg-[#27f3f3] hover:text-[#111]">
                              #business
                            </a>
                            <a href="#" className="py-1 border-2 border-[#35e6ab] rounded-full px-2 hover:bg-[#35e6ab] hover:text-[#111]">
                              #lifestyle
                            </a>
                            <a href="#" className="py-1 border-2 border-[#e6e635] rounded-full px-2 hover:bg-[#e6e635] hover:text-[#111]">
                              #history
                            </a>
                            <a href="#" className="py-1 border-2 border-[#a3e635] rounded-full px-2 hover:bg-[#a3e635] hover:text-[#111]">
                              #nature
                            </a>
                            <a href="#" className="py-1 border-2 border-[#EB2FAB] rounded-full px-2 hover:bg-[#EB2FAB] hover:text-[#111]">
                              #adventure
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <Link passHref={true} href="/#" className="z-10 mr-2  hidden sm:block">
                <p className=" text-sm md:text-base">Home</p>
              </Link>
              <Link passHref={true} href="/#featured" className="z-10 mr-2 hidden sm:block">
                <p className=" text-sm md:text-base">Featured</p>
              </Link>
              <NiceSearchBar className="relative hidden md:block flex-grow z-10 max-w-sm ml-auto" />
              <div className="flex gap-4 justify-evenly ml-6 ">
                <span
                  className="relative inline-flex gap-2 justify-center items-center border-2 rounded-full px-3 py-1 cursor-pointer hover:bg-white hover:text-black transition duration-300 ease-in-out"
                  onClick={toggleWrite}
                >
                  <p className="">Write</p>
                  <BiPlus className="h-5 w-5" />
                </span>
                <div
                  className={`absolute top-12 w-fit left-0 md:left-auto md:top-[90px]  border rounded-b-xl border-[#222] whitespace-nowrap bg-black z-[-1] transition ease-in-out duration-300 ${
                    write ? "translate-y-0" : "-translate-y-full"
                  }`}
                  // onMouseLeave={() => setWrite(false)}
                >
                  <div className="max-w-7xl text-sm md:text-base">
                    <form className="px-3 pt-2 pb-3 flex flex-col gap-1 w-min" onSubmit={createDocument}>
                      <input
                        disabled={state.loading}
                        className={`block min-w-[180px] w-full p-2 pl-3 pr-3 bg-[#222] rounded-xl text-[#ddd] placeholder:text-[#999] truncate ${
                          formError ? "border-2 border-red-400" : "border-0"
                        }  }`}
                        placeholder="File Name"
                        id="fileName"
                        type="text"
                        autoComplete="off"
                        onFocus={() => setFormError(null)}
                      />
                      {formError && <p className="text-red-400 text-xs px-2 pb-1">{formError}</p>}
                      <button
                        type="submit"
                        disabled={state.loading}
                        className="text-white text-md bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300  rounded-lg  w-full py-1.5 text-center dark:bg-cyan-400 dark:hover:bg-cyan-500 dark:focus:ring-cyan-800 font-medium mt-1"
                      >
                        {state.loading ? (
                          <div className="flex justify-center items-center gap-2">
                            <BiLoader className="animate-spin h-5 w-5" />
                            Please wait
                          </div>
                        ) : (
                          "Create Blog"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mr-5 sm:mr-0">
                {status === "loading" && <AvatarShimmer className="h-8 w-8 cursor-wait" />}
                {status === "authenticated" && <UserOptionsBar session={session} />}
                {status === "unauthenticated" && (
                  <Link
                    passHref={true}
                    href="/auth"
                    className="relative h-8 w-8 inline-flex justify-center items-center cursor-pointer z-10  border-2 border-white rounded-full"
                  >
                    <BiUser className="h-6 w-6" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-[90px]  px-4 pb-4  max-w-md  md:hidden mx-auto">
        <NiceSearchBar className="flex-1" />
      </div>
      {/* RESPONSIVE */}
      <div
        className={`z-10 block md:hidden fixed top-[72px] w-full h-full  bg-[#11111199] transition duration-500 ease-out ${
          showBooks ? "backdrop-blur-sm opacity-100 pointer-events-auto" : "backdrop-blur-none opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowCourses(false)}
      ></div>
      <div
        className={` z-10 block md:hidden fixed top-[72px] w-3/4 right-0 bottom-0 bg-[#00000099] shadow transition duration-500 ease-out ${
          showBooks ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="py-2 text-md md:text-sm text-white overflow-y-scroll max-h-full">
          {data.categories.map((e, i) => (
            <li key={`data:${i}`}>
              <a href="#" className="block px-4 py-4 md:py-2 hover:bg-gray-100 truncate" onClick={() => handleSwitch(e.name)}>
                {e.name}
              </a>
            </li>
          ))}
          <div className="border-b-[1px] border-[#eaeaea] h-px my-2"></div>
          <div className="py-2">
            <Link
              passHref={true}
              href="/all-courses"
              className="flex flex-row py-2 opacity-100 mx-3 px-3 items-center rounded-md primary-button-ring hover:text-white"
              type="button"
            >
              <p className="text-lg uppercase pointer-events-none">Explore All Books</p>{" "}
              <BiRightArrowAlt className="text-xl ml-1 font-light pointer-events-none" />
            </Link>
          </div>
        </ul>
      </div>
      {/* END OF RESPONSIVE */}
    </header>
  );
};

export default Header;
