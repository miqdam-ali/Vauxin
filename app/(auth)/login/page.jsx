'use client'
import React from 'react'
import Link from 'next/link'
import login from './action'
import { useRouter } from 'next/navigation'
import { useToast } from '../../../Toast'

const LoginPage = () => {
  const { runAction, ToastUI } = useToast() // Removed unused askConfirm
  const router = useRouter()

  const handleLogin = (e) => {
  if (e) e.preventDefault(); 

  const formData = new FormData(e.currentTarget);

  runAction(
    async () => {
      const res = await login(formData);
      
      if (res?.success) {
        router.push('/Home');
      } else {
        throw new Error(res?.error || 'Wrong Password or Email!');
      }
    },
    'Welcome Back! Login Successful 🚀' 
  );
};


  return (
    <div className="min-h-screen bg-slate-300 flex justify-center items-center p-4 backdrop-blur-xl">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg shadow-black/10">
        
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Log In
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-3">
          <input 
            type="email" 
            name='email'
            placeholder="Email" 
            className="w-full p-2.5 outline-none bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-slate-900" 
            required 
          />
          <input 
            type="password" 
            name='password'
            placeholder="Password" 
            className="w-full p-2.5 outline-none bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-slate-900" 
            required 
          />
          
          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-black transition-colors"
          >
            Log In
          </button>
        </form>

        <p className="text-xs text-slate-600 mt-4 text-center">
          Don't have an account? <Link href="/signup" className="underline font-bold text-slate-900">Sign up</Link>
        </p>

      </div>
      <ToastUI/>
    </div>
  )
}

export default LoginPage
