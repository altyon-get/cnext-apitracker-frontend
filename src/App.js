import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddAPI from "./pages/AddAPI";
import ViewAPI from "./pages/ViewAPI";
import EditAPI from "./pages/EditAPI";
import Login from "./pages/auth/Login";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Sidebar />} />
        <Route path="/add-api" element={<AddAPI />} />
        <Route path="/view-api/:id" element={<ViewAPI />} />
        <Route path="/edit-api/:id" element={<EditAPI />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;


