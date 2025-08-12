
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold">AI Learning</h1>
      <div className="flex gap-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/quiz" className="hover:underline">
          Quiz
        </Link>
        <Link href="/sign-in" className="hover:underline">
          Sign In
        </Link>
        <Link href="/sign-up" className="hover:underline">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
