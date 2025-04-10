import { useEffect, useState } from "react";
import { fetchCart, removeFromCart, updateCartItem } from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Cart = ({ user }) => {
  const [cart, setCart] = useState([]);
  const storedUser = sessionStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser ? parsedUser._id : null;
  const navigate = useNavigate();
  const shipping = 15;

  useEffect(() => {
    const loadCart = async () => {
      const cartItems = await fetchCart(userId);
      setCart(cartItems || []);
    };

    loadCart();
  }, [userId]);

  const handleRemove = async (id, variant) => {
    const result = await removeFromCart(userId, id, variant);
    if (result !== false) {
      // Update local cart state with the new cart items from the server
      setCart(result);
    }
  };

  const handleQuantityChange = async (id, variant, newQuantity) => {
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
    navigate("/checkout", { state: { cart, totalBill } });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-comfortaa">
      <h1 className="text-2xl font-bold text-[#1572A1] mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link 
            to="/products" 
            className="inline-block bg-[#1572A1] text-white px-6 py-2 rounded-lg hover:bg-[#125a80] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg shadow">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹ {item.price.toLocaleString("en-IN")}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.variant, item.quantity - 1)}
                      className="text-gray-500 hover:text-[#1572A1]"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.variant, item.quantity + 1)}
                      className="text-gray-500 hover:text-[#1572A1]"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemove(item.id, item.variant)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
            <div className="space-y-2 mb-4">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹ {totalBill.toLocaleString("en-IN")}</span>
              </p>
              <p className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{shipping.toLocaleString("en-IN")}</span>
              </p>
              <div className="border-t pt-2">
                <p className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>₹ {(totalBill + 15).toLocaleString("en-IN")}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className="block w-full bg-[#1572A1] text-white text-center py-2 rounded-lg hover:bg-[#125a80] transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
