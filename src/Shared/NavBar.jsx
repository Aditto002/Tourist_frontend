import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const NavBar = () => {
  const { currentUser } = useSelector(state => state.user)

  return (
    <div className='bg-slate-200 shadow-md '>
      {/* fixed top-0 left-0 w-full z-50 */}
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to="/">
          <h1 className='font-bold text-4xl text-indigo-600 hover:text-indigo-800 transition duration-300'>
            ExploreConnect
          </h1>
        </Link>

        <ul className='flex gap-6 font-medium cursor-pointer'>
          <li className='hover:text-indigo-600 transition duration-200'>
            <Link to='/'>Home</Link>
          </li>
          <li className='hover:text-indigo-600 transition duration-200'>
            <Link to="/gallery">Trip</Link>
          </li>
          {
            currentUser ? (<li className='hover:text-indigo-600 transition duration-200'>
              <Link to="/reminderpage">Reminder</Link>
            </li>):(<></>)
          }
          

          <li className='hover:text-indigo-600 transition duration-200'>
            <Link to="/about">About</Link>
          </li>
          <li className='hover:text-indigo-600 transition duration-200'>
            <Link to="/services">Services</Link>
          </li>
          <li className='hover:text-indigo-600 transition duration-200'>
            <Link to="/contact">Contact</Link>
          </li>

          {currentUser ? (
            <Link to="/profile">
              <img 
                src={currentUser.profilePicture} 
                alt="Profile" 
                className='h-8 w-8 rounded-full border-2 border-indigo-600 object-cover transition-transform duration-300 hover:scale-105' 
              />
            </Link>
          ) : (
            <li className='hover:text-indigo-600 transition duration-300'>
              <Link to='/signIn'>Sign In</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default NavBar
