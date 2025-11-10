// src/components/ui/card.jsx
import React from "react";

export function Card({ children, className }) {
  return (
    <div className={`bg-white rounded-2xl shadow-md border overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
