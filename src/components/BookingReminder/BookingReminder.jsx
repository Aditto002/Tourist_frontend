import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const ReminderForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    reminderDate: '',
    reminderTime: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get userId from token when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode JWT token to get userId
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        setUserId(payload.id); // Assuming your JWT payload has an 'id' field
      } catch (error) {
        console.error('Error decoding token:', error);
        setStatus({
          type: 'error',
          message: 'Authentication error. Please try logging in again.'
        });
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    if (!userId) {
      setStatus({
        type: 'error',
        message: 'Please log in to schedule reminders'
      });
      setLoading(false);
      return;
    }

    // Combine date and time for the API
    const dateTime = new Date(`${formData.reminderDate}T${formData.reminderTime}`);

    try {
      const accessToken = localStorage.getItem("token");

      const response = await axios.post(
        'http://localhost:5000/api/reminders/create',
        {
          userId: userId, // Include userId in the request
          email: formData.email,
          reminderDate: dateTime.toISOString(),
          message: formData.message
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      console.log("reminder ",response)
      // Check if the response is successful
      if (response.status === 201) { // Changed to 201 as per your backend code
        setStatus({
          type: 'success',
          message: 'Reminder scheduled successfully!'
        });
        setFormData({
          email: '',
          reminderDate: '',
          reminderTime: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error details:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Error scheduling reminder'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8 p-4 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Schedule a Reminder</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="reminderDate"
              value={formData.reminderDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Reminder Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {status.message && (
          <div className={`p-3 rounded-md flex items-center gap-2 ${
            status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !userId}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Scheduling...' : 'Schedule Reminder'}
        </button>
      </form>
    </div>
  );
};

export default ReminderForm;