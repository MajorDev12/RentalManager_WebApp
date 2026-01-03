import React, { createContext, useContext, useState, useCallback } from 'react';
import '../../css/toast.css'; // Make sure the path to toast.css is correct

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    isSuccess: true
  });

  const showToast = useCallback((isSuccess, message) => {
    setToast({ visible: true, message, isSuccess });
    setTimeout(() => {
      setToast({ visible: false, message: '', isSuccess: true });
    }, 9000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast.visible && (
        <div className={`toast ${toast.isSuccess ? 'success' : 'error'}`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
