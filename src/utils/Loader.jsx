import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center fixed inset-0  z-50 mt-10">
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-opacity-75"></div>
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
