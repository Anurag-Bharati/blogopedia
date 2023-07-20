import { useEffect, useRef, useState } from "react";
import {
  BiCheck,
  BiCopyAlt,
  BiLinkAlt,
  BiLogoFacebookSquare,
  BiLogoMessenger,
  BiLogoTwitter,
  BiLogoWhatsappSquare,
  BiSolidEnvelope,
  BiXCircle,
} from "react-icons/bi";
import { EmailShareButton, FacebookMessengerShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";

const ShareCard = ({ setIsModalOpen, isModalOpen, urlLink }) => {
  const [state, setState] = useState({ copied: false });
  const handleCopy = () => {
    navigator.clipboard.writeText(linkField.current.value);
    setState({ copied: true });
  };

  useEffect(() => {
    let timeout;
    if (state.copied) {
      timeout = setTimeout(() => {
        setState({ copied: false });
        if (isModalOpen.share) setIsModalOpen({ hide: false, share: false });
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [isModalOpen.share, setIsModalOpen, state.copied]);

  const hideModal = () => setIsModalOpen({ hide: false, share: false });

  const linkField = useRef(null);

  return (
    <div className="w-[256px] whitespace-nowrap p-4 rounded-xl  bg-[#222]">
      <div className="flex justify-between items center">
        <div className="flex items-center justify-center">
          <p className="text-xl font-medium">Share this blog?</p>
        </div>
        <div className=" hover:bg-red-500 cursor-pointer  ml-2 font-sans w-6 h-6 flex items-center justify-center rounded-full" onClick={hideModal}>
          <BiXCircle className="w-6 h-6 text-red-400 hover:text-[#222]" />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-base pb-2">Share this link via</p>
        <div className="flex items-center pb-2 justify-between">
          <FacebookShareButton url={urlLink} onClick={hideModal}>
            <BiLogoFacebookSquare className="w-8 h-8 fill-[#4267B2] rounded-md bg-white" />
          </FacebookShareButton>
          <FacebookMessengerShareButton url={urlLink} onClick={hideModal}>
            <BiLogoMessenger className="w-8 h-8 rounded-md fill-[#00B2FF] bg-white" />
          </FacebookMessengerShareButton>
          <WhatsappShareButton url={urlLink} onClick={hideModal}>
            <BiLogoWhatsappSquare className="w-8 h-8 rounded-md fill-[#25D366] bg-white" />
          </WhatsappShareButton>
          <TwitterShareButton url={urlLink} onClick={hideModal}>
            <BiLogoTwitter className="w-8 h-8 rounded-md fill-[#1DA1F2] bg-white" />
          </TwitterShareButton>
          <EmailShareButton url={urlLink} onClick={hideModal}>
            <BiSolidEnvelope className="w-8 p-0.5 h-8 rounded-md bg-white fill-gray-500" />
          </EmailShareButton>
        </div>
        <p className="text-base">Or copy link</p>
        <div className="rounded-md mb-2 border-2 border-[#444] flex justify-between items-center mt-2 py-2 px-2">
          <BiLinkAlt className="w-6 h-6" />
          <input
            className="pl-2 pr-3 w-full outline-none bg-transparent truncate"
            type="text"
            placeholder="link"
            value={urlLink}
            ref={linkField}
            readOnly
          />

          <button
            className={` text-black  text-sm  p-1 rounded-md  ${state.copied ? "bg-green-400 hover:bg-green-500" : "text-white hover:bg-cyan-500"}`}
            onClick={handleCopy}
          >
            {state.copied ? <BiCheck className="h-6 w-6 animate-pulse" /> : <BiCopyAlt className="h-6 w-6" />}
          </button>
        </div>
        <p className={`text-end text-sm text-green-500 h-0 transition-all ${state.copied ? "opacity-100 h-3" : "opacity-0 pointer-events-none"}`}>
          Copied to clipboard
        </p>
      </div>
    </div>
  );
};

export default ShareCard;
