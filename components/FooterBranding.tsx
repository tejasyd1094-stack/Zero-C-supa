export default function FooterBranding() {
  return (
    <footer className="text-center p-6 text-gray-400 text-sm">
      © {new Date().getFullYear()} Kryptonpath.com  
      <br />
      For business queries: business@kryptonpath.com
    </footer>
  );
}