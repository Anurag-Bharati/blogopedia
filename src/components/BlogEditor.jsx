"use client";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import moment from "moment";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
// SSR is disabled for Editor component since it uses draft-js which is not compatible with SSR
const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false });
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { firestore } from "@/config/firebase/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

import EditorLeftAside from "./EditorLeftAside";
import EditorRightAside from "./EditorRightAside";
import EditorTopNav from "./EditorTopNav";

import { calculateReadTime, isArrayDifferent, findTitle, pullHastags, pullHeaders, scrollIntoView, getCleanPlainText } from "@/utils/blog.utils";
import { getTLDR } from "@/app/actions";
import InfiniteLinearProgressBar from "./InfiniteLinearProgressBar";

const storage = getStorage();
const dummyImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/blogopedia-dev.appspot.com/o/blogs%2Fplaceholder.png?alt=media&token=a897007f-e8d1-487e-b318-7d31c6ae7a04";
const editorPlaceholder = "Start writing your blog here...\nRemember that first H1 determines the title of your blog.";

const BlogEditor = ({ id, useTLDR = false }) => {
  const router = useRouter();
  // Check if user is logged in; redirect to login page if not
  const { data: session } = useSession({ required: true });

  // DraftJS Stuffs
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorState) => setEditorState(editorState);

  // use useMemo for docRef
  const docRef = useMemo(() => doc(firestore, "blogs", id), [id]);
  // Fetch blog data from firestore using id with react-firebase-hooks
  const [snapshot, loading, error] = useDocumentOnce(docRef);

  const [image, setImage] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [blogStatus, setBlogStatus] = useState("draft");
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");
  const [lastSaved, setLastSaved] = useState(null);
  const [exitOnSave, setExitOnSave] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

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
      await deleteDoc(docRef);
      router.replace("/profile#myblogs");
    } catch (error) {
      console.log("Error during deletion", error);
    } finally {
      console.log("done deleting");
    }
  };

  // main function to save the blog
  const handleSave = (status = "draft", exit = false) => {
    setSaving(true);
    setExitOnSave(exit);
    setBlogStatus(status);
    setUploadStatus("uploading assets");
    if (image) uploadImage(image);
    else setDownloadURL(dummyImageUrl);
  };

  // upload image to firebase storage
  const uploadImage = (file) => {
    setUploadPercentage(0);
    if (!session || !file) return;
    const ts = Date.now().toString();
    const path = session?.user?.email?.split("@")[0];
    const storageRef = ref(storage, `blogs/${path}/cover-${ts}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (!saving) setSaving(true);
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
    else if (!snapshot.exists()) return notFound();
    setBlogStatus(snapshot?.data()?.status ?? blogStatus ?? "draft");
    setCoverImage(snapshot?.data()?.cover ?? dummyImageUrl);
    setBlogMeta((prev) => ({
      ...prev,
      title: findTitle(snapshot?.data()?.content) ?? snapshot?.data()?.fileName ?? "Untitled",
      status: blogStatus,
      // convert int timestamp (createdAt) to  time ago
      createdAt: moment(snapshot?.data()?.createdAt.seconds * 1000).fromNow(),
      updatedAt: moment(snapshot?.data()?.updatedAt.seconds * 1000).fromNow(),
      filename: snapshot?.data()?.fileName ?? "Untitled",
    }));
    //apply the blog content to the editor
    if (snapshot?.data()?.content) setEditorState(EditorState.createWithContent(convertFromRaw(snapshot?.data()?.content)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot]);

  // listen for changes in downloadURL and upload the blog to firestore
  useEffect(() => {
    if (!downloadURL || !docRef || !editorState || !snapshot) return setSaving(false);
    const uploadToFiresotre = async () => {
      const rawContentState = convertToRaw(editorState.getCurrentContent());

      // get the clean plain text from the editor
      const plainText = getCleanPlainText(rawContentState);
      console.log("plainText", plainText);
      // generate TLDR
      let tldr = null;
      if (useTLDR) tldr = await getTLDR(plainText);
      const data = { cover: image ? downloadURL : coverImage, tldr: tldr ?? snapshot?.data()?.tldr ?? null, status: blogStatus };

      // fallback to stop the saving animation after 15 seconds
      let fallback = null;
      fallback = setTimeout(() => {
        setSaving(false);
        setAutoSaveStatus("error");
      }, 15000);

      try {
        await updateDoc(docRef, data, { merge: true });
        setAutoSaveStatus("saved");
        if (exitOnSave) setUploadStatus("redirecting...");
        else setUploadStatus("data saved");
        setTimeout(() => {
          if (exitOnSave) {
            setExitOnSave(false);
            router.replace("/profile#myblogs");
          } else {
            setDownloadURL(null);
            setSaving(false);
          }
        }, 2000);
      } catch (error) {
        console.log("Error during upload by input", error);
        setAutoSaveStatus("error");
        setSaving(false);
        setUploadStatus("saving error");
      } finally {
        clearTimeout(fallback);
      }
    };
    const debounceReq = setTimeout(() => {
      setUploadStatus("syncing with firestore");
      uploadToFiresotre();
    }, 1000);
    return () => clearTimeout(debounceReq);
  }, [docRef, downloadURL, editorState, useTLDR, blogStatus, exitOnSave, router, image, coverImage, snapshot]);

  // sync the blog to firestore after 15 seconds of unsaved changes
  useEffect(() => {
    // sync the blog to firestore
    const syncBlog = async (rawContentState) => {
      const data = {
        content: rawContentState,
        tags: hashtags,
        toc: headers,
        readTime: calculateReadTime(rawContentState),
        updatedAt: serverTimestamp(),
        title: findTitle(rawContentState) ?? snapshot?.data()?.title ?? snapshot?.data()?.filename ?? "Untitled",
      };
      let fallback = null;
      try {
        fallback = setTimeout(() => {
          setAutoSaveStatus("error");
        }, 15000);
        await updateDoc(docRef, data, { merge: true });
        const newDoc = await getDoc(docRef);
        if (newDoc.exists()) {
          const updatedAt = moment(newDoc?.data()?.updatedAt.seconds * 1000).fromNow();
          setLastSaved(updatedAt);
        }
        setTimeout(() => {
          setAutoSaveStatus("saved");
        }, 3000);
      } catch (error) {
        console.log("Error during autosave", error);
        setTimeout(() => {
          setAutoSaveStatus("error");
        }, 3000);
      } finally {
        clearTimeout(fallback);
      }
    };

    // run this once
    if (!docRef) return;
    // pull out the rawContentState from editorState
    const rawContentState = convertToRaw(editorState.getCurrentContent());

    // dont make editor state constently trigger autosave
    // timer to trigger syncBlog after 15 seconds
    const saveTimer = setTimeout(() => {
      setAutoSaveStatus("saving");
      // sync the blog to firestore
      syncBlog(rawContentState);
    }, 3000);

    return () => clearTimeout(saveTimer);
    // return () => clearInterval(saveTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docRef, hashtags, headers, editorState]);

  // set the autosave status in the top nav
  useEffect(() => setBlogMeta((prev) => ({ ...prev, autosaving: autoSaveStatus })), [autoSaveStatus]);

  // set lastSaved in the top nav
  useEffect(() => setBlogMeta((prev) => ({ ...prev, lastSaved: lastSaved })), [lastSaved]);

  // main function to calculate headers, hashtags and read time
  useEffect(() => {
    const debounceCalculation = setTimeout(() => {
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      const newHeaders = pullHeaders(rawContentState);
      const newHashtags = pullHastags(editorState);
      // compare with old headers and hashtags to avoid unnecessary rerenders
      isArrayDifferent(newHeaders, headers) && setHeaders(newHeaders);
      isArrayDifferent(newHashtags, hashtags) && setHashtags(newHashtags);

      setBlogMeta((prev) => ({
        ...prev,
        status: blogStatus,
        readTime: calculateReadTime(rawContentState),
        title: findTitle(rawContentState) ?? prev.title ?? "Untitled",
      }));
    }, 300);
    return () => clearTimeout(debounceCalculation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState, blogStatus]);

  // TODO : Implement the following in separate components
  if (loading) return <div className="w-full h-screen flex justify-center items-center">Loading...</div>;
  if (error) return <div className="w-full h-screen flex justify-center items-center">Error: {error.message}</div>;
  if (!snapshot.exists()) return <div className="w-full h-screen flex justify-center items-center">Document does not exist</div>;
  // check if user is the owner of the blog
  if (!loading && snapshot && snapshot?.data()?.author.email !== session?.user?.email)
    return <div className="w-full h-screen flex justify-center items-center"> Unauthorized </div>;
  return (
    <main className="w-full h-screen text-black ">
      <div className="w-full h-full flex">
        <EditorLeftAside
          headers={headers}
          scrollIntoView={scrollIntoView}
          setImage={setImage}
          saving={saving}
          coverLink={coverImage}
          setCoverLink={setCoverImage}
        />
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
                {image && uploadPercentage < 99.0 ? (
                  <div className="h-full bg-[#a3e635] rounded-full" style={{ width: `${uploadPercentage}%` }}></div>
                ) : (
                  <InfiniteLinearProgressBar />
                )}
              </div>
            </div>
            <p className="text-white text-sm">Hang tight! Your work is being saved</p>
            <p className="text-white text-sm">{uploadStatus}</p>
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
