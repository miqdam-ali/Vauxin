import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      
      {/* 1. Combined Nav Component */}
      <nav className="w-full border-b border-slate-300 shadow-sm shadow-black/5">
        <section className="  flex justify-between items-center px-4 py-2">
          <div>
            <h1 className="font-mono tracking-widest font-black text-slate-900 text-lg uppercase">
              Todos App
            </h1>
          </div>
          <div className="space-x-4 font-mono text-sm font-bold flex items-center">
            <Link href="/login" className="text-slate-600 hidden md:flex bg-white px-3 py-1.5 rounded-lg  hover:text-slate-900 transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors">
              Register
            </Link>
          </div>
        </section>
      </nav>

      {/* 2. Main Landing Page Body */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl ">
          
          {/* One Large Title */}
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Manage Your Tasks Easily
          </h1>
          
          {/* One Text Description */}
          <p className="text-slate-600 mb-8 font-medium">
            A simple and minimalist todo app designed to help you stay organized and focus on what matters daily.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link 
              href="/signup" 
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg shadow-black/10 hover:bg-slate-950 transition-all text-center block"
            >
              Sign Up
            </Link>
            
            <Link 
              href="/login" 
              className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl border border-slate-200 hover:bg-slate-200 transition-all text-center block"
            >
              Log In
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
