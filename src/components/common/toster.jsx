import React from "react";
import toast, { Toaster } from "react-hot-toast";

// Toast Container Component
export default function ToastContainer({ 
  headerHeight = 64,
  position = 'top-right',
  toastOptions = {},
  duration=2000
}) {
  return (
    <Toaster
      position={position}
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: `${headerHeight + 8}px`, // Add margin to avoid header
      }}
      toastOptions={{
        duration: {duration},
        style: {
          background: '#363636',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        success: {
          duration: 4000,
          style: {
            background: '#4caf50',
          },
        },
        error: {
          duration: 5000,
          style: {
            background: '#f44336',
          },
        },
        ...toastOptions,
      }}
    />
  );
}

// Export the toast functions for direct use
export { toast };