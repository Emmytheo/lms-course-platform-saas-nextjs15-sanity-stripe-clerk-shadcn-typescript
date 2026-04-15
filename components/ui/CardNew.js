// components/ui/Card.js
import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    // <div
    //   className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
    // >
    <div className={`${className}`}>
      {/* <div
       className={`bg-card rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-4px] border border-border flex flex-col flex-1 ${className}`}
    > */}
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`p-6 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = "" }) => {
  return (
    <h3 className={`text-lg font-semibold ${className}`}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className = "" }) => {
  return (
    <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
  );
};

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
