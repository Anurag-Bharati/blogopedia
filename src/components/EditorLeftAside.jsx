import Image from "next/image";
import { useRef, useState } from "react";
import { BiHeading, BiImageAdd } from "react-icons/bi";
const EditorLeftAside = ({ headers, scrollIntoView, setImage, saving }) => {
  const [cover, setCover] = useState(null);
  const filePickerRef = useRef(null);
  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      setImage(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setCover(readerEvent.target.result);
    };
  };
  const clearImage = () => {
    setCover(null);
    setImage(null);
  };
  return (
    <aside className="relative bg-[#000] w-[250px] h-full overflow-hidden">
      <div
        className={`absolute w-full h-full bg-[#000000ee] z-30 transition duration-300 ${
          saving ? "opacity-100" : "opacity-0 pointer-events-none"
        } flex flex-col justify-center items-center gap-2`}
      ></div>
      <div className="flex flex-col h-full ">
        <div className="relative h-48 w-full bg-[#ffffff22] overflow-hidden">
          {cover ? (
            <div>
              <span className="absolute text-white bg-red-500 text-sm rounded-md px-1 py-0 bottom-0 right-0 m-3 cursor-pointer" onClick={clearImage}>
                {" "}
                clear
              </span>
              <Image height={192} width={250} src={cover} alt="Blog Cover" className="w-auto h-44 object-cover" />
            </div>
          ) : (
            <div className=" h-full w-full p-7">
              <div className="relative border-2  h-full w-full rounded-xl border-dashed flex">
                <input type="file" className=" absolute h-full w-full opacity-0  cursor-pointer" ref={filePickerRef} onChange={addImageToPost} />
                <BiImageAdd className="w-8 h-8 text-[#ffffff99] m-auto" />
              </div>
            </div>
          )}
        </div>
        <div className="overflow-y-scroll override-scroll-bar-all h-full">
          <h1 className=" p-4 pt-6 text-lg text-white">Table of Contents</h1>
          <div className="flex flex-col px-4 text-sm gap-2">
            {headers.length === 0 && (
              <div className="h-32 bg-[#111] flex flex-col justify-center items-center rounded-md">
                <BiHeading className="w-6 h-6 text-gray-400" />
                <span className="text-gray-400">No headers found</span>
                <span className="text-gray-400">Try adding H1</span>
              </div>
            )}
            {headers &&
              headers.map((h, i) => {
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
