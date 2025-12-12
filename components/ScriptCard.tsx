"use client";

import ActionButtons from "./ActionButtons";

export default function ScriptCard({
  type,
  text
}: {
  type: string;
  text: string;
}) {
  return (
    <div className="p-6 bg-[#081224] rounded-2xl border border-white/10 shadow-lg">
      <div className="font-semibold text-lg mb-2">{type} Script</div>

      <p className="text-white/80 whitespace-pre-wrap leading-relaxed">
        {text}
      </p>

      <ActionButtons text={text} />
    </div>
  );
}
