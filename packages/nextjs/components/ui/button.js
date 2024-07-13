import React from "react";
import { motion } from "framer-motion";

export function Button({ children, onClick, className = "" }) {
  return (
    <motion.button
      className={`px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
