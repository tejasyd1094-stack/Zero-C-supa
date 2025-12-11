"use client";

import { useState, useRef } from "react";
import ScriptCard from "./ScriptCard";

export default function ScriptCarousel({ scripts }: any) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollTo(i: number) {
    setIndex(i);
    scrollRef.current?.scrollTo({
      left: i * window.innerWidth * 0.9,
      behavior: "smooth"
    });
  }

  return (
    <div className="mt-10">
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll snap-x snap-mandatory space-x-6 pb-4 no-scrollbar"
        style={{ width: "100%" }}
        onScroll={(e) => {
          const x = (e.target as HTMLDivElement).scrollLeft;
          const w = window.innerWidth * 0.9;
          const newIndex = Math.round(x / w);
          setIndex(newIndex);
        }}
      >
        {scripts.map((s: any, i: number) => (
          <div key={i} className="snap-center" style={{ minWidth: "90%" }}>
            <ScriptCard {...s} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {scripts.map((_: any, i: number) => (
          <div
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-3 w-3 rounded-full cursor-pointer transition ${
              i === index ? "bg-[#21D4FD]" : "bg-white/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
