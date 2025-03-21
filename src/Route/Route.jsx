import { createBrowserRouter,RouterProvider,Navigate } from 'react-router-dom'
import Username from '../components/Username.jsx'
import Register from "../components/Register.jsx"
import Main from '../Shared/Main.jsx'
import Profile from "../components/Profile.jsx"
import SignIn from "../components/SignIn.jsx"
import About from "../components/About.jsx"
import Home from "../components/Home.jsx"
import Gallery from "../components/Gallery.jsx"
import Contact from '../components/Contact.jsx'
import PrivateRoute from '../components/PrivateRoute.jsx'
import Services from '../components/Services.jsx'
import EmailVerify from '../components/EmailVerify/EmailVerify.jsx'
import OTPVerification from '../components/OtpVerification/OtpVerification.jsx'
import Adminlogin from '../components/adminpage/Adminlogin.jsx'
import Dashboard from '../components/AdminDashboard/Dashboard.jsx'
import AddTrips from '../components/AdminDashboard/Places.jsx'
import UserManagement from '../components/AdminDashboard/UserManagement.jsx'
import PlaceManagement from '../components/AdminDashboard/PlaceManagement.jsx'
import UpdateTrip from '../components/AdminDashboard/UpdateTrip.jsx'
import UserBookings from '../components/userbooking/UserBookings.jsx'
import AdminBookings from '../components/adminbookings/AdminBookings.jsx'
// import BookingReminder from '../components/BookingReminder/BookingReminder.jsx'
import RemindersPage from '../components/BookingReminder/RemindersPage.jsx'
import PaymentPage from '../components/Payment/PaymentPage.jsx'
const router = createBrowserRouter([
  {
    path:'/',
    element:<Main></Main>,
    children:[
      {
        path:'/',
        element:<Home></Home>
      },
      {
        path:'/register',
        element:<Register></Register>
      },
      {
        path:'/profile',
        element:<Profile></Profile>
      },
      {
        path:'/gallery',
        element:<Gallery></Gallery>
      },
      {
        path:'/signIn',
        element:<SignIn></SignIn>
      },
      {
        path:'/about',
        element:<About></About>
      },
      {
        path:'/contact',
        element:<Contact></Contact>
      },
      {
        path:'/emailverify',
        element:<EmailVerify></EmailVerify>
      },
      {
        path:'/otpVerification',
        element:<OTPVerification></OTPVerification>
      },
      {
        path:'/services',
        element:<Services></Services>
      },
    
    {
     path:'/dashboard',
    element:<Dashboard></Dashboard>
   },
    {
     path:'/addtrips',
    element:<AddTrips></AddTrips>
   },{
    path: '/user',
    element:<UserManagement></UserManagement>
   },
   {
    path: '/placemanagement',
    element:<PlaceManagement></PlaceManagement>
   },
   {
    path: '/userbooking',
    element:<UserBookings></UserBookings>
   },
   {
    path: '/adminbookings',
    element:<AdminBookings></AdminBookings>
   },
  //  {
  //   path: '/bookingreminder',
  //   element:<BookingReminder></BookingReminder>
  //  },
   {
    path: '/reminderpage',
    element:<RemindersPage></RemindersPage>
   },
   {
    path: "/payment/:id",
    element: <PaymentPage></PaymentPage>
  },
  {
    path: "/payment-success",
    element: <PaymentPage></PaymentPage>
  },
  {
    path: "/payment-failed",
    element: <PaymentPage></PaymentPage>
  },
  {
    path: "/payment-cancelled",
    element: <PaymentPage></PaymentPage>
  },
  {
    path: "/payment",
    element: <Navigate to="/userbooking" replace />
  }
    ]
  },
  {
    path: '/adminLogin',
    element: <Adminlogin />
  },
  {
    path:'/updatetrip/:placeId',
   element:<UpdateTrip></UpdateTrip>
  },

  
])
export default router