import { useState } from "react";
import { useLocation } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const { cart, totalBill } = location.state || { cart: [], totalBill: 0 };
  const shipping = totalBill > 4000 ? 0 : 60; // Free shipping for orders over $100

  const storedUser = sessionStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : {};

  const [formData, setFormData] = useState({
      firstName: parsedUser.name?.split(" ")[0] || "",
      lastName: parsedUser.name?.split(" ")[1] || "",
      phone: parsedUser.phone || "",
      email: parsedUser.email || "",
      address: parsedUser.address?.street || "",
      city: parsedUser.address?.city || "",
      state: parsedUser.address?.state || "",
      country: parsedUser.address?.country || "",
      postalCode: parsedUser.address?.postalCode || "",
      orderNotes: "",
      paymentMethod: "credit_card",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "radio" ? value : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully!");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-3 gap-8">
      {/* Left Section: Delivery Info & Payment */}
      <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Delivery info</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input type="text" name="firstName" value={formData.firstName} placeholder="First name" className="border p-2 rounded" onChange={handleChange} required />
                    <input type="text" name="lastName" value={formData.lastName} placeholder="Last name" className="border p-2 rounded" onChange={handleChange} required />
                    <input type="text" name="address" value={formData.address} placeholder="Street address" className="col-span-2 border p-2 rounded" onChange={handleChange} required />
                    <input type="text" name="city" value={formData.city} placeholder="City" className="border p-2 rounded" onChange={handleChange} required />
                    <input type="text" name="state" value={formData.state} placeholder="State" className="border p-2 rounded" onChange={handleChange} required />
                    <input type="text" name="country" value={formData.country} placeholder="Country" className="border p-2 rounded" onChange={handleChange} required />
                    <input type="text" name="postalCode" value={formData.postalCode} placeholder="ZIP code" className="border p-2 rounded" onChange={handleChange} required />
                    <input type="text" name="phone" value={formData.phone} placeholder="Phone" className="border p-2 rounded" onChange={handleChange} required />
                    <input type="email" name="email" value={formData.email} placeholder="Email address" className="col-span-2 border p-2 rounded" onChange={handleChange} required />
                    <textarea name="orderNotes" placeholder="Order notes (optional)" className="col-span-2 border p-2 rounded" onChange={handleChange}></textarea>

          <h2 className="text-xl font-bold col-span-2 mt-6">Payment</h2>
          <div className="col-span-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="paymentMethod" value="credit_card" checked={formData.paymentMethod === "credit_card"} onChange={handleChange} /> Credit Card
            </label>
            <label className="flex items-center gap-2 mt-2">
              <input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === "paypal"} onChange={handleChange} /> PayPal
            </label>
          </div>

          <button type="submit" className="col-span-2 bg-[#0F83B2] text-white w-full py-3 mt-4 font-bold rounded-md text-lg">
            Place Order
          </button>
        </form>
      </div>

      {/* Right Section: Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Your order</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-2 mb-2">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-12 h-12" />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm">Amount: {item.quantity}</p>
              </div>
            </div>
            <p>₹{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <p className="flex justify-between mt-2"><span>Subtotal:</span> <span>₹{totalBill.toFixed(2)}</span></p>
        <p className="flex justify-between font-bold mt-1"><span>Shipping:</span> <span>₹{shipping.toFixed(2)}</span></p>
        <p className="flex justify-between font-bold text-lg mt-2"><span>Total:</span> <span>₹{(totalBill + shipping).toFixed(2)}</span></p>
      </div>
    </div>
  );
};

export default Checkout;
