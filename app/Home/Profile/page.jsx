"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link"; // Added for routing functionality
import {
  getUserName,
  getAvatrUrl,
  getDOB,
  getBio,
  getEdu,
  getEmail,
  DOB,
  AddBio,
  AddEdu,
  DeleteBio,
  DeleteEdu,
  DeleteDob,
  DeleteUserName,
  UpdateUserName,
  UplaodAvatar,
  DeleteAvatar,
} from "../../(actions)/action";
import { logout } from "../../(auth)/logout/action";
import delectAccount from "../../(auth)/deleteacc/action";
import { FileInput, NewspaperIcon, Target, X } from "lucide-react";
import { useToast } from "../../../Toast";
const Page = () => {
  //Ref State
  const fileinputRef = useRef();
  //states
  const [isloading, setisloading] = useState(true);
  const [username, setusername] = useState("");
  const [imageUrl, setimageUrl] = useState(null);
  const [dob, setdob] = useState(null);
  const [bio, setbio] = useState(null);
  const [edu, setedu] = useState(null);
  const [email, setemail] = useState(null);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setisOpen] = useState(false);
  //Editable States
  const [editdob, seteditdob] = useState({ date: "", month: "", year: "" });
  const [iseditboxopen, seteditboxopen] = useState(false);
  const [isBioBox, setisBioBox] = useState(false);
  const [editbio, seteditbio] = useState(bio || "");
  const [isEduBox, setisEduBox] = useState(false);
  const [editEdu, seteditEdu] = useState(edu || "");
  const [NameBox, setNameBox] = useState(username || "");
  const [editName, seteditName] = useState(false);
  const [ImageBox, setImageBox] = useState(false);
  //Loading Phrases && State
  const LOADING_PHRASES = [
    "Fetching Profile...",
    "Verifying Session...",
    "Syncing Elements...",
    "Loading Dashboard...",
    "Almost Ready...",
  ];
  const [phrase, setphrase] = useState(0);
  //Timer Addition In Loading
  useEffect(() => {
    if (!isloading) return;

    const interval = setInterval(() => {
      setphrase((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isloading]);

  //Toast
  const { askConfirm, runAction, ToastUI } = useToast();
  //Edit Section Toggle Handler
  const handleToggle = () => {
    setisOpen(true);
  };
  //Edit DOB Box Function
  const handleeditBox = () => {
    if (dob) {
      // dob is strictly YYYY-MM-DD
      const [y, m, d] = dob.split("-");
      seteditdob({
        date: d ? String(parseInt(d, 10)) : "",
        month: m ? String(parseInt(m, 10)) : "",
        year: y || "",
      });
    } else {
      seteditdob({ date: "", month: "", year: "" });
    }
    seteditboxopen(true);
  };
  //Edit Bio Box Function
  const handleBio = () => {
    seteditbio(bio || "");
    setisBioBox(true);
  };

  //Edit Edu Box Function
  const handleEdu = () => {
    seteditEdu(edu || "");
    setisEduBox(true);
  };
  //Handle Username Box Function
  const handleUserName = () => {
    seteditName(username || "");
    setNameBox(true);
  };

  //Profile pic fetching
  useEffect(() => {
    let isMounted = true;

    async function fetchImage() {
      const response = await getAvatrUrl("avatar.png");
      if (isMounted && response?.data) {
        setimageUrl(response.data);
      }
    }

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, []);

  // UserName fetching
  async function FetchUserName() {
    const response = await getUserName();
    if (!response) {
      console.log("Error Nothing Get");
      setisloading(false);
      return;
    }

    const { data, error } = response;

    if (!error && data) {
      setusername(data);
    } else if (error) {
      console.log("Database Error:", error);
    }
    setisloading(false);
  }

  useEffect(() => {
    FetchUserName();
  }, []);

  //Fetching Details
  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      const startTime = Date.now();

      const [dobRes, bioRes, eduRes, emailRes] = await Promise.all([
        getDOB(),
        getBio(),
        getEdu(),
        getEmail(),
      ]);

      if (dobRes?.data) setdob(dobRes.data.dob);
      if (bioRes?.data) setbio(bioRes.data.bio);
      if (eduRes?.data) setedu(eduRes.data.education);
      if (emailRes?.data) setemail(emailRes.data);

      const elapsedTime = Date.now() - startTime;
      const minDelay = 1500;
      const remainingTime = Math.max(0, minDelay - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    }

    fetchDetails();
  }, []);

  //Handling Reloadng Page
  //Handling Dob Update Reload
  const handleUpdateDob = (e) => {
    if (e) e.preventDefault(); // 1. Prevent browser reload

    const { date, month, year } = editdob;

    // 2. Exact validation you had before
    if (!date || !month || !year) {
      alert("Please select complete Date of Birth!");
      return;
    }

    const formattedDate = String(date).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDOB = `${year}-${formattedMonth}-${formattedDate}`;

    // 🚨 3. Capture native inputs directly from the HTML Form elements
    const formData = new FormData(e.currentTarget);

    runAction(async () => {
      // 4. Send the form data containing your dropdown name attributes
      const res = await DOB(formData);

      if (res?.error) {
        throw new Error(res.error);
      }

      // 5. Run your exact state code on success
      setdob(formattedDOB);
      seteditboxopen(false);
    }, "Date of Birth Updated Successfully! 🎉");
  };

  //Handling Bio Update Relaod
  const handleUpdateBio = (e) => {
    if (e) e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const freshBio = formData.get("bio");

    runAction(async () => {
      // 1. Call your Bio Server Action to update database
      const res = await AddBio(formData);

      if (res?.error) {
        throw new Error(res.error);
      }

      // 2. Instant Client UI Update
      if (freshBio) setbio(freshBio);

      // 3. Close Bio Modal
      setisBioBox(false);
    }, "Bio Updated Successfully! 📝");
  };

  //Handling Edu Update Reload
  const handleUpdateEdu = (e) => {
    if (e) e.preventDefault();

    const formData = new FormData(e.currentTarget); // Full object layout
    const freshedu = formData.get("education");

    runAction(async () => {
      // 🚨 PASS THE WHOLE OBJECT back if your backend expects formData.get()
      const res = await AddEdu(formData);

      if (res?.error) {
        throw new Error(res.error);
      }

      if (res?.success || !res?.error) {
        setedu(freshedu);
        setisEduBox(false);
      }
    }, "Education Updated Successfully! 🎉");
  };

  // Handle DOB Delete
  const handleDeleteDob = async (e) => {
    if (e) e.preventDefault();

    askConfirm(
      "Are you sure you want to delete Your Dob?",
      async () => {
        const res = await DeleteDob();
        if (res?.success) setdob("");
      },
      "Date Of Birth Deleted SuccesFully",
    );
  };
  // Handle Bio Delete
  const handleDeleteBio = (e) => {
    if (e) e.preventDefault();

    askConfirm(
      "Are you sure you want to delete your Bio?",
      async () => {
        const res = await DeleteBio();
        if (res?.success) setbio("");
      },
      "Bio Deleted SuccessFully",
    );
  };
  // Handle Edu Delete
  const handleDeleteEdu = async (e) => {
    if (e) e.preventDefault();

    askConfirm(
      "Are you sure you want to delete your Education?",
      async () => {
        const res = await DeleteEdu();
        if (res?.success) setedu("");
      },
      "Education Deleted SuccessFully",
    );
  };
  // Handling UserName Deletion
  const handleUserDel = (e) => {
    if (e) e.preventDefault();

    // 🚨 Fixed: askConfirm ke brackets () ke andar hi teeno cheezein pass karni hain
    askConfirm(
      "Are you sure you want to delete your Name?", // 1. Sawal (confirmMsg)
      async () => {
        // 2. Function (asyncFn)
        const res = await DeleteUserName();
        if (res?.success) {
          seteditName("");
          setNameBox(false);
        } else {
          throw new Error(res?.error || "Failed To Delete Name");
        }
      },
      "Name Deleted Successfully! 🗑️",
    );
  };
  //Update UserName
  const handleUpdateUserName = (e) => {
    if (e) e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newName = formData.get("username"); // Input se value nikal li

    runAction(async () => {
      const res = await UpdateUserName(formData);

      if (res?.success) {
        setusername(newName); // 👈 Yeh UI par instant update kar dega bina reload ke
        setNameBox(false); // Modal close kar diya
      } else {
        throw new Error(res?.error || "Updation Failed");
      }
    }, "Updated Successfully! 🎉");
  };
  //Update IMage
  const handleUpdateImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    // Directly triggers Processing -> Success toast sequence
    runAction(async () => {
      const res = await UplaodAvatar(formData);

      if (res?.error) {
        throw new Error(res.error);
      }

      // Fetch updated avatar URL with cache buster
      const newUrl = await getAvatrUrl("avatar.png");

      if (newUrl?.data) {
        setimageUrl(`${newUrl.data}&t=${Date.now()}`);
        setImageBox(false);
      }
    }, "Profile Picture Updated! 📸");
  };

  //Delete Image
  const handleDeleteImage = () => {
    askConfirm(
      "Are you sure you want to delete your profile picture?",
      async () => {
        const res = await DeleteAvatar();

        if (res?.error) {
          throw new Error(res.error);
        }

        setimageUrl(null);
        setImageBox(false);
      },
      "Profile Picture Deleted! 🗑️",
    );
  };
  // Logout Handler
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
  // Delete Account Handling
  const handleDeleteAcc = (e) => {
    if (e) e.preventDefault();

    askConfirm(
      "⚠️ CRITICAL: Are you sure you want to permanently delete your account?",
      async () => {
        const res = await delectAccount();

        if (res?.error) {
          throw new Error(res.error || "Deletion Failed");
        }

        router.push("/signup");
      },
      "Account Permanently Deleted! 🗑️",
    );
  };

  //LoadingPage For Whole Page
  if (isloading) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-slate-100 space-y-4">
        {/* Animated Spinner Wheel */}
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />

        {/* Dynamic Animated Pulse Text */}
        <h1 className="text-slate-600 text-xs font-bold font-mono tracking-wider uppercase animate-pulse transition-all duration-300">
          ⏳ {LOADING_PHRASES[phrase]}
        </h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-3 bg-slate-100 flex justify-center items-center flex-col ">
      <section className="w-full md:w-200 flex justify-center items-center mt-20 ">
        <div className="bg-white rounded-2xl w-full  p-4 shadow-sm border border-slate-100">
          <div className="relative w-full flex flex-row items-center">
            {/* Top Right Edit Name Button */}
            <button
              onClick={handleUserName}
              type="button"
              className="absolute top-0 right-0 text-xs font-mono border border-slate-300 text-neutral-600 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              Edit Name
            </button>

            {/* Avatar Section */}
            <div className="w-1/2 flex justify-center items-center py-2">
              <div className="relative">
                {/* Avatar Circle */}
                <div className="h-20 w-20 border-2 border-slate-200 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center relative shadow-sm">
                  {imageUrl ? (
                    <>
                      <img
                        src={imageUrl}
                        alt="Avatar"
                        className={`w-full h-full object-cover ${isImgLoading ? "hidden" : "block"}`}
                        onLoad={() => setIsImgLoading(false)}
                        onError={() => setIsImgLoading(false)}
                      />

                      {isImgLoading && (
                        <svg
                          className="animate-spin h-6 w-6 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-400 text-xs text-center font-medium px-1">
                      No Image
                    </span>
                  )}
                </div>

                {/* Edit Icon Badge (Non-overlapping, pinned to bottom-right edge) */}
                <button
                  onClick={() => setImageBox(true)}
                  type="button"
                  className="absolute bottom-0 right-0 translate-x-1 translate-y-1 text-white font-mono font-bold text-[10px] bg-slate-900 hover:bg-black p-1.5 rounded-full shadow-md  transition-all active:scale-95"
                >
                 edit
                </button>
              </div>
            </div>

            {/* Username Display */}
            <div className="w-1/2">
              <h1 className="font-mono text-lg md:text-2xl font-semibold text-black truncate">
                {username || "No username"}
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="h-100 bg-white md:w-200 w-full rounded-2xl mt-5">
        <div className="p-6 relative pt-10">
          <button
            type="button"
            onClick={handleToggle}
            className="absolute top-2 right-3 text-xs font-mono shadow-2xl shadow-black border-2 border-slate-300 text-neutral-500 px-2 py-1 rounded-lg "
          >
            Edit Profile
          </button>
          <div className="w-full flex flex-row justify-between items-center">
            <span className="text-sm font-medium text-slate-500">
              Date Of Birth
            </span>
            <span className="text-sm font-semibold text-black min-h-5 flex items-center">
              {isLoading ? (
                <svg
                  className="animate-spin h-4 w-4 text-blue-600"
                  xmlns="http://w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                dob || "Not Mentioned"
              )}
            </span>
          </div>

          <div className="w-full flex flex-row justify-between items-center mt-5">
            <span className="text-sm font-medium text-slate-500">Email</span>
            <span className="text-sm font-semibold text-black min-h-5 flex items-center">
              {isLoading ? (
                <svg
                  className="animate-spin h-4 w-4 text-blue-600"
                  xmlns="http://w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                email || "Not Fetched"
              )}
            </span>
          </div>

          <div className="w-full flex flex-row justify-between items-center mt-5">
            <span className="text-sm font-medium text-slate-500">Bio</span>
            <span className="text-sm font-semibold text-black min-h-5 flex items-center">
              {isLoading ? (
                <svg
                  className="animate-spin h-4 w-4 text-blue-600"
                  xmlns="http://w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                bio || "Not Mentioned"
              )}
            </span>
          </div>

          <div className="w-full flex flex-row justify-between items-center mt-5">
            <span className="text-sm font-medium text-slate-500">
              Education
            </span>
            <span className="text-sm font-semibold text-black min-h-5 flex items-center">
              {isLoading ? (
                <svg
                  className="animate-spin h-4 w-4 text-blue-600"
                  xmlns="http://w3.org"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                edu || "Not Mentioned"
              )}
            </span>
          </div>

          <div className="w-full flex flex-col justify-between items-center mt-5 space-y-3">
            <Link
              href="/Home/SetUpProfile"
              className="w-full text-center font-mono bg-black text-white py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition"
            >
              SetUp Profile
            </Link>
          </div>

          <div className=" w-full mt-5">
            <button
              onClick={handleLogout}
              className="w-full block text-center border font-mono border-slate-300 text-slate-700 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
            >
              Logout
            </button>
          </div>

          <div className=" w-full mt-5">
            <button
              onClick={handleDeleteAcc}
              className="w-full block font-mono text-center bg-red-800 text-xs font-medium hover:underline py-2.5 rounded-lg"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>
      {/*Edit Section*/}
      {isOpen && (
        <section className="fixed inset-0 flex justify-center items-center p-5 mt-8">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-lg"
            onClick={() => setisOpen(false)}
          />
          <div className="relative z-99 bg-white w-full h-fit  rounded-2xl p-5">
            <h1 className="flex justify-center text-black font-mono font-bold">
              Manage Your Profile
            </h1>
            <button
              className="absolute top-3 right-3"
              onClick={() => setisOpen(false)}
            >
              <X color="black" size={24} />
            </button>
            <div className="mt-5">
              <div>
                <h1 className="font-mono text-black font-semibold text-center">
                  Date of Birth
                </h1>
                <p className=" text-center font-mono text-neutral-400 text-sm ">
                  Manage Your DOB Here
                </p>
              </div>
              <div className="flex justify-around mt-3 flex-col gap-3">
                <button
                  type="button"
                  onClick={handleeditBox}
                  className="bg-blue-700 px-3 py-1 rounded-lg font-mono"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteDob}
                  className="bg-red-700 px-3 py-1 rounded-lg font-mono"
                >
                  Delete
                </button>
              </div>

              <div className="mt-3">
                <h1 className="font-mono text-black font-semibold text-center">
                  Bio
                </h1>
                <p className=" text-center font-mono text-neutral-400 text-sm ">
                  Manage Your BIO Here
                </p>
              </div>
              <div className="flex justify-around mt-3 flex-col gap-3">
                <button
                  type="button"
                  onClick={handleBio}
                  className="bg-blue-700 px-3 py-1 rounded-lg font-mono"
                >
                  Edit
                </button>

                <button
                  onClick={handleDeleteBio}
                  className="bg-red-700 px-3 py-1 rounded-lg font-mono w-full"
                >
                  Delete
                </button>
              </div>

              <div className="mt-3">
                <h1 className="font-mono text-black font-semibold text-center">
                  Your Education
                </h1>
                <p className=" text-center font-mono text-neutral-400 text-sm ">
                  Manage Your EDU Here
                </p>
              </div>
              <div className="flex justify-around mt-3 flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setisEduBox(true)}
                  className="bg-blue-700 px-3 py-1 rounded-lg font-mono"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteEdu}
                  className="bg-red-700 px-3 py-1 rounded-lg font-mono w-full"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      //Edit Box
      {iseditboxopen && (
        <section className="inset-0 fixed flex justify-center items-center p-5">
          <div
            className="fixed inset-0 bg-transparent backdrop-blur-lg"
            onClick={() => seteditboxopen(false)}
          />
          <div className="relative z-100 h-50 w-full bg-white rounded-2xl p-5">
            <button
              className="absolute top-3 right-3"
              onClick={() => seteditboxopen(false)}
            >
              <X color="black" size={24} />
            </button>
            <section className="fixed inset-0 z-50 flex justify-center items-center p-5">
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => seteditboxopen(false)}
              />

              {/* Modal Content */}
              <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl">
                <h1 className="font-semibold font-mono text-center text-black text-base mb-4">
                  Edit Date of Birth
                </h1>

                {/* Form with Server Action */}
                <form onSubmit={handleUpdateDob}>
                  <div className="flex flex-row justify-center gap-2 mb-5">
                    {/* Date Dropdown */}
                    <select
                      name="date"
                      value={editdob.date}
                      onChange={(e) =>
                        seteditdob({ ...editdob, date: e.target.value })
                      }
                      className="bg-slate-200 rounded-lg px-2 py-1.5 text-xs text-black outline-none font-mono"
                      required
                    >
                      <option value="">Date</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>

                    {/* Month Dropdown */}
                    <select
                      name="month"
                      value={editdob.month}
                      onChange={(e) =>
                        seteditdob({ ...editdob, month: e.target.value })
                      }
                      className="bg-slate-200 rounded-lg px-2 py-1.5 text-xs text-black outline-none font-mono"
                      required
                    >
                      <option value="">Month</option>
                      {[
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ].map((m, i) => (
                        <option key={m} value={i + 1}>
                          {m}
                        </option>
                      ))}
                    </select>

                    {/* Year Dropdown */}
                    <select
                      name="year"
                      value={editdob.year}
                      onChange={(e) =>
                        seteditdob({ ...editdob, year: e.target.value })
                      }
                      className="bg-slate-200 rounded-lg px-2 py-1.5 text-xs text-black outline-none font-mono"
                      required
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

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => seteditboxopen(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-200 text-black hover:bg-slate-300"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg text-xs font-mono bg-blue-700 text-white hover:bg-gray-800"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </section>
      )}
      {/* Edit Bio Section*/}
      {isBioBox && (
        <section className="fixed inset-0 flex justify-center items-center p-5 z-50">
          <div
            className="fixed inset-0 bg-transparent backdrop-blur-lg"
            onClick={() => setisBioBox(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl">
            <h1 className="font-semibold font-mono text-center text-black text-base mb-4">
              Edit Bio
            </h1>

            {/* FIXED: action changed to onSubmit */}
            <form onSubmit={handleUpdateBio}>
              <div className="mb-4">
                <textarea
                  name="bio"
                  rows="4"
                  maxLength="200"
                  value={editbio}
                  onChange={(e) => seteditbio(e.target.value)}
                  placeholder="Write a brief bio..."
                  className="w-full bg-slate-100 rounded-xl p-3 text-xs text-black outline-none font-mono resize-none focus:ring-1 focus:ring-black"
                  required
                />
                <p className="text-[10px] text-slate-400 font-mono text-right mt-1">
                  {editbio.length}/200
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setisBioBox(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-200 text-black hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>

                {/* FIXED: Removed inline onClick modal-close */}
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-mono bg-blue-700 text-white hover:bg-gray-800 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
      {/* Edit Edu Section*/}
      {isEduBox && (
        <section className="fixed inset-0 flex justify-center items-center p-5">
          <div
            className="fixed inset-0 bg-transparent backdrop-blur-lg"
            onClick={() => setisEduBox(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl">
            <h1 className="font-semibold font-mono text-center text-black text-base mb-4">
              Edit Education
            </h1>

            <form onSubmit={handleUpdateEdu}>
              <div className="mb-4">
                <input
                  type="text"
                  name="education"
                  value={editEdu}
                  onChange={(e) => seteditEdu(e.target.value)}
                  placeholder="e.g. Bachelor's in CS, High School, etc."
                  className="w-full bg-slate-100 rounded-xl p-3 text-xs text-black outline-none font-mono focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setisEduBox(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-200 text-black hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-mono bg-blue-700 text-white hover:bg-gray-800 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
      {/* Edit Name */}
      {NameBox && (
        <section className="inset-0 fixed flex justify-center items-center p-5">
          <div
            className="inset-0 fixed bg-black/30 backdrop-blur-lg"
            onClick={() => setNameBox(false)}
          />
          <div className="z-99 relative bg-white w-full h-fit rounded-lg p-5">
            <button
              onClick={() => setNameBox(false)}
              className="absolute right-2 top-2"
            >
              <X color="black" />
            </button>
            <form onSubmit={handleUpdateUserName}>
              <h1 className="text-center font-mono font-bold text-black">
                Edit UserName
              </h1>
              <input
                type="text"
                name="username"
                placeholder="Enter Name"
                value={editName}
                onChange={(e) => seteditName(e.target.value)}
                className="w-full bg-slate-100 mt-3 rounded-xl p-3 text-xs text-black outline-none font-mono focus:ring-1 focus:ring-black"
              />
              <div className="flex justify-end gap-5 items-center mt-3">
                <button
                  type="submit"
                  className="bg-blue-700 py-1 px-3  rounded-lg"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleUserDel}
                  className="bg-red-700 py-1 px-3 rounded-lg "
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
      {/*IMahe Edit Box*/}
      {ImageBox && (
        <section className="inset-0 fixed flex justify-center items-center p-5">
          <div
            className="inset-0 fixed bg-black/30 backdrop-blur-lg z-30"
            onClick={() => setImageBox(false)}
          />
          <div className="relative z-99 bg-white w-full h-fit rounded-2xl p-5">
            <div className="flex justify-center items-center w-full h-full">
              <div className="flex flex-col gap-3">
                <h1 className="text-center font-mono text-black font-bold">
                  Edit Image
                </h1>
                <input
                  type="file"
                  ref={fileinputRef}
                  onChange={handleUpdateImage}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileinputRef.current?.click()}
                  className="flex  bg-blue-700 px-15 py-1  rounded-lg font-mono"
                >
                  {imageUrl ? "Change" : "Upload"}
                </button>
                <button
                  onClick={handleDeleteImage}
                  className="flex  bg-red-700 px-15 py-1 rounded-lg font-mono"
                >
                  Delete
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

export default Page;
