import { ShoppingCart, Search, User } from "lucide-react";
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
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
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

      <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-md">
        <Link to="/" className="text-2xl font-bold text-[#1572A1] font-comfortaa">
          ToyNest
        </Link>

        {/* <ul className="flex space-x-8 text-gray-700 font-medium">
          <li><Link to="/" className="hover:text-[#1572A1]">Home</Link></li>
          <li><Link to="/products" className="hover:text-[#1572A1]">Products</Link></li>
         
        </ul> */}

        <div className="flex items-center space-x-6">
   

          <div className="relative w-full w-[400px]">
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

        <div className="flex space-x-4 items-center">
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
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left font-comfortaa"
                >
                  Logout
                </button>
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left font-comfortaa">
                  Profile
                </Link>
                <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left font-comfortaa">
                  Orders
                </Link>
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
