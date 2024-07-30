import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
    <Link to="/api-list" className="text-blue-500 hover:underline">
      Go to API List
    </Link>
  </div>
);

export default NotFound;