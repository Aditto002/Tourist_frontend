import React from 'react';
import { FaMapMarkedAlt, FaRoute, FaShieldAlt, FaUsers, FaMountain, FaCamera } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url("/images/travel-bg.jpg")' }}></div>

      <div className="relative container mx-auto px-6 py-12">
        <div className="bg-white shadow-xl rounded-2xl p-8 md:p-16">
          {/* Welcome Section */}
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-800">
            Welcome to ExploreConnect - Your Ultimate Travel Guide to Bangladesh!
          </h2>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Explore the hidden gems of Bangladesh with ease. Whether you're planning a weekend getaway or a long journey, ExploreConnect is here to help you every step of the way.
          </p>

          {/* Mission Section */}
          <section className="mb-12">
            <h3 className="text-3xl font-semibold text-blue-700 mb-4">Our Mission</h3>
            <p className="text-lg text-gray-700">
              At <strong>ExploreConnect</strong>, our mission is to provide travelers with a seamless and enriching experience by offering comprehensive tools to plan, explore, and book their perfect trip. We believe that every journey should be memorable, safe, and accessible to all.
            </p>
          </section>

          {/* Features Section */}
          <section className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              { icon: <FaMapMarkedAlt className="text-4xl text-blue-700" />, title: 'Discover Amazing Places', description: 'Uncover beautiful destinations, from bustling cities to remote landscapes. Our curated list of tourist spots ensures you never miss a must-see location.' },
              { icon: <FaRoute className="text-4xl text-blue-700" />, title: 'Tailored Itineraries', description: 'Choose your destination and let us create the perfect itinerary for you. From transportation options to must-visit attractions, we make travel planning a breeze.' },
              { icon: <FaShieldAlt className="text-4xl text-blue-700" />, title: 'Travel with Confidence', description: 'We provide real-time travel alerts, safety tips, and weather updates so you can travel confidently knowing you\'re well-informed.' },
              { icon: <FaUsers className="text-4xl text-blue-700" />, title: 'Community Support', description: 'Join a vibrant community of travelers. Share experiences, get travel tips, and make your trip even more memorable with ExploreConnect.' },
            ].map((feature, index) => (
              <div key={index} className="flex items-start bg-blue-50 p-6 rounded-lg shadow-md">
                <div className="mr-4">{feature.icon}</div>
                <div>
                  <h4 className="text-2xl font-semibold text-blue-700 mb-2">{feature.title}</h4>
                  <p className="text-lg text-gray-700">{feature.description}</p>
                </div>
              </div>
            ))}
          </section>


          {/* Call to Action */}
          <section className="text-center mt-12">
            <h3 className="text-3xl font-semibold text-blue-700 mb-4">Ready to Start Your Adventure?</h3>
            <p className="text-lg text-gray-700 mb-6">
              Explore, plan, and book your perfect trip today with ExploreConnect. Whether you're looking for hidden gems or popular tourist spots, we're here to make your travel experience smooth and unforgettable.
            </p>
            <Link to="/">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-full font-bold shadow-md hover:bg-blue-700 transition">
                Start Exploring Now
              </button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
