import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ReminderList = () => {
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(true);
  
  const [editForm, setEditForm] = useState({
    message: '',
    reminderDate: '',
    reminderTime: ''
  });

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:5000/api/reminders/user-reminders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setReminders(response.data.data);
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Error fetching reminders'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/reminders/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStatus({
        type: 'success',
        message: 'Reminder deleted successfully'
      });
      fetchReminders();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Error deleting reminder'
      });
    }
  };

  const startEdit = (reminder) => {
    const reminderDate = new Date(reminder.reminderDate);
    setEditingId(reminder._id);
    setEditForm({
      message: reminder.message,
      reminderDate: reminderDate.toISOString().split('T')[0],
      reminderTime: reminderDate.toTimeString().split(' ')[0].slice(0, 5)
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      message: '',
      reminderDate: '',
      reminderTime: ''
    });
  };

  const handleEditChange = (e) => {
    setEditForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdateSubmit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const dateTime = new Date(`${editForm.reminderDate}T${editForm.reminderTime}`);

      await axios.put(`http://localhost:5000/api/reminders/update/${id}`, {
        message: editForm.message,
        reminderDate: dateTime.toISOString()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setStatus({
        type: 'success',
        message: 'Reminder updated successfully'
      });
      setEditingId(null);
      fetchReminders();
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Error updating reminder'
      });
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading reminders...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-6">Your Reminders</h2>

      {status.message && (
        <div className={`p-3 rounded-md flex items-center gap-2 mb-4 ${
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

      {reminders.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No reminders scheduled</p>
      ) : (
        <div className="space-y-4">
          {reminders.map(reminder => (
            <div key={reminder._id} className="border rounded-lg p-4 bg-white shadow-sm">
              {editingId === reminder._id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        name="reminderDate"
                        value={editForm.reminderDate}
                        onChange={handleEditChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Time</label>
                      <input
                        type="time"
                        name="reminderTime"
                        value={editForm.reminderTime}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                      name="message"
                      value={editForm.message}
                      onChange={handleEditChange}
                      rows="2"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 rounded border hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateSubmit(reminder._id)}
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="font-medium">
                      {new Date(reminder.reminderDate).toLocaleDateString()} at{' '}
                      {new Date(reminder.reminderDate).toLocaleTimeString()}
                    </p>
                    <p className="text-gray-600">{reminder.message}</p>
                    <p className="text-sm text-gray-500">Status: {reminder.status}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(reminder)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(reminder._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReminderList;