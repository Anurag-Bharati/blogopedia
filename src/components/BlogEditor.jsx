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

import { deleteDoc, doc } from "firebase/firestore";
import EditorLeftAside from "./EditorLeftAside";
import EditorRightAside from "./EditorRightAside";
import Image from "next/image";
import moment from "moment";
import EditorTopNav from "./EditorTopNav";
import { useRouter } from "next/navigation";

import { calculateReadTime, findTitle, pullHastags, pullHeaders, scrollIntoView } from "@/utils/blog.utils";

const storage = getStorage();
const dummyImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/blogopedia-dev.appspot.com/o/blogs%2Fplaceholder.png?alt=media&token=a897007f-e8d1-487e-b318-7d31c6ae7a04";

const BlogEditor = ({ id }) => {
  const router = useRouter();
  // Check if user is logged in; redirect to login page if not
  const { data: session, status } = useSession({ required: true });

  const [image, setImage] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [blogStatus, setBlogStatus] = useState("unsaved");

  // Fetch blog data from firestore using id with react-firebase-hooks
  const [snapshot, loading, error] = useDocumentOnce(doc(firestore, "blogs", id));

  const [blogMeta, setBlogMeta] = useState({
    title: "loading...",
    readTime: 0,
    status: "unsaved",
    createdAt: "loading...",
    updatedAt: "loading...",
    filename: "loading...",
  });

  // Log the blog data
  useEffect(() => {
    if (!snapshot) return;
    setBlogMeta((prev) => ({
      ...prev,
      title: findTitle(snapshot?.data()?.content) ?? snapshot?.data()?.fileName ?? "Untitled",
      status: snapshot?.data()?.status ?? blogStatus ?? "unsaved",
      // convert int timestamp (createdAt) to  time ago
      createdAt: moment(snapshot?.data()?.createdAt.seconds * 1000).fromNow(),
      updatedAt: moment(snapshot?.data()?.createdAt.seconds * 1000).fromNow(),
      filename: snapshot?.data()?.fileName ?? "Untitled",
    }));
  }, [blogStatus, snapshot]);

  // DraftJS Stuffs
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState) => setEditorState(editorState);

  // delete document and redirect to home page
  const discardDocument = () => {
    const docRef = doc(firestore, "blogs", id);
    deleteDoc(docRef);
    router.push("/");
  };

  // listen for changes in downloadURL and upload the blog to firestore
  useEffect(() => {
    console.log("Inside useEffect of setDownloadURL");
    if (!setDownloadURL) return setSaving(false);
    const uploadToFiresotre = () => {
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      const data = {
        title: findTitle(rawContentState) ?? snapshot?.data()?.fileName ?? "Untitled",
        content: rawContentState,
        hashtags: hashtags,
        cover: downloadURL,
        toc: headers,
        readTime: calculateReadTime(rawContentState),
        status: blogStatus,
      };
      console.log(data);
    };
    uploadToFiresotre();
    setUploadPercentage(0);
    setSaving(false);
    setDownloadURL(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadURL]);

  // main function to save the blog
  const handleSave = (status = "draft") => {
    setBlogStatus(status);
    setSaving(true);
    console.log("saving...");
    if (image) uploadImage(image);
    else setDownloadURL(dummyImageUrl);
  };

  // upload image to firebase storage
  const uploadImage = async (file) => {
    console.log("Inside uploadImage");
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
    setHeaders(pullHeaders(rawContentState));
    setHashtags(pullHastags(editorState));
    const updateBlogMeta = () => {
      setBlogMeta((prev) => ({
        ...prev,
        filename: snapshot?.data()?.fileName ?? "Untitled",
        readTime: calculateReadTime(rawContentState),
        blogStatus: blogStatus,
        title: findTitle(rawContentState) ?? snapshot?.data()?.fileName ?? "Untitled",
      }));
    };
    updateBlogMeta();
  }, [editorState, blogStatus, hashtags, snapshot]);

  return (
    <main className="w-full h-screen text-black ">
      <div className="w-full h-full flex">
        <EditorLeftAside headers={headers} scrollIntoView={scrollIntoView} setImage={setImage} saving={saving} />
        <div className="relative bg-gray-200 grow flex flex-col h-full">
          {/* Overlay */}
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
          {/* Top Navigation */}
          <EditorTopNav discardDocument={discardDocument} blogMeta={blogMeta} />
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
        <EditorRightAside session={session} progress={uploadPercentage} tags={hashtags} handleSave={handleSave} saving={saving} blogMeta={blogMeta} />
      </div>
    </main>
  );
};

export default BlogEditor;
