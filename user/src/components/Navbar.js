import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { fetchCart } from "../utils/cartUtils";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const updateCartCount = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const userId = parsedUser?._id;
        
        if (!userId) {
          setCartCount(0);
          return;
        }

        const cart = await fetchCart(userId);
        setCartCount(cart.length);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartCount(0);
      }
    };
    
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    setMobileMenuOpen(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="relative">
      <div className="bg-[#1572A1] h-12 w-full relative">
        <div className="absolute -bottom-3 left-0 w-full flex overflow-hidden">
          {Array.from({ length: 50 }).map((_, index) => (
            <div key={index} className="w-10 h-10 bg-[#1572A1] rounded-full" />
          ))}
        </div>
      </div>

      <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-10 py-5 bg-white shadow-md">
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link to="/" className="text-2xl font-bold text-[#1572A1] font-comfortaa">
            ToyNest
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:hidden flex-col w-full mt-4 space-y-4 animate-fade-in-down`}>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1572A1] font-comfortaa"
            />
            <button 
              onClick={handleSearch} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1572A1] p-2 rounded-full"
            >
              <Search size={18} className="text-white" />
            </button>
          </div>
          
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center justify-center w-full py-2 border-b border-gray-200">
              <Link to="/cart" className="relative flex items-center space-x-2">
                <ShoppingCart size={24} className="text-gray-700" />
                <span className="text-gray-700 font-comfortaa">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 left-4 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full font-comfortaa">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            
            {user ? (
              <div className="flex flex-col w-full">
                <Link to="/profile" className="text-gray-700 py-3 px-4 border-b border-gray-200 hover:bg-gray-50 font-comfortaa text-center">
                  Profile
                </Link>
                <Link to="/orders" className="text-gray-700 py-3 px-4 border-b border-gray-200 hover:bg-gray-50 font-comfortaa text-center">
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 py-3 px-4 hover:bg-gray-50 font-comfortaa text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col w-full">
                <button 
                  onClick={() => {setShowLogin(true); setMobileMenuOpen(false);}} 
                  className="text-gray-700 py-3 px-4 border-b border-gray-200 hover:bg-gray-50 font-comfortaa text-center"
                >
                  Login
                </button>
                <button 
                  onClick={() => {setShowRegister(true); setMobileMenuOpen(false);}} 
                  className="text-gray-700 py-3 px-4 hover:bg-gray-50 font-comfortaa text-center"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative w-[300px] lg:w-[400px]">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1572A1] font-comfortaa"
            />
            <button 
              onClick={handleSearch} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1572A1] p-2 rounded-full"
            >
              <Search size={18} className="text-white" />
            </button>
          </div>
        </div>

        <div className="hidden md:flex space-x-4 items-center">
          <Link to="/cart" className="relative cursor-pointer">
            <ShoppingCart size={24} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full font-comfortaa">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative group">
              <User size={28} className="text-gray-700 cursor-pointer" />
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left font-comfortaa">
                  Profile
                </Link>
                <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left font-comfortaa">
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left font-comfortaa"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className="text-gray-700 font-medium hover:text-[#1572A1] font-comfortaa">
                Login
              </button>
              <button onClick={() => setShowRegister(true)} className="text-gray-700 font-medium hover:text-[#1572A1] font-comfortaa">
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} />}
    </div>
  );
};

export default Navbar;