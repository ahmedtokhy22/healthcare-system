import React from 'react';
export const Label = ({ children, className }) => (
  <label className={`text-sm font-bold ${className}`}>{children}</label>
);