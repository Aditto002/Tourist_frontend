import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase";
import AdminNavbar from "./AdminNavbar";

const UpdateTrip = () => {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUpload, setImageUpload] = useState(0);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    fetchTripDetails();
  }, [placeId]);

  const fetchTripDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/image/place/${placeId}`);
      if (response.data.status === "success") {
        setTrip(response.data.data);
      } else {
        setError("Failed to load trip details");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load trip details. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "picture") {
      const file = e.target.files[0];
      if (file && ["image/jpeg", "image/png"].includes(file.type)) {
        setNewImage(file);
        setError("");
      } else {
        setError("Only JPG, PNG formats are allowed.");
      }
    } else if (name === "availability" || name === "featured") {
      setTrip((prev) => ({ ...prev, [name]: checked }));
    } else if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setTrip((prev) => ({
        ...prev,
        location: { ...prev.location, [locationField]: value },
      }));
    } else if (name === "price") {
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        setTrip((prev) => ({ ...prev, price: numericValue }));
      }
    } else if (name === "maxGuests") {
      const numericValue = parseInt(value);
      if (!isNaN(numericValue)) {
        setTrip((prev) => ({ ...prev, maxGuests: numericValue }));
      }
    } else {
      setTrip((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}_${image.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUpload(Math.round(progress));
        },
        (error) => {
          setError("Error uploading file: " + error.message);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            setError("Failed to get download URL");
            reject(error);
          }
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!trip.title || !trip.price || !trip.description) {
        throw new Error("Please fill in all required fields");
      }

      let imageUrl = trip.picture;
      if (newImage) {
        imageUrl = await handleFileUpload(newImage);
      }

      const updatedTrip = {
        ...trip,
        picture: imageUrl,
        price: parseFloat(trip.price),
        maxGuests: parseInt(trip.maxGuests),
      };

      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        throw new Error("No authentication token found");
      }

      const response = await axios.put(
        `http://localhost:5000/api/image/update/${placeId}`,
        updatedTrip,
        {
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        navigate("/placemanagement");
      } else {
        throw new Error(response.data.message || "Failed to update trip");
      }
    } catch (error) {
      setError(error.message || "Failed to update trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return <div className="text-center p-8"><p className="text-gray-600">Loading trip details...</p></div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <AdminNavbar></AdminNavbar>
      <h2 className="text-4xl font-bold mb-6 pt-10 text-center text-gray-800">Update Trip</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <input 
          type="text" 
          name="title" 
          value={trip.title || ''} 
          onChange={handleChange} 
          placeholder="Title" 
          className="p-4 border rounded-lg bg-gray-100" 
          required 
        />

        <input 
          type="number" 
          name="price" 
          value={trip.price || ''} 
          onChange={handleChange} 
          placeholder="Price" 
          className="p-4 border rounded-lg bg-gray-100" 
          required 
          step="0.01"
          min="0"
        />

        <textarea 
          name="description" 
          value={trip.description || ''} 
          onChange={handleChange} 
          placeholder="Description" 
          className="p-4 border rounded-lg bg-gray-100 col-span-2" 
          required
        />

        <input 
          type="text" 
          name="location.address" 
          value={trip.location?.address || ''} 
          onChange={handleChange} 
          placeholder="Address" 
          className="p-4 border rounded-lg bg-gray-100" 
          required 
        />

        <input 
          type="text" 
          name="location.city" 
          value={trip.location?.city || ''} 
          onChange={handleChange} 
          placeholder="City" 
          className="p-4 border rounded-lg bg-gray-100" 
          required 
        />

        <input 
          type="text" 
          name="location.country" 
          value={trip.location?.country || ''} 
          onChange={handleChange} 
          placeholder="Country" 
          className="p-4 border rounded-lg bg-gray-100" 
          required 
        />

        <select 
          name="category" 
          value={trip.category || ''} 
          onChange={handleChange} 
          className="p-4 border rounded-lg bg-gray-100"
        >
          <option value="">Select Category</option>
          <option value="beach">Beach</option>
          <option value="mountain">Mountain</option>
          <option value="city">City</option>
          <option value="rural">Rural</option>
          <option value="historic">Historic</option>
          <option value="adventure">Adventure</option>
        </select>

        <input 
          type="number" 
          name="maxGuests" 
          value={trip.maxGuests || ''} 
          onChange={handleChange} 
          placeholder="Max Guests" 
          className="p-4 border rounded-lg bg-gray-100"
          min="1" 
        />

        <div className="col-span-2">
          <input 
            type="file" 
            name="picture" 
            accept="image/jpeg, image/png" 
            onChange={handleChange} 
            className="p-4 border rounded-lg bg-gray-100 w-full" 
          />
          {imageUpload > 0 && imageUpload < 100 && (
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${imageUpload}%` }}
              />
            </div>
          )}
        </div>

        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            name="availability" 
            checked={trip.availability || false} 
            onChange={handleChange} 
          />
          Available
        </label>

        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            name="featured" 
            checked={trip.featured || false} 
            onChange={handleChange} 
          />
          Featured
        </label>

        <button 
          type="submit" 
          className="col-span-2 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Trip"}
        </button>
      </form>
    </div>
  );
};

export default UpdateTrip;
