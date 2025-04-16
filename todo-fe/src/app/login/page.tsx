"use client";
import Axios from "@/lib/Axios";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!email || !password) {
    //   setError("Email and password are required.");
    //   return;
    // }

    // if (email === "test@example.com" && password === "password123") {
    //   setError("");
    //   alert("Login successful!");
    // } else {
    //   setError("Invalid email or password.");
    // }
    try {
      const res = await Axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });
      setError("");
      const { token, data } = res.data;

      // Save the token and user data to sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      router.push("/todo"); // Redirect to /todo
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Handle 401 error (Unauthorized)
          setError(error.response.data.message || "Unauthorized");
        } else {
          // Handle other types of errors
          setError(
            error.response?.data.message || "An unexpected error occurred"
          );
        }
      } else {
        // Handle non-Axios errors
        setError("Error: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-[#E5E7EB] px-4">
      <div className="w-full max-w-md bg-[#1F2937] p-6 sm:p-8 rounded-2xl shadow-lg shadow-black/30 backdrop-blur-md border border-white/5">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
          Welcome Back
        </h2>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-[#2A2A2A] text-white placeholder-gray-400 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#2A2A2A] text-white placeholder-gray-400 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition"
            />
          </div>

          <div className="text-right text-sm">
            <a
              href="/forgot-password"
              className="text-[#6366F1] hover:underline hover:text-indigo-400 transition"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white py-2.5 rounded-lg font-medium hover:brightness-110 transition duration-200 shadow-md shadow-indigo-500/20"
            onClick={handleSubmit}
          >
            Login
          </button>

          <div className="text-center text-sm mt-4 text-gray-400">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-[#6366F1] hover:underline hover:text-indigo-400 transition"
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
