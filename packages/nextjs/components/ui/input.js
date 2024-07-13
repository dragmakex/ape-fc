// packages/nextjs/components/ui/input.js
import React from "react";

// Input Component
export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-4 py-2 bg-green-700 text-green-100 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 ${className}`}
      {...props}
    />
  );
}
