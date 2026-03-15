import React from 'react';
export const Button = ({ className, ...props }) => (
  <button className={`w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 duration-200 ${className}`} {...props} />
);