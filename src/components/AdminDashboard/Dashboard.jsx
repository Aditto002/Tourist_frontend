import React, { useEffect, useState } from "react";
import { FaHome, FaUsers, FaMapMarkedAlt, FaClipboardList, FaDollarSign, FaBell, FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from 'axios';

const Dashboard = () => {
    const [countItems, setCountItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
        const accessToken = localStorage.getItem("token");
      try {
        const response = await axios.get('http://localhost:5000/api/admin/dashboard-stats',
            {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              }
        ); // Fetch limited items
        console.log("gallery", response.data)
        setCountItems(response.data);
      } catch (error) {
        console.error('Error fetching gallery items:', error);
      }
    };

    fetchGalleryItems();
  }, []);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white flex flex-col h-full shadow-lg">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
          <p className="text-sm text-center mt-2 opacity-75">ExploreConnect</p>
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <NavItem icon={<FaHome />} label="Dashboard" />
         <Link to='/user'> <NavItem icon={<FaUsers />} label="Users" /></Link>
         <Link to='/placemanagement'><NavItem icon={<FaMapMarkedAlt />} label="Places" /></Link> 
         <Link to='/adminbookings'><NavItem icon={<FaClipboardList />} label="Bookings" /></Link> 
        </nav>
        <button 
          className="m-4 p-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/adminlogin';
          }}
        >
          <FaBell className="text-lg" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Topbar */}
        <header className="bg-white shadow p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-700">Dashboard Overview</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-indigo-300"
            />
          </div>
        </header>

        {/* Dashboard Cards */}
        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3 gap-6">
          <DashboardCard icon={<FaUsers />} label="Total Users" value={countItems.data?.totalUsers || 0} color="bg-indigo-500" />
          <DashboardCard icon={<FaMapMarkedAlt />} label="Total Places" value={countItems.data?.totalPlaces || 0} color="bg-green-500" />
          <DashboardCard icon={<FaClipboardList />} label="Bookings"  value={countItems.data?.totalBookings || 0} color="bg-orange-500" />
        </div>

        {/* Table Section */}
        <section className="p-6 bg-white shadow rounded-lg mx-6 my-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Recent Bookings</h3>
          <table className="w-full border-collapse bg-white shadow-lg">
            <thead>
              <tr>
                <TableHeader label="ID" />
                <TableHeader label="User" />
                <TableHeader label="Place" />
                <TableHeader label="Date" />
                <TableHeader label="Status" />
              </tr>
            </thead>
            <tbody>
              <TableRow id="001" user="ADIL" place="Eidgah" date="2024-10-11" status="Confirmed" />
              <TableRow id="002" user="Pollob" place="Eidgah" date="2024-10-11" status="Confirmed" />
              <TableRow id="003" user="Aditto" place="Eidgah" date="2024-10-11" status="Confirmed" />
              
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

/* Sidebar Item Component */
const NavItem = ({ icon, label }) => (
  <a href="#" className="flex items-center space-x-3 p-3 hover:bg-indigo-700 rounded-lg transition duration-200">
    <div className="text-xl">{icon}</div>
    <span className="text-lg font-medium">{label}</span>
  </a>
);

/* Dashboard Overview Card Component */
const DashboardCard = ({ icon, label, value, color }) => (
  <div className={`p-6 rounded-lg shadow-lg ${color} text-white transform transition-transform hover:scale-105`}>
    <div className="flex items-center space-x-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-sm uppercase font-semibold">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

/* Table Header Component */
const TableHeader = ({ label }) => (
  <th className="p-3 border-b text-gray-600 font-semibold text-left bg-gray-100">{label}</th>
);

/* Table Row Component */
const TableRow = ({ id, user, place, date, status }) => (
  <tr className="hover:bg-gray-100 transition">
    <td className="p-3 border-b">{id}</td>
    <td className="p-3 border-b">{user}</td>
    <td className="p-3 border-b">{place}</td>
    <td className="p-3 border-b">{date}</td>
    <td className="p-3 border-b">
      <span
        className={`px-3 py-1 rounded-full text-white ${
          status === "Confirmed" ? "bg-green-500" : status === "Pending" ? "bg-yellow-500" : "bg-red-500"
        }`}
      >
        {status}
      </span>
    </td>
  </tr>
);

export default Dashboard;