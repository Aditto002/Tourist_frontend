import { useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import loginAvatarAnimation from '.././assets/ani.json';
import { signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Oauth from './Oauth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

const SignIn = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  let emailRef = useRef();
  let passwordRef = useRef();
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  // Regex Patterns
  const emailPattern = /^([a-z\d\._]{2,})@gmail\.com$/;
  const passPattern = /((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*><?()*&+_])).{8,20}/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let email = emailRef.current.value;
    let password = passwordRef.current.value;

    // Email validation
    if (!emailPattern.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email Format!',
        text: 'Only Gmail accounts are allowed. Example: yourname@gmail.com',
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    // Password validation
    if (!passPattern.test(password)) {
      Swal.fire({
        icon: 'error',
        title: 'Wrong Password!',
        text: 'Enter correct password.',
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    try {
      let formData = { email, password };
      const res = await axios.post('http://localhost:5000/api/auth/signin', formData);
      localStorage.setItem("token", res?.data?.data?.token);

      if (res.data.data.user.isVerified) {
        dispatch(signInSuccess(res.data.data.user));
        Swal.fire({
          icon: "success",
          title: "Signed in successfully!",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
        });
        navigate('/');
        formRef.current.reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Email Not Verified!",
          text: "Verify your email first.",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
        });
        navigate('/otpVerification', { state: { email } });
      }
    } catch (error) {
      dispatch(signInFailure(error));
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className='font-[sans-serif] bg-white flex items-center justify-center md:h-screen p-4'>
      <div className='shadow-lg max-w-6xl max-md:max-w-lg rounded-md p-6'>
        <div className='grid md:grid-cols-2 items-center gap-8'>
          <div className='max-md:order-1 lg:min-w-[450px]'>
            <Lottie animationData={loginAvatarAnimation} loop={true} />
          </div>

          <form className='md:max-w-md w-full mx-auto' ref={formRef} onSubmit={handleSubmit}>
            <div className='mb-12'>
              <h3 className='text-4xl font-extrabold text-blue-600'>Sign in</h3>
            </div>

            <div className='relative flex items-center'>
              <input
                id='email'
                ref={emailRef}
                name='email'
                type='email'
                required
                className='w-full text-md border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none'
                placeholder='Enter email'
              />
            </div>

            <div className='mt-8 relative flex items-center'>
              <input
                id='password'
                ref={passwordRef}
                name='password'
                type={showPassword ? 'text' : 'password'}
                required
                className='w-full text-md border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none'
                placeholder='Enter password'
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className='absolute right-2 cursor-pointer'
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className='mt-12'>
              <button
                type='submit'
                className='w-full shadow-xl py-2.5 px-5 text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none mb-5'
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Sign In'}
              </button>
              <Oauth />
              <p className='text-gray-800 text-sm text-center mt-6'>
                Don't have an account?{' '}
                <Link to='/register' className='text-blue-600 font-semibold hover:underline ml-1'>
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
