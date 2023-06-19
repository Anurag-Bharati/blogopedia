import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GrFacebook, GrLinkedin, GrTwitter } from "react-icons/gr";

const Footer = () => {
  return (
    <footer className="px-4 pt-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
      <div className="grid gap-10 row-gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Link href="/" aria-label="Go home" title="Blogopedia" className="inline-flex items-center">
            <Image src="/assets/svgs/logo-full.svg" width={100} height={40} alt="blogopedia" />
            <span class="ml-2 mt-2 text-xs tracking-wide text-[#999] uppercase">By Anurag</span>
          </Link>
          <div className="mt-6 lg:max-w-sm">
            <p className="text-sm text-[#999]">
              Blogopedia is an innovative application developed with a strong focus on enhancing blogging & article writting.
            </p>
            <p className="mt-4 text-sm text-[#999]">
              As a remastered version of Wikipedia, Blogopedia retains the original style while introducing advanced features to improve the writing
              experience.
            </p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-base font-bold tracking-wide text-white">Contacts</p>
          <div className="flex">
            <p className="mr-1 text-[#999]">Phone:</p>
            <a href="tel:0000000000" aria-label="Our phone" title="Our phone">
              98X-XXX-XXXX
            </a>
          </div>
          <div className="flex">
            <p className="mr-1 text-[#999]">Email:</p>
            <a href="mailto:anuragbharati26@gmail.com" aria-label="Our email" title="Our email">
              anurag...@gmail.com
            </a>
          </div>
          <div className="flex">
            <p className="mr-1 text-[#999]">Address:</p>
            <a href="https://goo.gl/maps/YGXEwC3LnmYpTXzC9" target="_blank" rel="noopener noreferrer" aria-label="Our address" title="Our address">
              Kathmandu, Nepal
            </a>
          </div>
        </div>
        <div>
          <span className="text-base font-bold tracking-wide text-white">Social</span>
          <div className="flex items-center mt-1 space-x-3">
            <a href="/" className="text-[#999] transition-colors duration-300 hover:text-deep-purple-accent-400">
              <GrFacebook className="h-6 w-6" />
            </a>
            <a href="/" className="text-[#999] transition-colors duration-300 hover:text-deep-purple-accent-400">
              <GrTwitter className="h-6 w-6" />
            </a>
            <a href="/" className="text-[#999] transition-colors duration-300 hover:text-deep-purple-accent-400">
              <GrLinkedin className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-4 text-sm text-[#999]">Follow Anurag on social media. Share thoughts, make connections and get inspired.</p>
        </div>
      </div>
      <div className="flex flex-col-reverse justify-between pt-5 pb-10 border-t-2 border-[#999] border-dashed  lg:flex-row">
        <p className="text-sm text-[#999]">© Copyright 2023 N0M4D. All rights reserved.</p>
        <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row">
          <li>
            <a href="/" className="text-sm text-[#999] transition-colors duration-300 hover:text-deep-purple-accent-400">
              F.A.Q
            </a>
          </li>
          <li>
            <a href="/" className="text-sm text-[#999] transition-colors duration-300 hover:text-deep-purple-accent-400">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="/" className="text-sm text-[#999] transition-colors duration-300 hover:text-deep-purple-accent-400">
              Terms &amp; Conditions
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
