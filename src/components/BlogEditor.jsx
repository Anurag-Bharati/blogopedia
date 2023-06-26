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
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

import { doc } from "firebase/firestore";
import EditorLeftAside from "./EditorLeftAside";
import EditorRightAside from "./EditorRightAside";
import Image from "next/image";

const storage = getStorage();

const BlogEditor = ({ id }) => {
  // Check if user is logged in; redirect to login page if not
  const { data: session, status } = useSession({ required: true });

  const [image, setImage] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  // Fetch blog data from firestore using id with react-firebase-hooks
  const [snapshot, loading, error] = useDocumentOnce(doc(firestore, "blogs", id));
  // Log the blog data
  useEffect(() => console.log(snapshot?.data()), [snapshot]);

  // DraftJS Stuffs
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState) => setEditorState(editorState);

  useEffect(() => {
    if (!setDownloadURL) return;
    const uploadToFiresotre = (type = "draft") => {
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      // to firebase
      const data = {
        title: rawContentState.blocks[0].text,
        content: rawContentState,
        hashtags: hashtags,
        type: type,
      };
      if (image) data.cover = image;
      console.log(data);
    };
    uploadToFiresotre();
    setUploadPercentage(0);
    setSaving(false);
  }, [downloadURL, editorState, hashtags, image]);

  // Save blog to firestore

  const handleSave = (type = "draft") => {
    setSaving(true);
    if (image) uploadImage(image);
    else {
      setSaving(false);
      setUploadPercentage(0);
    }

    // const docRef = doc(firestore, "blogs", id);
  };

  const scrollIntoView = (e) =>
    document.querySelector(`[data-offset-key="${e}-0-0"]`).scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setHashtags(tempHastags);
  };
  // upload image to firebase storage
  const uploadImage = async (file) => {
    if (!session) return;
    const ts = Date.now().toString();
    const path = session?.user?.email?.split("@")[0];
    const storageRef = ref(storage, `blogs/${path}/cover-${ts}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        setUploadPercentage(progress);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadURL(downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    console.log(rawContentState);
    const tempHeaders = [];
    rawContentState.blocks.forEach((block) => {
      if (block.type === "header-one" || block.type === "header-two" || block.type === "header-three") tempHeaders.push(block);
    });
    setHeaders(tempHeaders);
    pullHastags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  return (
    <main className="w-full h-screen text-black ">
      <div className="w-full h-full flex">
        <EditorLeftAside headers={headers} scrollIntoView={scrollIntoView} setImage={setImage} saving={saving} />
        <div className="relative bg-gray-200 grow flex flex-col h-full">
          <div
            className={`absolute w-full h-full bg-[#000000ee] z-30 transition duration-300 ${
              saving ? "opacity-100" : "opacity-0 pointer-events-none"
            } flex flex-col justify-center items-center gap-2`}
          >
            <Image src="/assets/svgs/logo-full.svg" width={128} height={64} alt="Logo" className="animate-pulse py-2" />
            <div className="px-4">
              <div className="h-1 w-48 bg-gray-300 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${uploadPercentage}%` }}></div>
              </div>
            </div>
            <p className="text-white text-sm">Hang tight! Your work is being saved</p>
          </div>
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
        <EditorRightAside session={session} progress={uploadPercentage} tags={hashtags} handleSave={handleSave} saving={saving} />
      </div>
    </main>
  );
};

export default BlogEditor;
