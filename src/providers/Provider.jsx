"use client";
import { RecoilRoot } from "recoil";
import { SessionProvider } from "next-auth/react";

const Provider = ({ children }) => {
  return (
    <SessionProvider>
      <RecoilRoot>{children}</RecoilRoot>
    </SessionProvider>
  );
};

export default Provider;
