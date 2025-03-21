import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../AdminDashboard/AdminNavbar";
import { useNavigate } from 'react-router-dom';
const PlaceManagement = () => {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/image/galleries");
      setPlaces(response.data.data);
    } catch (error) {
      console.error("Error fetching places:", error);
      setError("Failed to load places. Please try again later.");
    }
  };



  const handleUpdate = (placeId) => {
    // alert(`Update functionality for place ID: ${placeId} (Not implemented)`);
    navigate(`/updatetrip/${placeId}`);

  };

  const handleDelete = async (placeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this place?");
    if (!confirmDelete) return;

    try {
      const accessToken = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/place/delete/${placeId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPlaces(places.filter((place) => place._id !== placeId));
    } catch (error) {
      console.error("Error deleting place:", error);
      setError("Failed to delete place. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Place Management</h2>
          <Link to="/addtrips">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300">
              Add Place
            </button>
          </Link>
        </div>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-blue-600 text-white sticky top-0">
              <tr>
                <th className="border border-gray-300 px-6 py-3 text-left">Name</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Description</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Image</th>
                <th className="border border-gray-300 px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place, index) => (
                <tr key={place._id} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}>
                  <td className="border border-gray-300 px-6 py-4">{place.title}</td>
                  <td className="border border-gray-300 px-6 py-4">{place.description}</td>
                  <td className="border border-gray-300 px-6 py-4">
                    <img src={place.picture} alt={place.name} className="w-24 h-24 object-cover rounded-lg shadow-md" />
                  </td>
                  <td className="border border-gray-300 px-6 py-4 flex space-x-3">
                    <button
                      onClick={() => handleUpdate(place._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center space-x-2"
                    >
                      <FaEdit /> <span>Update</span>
                    </button>
                    <button
                      onClick={() => handleDelete(place._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center space-x-2"
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

export default PlaceManagement;
