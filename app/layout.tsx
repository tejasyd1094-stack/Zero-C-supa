import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import FooterBranding from "@/components/FooterBranding";

export const metadata = { title: "Zero Conflict — KryptonPath", description: "AI conflict scripts." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main className="container">{children}</main>
          <FooterBranding />
        </Providers>
      </body>
    </html>
  );
}
