'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { toast, ToastContainer, ToastOptions, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastContextType {
  success: (message: string, options?: ToastOptions) => Id;
  error: (message: string, options?: ToastOptions) => Id;
  info: (message: string, options?: ToastOptions) => Id;
  warning: (message: string, options?: ToastOptions) => Id;
  loading: (message: string, options?: ToastOptions) => Id;
  dismiss: (toastId?: Id) => void;
  update: (toastId: Id, options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  style: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    border: '1px solid rgba(229, 9, 20, 0.3)',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    fontFamily: 'var(--font-heading)',
  }
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, { ...defaultOptions, ...options });
  };

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, { ...defaultOptions, ...options });
  };

  const info = (message: string, options?: ToastOptions) => {
    return toast.info(message, { ...defaultOptions, ...options });
  };

  const warning = (message: string, options?: ToastOptions) => {
    return toast.warning(message, { ...defaultOptions, ...options });
  };

  const loading = (message: string, options?: ToastOptions) => {
    return toast.loading(message, { ...defaultOptions, ...options });
  };

  const dismiss = (toastId?: Id) => {
    toast.dismiss(toastId);
  };

  const update = (toastId: Id, options: ToastOptions) => {
    toast.update(toastId, options);
  };

  return (
    <ToastContext.Provider value={{ 
      success, 
      error, 
      info, 
      warning, 
      loading, 
      dismiss, 
      update 
    }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="toast-container"
      />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
