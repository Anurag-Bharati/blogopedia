import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { BiCog, BiLogOutCircle } from "react-icons/bi";

import InfiniteLinearProgressBar from "./InfiniteLinearProgressBar";
import Image from "next/image";

const UserOptionsBar = ({ session, cardClassName = "", redirectToHome = true }) => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  useEffect(() => {
    if (!open && loading) return;
    const loadDelay = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(loadDelay);
  }, [open, loading]);

  const handleSignOut = async () => {
    if (redirectToHome) await signOut({ redirect: true, callbackUrl: "http://localhost:3000" });
    else await signOut({ redirect: false });
  };

  return (
    <div className="inline-flex flex-shrink-0 justify-center items-center cursor-pointer w-8 h-8 rounded-full overflow-hidden ">
      <Image
        src={session?.user?.image}
        height={64}
        width={64}
        className="object-cover aspect-square w-full h-full z-10"
        onClick={toggleOpen}
        alt="avatar"
      />
      <div
        className={`${cardClassName} absolute overflow-hidden top-12 w-fit right-3 md:left-auto md:top-24 shadow-xl rounded-lg  border border-[#222] bg-[#111] whitespace-nowrap  transition ease-in-out duration-300 ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
        }`}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="max-w-7xl text-sm md:text-base">
          <ul className="py-0">
            <li className="px-4 py-2 hover:bg-[#222] cursor-pointer text-white flex items-center gap-2 border-b-2 border-[#222]">
              <div className="flex items-center gap-2">
                <Image src={session?.user?.image} height={64} width={64} className="object-cover w-10 h-10 z-10 rounded-full" alt="avatar" />
                <div>
                  <p className="text-sm">{session?.user?.name}</p>
                  <p className="text-xs">{session?.user?.email}</p>
                </div>
              </div>
            </li>
            <li className={`relative transition-all duration-150 ease-out ${loading ? "pb-2 h-fit opacity-100" : "pb-0 h-0 opacity-0"}`}>
              <InfiniteLinearProgressBar small={true} />
            </li>
            <li className="px-4 py-2 hover:bg-[#222] cursor-pointer text-white flex items-center gap-2">
              <BiCog className="w-5 h-5" />
              <p>Settings</p>
            </li>
            <li className="px-4 py-2 hover:bg-[#222] cursor-pointer text-white flex items-center gap-2" onClick={handleSignOut}>
              <BiLogOutCircle className="w-5 h-5" />
              <p>Sign out</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserOptionsBar;
