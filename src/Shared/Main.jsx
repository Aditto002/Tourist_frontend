import React from 'react'
import NavBar from './NavBar'
import { Outlet, useLocation } from 'react-router-dom'

const Main = () => {
  const location = useLocation();

  // Hide NavBar on OTP verification page
  const hideNavBarOnRoutes = ['/otpVerification', '/dashboard', '/booking', '/user', '/placemanagement','/addtrips','/adminbookings',];

  const hideNavBar = hideNavBarOnRoutes.includes(location.pathname);
  return (
    <div>
    <div>
    {!hideNavBar && <NavBar />}
    </div>
    <div>
      <Outlet></Outlet>
    </div>
  </div>
  
  )
}

export default Main
