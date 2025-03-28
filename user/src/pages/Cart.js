import { useEffect, useState } from "react";
import { fetchCart, removeFromCart, updateCartItem } from "../utils/cartUtils";

const CartPage = ({ user }) => {
  const [cart, setCart] = useState([]);
  const storedUser = sessionStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser ? parsedUser._id : null;

  useEffect(() => {
    const loadCart = async () => {
      const cartItems = await fetchCart(userId);
      setCart(cartItems);
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

  // Calculate total bill
  const totalBill = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    alert(`Proceeding to checkout. Total: Rs ${totalBill.toLocaleString()}`);
    // Redirect to payment page or checkout process
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="border p-4 flex gap-4 items-center mb-4">
              <img src={item.image} alt={item.name} width="50" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>Rs {item.price.toLocaleString()}</p>
                <p>Variant: {item.variant || "Default"}</p>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-300 px-2"
                    onClick={() => handleQuantityChange(item.id, item.variant, item.quantity - 1)}
                  >
                    -
                  </button>
                  <p>{item.quantity}</p>
                  <button
                    className="bg-gray-300 px-2"
                    onClick={() => handleQuantityChange(item.id, item.variant, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="bg-red-500 text-white p-2 mt-2"
                  onClick={() => handleRemove(item.id, item.variant)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total Price & Checkout Button */}
          <div className="mt-6 p-4 border-t">
            <h3 className="text-xl font-bold">Total: Rs {totalBill.toLocaleString()}</h3>
            <button
              className="bg-green-500 text-white px-4 py-2 mt-4 w-full"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
