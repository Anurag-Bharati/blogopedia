"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { EditorState } from "draft-js";
// SSR is disabled for Editor component since it uses draft-js which is not compatible with SSR
const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false });
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { firestore } from "@/config/firebase/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";

const BlogEditor = ({ id }) => {
  // Check if user is logged in; redirect to login page if not
  const { data: session, status } = useSession({ required: true });

  // Fetch blog data from firestore using id with react-firebase-hooks
  const [snapshot, loading, error] = useDocumentOnce(doc(firestore, "blogs", id));

  // Log the blog data
  useEffect(() => console.log(snapshot?.data()), [snapshot]);

  // DraftJS Stuffs
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState) => setEditorState(editorState);
  const handleSaveDraft = () => null;
  const handlePublish = () => null;

  return (
    <div className="w-full h-full text-black ">
      <header className="[&>*]:!border-none ">TEST</header>
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
      </div>
    </div>
  );
};

export default BlogEditor;
