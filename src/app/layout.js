import Provider from "@/providers/Provider";
import { Poppins } from "next/font/google";
import "./globals.scss";

const poppins = Poppins({ subsets: ["latin"], display: "swap", weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata = {
  title: {
    template: "%s - Blogopedia",
    default: "Blogopedia",
  },
  description: "Blogs & Articles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
