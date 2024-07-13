import React from "react";
import { motion } from "framer-motion";

// Card Component
export function Card({ children, className = "" }) {
  return (
    <motion.div
      className={`bg-gradient-to-br from-green-800 to-green-900 rounded-3xl shadow-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

// CardContent Component
export function CardContent({ children, className = "" }) {
  return <div className={`p-6 text-green-100 ${className}`}>{children}</div>;
}

// CardDescription Component
export function CardDescription({ children, className = "" }) {
  return <p className={`text-green-300 mt-2 ${className}`}>{children}</p>;
}

// CardFooter Component
export function CardFooter({ children, className = "" }) {
  return <div className={`bg-green-950 p-4 mt-4 ${className}`}>{children}</div>;
}

// CardHeader Component
export function CardHeader({ children, className = "" }) {
  return <div className={`bg-green-700 p-4 ${className}`}>{children}</div>;
}

// CardTitle Component
export function CardTitle({ children, className = "" }) {
  return <h2 className={`text-2xl font-bold text-yellow-400 ${className}`}>{children}</h2>;
}
