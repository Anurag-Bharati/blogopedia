"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiSolidVolume, BiSolidVolumeFull, BiSolidVolumeLow, BiSolidVolumeMute } from "react-icons/bi";
import { FaPlay, FaPause, FaStop, FaHeadphonesAlt } from "react-icons/fa";

function BlogopediaUtterance({ text = null }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!utteranceRef.current) {
      utteranceRef.current = new SpeechSynthesisUtterance();
      utteranceRef.current.text = text;
    }

    const handleBoundary = (event) => {
      const currentIndex = event.charIndex;
      const totalLength = utteranceRef.current.text.length;
      const calculatedProgress = Math.floor((currentIndex / totalLength) * 100);
      setProgress(calculatedProgress);
    };

    utteranceRef.current.addEventListener("boundary", handleBoundary);

    return () => {
      utteranceRef.current.removeEventListener("boundary", handleBoundary);
      window.speechSynthesis.cancel();
    };
  }, [text]);

  const handlePlay = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else if (window.speechSynthesis.speaking) {
      return;
    } else {
      window.speechSynthesis.speak(utteranceRef.current);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
    }
    setProgress(0);
    setIsPlaying(false);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    utteranceRef.current.volume = newVolume;
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
        window.speechSynthesis.cancel();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="relative max-w-5xl w-full mx-auto p-4 border-2 border-gray-200 rounded-lg ">
      <div className="absolute right-0 -bottom-10 opacity-50 flex justify-center items-center gap-1 select-none pointer-events-none">
        <span className="text-xs">powered by</span>
        <Image src="/assets/svgs/logo-full.svg" alt="Blogopedia" width={48} height={48} className=" invert h-12 w-12" />
      </div>

      <div className="flex justify-center items-center gap-2 pb-2">
        <FaHeadphonesAlt className="text-xl text-gray-500" />
        <span className="text-lg text-gray-500 uppercase font-medium tracking-wide">Play this Blog</span>
      </div>
      <div className="flex items-center md:flex-row flex-col">
        <div className="flex items-center w-full">
          <button className="p-2 rounded-full  text-gray-500" onClick={handlePause} disabled={!isPlaying}>
            <FaPause />
          </button>
          <button className="p-2 rounded-full  text-gray-500" onClick={handlePlay} disabled={isPlaying}>
            <FaPlay />
          </button>
          <div className="w-full  h-4 bg-gray-300 rounded-md">
            <div className="h-full bg-blue-500  rounded-md transition-all duration-1000  ease-in-out" style={{ width: `${progress}%` }}></div>
          </div>
          <button className="p-2 rounded-full  text-gray-500" onClick={handleStop}>
            <FaStop />
          </button>
        </div>
        <div className="flex w-fill">
          <div className="p-2 text-xl text-gray-500">
            {volume === 0 && <BiSolidVolumeMute />}
            {volume > 0 && volume <= 0.3 && <BiSolidVolume />}
            {volume > 0.3 && volume <= 0.7 && <BiSolidVolumeLow />}
            {volume > 0.7 && <BiSolidVolumeFull />}
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-grow mr-4 "
            disabled={isPlaying}
          />
        </div>
      </div>
    </div>
  );
}
export default BlogopediaUtterance;
