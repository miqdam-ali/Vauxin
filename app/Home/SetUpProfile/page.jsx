"use client";
import React, { useRef, useState } from "react";
import {
  AddUserName,
  UplaodAvatar,
  AddBio,
  AddEdu,
  DOB,
} from "../../(actions)/action";
import { useToast } from "../../../Toast";
 
const Page = () => {
  //States
  const fileinputRef = useRef(null);
  const [isSelectFile, setisSelectFile] = useState(null);
  const [dob, setDob] = useState({ month: "", day: "", year: "" });
  const [isOpendateofBirth, setisOpendateofBirth] = useState(false);
  const [isOpenEdu, setisOpenEdu] = useState(false);
  const [isOpenBio, setIsOpenBio] = useState(false);
  const [bio, setbio] = useState();
  const [edu, setedu] = useState();
  const [username, setusername] = useState();
  
  //Toast
  const { askConfirm, runAction, ToastUI } = useToast();
 
  //Date of Birth Pop Handler
  const handleToggledateofBirth = () => {
    setisOpendateofBirth(true);
  };
  //Bio handler button
  const handleBio = () => {
    setIsOpenBio(true);
  };
  // Education Button Handler
  const handleToggelEmail = () => {
    setisOpenEdu(true);
  };
 
  const handleFileSelection = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setisSelectFile(selectedFile);
 
      const formData = new FormData();
      formData.append("avatar", selectedFile);
 
      const response = await UplaodAvatar(formData);
      if (response.error) {
        console.log("Upload Failure:", response.error);
      } else {
        console.log("File Uploaded:", response.data);
      }
    }
  };
 
  // Handling Bio Pop Ups 
  const handleBioUi = async (e) => {
    if (e) e.preventDefault();
    const formData = new FormData(e.currentTarget); 
    const rawBio = formData.get('bio');
    
    runAction(
      async () => {
        const response = await AddBio(formData);
        if (response?.success) {
          setbio(rawBio);
          setIsOpenBio(false);
        } else {
          throw new Error(response?.error || 'Failed To Add');
        }
      },
      'Bio Added SuccessFully! �'
    );
  };
 
  // Handling Edu PopUp
  const handleEduui = async (e) => {
    if (e) e.preventDefault();
 
    const formData = new FormData(e.currentTarget);
    const rawEdu = formData.get('education');
    runAction(
      async () => {
        const res = await AddEdu(formData);
        if (res?.success) {
          setedu(rawEdu);
          setisOpenEdu(false);
        } else {
          throw new Error(res?.error || 'Failed to Add');
        }
      },
      'Education Added SuccessFully'
    );
  };
 
  // Handling Dob Pop Up
  const handleDobUi = (e) => {
    if (e) e.preventDefault();
 
    if (!dob.day || !dob.month || !dob.year) {
      alert("Please select complete Date of Birth!");
      return;
    }
 
    runAction(
      async () => {
        const formData = new FormData(e.currentTarget);
        const res = await DOB(formData);
        
        if (res?.success) {
          setisOpendateofBirth(false);
        } else {
          throw new Error(res?.error || 'Failed To Add');
        }
      },
      'Date Of Birth Added Successfully! �'
    );
  };
 
  // Handling Username Popup
  const handleSaveUsername = (e) => {
    if (e) e.preventDefault();
 
    const formData = new FormData(e.currentTarget);
    const newUsername = formData.get("username");
 
    if (!newUsername || !newUsername.trim()) return;
 
    runAction(
      async () => {
        const res = await AddUserName(formData);
 
        if (res?.error) {
          throw new Error(res.error);
        }
      },
      "Username Updated Successfully! �"
    );
  };
 
  return (
    <main className="min-h-screen p-3 bg-slate-100 flex flex-col items-center">
      <div className="w-full md:w-200 mt-5 flex flex-col">
 
        {/* Top Profile / Setup Form */}
        <section className="h-43 w-full  flex justify-center items-end">
          <div className="bg-white h-30 rounded-2xl w-full">
            <div className="w-full flex flex-row items-center">
              {/* Profile Image Upload */}
              <div className="w-1/2 h-30 flex justify-center items-center">
                <div className="relative h-10 w-20 border flex justify-center items-center rounded-full border-slate-400 bg-slate-100">
                  <h1 className="text-black text-xs font-bold font-mono">
                    Add Image
                  </h1>
                  <div className="w-6 h-6 rounded-full bg-black absolute flex justify-center items-center -bottom-1 -right-1">
                    <input
                      type="file"
                      ref={fileinputRef}
                      onChange={handleFileSelection}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileinputRef.current?.click()}
                      className="cursor-pointer text-white font-bold leading-none text-sm mb-0.5"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
 
              {/* Username Setup */}
              <form
                onSubmit={handleSaveUsername}
                className="w-1/2 flex justify-center flex-col gap-3 mr-2"
              >
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  name="username"
                  className="bg-slate-200 outline-none rounded-lg w-full mr-3 text-black text-sm px-3 py-1"
                />
               <div className="flex justify-end">
                 <button
                  type="submit"
                  className="bg-blue-700 md:w-30 rounded-lg text-white font-mono text-sm py-1 px-6 font-semibold cursor-pointer"
                >
                  Save
                </button>
               </div>
              </form>
            </div>
          </div>
        </section>
 
        {/* Main Settings Wrapper Container */}
        <section className="h-fit bg-white rounded-2xl mt-5 w-full md:w-200">
          <div className="p-5">
            {/* Date of Birth */}
            <section className="w-full flex flex-row justify-between items-center gap-3">
              <div className="w-full flex flex-row justify-between items-center">
                <div className="w-full flex justify-between items-center">
                  <h1 className="text-black font-mono">Date of Birth</h1>
                  <button
                    type="button"
                    onClick={handleToggledateofBirth}
                    className="bg-blue-700 py-1 px-3 rounded-lg font-semibold text-sm text-white cursor-pointer"
                  >
                    Select
                  </button>
                </div>
              </div>
            </section>
 
            {/* Bio */}
            <section className="w-full flex flex-col justify-between items-center mt-5 gap-3">
              <div className="flex justify-between w-full">
                <h1 className="font-mono text-black">Add Bio</h1>
                <button
                  type="button"
                  onClick={handleBio}
                  className="bg-blue-700 font-semibold px-3 py-1 rounded-lg text-sm text-white cursor-pointer"
                >
                  Add
                </button>
              </div>
            </section>
 
            {/* Education */}
            <section className="w-full flex flex-col justify-between items-center mt-5 gap-3">
              <div className="flex justify-between w-full">
                <h1 className="font-mono text-black">Add Education</h1>
                <button
                  type="button"
                  onClick={handleToggelEmail}
                  className="bg-blue-700 font-semibold px-3 py-1 rounded-lg text-sm text-white cursor-pointer"
                >
                  Add
                </button>
              </div>
            </section>
          </div>
 
          {/* Date of Birth Pop up */}
          {isOpendateofBirth && (
            <section className="fixed inset-0 flex justify-center items-center p-5 z-50">
              <div
                className="fixed inset-0 bg-transparent backdrop-blur-lg"
                onClick={() => setisOpendateofBirth(false)}
              />
 
              <form
                onSubmit={handleDobUi}
                className="relative z-50 w-full max-w-sm md:max-w-md h-fit bg-white rounded-2xl p-5 md:p-6 shadow-xl"
              >
                <div>
                  <div className="w-full flex flex-col justify-between items-center gap-3 md:gap-4">
                    <span className="text-sm md:text-base text-black font-mono font-bold">
                      Date of Birth
                    </span>
                    <div className="flex gap-2 md:gap-3">
                      {/* Day */}
                      <select
                        name="date"
                        value={dob.day}
                        onChange={(e) => setDob({ ...dob, day: e.target.value })}
                        className="bg-slate-300 rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-black outline-none font-mono cursor-pointer"
                      >
                        <option value="">Date</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      {/* Month */}
                      <select
                        name="month"
                        value={dob.month}
                        onChange={(e) =>
                          setDob({ ...dob, month: e.target.value })
                        }
                        className="bg-slate-300 rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-black outline-none font-mono cursor-pointer"
                      >
                        <option value="">Month</option>
                        {[
                          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                        ].map((m, i) => (
                          <option key={m} value={i + 1}>
                            {m}
                          </option>
                        ))}
                      </select>
 
                      {/* Year */}
                      <select
                        name="year"
                        value={dob.year}
                        onChange={(e) => setDob({ ...dob, year: e.target.value })}
                        className="bg-slate-300 rounded-lg px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm text-black outline-none font-mono cursor-pointer"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 80 }, (_, i) => 2026 - i).map(
                          (y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Ok and Cancel */}
                <div className="flex flex-row justify-around mt-5 md:mt-6 gap-4">
                  <button
                    type="submit"
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-mono font-medium px-5 md:px-6 py-1 md:py-1.5 text-sm rounded-lg shadow-md transition-colors duration-200 cursor-pointer"
                  >
                    Save
                  </button>
 
                  <button
                    type="button"
                    onClick={() => setisOpendateofBirth(false)}
                    className="bg-white/10 hover:bg-white/20 font-mono text-zinc-800 font-medium py-1 md:py-1.5 px-3 md:px-4 text-sm border border-slate-300 backdrop-blur-md rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}
 
          {/* Education Adding Pop Up */}
          {isOpenEdu && (
            <section className="fixed inset-0 flex justify-center items-center p-3 z-50">
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-lg"
                onClick={() => setisOpenEdu(false)}
              />
              <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm md:max-w-md mx-auto shadow-xl border border-gray-100 z-50">
                <div className="flex flex-col gap-4">
                  <h1 className="text-center text-gray-900 font-mono font-bold text-xl md:text-2xl tracking-wide uppercase">
                    Your Education
                  </h1>
                  <form onSubmit={handleEduui}>
                    <div className="relative mb-4">
                      <textarea
                        name="education"
                        placeholder="Enter your degree or school..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-inner resize-none h-28 md:h-36"
                      />
                    </div>
                    <div className="flex justify-around">
                      <button
                        type="submit"
                        className="bg-black text-white font-mono px-4 md:px-6 py-1.5 md:py-2 rounded-lg shadow-lg cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setisOpenEdu(false)}
                        className="text-black border border-slate-300 rounded-lg px-4 md:px-6 py-1.5 md:py-2 shadow-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          )}
 
          {/* Bio Pop Up */}
          {isOpenBio && (
            <section className="fixed inset-0 flex justify-center items-center p-3 z-50">
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-lg"
                onClick={() => setIsOpenBio(false)}
              />
              <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm md:max-w-md mx-auto shadow-xl border border-gray-100 z-50">
                <div className="flex flex-col gap-4">
                  <h1 className="text-center text-gray-900 font-mono font-bold text-xl md:text-2xl tracking-wide uppercase">
                    Add Bio
                  </h1>
                  <form onSubmit={handleBioUi}>
                    <div className="relative mb-4">
                      <textarea
                        name="bio"
                        placeholder="Add Bio"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-inner resize-none h-28 md:h-36"
                      />
                    </div>
                    <div className="flex justify-around">
                      <button
                        type="submit"
                        className="bg-black text-white font-mono px-4 md:px-6 py-1.5 md:py-2 rounded-lg shadow-lg cursor-pointer"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsOpenBio(false)}
                        className="text-black border border-slate-300 rounded-lg px-4 md:px-6 py-1.5 md:py-2 shadow-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          )}
        </section>
      </div>
      <ToastUI />
    </main>
  );
};
 
export default Page;
 
