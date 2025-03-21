import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
        const accessToken = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5000/api/bookings/user-bookings',{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
      }, {
        withCredentials: true,
      });
      if (response.data.status === 'success') {
        setBookings(response.data.data);
      } else {
        setError('Failed to fetch bookings');
      }
      console.log("object",response)
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      setPaymentLoading(true);
      const accessToken = localStorage.getItem("token");
      
      // Call the payment initiation API
      const response = await axios.post(
        `http://localhost:5000/api/payment/initiate/${bookingId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (response.data.success && response.data.url) {
        // Redirect to payment gateway
        window.location.href = response.data.url;
      } else {
        // If there's no URL but the response was successful, navigate to the payment page
        navigate(`/payment/${bookingId}`);
      }
    } catch (err) {
      console.error("Payment initiation error:", err.response?.data || err);
      setError(err.response?.data?.message || 'Error initiating payment. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const accessToken = localStorage.getItem("token");
      
      // Fixed axios PUT request structure
      const response = await axios({
        method: 'put',
        url: `http://localhost:5000/api/bookings/cancel/${bookingId}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: false  // Changed this to false
      });

      if (response.data.status === 'success') {
        setSuccessMessage('Booking cancelled successfully');
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId
              ? { ...booking, status: 'cancelled' }
              : booking
          )
        );
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error("Cancel error:", err.response?.data || err);
      setError(err.response?.data?.message || 'Error connecting to server');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper function to determine if a booking is eligible for payment
  const isPaymentEligible = (booking) => {
    return booking.status !== 'cancelled' && 
           booking.paymentStatus !== 'completed' &&
           booking.paymentStatus !== 'processing';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 bg-green-100 text-green-700 p-4 rounded">
          {successMessage}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded shadow">
          <p className="text-center text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded shadow overflow-hidden"
            >
              <div className="bg-gray-50 p-4 flex justify-between items-center">
                <span className="font-semibold">{booking.place.title}</span>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : booking.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <strong>Check-in: </strong>
                      <span>{formatDate(booking.checkIn)}</span>
                    </div>
                    <div>
                      <strong>Check-out: </strong>
                      <span>{formatDate(booking.checkOut)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <strong>Payment Status: </strong>
                      <span className={`${
                        booking.paymentStatus === 'completed' 
                          ? 'text-green-600 font-medium'
                          : booking.paymentStatus === 'failed'
                          ? 'text-red-600 font-medium'
                          : 'text-yellow-600 font-medium'
                      }`}>
                        {booking.paymentStatus 
                          ? booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)
                          : 'Pending'}
                      </span>
                    </div>
                    <div className="font-semibold">
                      Total Price: ৳{booking.totalPrice}
                    </div>
                  </div>
                </div>

                {booking.status !== 'cancelled' && (
                  <div className="mt-4 flex justify-end space-x-2">
                    {isPaymentEligible(booking) && (
                      <button
                        onClick={() => handlePayment(booking._id)}
                        disabled={paymentLoading}
                        className={`px-4 py-2 rounded ${
                          paymentLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600'
                        } text-white`}
                      >
                        {paymentLoading ? 'Processing...' : 'Pay Now'}
                      </button>
                    )}
                    
                    {booking.paymentStatus !== 'completed' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;