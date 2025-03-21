import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaCreditCard, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const PaymentPage = () => {
  const { id } = useParams(); // booking ID
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  // Check if we have status query params (for redirects from payment gateway)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    
    if (status === 'success') {
      setMessage('Payment completed successfully!');
      setPaymentStatus('completed');
    } else if (status === 'failed') {
      setMessage('Payment failed. Please try again.');
      setPaymentStatus('failed');
    } else if (status === 'cancelled') {
      setMessage('Payment was cancelled.');
      setPaymentStatus('cancelled');
    }
  }, [location.search]);

  // Fetch booking details and payment status
//   useEffect(() => {
//     const fetchBookingAndPaymentStatus = async () => {
//       try {
//         setLoading(true);
        
//         // Get booking details (you'll need to implement this endpoint)
//         const bookingResponse = await axios.get(`http://localhost:5000/api/bookings/${id}`, {
//           withCredentials: true,
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
        
//         // Get payment status
//         const paymentResponse = await axios.get(`http://localhost:5000/api/payment/status/${id}`, {
//           withCredentials: true,
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
        
//         setBooking(bookingResponse.data.booking);
//         setPaymentStatus(paymentResponse.data.paymentStatus);
        
//       } catch (err) {
//         setError(err.response?.data?.message || 'Error loading booking details');
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     if (id) {
//       fetchBookingAndPaymentStatus();
//     }
//   }, [id]);
useEffect(() => {
    const fetchBookingAndPaymentStatus = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Updated API endpoint
            const bookingResponse = await axios.get(
                `http://localhost:5000/api/payment/booking/${id}`, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            const paymentResponse = await axios.get(
                `http://localhost:5000/api/payment/status/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            setBooking(bookingResponse.data.booking);
            setPaymentStatus(paymentResponse.data.paymentStatus);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Error loading booking details');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };
    
    if (id) {
        fetchBookingAndPaymentStatus();
    }
}, [id]);
const handleInitiatePayment = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `http://localhost:5000/api/payment/initiate/${id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
      } else {
        setError('Could not initialize payment. Please try again.');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error initiating payment');
      console.error('Payment initiation error:', err);
    } finally {
      setProcessing(false);
    }
  };



  // Helper function to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-center text-red-500 mb-4">Error</h2>
        <p className="text-gray-700 text-center">{error}</p>
        <button
          onClick={() => navigate('/bookings')}
          className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Go Back to Bookings
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-red-500 mb-4">Booking Not Found</h2>
        <p className="text-gray-700 text-center">The booking you're looking for doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => navigate('/bookings')}
          className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Go Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Payment</h1>
      
      {/* Show message if redirected from payment gateway */}
      {message && (
        <div className={`p-4 mb-6 rounded-md text-center ${
          paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 
          paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 
          'bg-yellow-100 text-yellow-700'
        }`}>
          <p className="font-semibold">{message}</p>
        </div>
      )}
      
      {/* Booking Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Booking Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Destination:</span>
            <span className="font-medium">{booking.place?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-in:</span>
            <span className="font-medium">{formatDate(booking.checkIn)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Check-out:</span>
            <span className="font-medium">{formatDate(booking.checkOut)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Number of Guests:</span>
            <span className="font-medium">{booking.numberOfGuests}</span>
          </div>
          <div className="flex justify-between pt-2 border-t mt-2">
            <span className="text-gray-800 font-semibold">Total Amount:</span>
            <span className="text-lg font-bold text-blue-600">৳{booking.totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* Payment Status */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Payment Status</h2>
        <div className="flex items-center justify-center p-4 rounded-md bg-gray-50">
          {paymentStatus === 'completed' ? (
            <div className="flex flex-col items-center text-green-600">
              <FaCheckCircle className="text-4xl mb-2" />
              <span className="font-semibold">Payment Completed</span>
              <p className="text-sm text-center mt-2 text-gray-600">
                Thank you for your payment. Your booking has been confirmed.
              </p>
            </div>
          ) : paymentStatus === 'failed' ? (
            <div className="flex flex-col items-center text-red-600">
              <FaTimesCircle className="text-4xl mb-2" />
              <span className="font-semibold">Payment Failed</span>
              <p className="text-sm text-center mt-2 text-gray-600">
                We couldn't process your payment. Please try again.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-blue-600">
              <FaCreditCard className="text-4xl mb-2" />
              <span className="font-semibold">Payment Pending</span>
              <p className="text-sm text-center mt-2 text-gray-600">
                Complete your payment to confirm your booking.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Action Button */}
      {paymentStatus !== 'completed' && (
        <div className="mt-6">
          <button
            onClick={handleInitiatePayment}
            disabled={processing}
            className={`w-full py-3 px-4 rounded-md text-white font-semibold ${
              processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition duration-200 flex items-center justify-center`}
          >
            {processing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <FaCreditCard className="mr-2" />
                Proceed to Payment
              </>
            )}
          </button>
          <p className="text-sm text-center text-gray-500 mt-4">
            You will be redirected to our secure payment gateway to complete your transaction.
          </p>
        </div>
      )}
      
      {/* Actions when payment is completed */}
      {paymentStatus === 'completed' && (
        <div className="mt-6">
          <button
            onClick={() => navigate('/bookings')}
            className="w-full py-3 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-200"
          >
            View All Bookings
          </button>
        </div>
      )}
      
      {/* Cancel Option */}
      {paymentStatus !== 'completed' && (
        <button
          onClick={() => navigate('/bookings')}
          className="w-full mt-4 py-2 px-4 rounded-md border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition duration-200"
        >
          Cancel and Go Back
        </button>
      )}
    </div>
  );
};

export default PaymentPage;