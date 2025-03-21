import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaLock } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Regex Patterns
  const emailPattern = /^([a-z\d\._]{2,})@gmail\.com$/;
  const passPattern = /((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*><?()*&+_])).{8,20}/;

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    if (!emailPattern.test(data.email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email!",
        text: "Please enter a valid email",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
      });
      setLoading(false);
      return;
    }

    if (!passPattern.test(data.password)) {
      Swal.fire({
        icon: "error",
        title: "Wrong email or Password!",
        text: "Please enter correct email and password.",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/admin/signin", data);

      localStorage.setItem("token", response?.data?.data?.token);
      navigate("/dashboard");

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Invalid Credentials!",
        text: "Wrong email or password. Please try again.",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl text-gray-900">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", { required: "Password is required" })}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="absolute right-3 top-4 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Go to Website Button */}
          <button 
            onClick={() => navigate("/")} 
            className="w-full p-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition font-semibold mt-3"
          >
            Go to Website
          </button>
        </form>
      </div>
    </div>
  );
}
