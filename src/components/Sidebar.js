import React, { useState, useEffect } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import APIList from "../pages/APIList";
import AddAPI from "../pages/AddAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (windowWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    toast.success("Logout successfully");
    navigate("/login");
    closeSidebar();
  };

  const renderPage = () => {
    switch (activePage) {
      case "/":
        return <APIList />;
      case "/add-api":
        return <AddAPI />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-800 text-white flex flex-col fixed h-full transition-transform duration-300 ease-in-out ${
          isSidebarOpen || windowWidth >= 768
            ? "translate-x-0"
            : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-2xl font-semibold text-white">API Tracker</span>
        </div>

        <nav className="mt-6 flex-grow">
          <ul>
            <li>
              <button
                className={`flex items-center py-2 px-8 w-full text-white hover:bg-gray-700 hover:text-white transition duration-150  ${
                  activePage === "/" ? "bg-gray-700 text-white" : ""
                }`}
                onClick={() => {
                  setActivePage("/");
                  closeSidebar();
                }}
              >
                API LIST
              </button>
            </li>
            <li>
              <button
                className={`flex items-center py-2 px-8 w-full text-white text-[1.4rem] hover:bg-gray-700 hover:text-white transition duration-150 ${
                  activePage === "/" ? "bg-gray-700 text-white" : ""
                }`}
                onClick={() => {
                  setActivePage("/add-api");
                  closeSidebar();
                }}
              >
                Add API
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto mb-4 px-4 border-t border-gray-300">
          <div className="mt-2">
            <button
              className="flex items-center py-2 px-4 w-full text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150 rounded"
              onClick={() => {
                closeSidebar();
              }}
            >
              <FaUser className="w-5 h-5 mr-3" />
              Test User
            </button>
            <button
              className="flex items-center py-2 px-4 w-full text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150 rounded mt-2"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col ${
          windowWidth >= 768 ? "md:ml-64" : ""
        }`}
      >
        {/* render pages */}
        <main className="flex-1 p-8 mt-2">{renderPage()}</main>
      </div>
    </div>
  );
};

export default Sidebar;
