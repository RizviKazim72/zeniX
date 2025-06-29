'use client';

import React, { createContext, useContext, ReactNode, useRef, useCallback } from 'react';
import { toast, ToastContainer, ToastOptions, Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastContextType {
  success: (message: string) => Id;
  error: (message: string) => Id;
  info: (message: string) => Id;
  warning: (message: string) => Id;
  loading: (message: string) => Id;
  dismiss: (toastId?: Id) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const lastToastRef = useRef<{ message: string; timestamp: number; type: string } | null>(null);

  const preventDuplicate = useCallback((message: string, type: string): boolean => {
    const now = Date.now();
    const lastToast = lastToastRef.current;
    
    // Prevent duplicates within 500ms of the same message and type
    if (lastToast?.message === message && 
        lastToast?.type === type && 
        now - lastToast.timestamp < 500) {
      return false;
    }
    
    lastToastRef.current = { message, timestamp: now, type };
    return true;
  }, []);

  const success = useCallback((message: string) => {
    if (!preventDuplicate(message, 'success')) return '' as Id;
    // Dismiss any existing toasts before showing new one
    toast.dismiss();
    return toast.success(message, {
      toastId: `success-${message}`, // Unique ID to prevent duplicates
    });
  }, [preventDuplicate]);

  const error = useCallback((message: string) => {
    if (!preventDuplicate(message, 'error')) return '' as Id;
    toast.dismiss();
    return toast.error(message, {
      toastId: `error-${message}`,
    });
  }, [preventDuplicate]);

  const info = useCallback((message: string) => {
    if (!preventDuplicate(message, 'info')) return '' as Id;
    toast.dismiss();
    return toast.info(message, {
      toastId: `info-${message}`,
    });
  }, [preventDuplicate]);

  const warning = useCallback((message: string) => {
    if (!preventDuplicate(message, 'warning')) return '' as Id;
    toast.dismiss();
    return toast.warning(message, {
      toastId: `warning-${message}`,
    });
  }, [preventDuplicate]);

  const loading = useCallback((message: string) => {
    if (!preventDuplicate(message, 'loading')) return '' as Id;
    toast.dismiss();
    return toast.loading(message, {
      toastId: `loading-${message}`,
    });
  }, [preventDuplicate]);

  const dismiss = useCallback((toastId?: Id) => {
    toast.dismiss(toastId);
  }, []);

  return (
    <ToastContext.Provider value={{ 
      success, 
      error, 
      info, 
      warning, 
      loading, 
      dismiss
    }}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        limit={1}
        toastStyle={{
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          borderRadius: '8px',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
        className="!border-none"
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
