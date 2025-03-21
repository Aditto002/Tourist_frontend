import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import axios from 'axios';
import { updateUserStart, updateUserSuccess, updateUserFailur, signOut } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaCamera, FaSignOutAlt, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const fileRef = useRef();
  const [image, setImage] = useState(null);
  const [imageUpload, setImageUpload] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const passPattern = /((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*><?()*&+_])).{8,20}/;
  const namePattern = /^.{2,}$/;
  
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUpload(Math.round(progress));
      },
      () => setImageError(true),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!namePattern.test(usernameRef.current.value)) {
      Swal.fire({
        icon: 'error',
        title: 'Username must be at least 2 characters long!',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    if (passwordRef.current.value && !passPattern.test(passwordRef.current.value)) {
      Swal.fire({
        icon: 'error',
        title: 'Password must be 8-20 characters long and include uppercase, lowercase, number, and special character!',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    dispatch(updateUserStart());

    try {
      const updatedData = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value || undefined,
      };

      const res = await axios.post(
        `http://localhost:5000/api/user/update/${currentUser._id}`,
        { ...formData, ...updatedData },
        { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }
      );

      dispatch(updateUserSuccess(res.data.data));
      Swal.fire({
        icon: 'success',
        title: 'Profile updated successfully',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (err) {
      dispatch(updateUserFailur(err));
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        toast: true,
        position: 'top-right',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-lg bg-white rounded-lg shadow-xl p-8'>
        <div className='flex flex-col items-center'>
          <h1 className='text-3xl font-bold text-gray-900'>Profile</h1>
          <div className='relative mt-4'>
            <img
              src={formData.profilePicture || currentUser.profilePicture}
              alt='Profile'
              className='w-32 h-32 rounded-full object-cover shadow-md border-4 border-gray-300'
            />
            <button
              onClick={() => fileRef.current.click()}
              className='absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-800 transition'
            >
              <FaCamera size={16} />
            </button>
            <input type='file' ref={fileRef} hidden accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className='mt-4 space-y-3'>
          <input ref={usernameRef} defaultValue={currentUser.username} className={inputField} type='text' placeholder='Username' />
          <input ref={emailRef} defaultValue={currentUser.email} className={inputField} type='email' placeholder='Email' disabled />
          <div className='relative'>
            <input ref={passwordRef} className={inputField} type={showPassword ? 'text' : 'password'} placeholder='New Password' />
            <button
              type='button'
              className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type='submit' className={btnPrimary}>Update Profile</button>
        </form>

        <button
          onClick={() => navigate('/userbooking')}
          className='w-full mt-4 bg-gray-200 text-gray-900 p-3 rounded-lg flex justify-between items-center hover:bg-gray-300 transition'
        >
          View Your Bookings <FaArrowRight />
        </button>

        <button
          onClick={() => { localStorage.removeItem('token'); dispatch(signOut()); navigate('/register'); }}
          className='w-full mt-4 bg-red-600 text-white p-3 rounded-lg hover:bg-red-800 transition flex items-center justify-center'
        >
          <FaSignOutAlt className='mr-2' /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;

const inputField = 'w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-blue-300';
const btnPrimary = 'w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800 transition';