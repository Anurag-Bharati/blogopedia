"use client";

import Featured from "@/components/Featured";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { firestore } from "@/config/firebase/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const collectionRef = useMemo(() => collection(firestore, "blogs"), []);
  const qRef = useMemo(() => query(collectionRef, where("status", "==", "published"), orderBy("createdAt", "desc")), [collectionRef]);
  useEffect(() => {
    const getBlogs = async () => {
      if (blogs.length > 0) return;
      try {
        const snapshot = await getDocs(qRef);
        setBlogs(snapshot?.docs?.map((doc) => ({ id: doc?.id, ...doc?.data() } ?? [])));
      } catch (error) {
        console.error(error);
      }
    };
    getBlogs();
  }, [blogs, qRef]);

  useEffect(() => {
    setRecentBlogs(blogs.slice(0, 6));
  }, [blogs]);

  return (
    <>
      <Header blogs={blogs} />
      <main>
        <Hero recentBlogs={recentBlogs} />
        <Featured blogs={blogs} />
      </main>
      <Footer />
    </>
  );
}
