import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import "./toast.css";

const ToastContext = createContext({ show: () => {}, success: () => {}, error: () => {}, info: () => {} });

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef({});

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timeout = timeoutsRef.current[id];
    if (timeout) {
      clearTimeout(timeout);
      delete timeoutsRef.current[id];
    }
  }, []);

  const show = useCallback((message, options = {}) => {
    const id = ++idCounter;
    const toast = {
      id,
      message,
      type: options.type || "info",
      duration: typeof options.duration === "number" ? options.duration : 2500,
    };
    setToasts((prev) => [...prev, toast]);
    timeoutsRef.current[id] = setTimeout(() => remove(id), toast.duration);
    return id;
  }, [remove]);

  const success = useCallback((m, opts = {}) => show(m, { ...opts, type: "success" }), [show]);
  const error = useCallback((m, opts = {}) => show(m, { ...opts, type: "error" }), [show]);
  const info = useCallback((m, opts = {}) => show(m, { ...opts, type: "info" }), [show]);

  const value = useMemo(() => ({ show, success, error, info, remove }), [show, success, error, info, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" role="status" aria-live="polite" aria-atomic="true">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`} onClick={() => remove(t.id)}>
            <span className="toast-message">{t.message}</span>
            <button className="toast-close" aria-label="Close">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export default ToastProvider;


