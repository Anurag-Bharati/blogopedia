"use client";
import { useState, useEffect, useMemo } from "react";
import ContentCard from "./ContentCard";
import Image from "next/image";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/config/firebase/firebase";

const Featured = () => {
  const [blogs, setBlogs] = useState([]);
  const collectionRef = useMemo(() => collection(firestore, "blogs"), []);
  const qRef = useMemo(() => query(collectionRef, where("status", "==", "published"), orderBy("createdAt", "asc")), [collectionRef]);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const snapshot = await getDocs(qRef);
        setBlogs(snapshot?.docs?.map((doc) => ({ id: doc?.id, ...doc?.data() } ?? [])));
      } catch (error) {
        console.error(error);
      }
    };
    getBlogs();
  }, [qRef]);

  console.log(blogs);

  return (
    <section id="featured" className="relative isolate px-4 pt-10 md:pt-0 mx-auto md:px-10 max-w-7xl lg:px-8 scroll-mt-32">
      <div className="mx-auto max-w-[1105px] text-start mb-8 lg:mb-12 mt-0">
        <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl tracking-tight ">Insightful Perspectives</h2>
        <p className="mb-5 font-light text-[#999] sm:text-xl ">
          Discover new perspectives, gain valuable knowledge, and find inspiration in the words of passionate writers and experts who share their
          experiences and expertise.
        </p>
      </div>
      <div className="absolute left-0 top-0 blur-3xl z-[-1] opacity-20 pointer-events-none overflow-hidden">
        <Image src="/assets/svgs/blob.svg" width={600} height={600} alt="..." />
      </div>
      {blogs?.length === 0 && <p className="text-center">No blogs found</p>}
      {blogs.map((e, i) => (
        <ContentCard varient="blog" key={i} data={e} />
      ))}
    </section>
  );
};

export default Featured;
