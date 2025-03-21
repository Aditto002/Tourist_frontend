import { useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Oauth from './Oauth';
import Lottie from 'lottie-react';
import loginAvatarAnimation from '../assets/ani.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const formRef = useRef(null);
  const navigate = useNavigate();

  let usernameRef, passwordRef, emailRef = useRef();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let username = usernameRef.value;
      let password = passwordRef.value;
      let email = emailRef.value;
      var namepattern = /[a-zA-Z.]/;
      // var emailpattern = /^([\w]*[\w\.]*(?!\.)@gmail.com)/;
      var emailpattern = /^([a-z\d\._]{2,})@gmail\.com$/;
      var passpattern = /((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*><?()*&+_])).{8,20}/;

      if (username.length < 2 || username.length > 20) {
        document.getElementById("efname").innerHTML = "length must be 2-20";
        return false;
      } else if (!username.match(namepattern)) {
        document.getElementById("efname").innerHTML = "invalid input";
        return false;
      } else {
        document.getElementById("efname").innerHTML = "";
      }

      if (!email.match(emailpattern)) {
        document.getElementById("eemail").innerHTML = "Enter a Valied Email";
        return false;
      } else {
        document.getElementById("eemail").innerHTML = "";
      }

      if (!password) {
        document.getElementById("epass").innerHTML = "Password is required";
        return false;
      } else if (!password.match(passpattern)) {
        document.getElementById("epass").innerHTML = "Password must be 8 character and atlest one uppercase, lowercase, digit and special character ";
        return false;
      } else {
        document.getElementById("epass").innerHTML = "";
      }

      setLoading(true);
      setError(false);

      let formData = {
        username: username,
        password: password,
        email: email,
      };
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      console.log(res);
      console.log("  hello")
      
      if(res.data.success === 'false'){
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "User Already Exist"
        });

        setLoading(false);
      }else{
        setLoading(false);

        if(res.status === 201){
          navigate('/otpVerification', { state: { email: email } });
  
        }
        if (res.data.success === 'false') {
          setError(true);
          return;
        }
        setError(false);
        if(res.data.status == 'success'){
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Register successfully, Now Sign Up "
          });
        }
        formRef.current.reset();
      } 
      }
    catch (error) {
      setLoading(false);
      setError(true);
      console.error('Error:', error);
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="grid md:grid-cols-2 items-center gap-8 max-w-5xl w-full p-8 bg-white shadow-lg rounded-lg">
        <div className='max-md:order-1 lg:min-w-[450px]'>
          <Lottie animationData={loginAvatarAnimation} loop={true} />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6 text-blue-500 text-center">Create an Account</h2>
          <form className="space-y-6" ref={formRef}>
            <div>
              <label className="block text-sm text-gray-700 mb-1" htmlFor="username">Username</label>
              <input
                id="username"
                ref={(input) => (usernameRef = input)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter your username"
              />
              <span id="efname" className="text-sm text-red-500"></span>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                ref={(input) => (emailRef = input)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                placeholder="Enter your email"
              />
              <span id="eemail" className="text-sm text-red-500"></span>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  ref={(input) => (passwordRef = input)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash} 
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility} 
                />
              </div>
              <span id="epass" className="text-sm text-red-500"></span>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-3 px-6 text-sm tracking-wider font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white focus:outline-none"
              disabled={loading}
            >
              {loading ? "LOADING..." : "Sign Up"}
            </button>
            <Oauth />
            <div className="text-center mt-6">
              <p>
                Already have an account? <Link to="/signin" className="text-blue-500 font-semibold">Sign in</Link>
              </p>
            </div>

            <p className="text-center text-red-500">{error && "Something went wrong!"}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
