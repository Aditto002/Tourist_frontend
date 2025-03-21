import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../AdminDashboard/AdminNavbar';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:5000/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.data.status === 'success') {
        setBookings(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Booking fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/booking/status/${bookingId}`,
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.status === 'success') {
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status: status } : booking
          )
        );
      } else {
        throw new Error(response.data.message || 'Failed to update booking status');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update booking status');
      setTimeout(() => setError(null), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 min-h-screen">
      <AdminNavbar></AdminNavbar>
    <div className=" max-w-7xl mx-auto">
      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      <div className="card border border-gray-200 rounded-lg p-4">
        <h2 className="text-2xl font-bold mb-4">Booking Management</h2>
        <div className="grid gap-4">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings found
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  {/* User Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div>
                        <h3 className="font-semibold">{booking.user?.username || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-500">{booking.user?.email || 'No email'}</p>
                        {/* <h1 className="text-sm text-gray-500">payment Status :<span className=''>{booking.paymentStatus || 'pending'}</span></h1> */}
                        
                        <h1 className="text-sm text-gray-500">
                          Payment Status: 
                          <span
                          className={`font-bold ${
                            booking.paymentStatus === 'pending'
                            ? 'text-red-600'
                            : booking.paymentStatus === 'completed'
                            ? 'text-green-600'
                            : 'text-gray-500' // Default color if no status
                            }`}
                            >
                              {booking.paymentStatus || 'pending'}
                              </span>
                              </h1>


                      </div>
                    </div>
                  </div>

                  {/* Place Info */}
                  <div className="space-y-2">
                    <h4 className="font-medium">{booking.place?.title || 'Unknown Place'}</h4>
                    {booking.place && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-1">&#128205;</span>
                        {booking.place.location ? (
                          `${booking.place.location.city || 'Unknown City'}, 
                           ${booking.place.location.country || 'Unknown Country'}`
                        ) : (
                          'Location not available'
                        )}
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="mr-1">&#128197;</span>
                      <span>
                        {new Date(booking.checkIn).toLocaleDateString()} -{' '}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-1">&#128181;</span>
                      <span>${booking.totalPrice}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-1">&#128336;</span>
                      <span>{new Date(booking.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="space-y-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    {booking.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                          className="flex items-center px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                        >
                          &#10003; Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'rejected')}
                          className="flex items-center px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                        >
                          &#10060; Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminBookings;