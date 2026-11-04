import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed left-4 right-4 top-4 z-50 flex flex-col gap-2 sm:left-auto">
        {toasts.map((t) => (
          <div key={t.id}
            className={`flex min-w-0 items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg sm:min-w-[260px] ${
              t.type === "error" ? "bg-red-600" : "bg-emerald-600"
            }`}>
            {t.type === "error" ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
            <span className="text-sm flex-1">{t.message}</span>
            <button onClick={() => remove(t.id)}><X size={16} /></button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);