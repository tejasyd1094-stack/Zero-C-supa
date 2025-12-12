"use client";

export default function ActionButtons({ text }: { text: string }) {
  function copyText() {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }

  function shareNative() {
    if (navigator.share) {
      navigator.share({
        title: "Zero Conflict Script",
        text
      });
    } else {
      alert("Sharing not supported on this device");
    }
  }

  function sendWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  function sendEmail() {
    const url = `mailto:?subject=Zero Conflict Script&body=${encodeURIComponent(text)}`;
    window.location.href = url;
  }

  return (
    <div className="mt-4 flex gap-3 flex-wrap">
      <button
        onClick={copyText}
        className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20"
      >
        Copy
      </button>

      <button
        onClick={shareNative}
        className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20"
      >
        Share
      </button>

      <button
        onClick={sendWhatsApp}
        className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20"
      >
        WhatsApp
      </button>

      <button
        onClick={sendEmail}
        className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20"
      >
        Email
      </button>
    </div>
  );
}
