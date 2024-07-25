import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddAPI from "./pages/AddAPI";
import APIList from "./pages/APIList";
import ViewAPI from "./pages/ViewAPI";
import EditAPI from "./pages/EditAPI";
import { LoginRoute, ProtectedRoute } from "./routes/PrivateRoutes";
import { ToastContainer } from "react-toastify";

const App = () => {
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";

  return (
    <div className="flex h-screen">
      {!isLoginRoute && (
        <div className="fixed top-0 left-0 h-full">
          <Sidebar />
        </div>
      )}
      <div className={isLoginRoute ? "flex-grow p-6" : "flex-grow ml-64 p-6 overflow-y-auto"}>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/api-list"
            element={
              <ProtectedRoute>
                <APIList />
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
            path="/edit-api/:id"
            element={
              <ProtectedRoute>
                <EditAPI />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
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
