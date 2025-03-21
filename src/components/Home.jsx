import React, { useState } from 'react';
import ReactSlider from './ReactSlider';

const Home = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);

  const trips = [
    {
      id: 1,
      title: 'Sundarbans Adventure',
      description: 'Explore the largest mangrove forest, home to Royal Bengal Tigers.',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1549300461-11c5b94e8855?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VuZGFyYmFufGVufDB8fDB8fHww',
    },
    {
      id: 2,
      title: 'Cox’s Bazar Beach',
      description: 'Relax at the world’s longest unbroken sandy sea beach.',
      price: 4000,
      image: 'https://awalkintheworld.com/wp-content/uploads/2022/05/coxs-bazar-sunset-1024x461.jpg',
    },
    {
      id: 3,
      title: 'Srimangal Tea Gardens',
      description: 'Discover the scenic tea gardens and lush greenery.',
      price: 3500,
      image: 'https://cdn-gdpal.nitrocdn.com/wYTsNDvTtivyqMQKozkdeShFCCdGExJz/assets/images/optimized/rev-b1c501a/wp-content/uploads/2022/07/1-3-1.jpg',
    },
    {
      id: 4,
      title: 'Bandarban Trek',
      description: 'Experience the breathtaking hill tracks of Bandarban.',
      price: 6000,
      image: 'https://pathfriend-bd.com/wp-content/uploads/2019/08/Bandarban.jpg',
    },
    {
      id: 6,
      title: 'Sylhet Tea Valley',
      description: 'Visit the lush tea valleys and experience the calmness of Sylhet.',
      price: 3800,
      image: 'https://media.licdn.com/dms/image/v2/D4D12AQGEM5snxG6IgA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1660927692547?e=2147483647&v=beta&t=Z3D7kjfLTQIl-Bqmm0satrGiUhhuVZDB5h8qLaXwpb4',
    },
    {
      id: 7,
      title: 'Kuakata Beach',
      description: 'Experience the unique sunset and sunrise views from the same beach.',
      price: 4200,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZS-_XM1MkC8-jEyy-sE6qqwyxMXk81ES8sg&s',
    },
    {
      id: 8,
      title: 'Patenga Beach, Chattogram',
      description: 'Enjoy the cool breeze and scenic beauty of Patenga beach.',
      price: 3800,
      image: 'https://www.travelmate.com.bd/wp-content/uploads/2019/08/Patenga.jpg',
    },
    {
      id: 9,
      title: 'St. Martin’s Island',
      description: 'Discover the coral island and clear blue waters of St. Martin’s.',
      price: 5500,
      image: 'https://d14tz9u25kttx3.cloudfront.net/St_Martin_s_Island_01ba8992e4.webp',
    },
  ];
  

  const handleBooking = (e) => {
    e.preventDefault();
    alert(`Booking confirmed for ${selectedTrip.title}!`);
    setSelectedTrip(null);
  };

  return (
    <div>
      {/* Slider */}
      <ReactSlider />

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white">
        <h2 className="text-center text-4xl font-bold mb-8">Discover the Beauty of Bangladesh</h2>
        <p className="text-center text-lg mb-6">
          Embark on unforgettable journeys with Explore Connect. Your adventure starts here!
        </p>
      </section>

      {/* Trips Section */}
      <section className="py-12 bg-gray-100">
        <h2 className="text-center text-3xl font-bold mb-6">Our Popular Destinations</h2>
        <p className="text-center text-gray-600 mb-10">
          From the serene beaches to lush greenery, explore the heart of Bangladesh.
        </p>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105 hover:shadow-xl"
            >
              <img
                src={trip.image}
                alt={trip.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{trip.title}</h3>
                <p className="text-gray-600 mt-2">{trip.description}</p>
                {/* <p className="text-green-600 font-semibold mt-4">
                  Price: BDT {trip.price}
                </p> */}
                {/* <button
                  onClick={() => setSelectedTrip(trip)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Book Now
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-12 bg-blue-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for your next adventure?
          </h2>
          <p className="text-lg mb-6">
            Plan your dream trip with us today. Start exploring the best places in Bangladesh now!
          </p>
          <a
            href="#"
            className="inline-block bg-yellow-500 text-blue-800 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-yellow-600"
          >
            Explore More Trips
          </a>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Book Trip: {selectedTrip.title}
            </h2>
            <form onSubmit={handleBooking}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={() => setSelectedTrip(null)}
                className="ml-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
  <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {/* About Section */}
    <div>
      <h4 className="text-xl font-bold mb-4">Explore Connect</h4>
      <p className="text-gray-400">
        Discover the beauty of Bangladesh with Explore Connect. From serene beaches to breathtaking hills, your adventure awaits.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="text-xl font-bold mb-4">Quick Links</h4>
      <ul className="space-y-3">
        <li>
          <a href="/gallery" className="text-gray-400 hover:text-white">
            Trips
          </a>
        </li>
        <li>
          <a href="/reminderpage" className="text-gray-400 hover:text-white">
            Reminder
          </a>
        </li>
        <li>
          <a href="/contact" className="text-gray-400 hover:text-white">
            Contact Us
          </a>
        </li>
      </ul>
    </div>

    {/* Newsletter */}
    <div>
      <h4 className="text-xl font-bold mb-4">Stay Updated</h4>
      <p className="text-gray-400">
        Subscribe to our newsletter for the latest updates and offers.
      </p>
      <form className="mt-4">
        <input
          type="email"
          placeholder="Your Email"
          className="w-full bg-gray-700 border-none rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md w-full"
        >
          Subscribe
        </button>
      </form>
    </div>

    {/* Social Media */}
    <div>
      <h4 className="text-xl font-bold mb-4">Follow Us</h4>
      <p className="text-gray-400">
        Stay connected with us on social media for the latest updates.
      </p>
      <div className="flex space-x-4 mt-4">
        <a
          href="#"
          className="p-3 bg-gray-700 rounded-full hover:bg-blue-500 transition"
          aria-label="Facebook"
        >
          <i className="fab fa-facebook-f"></i>
        </a>
        <a
          href="#"
          className="p-3 bg-gray-700 rounded-full hover:bg-pink-500 transition"
          aria-label="Instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="#"
          className="p-3 bg-gray-700 rounded-full hover:bg-blue-400 transition"
          aria-label="Twitter"
        >
          <i className="fab fa-twitter"></i>
        </a>
        <a
          href="#"
          className="p-3 bg-gray-700 rounded-full hover:bg-red-500 transition"
          aria-label="YouTube"
        >
          <i className="fab fa-youtube"></i>
        </a>
      </div>
    </div>
  </div>

  {/* Bottom Footer */}
  <div className="mt-12 border-t border-gray-700 pt-6">
    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
      <p className="text-gray-500 text-sm text-center sm:text-left">
        © 2024 Explore Connect. Designed with ❤️ for adventurers.
      </p>
      <div className="flex space-x-4 mt-4 sm:mt-0">
        <a href="#" className="text-gray-400 hover:text-white text-sm">
          Privacy Policy
        </a>
        <a href="#" className="text-gray-400 hover:text-white text-sm">
          Terms of Service
        </a>
      </div>
    </div>
  </div>
</footer>

    </div>
  );
};

export default Home;
