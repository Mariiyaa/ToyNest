import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import heroPageBaby from '../assets/hero-page-baby.jpg'
import playset from '../assets/playset.png'
import controlToy from '../assets/controlToy.png'
import educational from '../assets/educational.png'
import ecoFriendly from '../assets/ecoFriendly.png'
import stuffed from '../assets/stuffed.png'
import ReviewSection from '../components/ReviewSection';
import Login from '../components/Login';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Home = () => {
  const [products, setProducts] = useState({
    featured: [],
    bestSeller: [],
    newArrivals: []
  });
  const [activeTab, setActiveTab] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const storedUser = sessionStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser ? parsedUser._id : null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_PORT}/api/products`);
        const allProducts = response.data;
        console.log(allProducts)

        // Filter products based on categories
        const featured = allProducts.filter(product => product.isFeatured);
        const bestSeller = allProducts.filter(product => product.isBestSeller);
        const newArrivals = allProducts.filter(product => {
          const productDate = new Date(product.createdAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return productDate >= thirtyDaysAgo;
        });

        setProducts({
          featured,
          bestSeller,
          newArrivals
        });
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const displayProducts = products[activeTab] || [];

  const handleAddToCart = (product) => {
    if (!userId) {
      setShowLogin(true);
      return;
    }
    // Add to cart logic here
  };

  if (loading) return <p className="text-center py-8 font-comfortaa">Loading...</p>;
  if (error) return <p className="text-center py-8 text-red-500 font-comfortaa">{error}</p>;

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full"
          style={{
            backgroundImage: `url(${heroPageBaby})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex items-center">
          <div className="max-w-lg bg-white bg-opacity-90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00B4D8] mb-2 sm:mb-4 font-Baloo">
              Play, learn, & grow!
            </h1>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base font-comfortaa">
              Crafting smiles with every toy, made for learning, fun, and growth.
            </p>
            <Link 
              to="/products" 
              className="inline-block bg-[#FFD700] hover:bg-[#FFE44D] text-black px-4 sm:px-6 md:px-8 py-2 rounded-full font-medium transition-colors text-sm sm:text-base font-comfortaa"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 font-comfortaa">Find the Perfect Toy</h2>
          <p className="text-gray-600 text-sm sm:text-base font-comfortaa">Our Collections</p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 md:gap-16">
          <Link to="/products?category=playset" className="text-center group w-1/3 sm:w-auto">
            <div className="mb-2 sm:mb-3 transform hover:-translate-y-1 transition-transform">
              <img src={playset} alt="Playsets" className="w-20 h-16 sm:w-30 sm:h-24 mx-auto" />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700 font-comfortaa">Playsets</p>
          </Link>

          <Link to="/products?category=control" className="text-center group w-1/3 sm:w-auto">
            <div className="mb-2 sm:mb-3 transform hover:-translate-y-1 transition-transform">
              <img src={controlToy} alt="Control Toys" className="w-20 h-16 sm:w-30 sm:h-24 mx-auto" />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700 font-comfortaa">Control Toys</p>
          </Link>

          <Link to="/products?category=educational" className="text-center group w-1/3 sm:w-auto">
            <div className="mb-2 sm:mb-3 transform hover:-translate-y-1 transition-transform">
              <img src={educational} alt="Educational Toys" className="w-20 h-16 sm:w-30 sm:h-24 mx-auto" />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700 font-comfortaa">Educational Toys</p>
          </Link>

          <Link to="/products?category=eco-friendly" className="text-center group w-1/3 sm:w-auto">
            <div className="mb-2 sm:mb-3 transform hover:-translate-y-1 transition-transform">
              <img src={ecoFriendly} alt="Eco-Friendly Toys" className="w-20 h-16 sm:w-30 sm:h-24 mx-auto" />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700 font-comfortaa">Eco-Friendly Toys</p>
          </Link>

          <Link to="/products?category=stuffed" className="text-center group w-1/3 sm:w-auto">
            <div className="mb-2 sm:mb-3 transform hover:-translate-y-1 transition-transform">
              <img src={stuffed} alt="Stuffed Toys" className="w-20 h-16 sm:w-30 sm:h-24 mx-auto" />
            </div>
            <p className="text-sm sm:text-base font-medium text-gray-700 font-comfortaa">Stuffed Toys</p>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 font-comfortaa">
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">New Arrivals</h1>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {products.newArrivals.slice(0, 3).map((product) => (
            <div key={product._id} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm relative group">
              {/* Wishlist and Cart Icons */}
              <div className="absolute right-2 sm:right-4 top-2 sm:top-4 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 sm:p-2 bg-white rounded-full shadow-md hover:text-[#1572A1]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="p-1 sm:p-2 bg-white rounded-full shadow-md hover:text-[#1572A1]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>

              {/* Sale Badge */}
              {product.onSale && (
                <div className="absolute left-2 sm:left-4 top-2 sm:top-4 bg-red-500 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded">
                  SALE
                </div>
              )}

              {/* Product Image */}
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.variants?.[0]?.image || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-36 sm:h-48 object-contain mb-2 sm:mb-4"
                />
              </Link>

              {/* Product Details */}
              <Link to={`/products/${product._id}`}>
                <h3 className="text-gray-800 font-medium mb-1 sm:mb-2 truncate text-sm sm:text-base">{product.name}</h3>
              </Link>
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-[#1572A1] font-semibold text-sm sm:text-base">₹ {product.price.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      </div>
      <ReviewSection />

      {/* Contact and Map Section */}
      <div className="bg-gray-50 py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4 font-comfortaa">Contact Us</h2>
            <p className="text-gray-600 text-sm sm:text-base font-comfortaa">We'd love to hear from you!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Information */}
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 font-comfortaa">Get in Touch</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#1572A1] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-gray-900 font-medium text-sm sm:text-base font-comfortaa">Address</p>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base font-comfortaa">123 Toy Street, Vadodara, Gujarat 390001</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#1572A1] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-gray-900 font-medium text-sm sm:text-base font-comfortaa">Phone</p>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base font-comfortaa">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#1572A1] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-gray-900 font-medium text-sm sm:text-base font-comfortaa">Email</p>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base font-comfortaa">info@toynest.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#1572A1] mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-gray-900 font-medium text-sm sm:text-base font-comfortaa">Business Hours</p>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base font-comfortaa">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base font-comfortaa">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white p-2 sm:p-4 rounded-lg shadow-sm h-[300px] sm:h-[400px]">
              <MapContainer
                center={[22.3072, 73.1812]} // Vadodara coordinates
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[22.3072, 73.1812]}>
                  <Popup>
                    ToyNest Store <br />
                    Vadodara, Gujarat
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default Home;
