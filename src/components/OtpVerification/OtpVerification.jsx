import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInSuccess } from '../../redux/user/userSlice';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
//   const email = searchParams.get('email');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};


  
  
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("object", email)
    if (!email) {
      navigate('/signup'); // Redirect if email is not provided
    }
  }, [email, navigate]);

const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }

    try {
      setLoading(true);
      setError('');
       console.log("email", email);
       console.log("otp", otp);
      const res = await axios.post('http://localhost:5000/api/auth/verify',{
        email,
        otp,
      });
      localStorage.setItem("token", res?.data?.data?.token)
      console.log(" hello ",res)
      if(res.data.data.user.isVerified === true){

        dispatch(signInSuccess(res.data.data.user));
      }
      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'OTP Verified!',
          text: 'Your account has been verified.',
          timer: 2000,
          showConfirmButton: false,
        });
        navigate('/');
      } else {
        setError('Invalid OTP or verification failed.');
      }
      setLoading(false);
    } 
    catch (error) {
      dispatch(signInFailure(error));
      setLoading(false);
      setError('An error occurred while verifying the OTP.');
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Verify OTP</h2>
        <p className="text-center mb-4 text-gray-700">We’ve sent an OTP to your email: <span className="font-bold">{email}</span></p>
        <form onSubmit={handleVerifyOtp}>
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2" htmlFor="otp">Enter OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter OTP"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
