import Image from "next/image";
const EditorLeftAside = ({ headers, scrollIntoView }) => {
  return (
    <aside className="bg-[#111] w-[250px] h-full overflow-hidden">
      <div className="flex flex-col h-full ">
        <div className="">
          <Image height={150} width={250} src="https://via.placeholder.com/250x150" alt="Blog Cover" className="w-full h-[150px] object-cover" />
        </div>
        <div className="overflow-y-scroll override-scroll-bar-all h-full">
          <h1 className=" p-4 pt-6 text-lg text-white">Table of Contents</h1>
          <div className="flex flex-col px-4 text-sm gap-2 ">
            {headers.map((h, i) => {
              if (h.text.trim() === "") return;
              if (h.type === "header-one")
                return (
                  <a onClick={() => scrollIntoView(h.key)} className="line-clamp-2  text-gray-400 hover:text-white cursor-pointer" key={i}>
                    {h.text}
                  </a>
                );
              else if (h.type === "header-two")
                return (
                  <a
                    onClick={() => scrollIntoView(h.key)}
                    className="line-clamp-1 truncate  text-gray-400 hover:text-white ml-2 cursor-pointer"
                    key={i}
                  >
                    {h.text}
                  </a>
                );
              else if (h.type === "header-three")
                return (
                  <a
                    onClick={() => scrollIntoView(h.key)}
                    className="line-clamp-1 truncate  text-gray-400 hover:text-white ml-4 cursor-pointer"
                    key={i}
                  >
                    {h.text}
                  </a>
                );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default EditorLeftAside;
