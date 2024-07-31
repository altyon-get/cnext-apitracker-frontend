import React from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  parent,
  confirmButtonText,
  isSidebarExpanded
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className={`absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm ml-${parent=='Sidebar'? 0:isSidebarExpanded? 64:20}`}></div>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ml-${parent=='Sidebar'? 0:isSidebarExpanded? 64:20} `}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2">{message}</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationModal;
