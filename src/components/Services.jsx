import React from 'react';
import { FaMapMarkedAlt, FaRoute, FaShieldAlt, FaUsers, FaMountain, FaCamera } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url("/images/services-bg.jpg")' }}></div>

      <div className="relative container mx-auto px-6 py-12">
        <div className="bg-white shadow-lg rounded-2xl p-8 md:p-16">
          {/* Welcome Section */}
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-800">
            Our Services at ExploreConnect
          </h2>
          <p className="text-lg text-gray-700 mb-8 text-center">
            At ExploreConnect, we offer a wide range of services to ensure your travel experience is smooth and unforgettable.
          </p>

          {/* Services Section */}
          <section className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: <FaMapMarkedAlt className="text-4xl text-blue-700 transition-transform transform hover:scale-110" />,
                title: 'Discover Tourist Spots',
                description: 'Explore amazing tourist locations across Bangladesh. Our curated guides make sure you don’t miss out on must-visit places.',
              },
              {
                icon: <FaRoute className="text-4xl text-blue-700 transition-transform transform hover:scale-110" />,
                title: 'Customized Itineraries',
                description: 'Craft tailored itineraries that include transportation, tourist attractions, and local experiences to make your trip memorable.',
              },
              {
                icon: <FaShieldAlt className="text-4xl text-blue-700 transition-transform transform hover:scale-110" />,
                title: 'Safety First',
                description: 'With real-time travel alerts and safety tips, we ensure you are well-prepared and informed, making your journey safe and stress-free.',
              },
              {
                icon: <FaUsers className="text-4xl text-blue-700 transition-transform transform hover:scale-110" />,
                title: 'Community Support',
                description: 'Join a vibrant community of travelers to share experiences, get travel tips, and make your trip even more memorable.',
              },
            ].map((service, index) => (
              <div key={index} className="flex items-start bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="mr-4">{service.icon}</div>
                <div>
                  <h4 className="text-2xl font-semibold text-blue-700 mb-2">{service.title}</h4>
                  <p className="text-lg text-gray-700">{service.description}</p>
                </div>
              </div>
            ))}
          </section>

          {/* New Section: Top Activities */}
          <section className="mb-12">
            <h3 className="text-3xl font-semibold text-blue-700 mb-6 text-center">Top Activities to Try</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <FaMountain className="text-6xl text-blue-700 mb-4 transition-transform transform hover:scale-110" />,
                  title: 'Trekking Adventures',
                  description: 'Discover scenic trails and embark on unforgettable trekking experiences.',
                },
                {
                  icon: <FaCamera className="text-6xl text-blue-700 mb-4 transition-transform transform hover:scale-110" />,
                  title: 'Photography Tours',
                  description: 'Capture the essence of Bangladesh with our guided photography tours.',
                },
                {
                  icon: <FaUsers className="text-6xl text-blue-700 mb-4 transition-transform transform hover:scale-110" />,
                  title: 'Cultural Tours',
                  description: 'Immerse yourself in the rich culture and history of Bangladesh through our cultural tours.',
                },
              ].map((activity, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
                  {activity.icon}
                  <h4 className="text-2xl font-semibold text-blue-700 mb-2">{activity.title}</h4>
                  <p className="text-lg text-gray-700">{activity.description}</p>
                </div>
              ))}
            </div>
          </section>


          {/* Call to Action Section */}
          <section className="text-center mt-12">
            <h3 className="text-3xl font-semibold text-blue-700 mb-4">Ready to Explore with Us?</h3>
            <p className="text-lg text-gray-700 mb-6">
              Contact us today to plan your next adventure, or explore our platform to find the best travel experiences.
            </p>
            <Link to="/contact">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-full font-bold shadow-md hover:bg-blue-700 transition">
                Get in Touch
              </button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Services;
