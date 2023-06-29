"use client";
import BlogFileCard, { DummyBlogCard } from "@/components/BlogFileCard";
import Footer from "@/components/Footer";
import UserOptionsBar from "@/components/UserOptionsBar";
import { firestore } from "@/config/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const { data: session, status } = useSession({ required: true });
  const [myBlogs, setMyBlogs] = useState([]);
  const collectionRef = useMemo(() => collection(firestore, "blogs"), []);
  useEffect(() => {
    if (status !== "authenticated") return;
    const q = query(collectionRef, where("author.email", "==", session?.user.email));
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) return;
      setMyBlogs(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
  }, [collectionRef, session?.user.email, status]);

  return (
    <>
      <nav>
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="flex py-3 md:py-5 px-6 md:px-8 mx-auto max-w-[1280px]">
            <Link passHref={true} href="/" scroll={false} className="inline-block py-1 whitespace-nowrap mr-2 w-40 text-center my-auto z-10">
              <Image src="/assets/svgs/logo-full.svg" width={120} height={120} alt="Blogopedia logo; varient: full" />
            </Link>
            <div className="flex basis-full justify-end items-center gap-4">
              <Link passHref={true} href="/#" className="z-10 mr-2">
                <p className=" text-sm md:text-base">Home</p>
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
          {status === "authenticated" ? (
            <h1 className="text-3xl  mx-auto font-bold uppercase tracking-tight"> {session?.user?.name}</h1>
          ) : (
            <span className="text-3xl  mx-auto font-bold uppercase tracking-tight text-transparent shimmer w-64 rounded-md ">.</span>
          )}
          <p className="text-xl mx-auto tracking-widest font-light mt-1">Student ● 20 Blogs ● 128 Likes</p>
          <div className="mx-auto">
            <div className="flex gap-4 justify-center items-center p-4 min-w-[300px]">
              <button className="rounded-xl border-2 text-2xl px-2 flex-1 py-1 hover:bg-white hover:text-black hover:scale-95">Edit</button>
              <button className="rounded-xl  text-2xl px-2 flex-1 py-1 bg-gradient-to-br from-pink-400 to-[#F02989]   hover:text-black hover:brightness-110 hover:scale-95">
                Share
              </button>
            </div>
          </div>
        </section>
        <section className="w-full relative isolate scroll-mt-10" id="myblogs">
          <header className="mx-auto max-w-3xl w-full  px-4 pb-4">
            <h1 className="text-2xl">My blogs</h1>
          </header>
          <div className="mx-auto max-w-3xl w-full bg-[#111] p-4 rounded-xl">
            <div className="flex flex-col gap-2">
              {myBlogs.length === 0 && (
                <>
                  <DummyBlogCard />
                  <DummyBlogCard />
                </>
              )}
              {myBlogs.map((blog, i) => (
                <BlogFileCard i={i} blog={blog} key={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
