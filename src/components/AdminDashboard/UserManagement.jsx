import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import NavBar from "../../Shared/NavBar";
import AdminNavbar from "./AdminNavbar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const accessToken = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/admin/users",
        {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
      );
      console.log("object",response.data.data)
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again later.");
    }
  };

  const handleEdit = (userId) => {
    alert(`Edit functionality for user ID: ${userId} (Not implemented)`);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
        const accessToken = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/user/delete/${userId}`,
        {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
      );
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again later.");
    }
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      <AdminNavbar></AdminNavbar>
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 mt-10">User Management</h2>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <div className="container mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2 flex space-x-4">
                    {/* <button
                      onClick={() => handleEdit(user._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                    >
                      <FaEdit /> <span>Edit</span>
                    </button> */}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2"
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;