import { useEffect, useState } from "react";
import { fetchCart, removeFromCart, updateCartItem } from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";
const CartPage = ({ user }) => {
  const [cart, setCart] = useState([]);
  const storedUser = sessionStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser ? parsedUser._id : null;
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      const cartItems = await fetchCart(userId);
      setCart(cartItems || []);
    };

    loadCart();
  }, [userId]);

  const handleRemove = async (id, variant) => {
    await removeFromCart(userId, id, variant);
    setCart(cart.filter((item) => item.id !== id || item.variant !== variant));
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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Subtotal</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3 flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16" />
                    <span>{item.name}</span>
                  </td>
                  <td className="p-3 text-center">${item.price.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center border px-2 py-1 w-fit mx-auto rounded-lg bg-gray-100">
                      <button className="px-3 py-1 bg-gray-300 rounded-l-md" onClick={() => handleQuantityChange(item.id, item.variant, item.quantity - 1)}>-</button>
                      <span className="px-4 py-1 bg-white border-x text-center">{item.quantity}</span>
                      <button className="px-3 py-1 bg-gray-300 rounded-r-md" onClick={() => handleQuantityChange(item.id, item.variant, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td className="p-3 text-center">${(item.price * item.quantity).toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <button className="text-red-500 text-lg" onClick={() => handleRemove(item.id, item.variant)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-between items-center mt-6">
            <input type="text" placeholder="Coupon code" className="border px-4 py-2 rounded-md" />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md">Apply</button>
          </div>
          
      
          
          <div className="mt-6 border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">Cart Total</h3>
            <p className="flex justify-between"><span>Subtotal:</span> <span>${totalBill.toFixed(2)}</span></p>
            <p className="flex justify-between font-bold"><span>Total:</span> <span>${(totalBill + 15).toFixed(2)}</span></p>
            <button className="bg-yellow-500 text-white w-full py-3 mt-4 font-bold rounded-md text-lg" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
