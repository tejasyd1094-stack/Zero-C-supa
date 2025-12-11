import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import FooterBranding from "@/components/FooterBranding";

export const metadata = {
  title: "Zero Conflict",
  description: "AI Dialogue Engine for difficult workplace conversations"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers />
        <div className="max-w-5xl mx-auto px-4">
          <Navbar />
          <main>{children}</main>
          <FooterBranding />
        </div>
      </body>
    </html>
  );
}