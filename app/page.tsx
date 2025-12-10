import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">

      {/* Header Section */}
      <header className="mb-10 text-center">
        <Image
          src="/logo.png"
          alt="Zero Conflict Logo"
          width={120}
          height={120}
          className="mx-auto"
        />

        <h1 className="text-4xl font-bold mt-5">Zero-Conflict</h1>
        <p className="text-lg text-gray-600 mt-2">
          AI that helps corporate professionals navigate difficult conversations.
        </p>
      </header>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">

        <div className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Conflict Scripts</h2>
          <p className="mt-2 text-gray-600">
            Get AI-generated messages for tough workplace situations.
          </p>
        </div>

        <div className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Role-Based Tones</h2>
          <p className="mt-2 text-gray-600">
            Manager, peer, direct-report — tailored communication.
          </p>
        </div>

        <div className="border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold">One Click Delivery</h2>
          <p className="mt-2 text-gray-600">
            Export messages instantly for email, Teams, or WhatsApp.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="mt-14 text-sm text-gray-500">
        © {new Date().getFullYear()} Zero-Conflict — Empowering workplace clarity.
      </footer>
    </main>
  );
}