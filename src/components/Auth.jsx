"use client";
import { userState } from "@/atoms/userAtom";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GrGoogle } from "react-icons/gr";
import { useRecoilState } from "recoil";

const Auth = () => {
  const [user, setUser] = useRecoilState(userState);
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const toggleShowPass = () => setShowPass(!showPass);
  const handleGoogleSignIn = async () => signIn("google", { callbackUrl: "http://localhost:3000" });
  return (
    <section className="relative isolate text-white overflow-hidden p-4 min-h-screen mx-auto md:px-10 max-w-7xl lg:px-8 scroll-mt-32 flex flex-col justify-center items-center">
      <div className="mb-6 sm:mb-0 sm:h-fit sm:absolute left-[5%] top-20 z-10 flex justify-center items-center gap-2">
        <BiChevronLeft className="h-5 w-5" />
        <Link href="/" className="text-center  focus:text-black focus:bg-white text-white hover:underline transition duration-300">
          Home
        </Link>
        •<span className="pointer-events-none text-cyan-400">Auth</span>
      </div>
      {/* Wrapper */}
      <div className="relative flex w-full h-full justify-evenly items-center">
        <div className="relative hidden md:block md:flex-1">
          <div className="absolute flex justify-center items-center w-full h-full blur-2xl z-[-1] opacity-50 pointer-events-none">
            <Image src="/assets/svgs/blob.svg" width={600} height={600} alt="..." />
          </div>

          <Image src="/assets/svgs/logo-full.svg" width={400} height={200} alt="blogopedia" className="mx-auto pointer-events-none" />
          <p className="ml-20 text-center text-xl">
            Insights, Inspiration and <br />
            Insightful Perspectives
          </p>
        </div>
        <div className="flex-1">
          <div className="w-fit border-2 flex flex-col rounded-2xl p-8 mx-auto">
            <div className="mb-6">
              <h1 className="mb-2 sm:mb-4 text-xl sm:text-2xl tracking-tight">{isLogin ? "Sign in to your account" : "Get started for free"}</h1>
              {isLogin ? (
                <p className="text-sm">
                  Don&apos;t have an account?{" "}
                  <a className="text-cyan-400" href="#" onClick={() => setIsLogin(false)}>
                    Sign Up
                  </a>
                </p>
              ) : (
                <p className="text-sm">
                  Already have an account?{" "}
                  <a className="text-cyan-400" href="#" onClick={() => setIsLogin(true)}>
                    Login
                  </a>
                </p>
              )}
            </div>
            {isLogin ? (
              <form className="sm:min-w-[270px]">
                <div className="mb-4">
                  <label htmlFor="username" />
                  <input
                    className="block w-full p-4 pl-6 pr-6 bg-[#222] rounded-xl text-[#ddd] placeholder:text-[#999] truncate"
                    placeholder="Email or Username"
                    id="username"
                    type="text"
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="relative mb-4">
                  <label htmlFor="password" />
                  <input
                    className="block w-full p-4 pl-6 pr-6 bg-[#222] rounded-xl text-[#ddd] placeholder:text-[#999] truncate"
                    placeholder="Password"
                    id="password"
                    type={showPass ? "text" : "password"}
                    minLength="6"
                    required
                    autoComplete="current-password"
                  />
                  <span className="absolute right-4 top-5 cursor-pointer" onClick={toggleShowPass}>
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-6 mx-1">
                  <div className="flex items-start mr-4">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required=""
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                    Forgot password?
                  </a>
                </div>

                <div className="mb-4">
                  <button
                    type="submit"
                    className="text-white text-md bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300  rounded-lg  w-full px-5 py-4 text-center dark:bg-cyan-400 dark:hover:bg-cyan-500 dark:focus:ring-cyan-800 font-semibold"
                  >
                    Login
                  </button>
                </div>
              </form>
            ) : (
              <form className="sm:min-w-[300px]">
                <div className="mb-4">
                  <label htmlFor="username" />
                  <input
                    className="block w-full p-4 pl-6 pr-6 bg-[#222] rounded-xl text-[#ddd] placeholder:text-[#999] truncate"
                    placeholder="Full Name"
                    id="username"
                    type="text"
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" />
                  <input
                    className="block w-full p-4 pl-6 pr-6 bg-[#222] rounded-xl text-[#ddd] placeholder:text-[#999] truncate"
                    placeholder="Email"
                    id="email"
                    type="text"
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="relative mb-4">
                  <label htmlFor="email" />
                  <input
                    className="block w-full p-4 pl-6 pr-6 bg-[#222] rounded-xl text-[#ddd] placeholder:text-[#999] truncate"
                    placeholder="Password"
                    id="password"
                    type={showPass ? "text" : "password"}
                    minLength="6"
                    required
                    autoComplete="current-password"
                  />
                  <span className="absolute right-4 top-5 cursor-pointer" onClick={toggleShowPass}>
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="mb-4">
                  <button
                    type="submit"
                    className="text-white text-md bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300  rounded-lg  w-full px-5 py-4 text-center dark:bg-cyan-400 dark:hover:bg-cyan-500 dark:focus:ring-cyan-800 font-semibold"
                  >
                    Register
                  </button>
                </div>
              </form>
            )}
            <div className="flex items-center mb-4">
              <div className="h-[0.125rem] w-full bg-[#999]"></div>
              <div className="text-center px-5">or</div>
              <div className="h-[0.125rem] w-full bg-[#999]"></div>
            </div>
            <button
              type="button"
              className="w-full block bg-black border-2 hover:bg-white focus:text-black focus:bg-white text-white hover:text-black font-semibold rounded-lg px-4 py-3 border-white transition duration-300"
            >
              <div className="flex items-center justify-center" onClick={handleGoogleSignIn}>
                <GrGoogle />
                <span className="ml-4">Log in with Google</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
