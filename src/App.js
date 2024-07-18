import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddAPI from "./pages/AddAPI";
import APIList from "./pages/APIList";
import ViewAPI from "./pages/ViewAPI";
import EditAPI from "./pages/EditAPI";
import { LoginRoute, ProtectedRoute } from "./routes/PrivateRoutes";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <div className="fixed top-0 left-0 h-full">
          <Sidebar />
        </div>
        <div className="flex-grow ml-64 p-6 overflow-y-auto">
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
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <APIList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
