import { useState, useEffect } from "react";
import axios from "axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase";
import { useNavigate } from 'react-router-dom';
import AdminNavbar from "./AdminNavbar";
const AddTrips = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();
  const [imageUpload, setImageUpload] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [newTrip, setNewTrip] = useState({
    title: "",
    description: "",
    price: "",
    picture: null,
    location: {
      address: "",
      city: "",
      country: "",
    },
    category: "",
    amenities: [],
    maxGuests: "",
    availability: true,
    featured: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await axios.get("/api/trips");
      setTrips(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError("Failed to load trips. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "picture") {
      const file = e.target.files[0];
      if (file && ["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setNewTrip({ ...newTrip, picture: file });
        setError("");
      } else {
        setError("Only JPG, JPEG, and PNG formats are allowed.");
      }
    } else if (name === "availability" || name === "featured") {
      setNewTrip({ ...newTrip, [name]: checked });
    } else if (name.startsWith("location.")) {
      setNewTrip({
        ...newTrip,
        location: { ...newTrip.location, [name.split(".")[1]]: value },
      });
    } else {
      setNewTrip({ ...newTrip, [name]: value });
    }
  };

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUpload(Math.round(progress));
        },
        (error) => {
          setImageError(true);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTrip.title || !newTrip.description || !newTrip.price || !newTrip.picture) {
      setError("All fields are required.");
      return;
    }

    try {
      const imageUrl = await handleFileUpload(newTrip.picture);
      const tripData = { ...newTrip, picture: imageUrl };

      const accessToken = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/admin/place/create", tripData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      fetchTrips();
      setNewTrip({
        title: "",
        description: "",
        price: "",
        picture: null,
        location: { address: "", city: "", country: "" },
        category: "",
        amenities: [],
        maxGuests: "",
        availability: true,
        featured: false,
      });
      setError("");
    } catch (error) {
      setError("Failed to add trip. Please try again.");
    }
  };

  return (
    <div className=" bg-gray-50 min-h-screen">
      <AdminNavbar></AdminNavbar>
      
      <h2 className="pt-10 text-4xl font-bold mb-6 text-center text-gray-800">Add New Trip</h2>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <input type="text" name="title" placeholder="Title" value={newTrip.title} onChange={handleChange} className="p-4 border rounded-lg bg-gray-100" required />
        
        <input type="number" name="price" placeholder="Price" value={newTrip.price} onChange={handleChange} className="p-4 border rounded-lg bg-gray-100" required />
        
        <textarea name="description" placeholder="Description" value={newTrip.description} onChange={handleChange} className="p-4 border rounded-lg bg-gray-100 col-span-2" required></textarea>
        
        <input type="text" name="location.address" placeholder="Address" value={newTrip.location.address} onChange={handleChange} className="p-4 border rounded-lg bg-gray-100" required />
        
        <input type="text" name="location.city" placeholder="City" value={newTrip.location.city} onChange={handleChange} className="p-4 border rounded-lg bg-gray-100" required />
        
        <input type="text" name="location.country" placeholder="Country" value={newTrip.location.country} onChange={handleChange} className="p-4 border rounded-lg bg-gray-100" required />
        
        <select name="category" value={newTrip.category} onChange={handleChange} className="p-4 border rounded-lg bg-gray-100">
          <option value="">Select Category</option>
          <option value="beach">Beach</option>
          <option value="mountain">Mountain</option>
          <option value="city">City</option>
          <option value="rural">Rural</option>
          <option value="historic">Historic</option>
          <option value="adventure">Adventure</option>
        </select>

        <input type="number" name="maxGuests" placeholder="Max Guests" value={newTrip.maxGuests} onChange={handleChange} className="p-4 border rounded-lg bg-gray-100" />

        <input type="file" name="picture" accept="image/jpeg, image/jpg, image/png" onChange={handleChange} className="p-4 border rounded-lg bg-gray-100 col-span-2" required />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="availability" checked={newTrip.availability} onChange={handleChange} />
          Available
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" checked={newTrip.featured} onChange={handleChange} />
          Featured
        </label>

        <button type="submit" className="col-span-2 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300">
          Add Trip
        </button>
      </form>
    </div>
  );
};

export default AddTrips;
