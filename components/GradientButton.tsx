"use client";

export default function GradientButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={`px-5 py-3 rounded-xl font-semibold text-white shadow-lg
      bg-gradient-to-br from-[#21D4FD] to-[#B721FF] hover:opacity-95 transition
      ${className}`}
    >
      {children}
    </button>
  );
}