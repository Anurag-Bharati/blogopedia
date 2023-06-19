"use client";
import Link from "next/link";
import { useState } from "react";
import { BiChevronDown, BiPlus, BiRightArrowAlt, BiSearch, BiUser, BiX } from "react-icons/bi";
import { GrArticle, GrCopy } from "react-icons/gr";
import data from "../config/data/articles.data.json";
import Image from "next/image";

const Header = () => {
  const [showBooks, setShowCourses] = useState(false);
  const [write, setWrite] = useState(false);
  const toggleWrite = () => setWrite(!write);
  var hideDelay;
  const showAllBooks = () => {
    clearTimeout(hideDelay);
    setShowCourses(true);
  };
  const toggleShowBooks = () => setShowCourses(!showBooks);
  const hideAllBooks = () => (hideDelay = setTimeout(() => setShowCourses(false), 300));
  const handleSwitch = (slug) => {
    setShowCourses(false);
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setShowResults(query !== "");
  };
  const handleClearSearch = () => {
    setSearchQuery("");
  };
  const filteredStuff = data.categories.filter((x) => x.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <header id="header" className="relative w-full mt-[90px]">
      {/* Wrapper for top-header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-current border-b-[1px] border-[#222]">
        <div className="flex py-3 md:py-5 px-6 md:px-8 mx-auto max-w-[1280px]">
          <Link href="/" scroll={false} className="inline-block py-1 whitespace-nowrap mr-2 w-40 text-center my-auto z-10">
            <Image src="/assets/svgs/logo-full.svg" width={120} height={120} alt="Blogopedia logo; varient: full" />
          </Link>
          <div className="flex basis-full justify-center">
            <div className="flex gap-4 items-center float-left px-0 pl-7 md:px-7 py-1 w-full justify-end md:justify-center isolate">
              <div className="absolute w-full h-full  bg-current z-0"></div>
              <ul
                className="flex flex-col list-none  hover:cursor-pointer "
                onMouseEnter={showAllBooks}
                onMouseLeave={hideAllBooks}
                onClick={toggleShowBooks}
              >
                <li className="relative">
                  <a className="flex items-center gap-2 px-2 py-2 text-md text-white pointer-events-none" type="button">
                    <p className=" text-sm md:text-base">Topics</p>
                    <BiChevronDown className={`text-2xl text-white transition ${showBooks ? "rotate-90" : "rotate-0"}`} />
                  </a>
                  <div
                    className={`absolute z-[-1] pt-6 transition duration-500 ease-out hidden md:block cursor-default ${
                      showBooks ? "translate-y-0" : "-translate-y-full"
                    }`}
                  >
                    <div className="relative w-auto  bg-current border-[1px] border-[#222]">
                      <div className="flex w-auto">
                        <ul className="py-2 text-md md:text-sm text-white max-h-72 overflow-y-scroll nice-scroll-bar w-80">
                          {data.categories.map((e, i) => (
                            <li key={`data:${i}:desktop`}>
                              <a href="#" className="block px-4 py-4 md:py-2 hover:bg-[#222]">
                                {e.name}
                              </a>
                            </li>
                          ))}
                          <div className="border-b-[1px] border-[#222] h-px my-2"></div>
                          <Link href="/#" className="inline-flex flex-row py-2 opacity-100 mx-3 px-3 items-center hover:text-white" type="button">
                            <p className="text-md uppercase text-current pointer-events-none">Show More</p>
                            <BiRightArrowAlt className="text-md ml-1 font-light pointer-events-none" />
                          </Link>
                        </ul>
                        <div className="flex flex-col p-4 gap-4">
                          <h2 className="text-white">Filters</h2>
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
                          <h2 className="text-white">Hastags</h2>
                          <div className="inline-flex flex-wrap text-md md:text-sm text-white p-0 gap-4 w-96 h-fit whitespace-nowrap justify-start">
                            <a href="#" className="py-1 border-2 border-[#2DCDFF] rounded-full px-2  hover:bg-[#2DCDFF] hover:text-[#111]">
                              #technology
                            </a>
                            <a href="#" className="py-1 border-2 border-[#27f3f3] rounded-full px-2 hover:bg-[#27f3f3] hover:text-[#111]">
                              #business
                            </a>
                            <a href="#" className="py-1 border-2 border-[#35e6ab] rounded-full px-2 hover:bg-[#35e6ab] hover:text-[#111]">
                              #life-style
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
              <Link href="/#" className="z-10 mr-2 text-white">
                <p className=" text-sm md:text-base">Home</p>
              </Link>
              <Link href="/#" className="z-10 mr-2 text-white">
                <p className=" text-sm md:text-base">Featured</p>
              </Link>

              <form className="relative hidden md:block flex-grow z-10 max-w-sm ml-auto">
                <div className="relative">
                  <input
                    className="block w-full px-3 py-2 pl-10 pr-28 bg-[#222] rounded-xl text-[#ddd] placeholder:text-[#999] truncate"
                    placeholder="What you want to read?"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    required
                  />
                  <div className="absolute p-2 right-0 top-0 bottom-0 mr-4">
                    <div className="border border-[#999] text-[#999] w-full h-full flex flex-col justify-center px-2 text-sm rounded-md">
                      CTRL + K
                    </div>
                  </div>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 ">
                    {searchQuery !== "" ? (
                      <BiX className="text-xl text-[#999] cursor-pointer z10" onClick={handleClearSearch} />
                    ) : (
                      <BiSearch className="text-xl text-[#999]" />
                    )}
                  </div>
                </div>
                {searchQuery !== "" && (
                  <div className="absolute top-32 w-full left-0 md:left-auto  md:top-16 md:w-[350px]  border border-[#222]">
                    <div className="max-w-7xl text-sm md:text-base mx-auto bg-current">
                      <ul className="py-2">
                        {filteredStuff.length > 0 ? (
                          filteredStuff.map((book) => (
                            <li key={book.name} className="px-4 py-2 hover:bg-[#222] cursor-pointer text-white">
                              {book.name}
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-white">No item found</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </form>

              <div className=" text-current flex gap-4 justify-evenly ml-6 text-white">
                <span
                  className="relative inline-flex gap-2 justify-center items-center border-2 rounded-full px-3 py-1 cursor-pointer hover:bg-white hover:text-black transition duration-300 ease-in-out"
                  onClick={toggleWrite}
                >
                  <p className="">Write</p>
                  <BiPlus className="h-5 w-5" />

                  <div
                    className={`absolute top-32 w-fit left-0 md:left-auto md:top-14  border border-[#222] whitespace-nowrap bg-black z-[-1] transition ease-in-out duration-300 ${
                      write ? "translate-y-0" : "-translate-y-full"
                    }`}
                    onMouseLeave={() => setWrite(false)}
                  >
                    <div className="max-w-7xl text-sm md:text-base">
                      <ul className="py-2">
                        <li className="px-4 py-2 hover:bg-[#222] cursor-pointer text-white flex items-center gap-2">
                          <GrCopy className="invert" />
                          <p>Create a Blog</p>
                        </li>
                        <li className="px-4 py-2 hover:bg-[#222] cursor-pointer text-white flex items-center gap-2">
                          <GrArticle className="invert" />
                          <p>Write an Article</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </span>

                <span className="inline-flex justify-center items-center cursor-pointer z-10">
                  <BiUser className="h-6 w-6" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-[90px]  px-4 pb-2  max-w-md  md:hidden mx-auto">
        <form className="flex-1">
          <div className="relative">
            <input
              className="block w-full px-3 py-2 pl-10 pr-28 bg-[#222] rounded-xl text-[#ddd] placeholder:text-[#999] truncate"
              placeholder="What you want to read?"
              value={searchQuery}
              onChange={handleSearchChange}
              required
            />
            <div className="absolute p-2 right-0 top-0 bottom-0 mr-4">
              <div className="border border-[#999] text-[#999] w-full h-full flex flex-col justify-center px-2 text-sm rounded-md">CTRL + K</div>
            </div>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 ">
              {searchQuery !== "" ? (
                <BiX className="text-xl text-[#999] cursor-pointer z10" onClick={handleClearSearch} />
              ) : (
                <BiSearch className="text-xl text-[#999]" />
              )}
            </div>
          </div>
        </form>
      </div>
      {/* RESPONSIVE */}
      <div
        className={`z-10 block md:hidden fixed top-[72px] w-full h-full  bg-[#11111199] transition duration-500 ease-out ${
          showBooks ? "backdrop-blur-sm opacity-100 pointer-events-auto" : "backdrop-blur-none opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowCourses(false)}
      ></div>
      <div
        className={` z-10 block md:hidden fixed top-[72px] w-3/4 right-0 bottom-0 bg-white shadow transition duration-500 ease-out ${
          showBooks ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="py-2 text-md md:text-sm text-gray-700 overflow-y-scroll max-h-full">
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
