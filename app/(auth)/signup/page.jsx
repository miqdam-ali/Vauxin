"use client";
import React from "react";
import Link from "next/link";
import { signup } from "./action";
import { useToast } from "../../../Toast";
import { useRouter } from "next/navigation";
const SignUpPage = () => {
  // Initiliaze Toast
  const { runAction, ToastUI } = useToast();
  //Navigator
  const router = useRouter();
  
  //Handling Sign Up Submission
  const handleSignUp = (e) => {
  if (e) e.preventDefault();
  const formData = new FormData(e.currentTarget);

  runAction(
    async () => {
      const res = await signup(formData);
      if (res?.error) {
        throw new Error(res.error || "Failed to Create Account");
      } else {
        router.push("/Home");
      }
    }, 
    "Account Created Successfully! 🚀"
  );
};

  return (
    <div className="min-h-screen bg-slate-300 flex justify-center items-center p-4 backdrop-blur-xl">
      {/* White structure box with 10% black shadow */}
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg shadow-black/10">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Sign Up</h2>

        <form onSubmit={handleSignUp} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-slate-900"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-slate-900"
            required
          />

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-black transition-colors"
          >
            Create Account
          </button>
        </form>

        <p className="text-xs text-slate-600 mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline font-bold text-slate-900">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
