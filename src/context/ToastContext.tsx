'use client';

import React, { createContext, useContext, ReactNode, useRef, useCallback } from 'react';
import { toast, ToastContainer, ToastOptions, Id, Slide } from 'react-toastify';
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

    if (lastToast?.message === message &&
        lastToast?.type === type &&
        now - lastToast.timestamp < 500) {
      return false;
    }

    lastToastRef.current = { message, timestamp: now, type };
    return true;
  }, []);

  const baseOptions: ToastOptions = {
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  };

  const success = useCallback((message: string) => {
    if (!preventDuplicate(message, 'success')) return '' as Id;
    return toast.success(message, {
      ...baseOptions,
      toastId: `success-${message}`,
    });
  }, [preventDuplicate]);

  const error = useCallback((message: string) => {
    if (!preventDuplicate(message, 'error')) return '' as Id;
    return toast.error(message, {
      ...baseOptions,
      toastId: `error-${message}`,
    });
  }, [preventDuplicate]);

  const info = useCallback((message: string) => {
    if (!preventDuplicate(message, 'info')) return '' as Id;
    return toast.info(message, {
      ...baseOptions,
      toastId: `info-${message}`,
    });
  }, [preventDuplicate]);

  const warning = useCallback((message: string) => {
    if (!preventDuplicate(message, 'warning')) return '' as Id;
    return toast.warning(message, {
      ...baseOptions,
      toastId: `warning-${message}`,
    });
  }, [preventDuplicate]);

  const loading = useCallback((message: string) => {
    if (!preventDuplicate(message, 'loading')) return '' as Id;
    return toast.loading(message, {
      ...baseOptions,
      toastId: `loading-${message}`,
    });
  }, [preventDuplicate]);

  const dismiss = useCallback((toastId?: Id) => {
    toast.dismiss(toastId);
  }, []);

  return (
    <ToastContext.Provider value={{ success, error, info, warning, loading, dismiss }}>
      {children}
      <ToastContainer
        position="top-right"
        limit={2} // Allow max 2 at a time
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        transition={Slide}
        style={{ zIndex: 99998 }} // Below navigation loader but above everything else
        toastStyle={{
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '4rem', // Add space below navbar
        }}
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
