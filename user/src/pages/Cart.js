import { useEffect, useState } from "react";
import { fetchCart, removeFromCart, updateCartItem } from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Login from "../components/Login";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const storedUser = sessionStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser ? parsedUser._id : null;
  const navigate = useNavigate();
  const shipping = 15;

  useEffect(() => {
    if (!userId) {
      setShowLogin(true);
      return;
    }

    const loadCart = async () => {
      const cartItems = await fetchCart(userId);
      setCart(cartItems || []);
    };

    loadCart();
  }, [userId]);

  const handleRemove = async (id, variant) => {
    if (!userId) {
      setShowLogin(true);
      return;
    }

    const result = await removeFromCart(userId, id, variant);
    if (result !== false) {
      setCart(result);
    }
  };

  const handleQuantityChange = async (id, variant, newQuantity) => {
    if (!userId) {
      setShowLogin(true);
      return;
    }

    if (newQuantity <= 0) {
      await handleRemove(id, variant);
      return;
    }

    await updateCartItem(userId, id, variant, newQuantity);

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.variant === variant
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const totalBill = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    if (!userId) {
      setShowLogin(true);
      return;
    }
    navigate("/checkout", { state: { cart, totalBill } });
  };

  return (
    <div className="max-w-6xl min-h-screen mx-auto p-4 sm:p-6 font-comfortaa">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1572A1] mb-4 sm:mb-6">Shopping Cart</h1>

      {!userId ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-gray-600 mb-4">Please login to view your cart</p>
          <button 
            onClick={() => setShowLogin(true)}
            className="inline-block bg-[#1572A1] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#125a80] transition-colors"
          >
            Login
          </button>
        </div>
      ) : cart.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link 
            to="/products" 
            className="inline-block bg-[#1572A1] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-[#125a80] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 bg-white p-3 sm:p-4 rounded-lg shadow">
                <div className="flex justify-center sm:justify-start">
                  <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-sm sm:text-base">{item.name}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">₹ {item.price.toLocaleString("en-IN")}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.variant, item.quantity - 1)}
                      className="text-gray-500 hover:text-[#1572A1] w-6 h-6 flex items-center justify-center border rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.variant, item.quantity + 1)}
                      className="text-gray-500 hover:text-[#1572A1] w-6 h-6 flex items-center justify-center border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-end sm:items-start">
                  <button 
                    onClick={() => handleRemove(item.id, item.variant)}
                    className="text-red-500 hover:text-red-700 text-sm sm:text-base"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow h-fit">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Cart Summary</h2>
            <div className="space-y-2 mb-4">
              <p className="flex justify-between text-sm sm:text-base">
                <span>Subtotal:</span>
                <span>₹ {totalBill.toLocaleString("en-IN")}</span>
              </p>
              <p className="flex justify-between text-sm sm:text-base">
                <span>Shipping:</span>
                <span>₹{shipping.toLocaleString("en-IN")}</span>
              </p>
              <div className="border-t pt-2">
                <p className="flex justify-between font-semibold text-sm sm:text-base">
                  <span>Total:</span>
                  <span>₹ {(totalBill + 15).toLocaleString("en-IN")}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className="block w-full bg-[#1572A1] text-white text-center py-2 rounded-lg hover:bg-[#125a80] transition-colors text-sm sm:text-base"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default Cart;
