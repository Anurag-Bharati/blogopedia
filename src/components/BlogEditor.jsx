"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { EditorState, convertToRaw } from "draft-js";
// SSR is disabled for Editor component since it uses draft-js which is not compatible with SSR
const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false });
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { firestore } from "@/config/firebase/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import EditorLeftAside from "./EditorLeftAside";
import EditorRightAside from "./EditorRightAside";

const BlogEditor = ({ id }) => {
  // Check if user is logged in; redirect to login page if not
  const { data: session, status } = useSession({ required: true });
  const [headers, setHeaders] = useState([]);
  const [hastags, setHastags] = useState([]);
  // Fetch blog data from firestore using id with react-firebase-hooks
  const [snapshot, loading, error] = useDocumentOnce(doc(firestore, "blogs", id));

  // Log the blog data
  useEffect(() => console.log(snapshot?.data()), [snapshot]);

  // DraftJS Stuffs
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState) => setEditorState(editorState);
  const handleSaveDraft = () => null;
  const handlePublish = () => null;

  const scrollIntoView = (e) =>
    document.querySelector(`[data-offset-key="${e}-0-0"]`).scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

  const pullHastags = () => {
    const tempHastags = [];
    editorState
      .getCurrentContent()
      .getBlocksAsArray()
      .forEach((block) => {
        if (block.getType() === "unstyled") {
          const text = block.getText();
          // hashtag regex
          const ht = text.match(/#[a-z]+/gi);
          // clean the ht
          if (ht) {
            ht.forEach((h) => {
              const clean = h.replace("#", "");
              if (!tempHastags.includes(clean)) tempHastags.push(clean);
            });
          }
        }
      });
    setHastags(tempHastags);
  };

  useEffect(() => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    console.log(rawContentState);
    const tempHeaders = [];
    rawContentState.blocks.forEach((block) => {
      if (block.type === "header-one" || block.type === "header-two" || block.type === "header-three") tempHeaders.push(block);
    });
    setHeaders(tempHeaders);
  }, [editorState]);

  return (
    <main className="w-full h-screen text-black ">
      <div className="w-full h-full flex">
        <EditorLeftAside headers={headers} scrollIntoView={scrollIntoView} />
        <div className="bg-gray-200 grow flex flex-col h-full">
          <Editor
            editorState={editorState}
            wrapperClassName="max-w-3xl mx-auto h-full w-full  flex flex-col [&>.rdw-editor-main]:flex-1 !overflow-hidden"
            toolbarClassName="gap-1 [&>div]:border-r [&>div]:pr-1 [&>div>*]:!border-none [&>div>*]:hover:!shadow-none !mb-0 [&>div>.rdw-option-active]:bg-[#2dcdff] override-scroll-bar"
            editorClassName="bg-white pb-0 px-[5%] pt-[3%] override-scroll-bar-all"
            onEditorStateChange={onEditorStateChange}
            hashtag={{
              separator: " ",
              trigger: "#",
            }}
            toolbar={{
              options: ["inline", "blockType", "fontSize", "fontFamily", "list", "textAlign", "link", "emoji", "image", "history"],
              blockType: {
                inDropdown: false,
                options: ["Normal", "H1", "H2", "H3", "Blockquote", "Code"],
              },
              inline: { inDropdown: false, options: ["bold", "italic", "underline", "strikethrough", "monospace"] },
              list: { inDropdown: false, options: ["unordered", "ordered"] },
              textAlign: { inDropdown: false },
              link: { inDropdown: true },
              history: { inDropdown: false },
            }}
          />
        </div>
        <EditorRightAside />
      </div>
    </main>
  );
};

export default BlogEditor;
{
  /* 
    

<Editor
editorState={editorState}
wrapperClassName="max-w-6xl mx-auto min-h-screen flex flex-col [&>.rdw-editor-main]:flex-1 "
toolbarClassName="gap-1 [&>div]:border-r [&>div]:pr-1 [&>div>*]:!border-none [&>div>*]:hover:!shadow-none !mb-0 [&>div>.rdw-option-active]:bg-[#2dcdff] override-scroll-bar"
editorClassName="bg-white  pb-10 px-[5%] pt-[3%] mb-10"
onEditorStateChange={onEditorStateChange}
/>
<div className="flex justify-end gap-4 px-4">
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSaveDraft}>
  Save as Draft
</button>
<button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handlePublish}>
  Publish
</button>
</div> */
}
