"use client";

import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import moment from "moment";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
// SSR is disabled for Editor component since it uses draft-js which is not compatible with SSR
const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false });
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { firestore } from "@/config/firebase/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

import EditorLeftAside from "./EditorLeftAside";
import EditorRightAside from "./EditorRightAside";
import EditorTopNav from "./EditorTopNav";

import { calculateReadTime, findTitle, pullHastags, pullHeaders, scrollIntoView } from "@/utils/blog.utils";

const storage = getStorage();
const dummyImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/blogopedia-dev.appspot.com/o/blogs%2Fplaceholder.png?alt=media&token=a897007f-e8d1-487e-b318-7d31c6ae7a04";
const editorPlaceholder = "Start writing your blog here...\nRemember that first H1 determines the title of your blog.";

const BlogEditor = ({ id }) => {
  const router = useRouter();
  // Check if user is logged in; redirect to login page if not
  const { data: session, status } = useSession({ required: true });

  // DraftJS Stuffs
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState) => setEditorState(editorState);

  // Fetch blog data from firestore using id with react-firebase-hooks
  const [snapshot, loading, error] = useDocumentOnce(doc(firestore, "blogs", id));

  const [image, setImage] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [blogStatus, setBlogStatus] = useState("draft");
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");

  // Set blog meta data this will be used in the top nav and right aside
  const [blogMeta, setBlogMeta] = useState({
    title: "loading...",
    readTime: 0,
    status: "draft",
    createdAt: "loading...",
    updatedAt: "loading...",
    filename: "loading...",
    autosaving: "loading...",
  });

  // delete document and redirect to home page
  const discardDocument = async () => {
    try {
      const docRef = doc(firestore, "blogs", id);
      await deleteDoc(docRef);
      router.push("/");
    } catch (error) {
      console.log("Error during deletion", error);
    } finally {
      console.log("done deleting");
    }
  };

  // main function to save the blog
  const handleSave = (status = "draft") => {
    setBlogStatus(status);
    setSaving(true);
    if (image) uploadImage(image);
    else setDownloadURL(dummyImageUrl);
  };

  // upload image to firebase storage
  const uploadImage = (file) => {
    if (!session || !file) return;
    const ts = Date.now().toString();
    const path = session?.user?.email?.split("@")[0];
    const storageRef = ref(storage, `blogs/${path}/cover-${ts}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

  // Log the blog data
  useEffect(() => {
    if (!snapshot) return;
    setBlogMeta((prev) => ({
      ...prev,
      title: findTitle(snapshot?.data()?.content) ?? snapshot?.data()?.fileName ?? "Untitled",
      status: snapshot?.data()?.status ?? blogStatus ?? "draft",
      // convert int timestamp (createdAt) to  time ago
      createdAt: moment(snapshot?.data()?.createdAt.seconds * 1000).fromNow(),
      updatedAt: moment(snapshot?.data()?.createdAt.seconds * 1000).fromNow(),
      filename: snapshot?.data()?.fileName ?? "Untitled",
    }));
    //apply the blog content to the editor
    setEditorState(EditorState.createWithContent(convertFromRaw(snapshot?.data()?.content)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot]);

  // listen for changes in downloadURL and upload the blog to firestore
  useEffect(() => {
    if (!downloadURL) return setSaving(false);
    const uploadToFiresotre = async () => {
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      const data = {
        title: findTitle(rawContentState) ?? snapshot?.data()?.title ?? snapshot?.data()?.filename ?? "Untitled",
        content: rawContentState,
        hashtags: hashtags,
        cover: downloadURL,
        toc: headers,
        readTime: calculateReadTime(rawContentState),
        status: blogStatus,
      };
      // fallback to stop the saving animation after 15 seconds
      let fallback = null;
      try {
        fallback = setTimeout(() => {
          setSaving(false);
          setAutoSaveStatus("error");
        }, 15000);
        const docRef = doc(firestore, "blogs", id);
        await updateDoc(docRef, data, { merge: true });
        setAutoSaveStatus("saved");
        setUploadPercentage(0);
        setDownloadURL(null);
      } catch (error) {
        console.log("Error during upload by input", error);
        setAutoSaveStatus("error");
      } finally {
        setSaving(false);
        clearTimeout(fallback);
      }
    };
    uploadToFiresotre();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadURL]);

  // sync the blog to firestore after 15 seconds of unsaved changes
  useEffect(() => {
    // sync the blog to firestore
    const syncBlog = async (rawContentState) => {
      const data = {
        content: rawContentState,
        hashtags: hashtags,
        toc: headers,
        readTime: calculateReadTime(rawContentState),
      };
      let fallback = null;
      try {
        const docRef = doc(firestore, "blogs", id);
        fallback = setTimeout(() => {
          setAutoSaveStatus("error");
        }, 15000);
        await updateDoc(docRef, data, { merge: true });
        setAutoSaveStatus("saved");
      } catch (error) {
        console.log("Error during autosave", error);
        setAutoSaveStatus("error");
      } finally {
        clearTimeout(fallback);
        console.log("done autosaving, sleeping for 20 seconds");
      }
    };

    // timer to trigger syncBlog after 15 seconds
    const saveTimer = setInterval(() => {
      // pull out the rawContentState from editorState
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      console.log(rawContentState);
      setAutoSaveStatus("saving");
      // sync the blog to firestore
      syncBlog(rawContentState);
    }, 30000);

    // clear the timer and interval
    return () => clearInterval(saveTimer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set the autosave status in the top nav
  useEffect(() => setBlogMeta((prev) => ({ ...prev, autosaving: autoSaveStatus })), [autoSaveStatus]);

  // main function to calculate headers, hashtags and read time
  useEffect(() => {
    const debounceCalculation = setTimeout(() => {
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      setHeaders(pullHeaders(rawContentState));
      setHashtags(pullHastags(editorState));
      setBlogMeta((prev) => ({
        ...prev,
        readTime: calculateReadTime(rawContentState),
        title: findTitle(rawContentState) ?? prev.title ?? "Untitled",
      }));
    }, 300);
    return () => clearTimeout(debounceCalculation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

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
            placeholder={editorPlaceholder}
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
