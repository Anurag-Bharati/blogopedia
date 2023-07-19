"use client";
import AvatarShimmer from "@/components/AvatarShimmer";
import BlogFileCard, { DummyBlogCard } from "@/components/BlogFileCard";
import Footer from "@/components/Footer";
import UserOptionsBar from "@/components/UserOptionsBar";
import { firestore } from "@/config/firebase/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BiCheckCircle, BiDetail } from "react-icons/bi";
import ReactPaginate from "react-paginate";

const itemsPerPage = 3;
const filterTypes = [where("status", "==", "published"), where("status", "==", "draft")];

export default function Page() {
  const { data: session, status } = useSession({ required: true });
  const [myBlogs, setMyBlogs] = useState([]);
  const [filter, setFilter] = useState(-1);
  const [sort, setSort] = useState("desc");
  const collectionRef = useMemo(() => collection(firestore, "blogs"), []);

  // Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = myBlogs.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(myBlogs.length / itemsPerPage);
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % myBlogs.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    const q =
      filter == 0 || filter == 1
        ? query(collectionRef, where("author.email", "==", session?.user.email), filterTypes[filter], orderBy("updatedAt", sort))
        : query(collectionRef, where("author.email", "==", session?.user.email), orderBy("updatedAt", sort));
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) return;
      setMyBlogs(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
  }, [collectionRef, session?.user.email, status, sort, filter]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="flex py-3 md:py-5 px-6 md:px-8 mx-auto max-w-[1280px]">
          <Link passHref={true} href="/" scroll={false} className="inline-block py-1 whitespace-nowrap mr-2 w-40  text-center my-auto">
            <Image src="/assets/svgs/logo-full.svg" width={120} height={120} alt="Blogopedia logo; varient: full" className="h-8" />
          </Link>
          <div className="flex basis-full justify-end items-center gap-4">
            <Link passHref={true} href="/#" className="z-10 mr-2">
              <p className=" text-sm md:text-base">Home</p>
            </Link>

            {status === "loading" && <AvatarShimmer className="h-8 w-8 cursor-wait" />}
            {status === "authenticated" && <UserOptionsBar session={session} />}
          </div>
        </div>
      </nav>
      <main>
        <section className="relative flex flex-col w-full overflow-hidden isolate min-h-[60vh] md:min-h-screen ">
          <div className="relative w-full h-full">
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
          </div>
          <div className="absolute top-0 bottom-0 right-0 left-0 z-20 scale-75 md:scale-100 translate-y-[15%] md:translate-y-0">
            <div className="flex flex-col h-full justify-center items-center">
              <div className=" h-32 w-32 rounded-full  z-10  pointer-events-none">
                {status === "authenticated" ? (
                  <Image src={session?.user?.image} width={256} height={256} alt="profile" className="rounded-full h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full rounded-full shimmer invert" />
                )}
              </div>
              {status === "authenticated" ? (
                <h1 className="mt-2 text-3xl  mx-auto font-bold uppercase tracking-tight"> {session?.user?.name}</h1>
              ) : (
                <span className="mt-2 text-3xl  mx-auto font-bold uppercase tracking-tight text-transparent shimmer w-64 rounded-md invert brightness-150">
                  .
                </span>
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
            </div>
          </div>
        </section>
        <section className="w-full relative isolate scroll-mt-10 md:scroll-mt-20  md:py-8 lg:py-12 overflow-hidden px-[5]" id="myblogs">
          <header className=" relative mx-auto max-w-3xl w-full  md:pl-2 md:pb-4 flex-col sm:flex-row flex justify-between items-center md:h-9">
            <h1 className="text-2xl align-middle mb-3 sm:mb-0">My blogs</h1>
            <div className="flex gap-2 items-center flex-wrap justify-center pb-2 sm:pb-0">
              {myBlogs.length === 0 && (
                <>
                  <span className="h-6 w-32 md:w-64 rounded-full shimmer" />
                  <span className="h-6 w-7 rounded-full shimmer" />
                  <span className="h-6 w-7 rounded-full shimmer" />
                </>
              )}
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={1}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                marginPagesDisplayed={1}
              />
              {myBlogs.length !== 0 && (
                <span
                  title="Filter by draft"
                  className={`w-7 h-7  bg-[#222] rounded-full transition ${
                    filter === 1 ? "bg-[#2dcdff] text-black" : ""
                  } cursor-pointer select-none grid place-items-center -order-2 sm:order-1`}
                  onClick={() => setFilter(filter === 1 ? -1 : 1)}
                >
                  <BiDetail className="inline-block align-middle" />
                </span>
              )}
              {myBlogs.length !== 0 && (
                <span
                  title="Filter by published"
                  className={`min-w-[28px] h-7 bg-[#222] rounded-full transition ${
                    filter === 0 ? "bg-[#2dcdff] text-black" : ""
                  } cursor-pointer select-none grid place-items-center -order-3 sm:order-2`}
                  onClick={() => setFilter(filter === 0 ? -1 : 0)}
                >
                  <BiCheckCircle className="inline-block align-middle " />
                </span>
              )}
            </div>
          </header>

          <div className="mx-auto max-w-3xl w-full bg-[#111] p-2 md:p-4 rounded-xl">
            <div className="flex flex-col gap-2">
              {myBlogs.length === 0 && (
                <>
                  <DummyBlogCard />
                  <DummyBlogCard />
                  <DummyBlogCard />
                </>
              )}
              <Blogs currentItems={currentItems} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Blogs({ currentItems }) {
  return (
    <>
      {currentItems.map((blog, i) => (
        <BlogFileCard i={i} blog={blog} key={i} />
      ))}
    </>
  );
}
