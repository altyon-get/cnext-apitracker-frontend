import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import APIList from './pages/APIList';
import AddAPI from './pages/AddAPI';
import ViewAPI from './pages/ViewAPI';
import EditAPI from './pages/EditAPI';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-6">
          <Routes>
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
}

export default App;
