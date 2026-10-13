"use client";
import React, { useEffect, useState } from "react";
import { Delete, Insert, update } from "../(actions)/action";
import { getProfile } from "../(actions)/action";
import { Trash, Edit } from "lucide-react";
import { useToast } from "../../Toast";
import { title } from "node:process";
const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [task, settask] = useState([]);
  const [loading, setloading] = useState(true);
  // edit state
  const [ edit , setedit] = useState(null)
  const [ editbox , seteditbox] = useState(false)
  //Toast Init
  const { runAction, askConfirm, ToastUI } = useToast();
  // Helper function to handle data fetching safely
  async function loadTasks() {
    const response = await getProfile();
    if (!response) {
      console.log("Profile returned nothing");
      setloading(false);
      return;
    }
    const { data: fectheddata, error } = response;
    if (!error && fectheddata) {
      settask(fectheddata);
    } else if (error) {
      console.log("Database Error:", error.message);
    }
    setloading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-slate-100 space-y-4">
        {/* Animated Spinner Wheel */}
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />

        {/* Optional Text */}
        <h1 className="text-slate-600 text-sm font-bold font-mono tracking-wider uppercase animate-pulse">
          Loading Tasks...
        </h1>
      </div>
    );
  // Handle Add Data
  const handleSave = (e) => {
    if (e) e.preventDefault();
    const formData = new FormData(e.currentTarget);

    runAction(
      async () => {
        const res = await Insert(formData); // Call server action

        if (res?.error) {
          throw new Error(res.error);
        }

        e.target.reset(); // 🚨 FIXED: Safe reset method
        setIsOpen(false); // Close layout overlay
        loadTasks(); // Refresh fresh rows
      },
      "Task Added Successfully! 🚀", // 🚨 FIXED: Clean emoji string
    );
  };
  //Handle UPdate Data
  const handleUpdateTaskSubmit = (e) => {
  if (e) e.preventDefault();
  if (!edit) return;

  const formData = new FormData(e.currentTarget);
  const updatedTitle = formData.get("title");
  const updatedDesc = formData.get("description");

  runAction(
    async () => {
      // Send data to your backend update server function
      const res = await update(edit.id, updatedTitle, updatedDesc);

      if (res?.error) {
        throw new Error(res.error);
      }

      if (res?.success) {
        loadTasks();
        seteditbox(false) // Reload layout items array rows
        setedit(null); // Safely shut down update modal overlay
      }
    },
    "Task Updated Successfully! 📝"
  );
};

  //Handle Delete Data
  const handleDeleteTask = (id) => {
    askConfirm(
      "Are you sure you want to delete this task?",
      async () => {
        // 🚨 FIXED: Call your lowercase 'Delete' server function with item ID
        const res = await Delete(id);

        if (res?.error) {
          throw new Error(res.error);
        }

        if (res?.success) {
          loadTasks(); // Purge from interface rows
        }
      },
      "Task Deleted Successfully! 🗑️",
    );
  };
  return (
    <main className="min-h-screen bg-slate-100 mt-15 p-5">
      {/* FIXED: Removed items-end to prevent elements from locking to the right margin layout */}
      <section className="w-full flex flex-col  space-y-6">
        <div className="h-40 bg-white w-full rounded-2xl flex items-center shadow-md">
          <div className="w-1/2 border-r border-slate-300">
            <div className="flex md:flex-row flex-col items-center justify-center md:space-x-10 space-x-5 space-y-3">
              <button
                onClick={() => setIsOpen(true)}
                className="text-5xl bg-slate-100 md:p-10 md:w-35 p-4 w-25 text-center md:ml-0 ml-3 rounded-full hover:bg-slate-200 transition-colors"
              >
                <h1 className="text-black">+</h1>
              </button>
              <p className="md:text-3xl font-mono font-bold text-black">
                Add Task
              </p>
            </div>
          </div>
          <div className="w-1/2 flex justify-center items-center">
            <h1 className="md:text-3xl text-3xl font-bold ml-3 md:ml-0 font-mono text-black">
              Manage Your Tasks
            </h1>
          </div>
        </div>

        <div className="w-full flex justify-center items-center mt-7">
          {task.length === 0 ? (
            <div>
              <h1 className="text-neutral-500 font-mono">No Task Added Yet</h1>
            </div>
          ) : (
            /* FIXED: Replaced fixed dimension boxes (h-100 w-100) with flexible responsive padding layouts */
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {task.map((item, index) => (
                <div
                  key={index}
                  className="relative p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-black"
                >
                  <div className="font-mono font-bold text-lg border-b border-slate-100 pb-2">
                    {item.task}
                  </div>
                  <div className="text-sm text-slate-600 mt-2">
                    {item.description}
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={()=>handleDeleteTask(item.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg font-mono transition-colors"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                  <div className="absolute top-3 right-15">
                    <button
                      type="button"
                      onClick={() => {setedit(item); seteditbox(true);}}
                    >
                      <Edit size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      </section>

      {isOpen && (
        <section className="fixed inset-0 flex justify-center items-center z-50 p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-50 w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl shadow-black/10 space-y-4">
            {/* FIXED: Form layout wraps action execution to update lists and shut panels dynamically */}
            <form onSubmit={handleSave}>
              <div className="space-y-1">
                <h1 className="font-mono font-bold text-sm text-slate-700 uppercase tracking-wider">
                  Title
                </h1>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Title"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="space-y-1 mt-3">
                <h1 className="font-mono font-bold text-sm text-slate-700 uppercase tracking-wider">
                  Description
                </h1>
                <textarea
                  name="description"
                  placeholder="Enter details..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-lg font-mono transition-colors shadow-md shadow-black/10"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </section>
      )}


     {/*Update Pop Up */}
     {editbox && edit && (
  <section className="inset-0 fixed flex justify-center items-center p-5 z-50">
    <div onClick={() => seteditbox(false)} className="fixed inset-0 backdrop-blur-md bg-black/30" />
    
    <div className="relative z-50 bg-white w-full max-w-sm h-fit p-5 rounded-2xl shadow-2xl">
      {/* 🚨 FIXED: Added correct wrapping form tag connected to submit listener */}
      <form onSubmit={handleUpdateTaskSubmit}>
        
        <div className="space-y-1">
          <h1 className="font-mono font-bold text-sm text-slate-700 uppercase tracking-wider">
            Title
          </h1>
          <input
            type="text"
            name="title"
            value={edit.task || ""} // 🚨 FIXED: Bound to object text property safely
            onChange={(e) => setedit({ ...edit, task: e.target.value })} // 🚨 FIXED: Allows independent typing
            placeholder="Enter Title"
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            required
          />
        </div>

        <div className="space-y-1 mt-3">
          <h1 className="font-mono font-bold text-sm text-slate-700 uppercase tracking-wider">
            Description
          </h1>
          <textarea
            name="description"
            value={edit.description || ""} // 🚨 FIXED: Bound to object description safely
            onChange={(e) => setedit({ ...edit, description: e.target.value })} // 🚨 FIXED: Typed characters wont clone into title
            placeholder="Enter details..."
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            required
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={() => seteditbox(false)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg font-mono transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit" // 🚨 FIXED: Triggers handleUpdateTaskSubmit form submission
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-lg font-mono transition-colors shadow-md shadow-black/10"
          >
            Save
          </button>
        </div>

      </form>
    </div>
  </section>
)}

      <ToastUI/>
    </main>
  );
};

export default Page;
