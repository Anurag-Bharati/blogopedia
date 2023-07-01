"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NotFoundScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleLoading = (e) => {
    if (loading) return;
    setLoading(true);
    if (e.target.getAttribute("goto")) router.push("/");
    else router.back();
    setLoading(false);
  };
  return (
    <section className="flex items-center h-screen p-16 dark:bg-black dark:text-gray-100">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <div className="h-12">
            <Image src="/assets/svgs/logo-full.svg" alt="404" width={500} height={500} className="w-auto mx-auto h-12" />
          </div>
          <h2 className="mb-8 font-extrabold text-9xl ">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn&apos;t find this page.</p>
          <p className="mt-4 mb-8 dark:text-gray-400">But dont worry, you can find plenty of other things on our homepage.</p>
          <div className="flex flex-wrap gap-4 justify-center ">
            <button onClick={handleLoading} className="px-8 py-3 font-semibold rounded dark:bg-cyan-400 dark:text-gray-900">
              {loading ? "Loading..." : "Go back"}
            </button>
            <button onClick={handleLoading} goto="/" className="px-8 py-3 font-semibold rounded dark:bg-cyan-400 dark:text-gray-900">
              {loading ? "Loading..." : "Go home"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundScreen;
