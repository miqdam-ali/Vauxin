import { useState } from "react";

export function useToast() {
  // 1. Loading & Success Pop-up state (🆕 Added 'type' property)
  const [toast, setToast] = useState({
    isOpen: false,
    loading: false,
    message: "",
    type: "success", // 'success', 'error', ya 'info'
  });

  // 2. Are You Sure Confirmation Modal state
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  // Direct Action Runner
    // Direct Action Runner (Smart Timing Upgraded)
  const runAction = async (asyncFn, successMsg) => {
    setToast({ isOpen: true, loading: true, message: "Processing...", type: "info" });

    try {
      // 1. Core action ko execute hone do
      await asyncFn();
      
      // 🚨 Fix: Agar page redirect ho raha hoga, to hum sirf temporary success set karenge 
      // taake memory leaks ya stale data data browser string crash na kare.
      setToast({ isOpen: true, loading: false, message: successMsg, type: "success" });

      const timer = setTimeout(() => {
        setToast({ isOpen: false, loading: false, message: "", type: "success" });
      }, 2000);

      return () => clearTimeout(timer);

    } catch (error) {
      // Next.js redirect errors ko bypass karne ke liye safe check
      if (error.message && error.message.includes("NEXT_REDIRECT")) {
        return; 
      }

      // 🚨 Agar asli main error ho to display karein
      setToast({ 
        isOpen: true, 
        loading: false, 
        message: error.message || "Action Failed!", 
        type: "error" 
      });
      
      setTimeout(() => setToast({ isOpen: false, loading: false, message: "", type: "success" }), 2500);
    }
  };


  // Confirmation Trigger
  const askConfirm = (confirmMsg, asyncFn, successMsg) => {
    setConfirmState({
      isOpen: true,
      message: confirmMsg,
      onConfirm: () => {
        setConfirmState({ isOpen: false, message: "", onConfirm: null });
        runAction(asyncFn, successMsg);
      },
    });
  };

  // Toast UI
  const ToastUI = () => (
    <>
      {/* 1. Are You Sure Modal */}
      {confirmState.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-999 animate-fade-in-up">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl text-center font-mono z-999">
            <h3 className="text-sm font-semibold text-gray-800 mb-5">
              {confirmState.message}
            </h3>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmState({ isOpen: false, message: "", onConfirm: null })}
                className="px-4 py-2 bg-slate-200 text-slate-800 text-xs rounded-xl hover:bg-slate-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmState.onConfirm}
                className="px-4 py-2 bg-red-600 text-white text-xs rounded-xl hover:bg-red-700 font-medium transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Processing / Success / Error Pop-up */}
      {toast.isOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm z-999 animate-fade-in-up flex justify-center items-center p-5">
          <div className="bg-white w-full max-w-xs h-30 flex justify-center rounded-2xl text-xs font-mono shadow-2xl items-center gap-3 border border-slate-100 z-999">
            {toast.loading ? (
              <div className="flex justify-center items-center gap-3">
                {/* 🚨 Fixed: bg-white hata kar border-blue-600 lagaya takay ghoomta nazar aaye */}
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-black font-mono">{toast.message}</span>
              </div>
            ) : (
              <div className="w-full h-30 flex justify-center items-center gap-2 px-4">
                {/* 🚨 Dynamic Icon & Color change based on toast.type */}
                {toast.type === "success" ? (
                  <span className="text-green-500 font-bold text-base">✓</span>
                ) : (
                  <span className="text-red-500 font-bold text-base">✕</span>
                )}
                <span className="font-semibold text-black font-mono text-center">
                  {toast.message}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  return { askConfirm, runAction, ToastUI };
}
