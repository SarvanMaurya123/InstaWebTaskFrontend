import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-orange-50 flex flex-col">
      
      {/* Navbar */}
      <header className="w-full flex items-center justify-between px-8 py-5 border-b bg-white/70 backdrop-blur">
        <h1 className="text-xl font-bold text-orange-600">
          LeadCRM
        </h1>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-md border border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-4 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Manage Your Leads  
            <span className="text-orange-600"> Smarter & Faster</span>
          </h2>

          <p className="mt-5 text-gray-600 text-lg">
            A simple CRM system to track, manage, and convert your leads efficiently.
            Stay organized and grow your business effortlessly.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}