"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/header";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // ✅ Disable button during login

    try {
      await login(email, password);
      router.push("/dashboard"); // ✅ Redirect user to Dashboard after login
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message) 
      } else {
        setError("Invalid email or password. Please try again.")
      }
    } finally {
      setLoading(false); // ✅ Re-enable button after request
    }
  }; 

  return (
    <div className="h-screen flex flex-col">
      {/* ✅ Ensure Header is NOT affected by blur */}
      <Header />

      {/* Blurred Background */}
      <div className="relative flex-1 text-gray-600">
        <div className="absolute inset-0 bg-[url('/dashboard.png')] bg-cover bg-center blur-xl"></div>

        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-xl"></div>

        {/* Login Form */}
        <div className="flex justify-center items-center h-full relative z-10">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <form onSubmit={handleLogin} className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <button
                type="submit"
                className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50"
                disabled={loading} // ✅ Disable button when loading
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-sm text-center mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-green-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
