import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaStar } from 'react-icons/fa';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [allgalleryItems, setAllGalleryItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [reviewData, setReviewData] = useState({
    rating: 5
  });

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/image/galleries');
        setGalleryItems(response.data.data);
        setAllGalleryItems(response.data.data)
      } catch (error) {
        console.error('Error fetching gallery items:', error);
      }
    };
    fetchGalleryItems();
  }, []);

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert('Please login to book');
        return;
      }

      let pricePerNight = selectedItem.price;
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const totalPrice = numberOfNights * pricePerNight;

      const bookingPayload = { 
        place: selectedItem._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        totalPrice: totalPrice
      };

      const response = await axios.post(
        'http://localhost:5000/api/bookings/create',
        bookingPayload,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.status === 200) {
        alert('Booking successful!');
        setShowBookingModal(false);
        navigate(`/userbooking`);
      }
    } catch (error) {
      console.error('Error making booking:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const handleReview = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to review');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/image/${selectedItem._id}/review`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert('Review submitted successfully!');
        setShowReviewModal(false);
        const updatedResponse = await axios.get('http://localhost:5000/api/image/galleries');
        setGalleryItems(updatedResponse.data.data);
      } else {
        alert('Review submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Review submission failed. Please try again.');
    }
  };
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if(!query){
      setGalleryItems(allgalleryItems);
    }
    else{
      
      console.log("query", query)
      const filteredItems = galleryItems.filter((item) =>
        item.title.toLowerCase().includes(query)
      );
      console.log("filteredItems", filteredItems)
      setGalleryItems(filteredItems);
    }
    
  };
  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
  


<h2 className="text-5xl font-bold text-gray-800 mb-12">ExploreConnect Gallery</h2>
       
       <div className="mb-8">
     <input
       type="text"
       placeholder="Search by title..."
       className="w-full max-w-md p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring focus:ring-indigo-300"
       value={searchQuery}
       onChange={handleSearch}
     />
     
   </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map(item => (
            <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => {
                setSelectedItem(item);
                setShowBookingModal(true);
              }}>
              <img src={item.picture} className="w-full h-60 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-indigo-600 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {showBookingModal && selectedItem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-2xl relative transform transition-all scale-100 overflow-auto max-h-[90vh]">
              <button className="absolute top-4 right-1 text-gray-600 hover:text-red-600" onClick={() => setShowBookingModal(false)}>
                <FaTimes size={24} />
              </button>
              <img src={selectedItem.picture} className="w-full h-60 object-cover rounded-md mb-4 shadow-md" />
              <h3 className="text-3xl font-bold text-indigo-700 mb-2">{selectedItem.title}</h3>
              <p className="text-gray-600 mb-4">{selectedItem.description}</p>
              <p className="text-gray-700 font-semibold">Location: {selectedItem.location.city}, {selectedItem.location.country}</p>
              <p className="text-lg font-bold text-indigo-600 mt-2">Price: ${selectedItem.price} per night</p>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <input type="date" className="border border-gray-300 rounded-lg w-full p-2 focus:ring focus:ring-indigo-300"
                    value={bookingData.checkIn} onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})} 
                    min={new Date().toISOString().split('T')[0]}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <input type="date" className="border border-gray-300 rounded-lg w-full p-2 focus:ring focus:ring-indigo-300"
                    value={bookingData.checkOut} onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})} 
                    min={new Date().toISOString().split('T')[0]}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                  <input type="number" className="border border-gray-300 rounded-lg w-full p-2 focus:ring focus:ring-indigo-300" min="1"
                    value={bookingData.guests} onChange={(e) => setBookingData({...bookingData, guests: e.target.value})} />
                </div>
                <div className="flex space-x-4 mt-4">
                  <button className="flex-1 bg-indigo-600 text-white py-3 px-5 rounded-lg hover:bg-indigo-700 transition-all shadow-md" onClick={handleBooking}>
                    Confirm Booking
                  </button>
                  <button className="flex-1 border border-indigo-600 text-indigo-600 py-3 px-5 rounded-lg hover:bg-indigo-100 transition-all shadow-md" 
                    onClick={() => {
                      setShowBookingModal(false); // Close booking modal
                      setShowReviewModal(true); // Open review modal
                    }}>
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showReviewModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
                onClick={() => setShowReviewModal(false)}
              >
                <FaTimes size={24} />
              </button>
              <h3 className="text-2xl font-bold mb-4">Write a Review</h3>
              <p className="mb-4">Share your experience at {selectedItem?.title}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-2xl cursor-pointer ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => setReviewData({...reviewData, rating: star})}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <button onClick={handleReview} className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
