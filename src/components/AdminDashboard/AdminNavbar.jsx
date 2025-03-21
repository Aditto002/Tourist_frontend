import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <nav className="bg-indigo-900 text-white py-4 px-28 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <ul className="flex space-x-6 ">
        <li>
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        </li>
        <li>
          <Link to="/user" className="hover:text-gray-300">Users</Link>
        </li>
        <li>
          <Link to="/placemanagement" className="hover:text-gray-300">Places</Link>
        </li>
        <li>
          <Link to="/adminbookings" className="hover:text-gray-300">Bookings</Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;