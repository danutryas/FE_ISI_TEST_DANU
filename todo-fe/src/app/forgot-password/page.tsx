"use client";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required.");
      return;
    }

    // Simulating password reset logic
    if (email === "test@example.com") {
      setError("");
      setMessage(
        "If an account with that email exists, a reset link has been sent."
      );
    } else {
      setError("No account found with that email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-[#E5E7EB] px-4">
      <div className="w-full max-w-md bg-[#1F2937] p-6 sm:p-8 rounded-2xl shadow-lg shadow-black/30 backdrop-blur-md border border-white/5">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
          Forgot Password
        </h2>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-500/30">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 text-green-400 p-3 rounded-lg mb-4 text-sm border border-green-500/30">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Enter your email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-[#2A2A2A] text-white placeholder-gray-400 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white py-2.5 rounded-lg font-medium hover:brightness-110 transition duration-200 shadow-md shadow-indigo-500/20"
          >
            Reset Password
          </button>

          <div className="text-center text-sm mt-4 text-gray-400">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-[#6366F1] hover:underline hover:text-indigo-400 transition"
            >
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
