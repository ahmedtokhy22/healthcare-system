import React from 'react';
export const Input = ({ className, ...props }) => (
  <input className={`w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-200 text-slate-700 placeholder:text-slate-400 ${className}`} {...props} />
);