import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import APIList from "./pages/APIList";
import AddAPI from "./pages/AddAPI";
import ViewAPI from "./pages/ViewAPI";
import EditAPI from "./pages/EditAPI";
import Login from "./pages/Login";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <div className="fixed top-0 left-0 h-full">
          <Sidebar />
        </div>
        <div className="flex-grow ml-64 p-6 overflow-y-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/api-list" element={<APIList />} />
            <Route path="/add-api" element={<AddAPI />} />
            <Route path="/view-api/:id" element={<ViewAPI />} />
            <Route path="/edit-api/:id" element={<EditAPI />} />
            <Route path="/" element={<APIList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;