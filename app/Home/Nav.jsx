"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation"; // Extracted to track active route
import Link from "next/link";
import { Menu, X, Home, User, Settings, Info ,Contact } from "lucide-react"; // Icons for clean UI
import { LogOut } from "lucide-react";
import { logout } from "../(auth)/logout/action";
import deleteacc from "../(auth)/deleteacc/action";
import { useToast } from "../../Toast";
const Navbar = () => {
  //Toast State
  const { askConfirm, runAction, ToastUI } = useToast();
  //handling Logout
  const handleLogout = (e) => {
    if (e) e.preventDefault();
    askConfirm(
      "Are you sure you want to log out?",
      async () => {
        await logout();
      },
      "Logged Out Successfully! 👋",
    );
  };
  //Handling Delete Account
  const handleDeleteAcc = (e) =>{
  if(e) e.preventDefault()
    askConfirm(
  'Are you sure you want to delete your Account?',
  async  () => {
  await deleteacc()
  },
  'Account Deleted SuccesFully'
    )
}
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); 

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/Home", icon: <Home className="w-5 h-5" /> },
    {
      name: "Profile",
      href: "/Home/Profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      name: "Settings",
      href: "/Home/SetUpProfile",
      icon: <Settings className="w-5 h-5" />,
    },
     {
      name: "Feedback",
      href: "/Home/FeedBack",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      name: "About me",
      href: "/Home/AboutDeveloper",
      icon: <Contact className="w-5 h-5" />,
    },

  ];

  return (
    <main>
      <nav className=" fixed w-full bg-white/30 p-3 shadow-sm backdrop-blur-md">
        <div className="flex justify-between items-center mx-3">
          <span className="font-bold  text-black font-mono tracking-widest text-xl">Vauxin</span>

          {/* Desktop Navbar View */}
          <div className="hidden md:flex space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={link.onClick}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                    isActive
                      ? "bg-black text-white" // Active Route styling
                      : "text-slate-600 hover:bg-slate-100 hover:text-black" // Idle Route styling
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => toggleMenu()}
            className="md:hidden text-black z-50"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Backdrop & Drawer Panel */}
      </nav>
      {isOpen && (
        <section className="fixed inset-0 flex justify-end md:hidden z-999">
          {/* Blur Backdrop */}
          <div
            className="fixed inset-0 bg-transparent backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Side Drawer Content */}
          <div className="relative w-55 h-full   rounded-tl-3xl rounded-bl-3xl bg-white p-6 shadow-xl flex flex-col z-99 space-y-4">
            <div className="flex justify-between flex-col h-full">
              <div>
                <button
                  onClick={() => setIsOpen(false)}
                  className=" text-black"
                >
                  <X />
                </button>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        if (link.onClick) link.onClick();
                        setIsOpen(false);
                      }}
                      className={`flex items-center tracking-wide gap-3 mt-2 px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                        isActive
                          ? "bg-black text-white font-bold" // Active styling for Mobile
                          : "text-slate-700 hover:bg-slate-100" // Idle styling for Mobile
                      }`}
                    >
                      {link.icon}
                      {link.name}
                    </Link>
                  );
                })}
              </div>
              <div className="w-full flex justify-center items-center flex-col gap-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex flex-row justify-around text-center border font-mono border-slate-300 text-slate-700 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
                >
                  <span>Logout</span>
                  <span className="flex self-end">
                    <LogOut className="w-5 h-5" />
                  </span>
                </button>

                <button
                  onClick={handleDeleteAcc}
                  className="w-full block font-mono text-center bg-red-800 text-xs font-medium hover:underline py-2.5 rounded-lg"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      <ToastUI />
    </main>
  );
};

export default Navbar;
