import React from 'react'
import axios from 'axios';
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import {  useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom';

const Oauth = () => {
    const dispatch = useDispatch();
    const naigate =useNavigate();
    const handlGoogle = async()=>{
        try{
         const provider = new GoogleAuthProvider()
         const auth = getAuth(app);
         const result = await signInWithPopup(auth,provider)
         let formData ={
          name:result.user.displayName,
          email:result.user.email,
          photo: result.user.photoURL
         }
        //  console.log(result)
         const res = await axios.post('https://explore-aditto.ahadalichowdhury.online/api/auth/google',formData);
        //  const data = await res.json();
         console.log(res)
         localStorage.setItem("token",res?.data?.token)
         dispatch(signInSuccess(res.data.data))
         naigate('/')
        }
        catch(e){
         console.log("could not login with google", e)
        }
    }
  return (
    <button type='button' onClick={handlGoogle} className=' bg-yellow-500 rounded-xl text-lg text-gray-200 shadow-md w-full h-10 hover:bg-yellow-600'>continue with google</button>

  )
}

export default Oauth