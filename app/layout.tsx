import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Zero Conflict AI",
  description: "Generate conflict-free communication scripts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
