"use client";
import Footer from "@/components/Footer";
import UserOptionsBar from "@/components/UserOptionsBar";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { BiCheckCircle, BiDetail, BiDotsVerticalRounded, BiTime } from "react-icons/bi";
import { CiStickyNote } from "react-icons/ci";
export default function Page() {
  const { data: session, status } = useSession({ required: true });
  return (
    <>
      <nav>
        <div className="fixed top-0 left-0 right-0 z-10">
          <div className="flex py-3 md:py-5 px-6 md:px-8 mx-auto max-w-[1280px]">
            <Link passHref={true} href="/" scroll={false} className="inline-block py-1 whitespace-nowrap mr-2 w-40 text-center my-auto z-10">
              <Image src="/assets/svgs/logo-full.svg" width={120} height={120} alt="Blogopedia logo; varient: full" />
            </Link>
            <div className="flex basis-full justify-end items-center gap-4">
              <Link passHref={true} href="/#" className="z-10 mr-2">
                <p className=" text-sm md:text-base">Home</p>
              </Link>
              <Link passHref={true} href="/#" className="z-10 mr-2 ">
                <p className=" text-sm md:text-base">Featured</p>
              </Link>
              <Link passHref={true} href="/#" className="z-10 mr-2 ">
                <p className=" text-sm md:text-base">Browse</p>
              </Link>
              <UserOptionsBar session={session} />
            </div>
          </div>
        </div>
      </nav>
      <main>
        <section className="relative flex flex-col w-full pb-20 overflow-hidden">
          <div className="relative w-full ">
            <div className="absolute z-10 h-[155px] bottom-0 w-full  bg-gradient-to-t from-black to-transparent"></div>
            <Image
              height={333}
              width={1280}
              src="/assets/images/profile-cover.png"
              alt="profile cover"
              className=" w-full h-full object-contain object-top -z-0 pointer-events-none"
            />
            <div className="absolute -left-20 -top-20 blur-3xl z-10 opacity-40 pointer-events-none overflow-hidden">
              <Image src="/assets/svgs/blob.svg" width={700} height={700} alt="..." />
            </div>
            <div className="absolute -right-20 -top-20 blur-3xl z-10 opacity-40 pointer-events-none overflow-hidden rotate-180">
              <Image src="/assets/svgs/blob.svg" width={700} height={700} alt="..." />
            </div>
            <div className="h-full w-full grid place-items-center ">
              <div className="absolute h-32 w-32 rounded-full bg-gray-200 z-10 -translate-y-2/3 border-4 pointer-events-none">
                <Image src={session?.user?.image} width={256} height={256} alt="profile" className="rounded-full h-full w-full object-cover" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl  mx-auto font-bold uppercase tracking-tight"> {session?.user?.name}</h1>
          <p className="text-xl mx-auto tracking-widest font-light">Student ● 20 Blogs ● 128 Likes</p>
          <div className="mx-auto">
            <div className="flex gap-4 justify-center items-center p-4 min-w-[300px]">
              <button className="rounded-xl border-2 text-2xl px-2 flex-1 py-1 hover:bg-white hover:text-black hover:scale-95">Edit</button>
              <button className="rounded-xl  text-2xl px-2 flex-1 py-1 bg-gradient-to-br from-pink-400 to-[#F02989]   hover:text-black hover:brightness-110 hover:scale-95">
                Share
              </button>
            </div>
          </div>
        </section>
        <section className="w-full relative isolate">
          <header className="mx-auto max-w-3xl w-full  px-4 pb-4">
            <h1 className="text-2xl">My blogs</h1>
          </header>
          <div className="mx-auto max-w-3xl w-full bg-[#111] p-4 rounded-xl">
            <div className="flex flex-col gap-2">
              <div className="w-full flex justify-between p-4 rounded-xl cursor-pointer hover:bg-[#ffffff22] bg-transparent transition duration-300 ease-in-out">
                <div>
                  <div className="flex gap-2 content-center items-center w-full justify-between">
                    <h2 className="text-xl">1. Untitled.blog</h2>
                    <div className="flex gap-2">
                      <span className="py-0.5  rounded-full px-1 text-md text-gray-400 font-light flex items-center gap-1">
                        <BiDetail className="text-md text-gray-400" />
                        draft
                      </span>
                      <span className="py-0.5  rounded-full px-1 text-md text-gray-400 font-light flex items-center gap-1">
                        <BiTime className="text-md text-gray-400" />a few seconds ago
                      </span>
                    </div>
                  </div>
                  <p className="text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                  <div className="flex gap-2 py-1">
                    <span className="py-0.5 border-2 border-[#a3e635] rounded-full px-1 text-xs hover:bg-[#a3e635] hover:text-[#000] text-white">
                      uiux
                    </span>
                    <span className="py-0.5 border-2 border-[#a3e635] rounded-full px-1 text-xs hover:bg-[#a3e635] hover:text-[#000] text-white">
                      uiux
                    </span>
                    <span className="py-0.5 border-2 border-[#a3e635] rounded-full px-1 text-xs hover:bg-[#a3e635] hover:text-[#000] text-white">
                      uiux
                    </span>
                    <span className="py-0.5 border-2 border-[#a3e635] rounded-full px-1 text-xs hover:bg-[#a3e635] hover:text-[#000] text-white">
                      uiux
                    </span>
                  </div>
                </div>
                <div>
                  <BiDotsVerticalRounded className="text-2xl " />
                </div>
              </div>
              <div className="w-full flex justify-between p-4 rounded-xl cursor-pointer hover:bg-[#ffffff22] bg-transparent transition duration-300 ease-in-out">
                <div>
                  <div className="flex gap-2 content-center items-center w-full justify-between">
                    <h2 className="text-xl">2. React Basics.blog</h2>
                    <div className="flex gap-2">
                      <span className="py-0.5  rounded-full px-1 text-md text-gray-400 font-light flex items-center gap-1">
                        <BiCheckCircle className="text-md text-gray-400" />
                        published
                      </span>
                      <span className="py-0.5  rounded-full px-1 text-md text-gray-400 font-light flex items-center gap-1">
                        <BiTime className="text-md text-gray-400" />
                        12 days ago
                      </span>
                    </div>
                  </div>
                  <p className="text-md">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</p>
                  <div className="flex gap-2 py-1">
                    <span className="py-0.5 border-2 border-[#a3e635] rounded-full px-1 text-xs hover:bg-[#a3e635] hover:text-[#000] text-white">
                      uiux
                    </span>
                    <span className="py-0.5 border-2 border-[#a3e635] rounded-full px-1 text-xs hover:bg-[#a3e635] hover:text-[#000] text-white">
                      uiux
                    </span>
                    <span className="py-0.5 border-2 border-[#a3e635] rounded-full px-1 text-xs hover:bg-[#a3e635] hover:text-[#000] text-white">
                      uiux
                    </span>
                    <span className="py-0.5 border-2 border-[#a3e635] rounded-full px-1 text-xs hover:bg-[#a3e635] hover:text-[#000] text-white">
                      uiux
                    </span>
                  </div>
                </div>
                <div>
                  <BiDotsVerticalRounded className="text-2xl " />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
