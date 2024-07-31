import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddAPI from "./pages/AddAPI";
import APIList from "./pages/APIList";
import ViewAPI from "./pages/ViewAPI";
import ViewAPI2 from "./pages/ViewAPI2";
import EditAPI from "./pages/EditAPI";
import { LoginRoute, ProtectedRoute } from "./routes/PrivateRoutes";
import { ToastContainer } from "react-toastify";
import ConfirmationModal from "./components/ConfirmationModal";
import NotFound from '../src/pages/NotFound'

const App = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    message: "",
    parent: "",
    onConfirm: () => {
      setShowModal(false);
    },
  });

  const handleOpenModal = (title, message, parent, onConfirm) => {
    setModalProps({
      title,
      message,
      parent,
      onConfirm: () => {
        onConfirm();
        handleCloseModal();
      },
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex h-screen">
      {!isLoginRoute && (
        <div
          className={`fixed top-0 left-0 h-full transition-all duration-300`}
        >
          <Sidebar
            isExpanded={isSidebarExpanded}
            onToggle={handleSidebarToggle}
            openModal={handleOpenModal}
          />
        </div>
      )}
      <div
        className={`flex-grow p-6 overflow-y-auto transition-all duration-300 flex flex-col h-screen ${
          isLoginRoute ? "ml-0" : isSidebarExpanded ? "ml-64" : "ml-20"
        }`}
      >
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/api-list"
            element={
              <ProtectedRoute>
                <APIList openModal={handleOpenModal} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/api-list" />} />
          <Route
            path="/add-api"
            element={
              <ProtectedRoute>
                <AddAPI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-api/:id"
            element={
              <ProtectedRoute>
                <ViewAPI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-api2/:id"
            element={
              <ProtectedRoute>
                <ViewAPI2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-api/:id"
            element={
              <ProtectedRoute>
                <EditAPI />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ConfirmationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={modalProps.onConfirm}
        title={modalProps.title}
        message={modalProps.message}
        parent={modalProps.parent}
        confirmButtonText="Confirm"
        isSidebarExpanded={isSidebarExpanded}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
