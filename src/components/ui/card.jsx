import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`bg-white shadow-2xl rounded-3xl border border-gray-100 w-full max-w-lg mx-auto p-2 ${className}`}>
    {children}
  </div>
);
export const CardHeader = ({ children }) => <div className="p-6 text-center">{children}</div>;
export const CardTitle = ({ children }) => <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{children}</h2>;
export const CardDescription = ({ children }) => <p className="text-slate-500 text-sm mt-2 font-medium">{children}</p>;
export const CardContent = ({ children }) => <div className="p-6 pt-0">{children}</div>;