import React from "react";
import { motion } from "framer-motion";

// Icon Components
const IconWrapper = ({ children, className = "" }) => <div className={`text-yellow-400 ${className}`}>{children}</div>;

export function MegaphoneIcon({ className = "" }) {
  return (
    <IconWrapper className={className}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.993 7.95a1 1 0 0 0-1.006.063L16.56 11H8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h.643a4.984 4.984 0 0 0 4.804 4 4.986 4.986 0 0 0 4.805-4h.353l4.425 2.987a1 1 0 0 0 1.006.063A1 1 0 0 0 24 20V9a1 1 0 0 0-.007-.05zM13.447 20a2.99 2.99 0 0 1-2.864-2h5.73a2.99 2.99 0 0 1-2.866 2zM22 18.388l-3.553-2.399A1 1 0 0 0 18 15.779v-2.556a1 1 0 0 0-.447-.833L22 10.388v8z" />
        <path d="M13.447 10a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1zM5 10a1 1 0 0 0 1-1V5a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1zM1 14a1 1 0 0 0 1-1v-2a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1z" />
      </svg>
    </IconWrapper>
  );
}

export function CurrencyDollarIcon({ className = "" }) {
  return (
    <IconWrapper className={className}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
        <path d="M12 11c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3zm0 4c-.551 0-1-.449-1-1s.449-1 1-1 1 .449 1 1-.449 1-1 1zM13 7h-2v2h2V7zM11 15h2v2h-2z" />
      </svg>
    </IconWrapper>
  );
}

export function ClockIcon({ className = "" }) {
  return (
    <IconWrapper className={className}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
        <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
      </svg>
    </IconWrapper>
  );
}
