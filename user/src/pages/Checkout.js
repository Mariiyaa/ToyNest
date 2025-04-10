import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { removeFromCart } from "../utils/cartUtils";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalBill } = location.state || { cart: [], totalBill: 0 };
  const shipping = totalBill > 4000 ? 0 : 60;

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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePayment = async () => {
    try {
      const totalAmount = totalBill + shipping;

      // Validate form data
      const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'address', 'city', 'state', 'country', 'postalCode'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        alert('Please fill in all required fields: ' + missingFields.join(', '));
        return;
      }

      // Prepare order data
      const orderData = {
        userId: parsedUser._id,
        products: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          variant: item.variant,
          price: item.price,
          name: item.name
        })),
        shippingDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          orderNotes: formData.orderNotes
        },
        totalPrice: totalBill,
        shippingCost: shipping
      };

      // Call backend API to create Razorpay order
      const response = await fetch(`${process.env.REACT_APP_BACK_PORT}/api/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: totalAmount,
          orderData
        }),
      });

      const razorpayOrder = await response.json();
      
      if (!razorpayOrder) {
        alert("Error processing payment. Please try again.");
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "ToyNest",
        description: "Toy Purchase",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Verify payment with backend
            const verifyResponse = await fetch(`${process.env.REACT_APP_BACK_PORT}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData // Send order data for creating the order
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Clear cart and redirect to order confirmation
              sessionStorage.removeItem('cart');
              alert("Order placed successfully! Order ID: " + verifyData.orderId);
              navigate('/orders'); // Add this route to show order history
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Error verifying payment. Please contact support.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country}, ${formData.postalCode}`,
          orderNotes: formData.orderNotes
        },
        theme: {
          color: "#1572A1",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    await removeFromCart(parsedUser._id, cart.map(item => item.id), cart.map(item => item.variant));
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 font-comfortaa">
      {/* Left Section: Delivery Info */}
      <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#1572A1]">Delivery Info</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input 
            type="text" 
            name="firstName" 
            value={formData.firstName} 
            placeholder="First name" 
            className="border p-2 rounded text-sm sm:text-base" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="lastName" 
            value={formData.lastName} 
            placeholder="Last name" 
            className="border p-2 rounded text-sm sm:text-base" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            placeholder="Street address" 
            className="col-span-1 sm:col-span-2 border p-2 rounded text-sm sm:text-base" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="city" 
            value={formData.city} 
            placeholder="City" 
            className="border p-2 rounded text-sm sm:text-base" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="state" 
            value={formData.state} 
            placeholder="State" 
            className="border p-2 rounded text-sm sm:text-base" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="country" 
            value={formData.country} 
            placeholder="Country" 
            className="border p-2 rounded text-sm sm:text-base" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="postalCode" 
            value={formData.postalCode} 
            placeholder="ZIP code" 
            className="border p-2 rounded text-sm sm:text-base" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="phone" 
            value={formData.phone} 
            placeholder="Phone" 
            className="border p-2 rounded text-sm sm:text-base" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            placeholder="Email address" 
            className="col-span-1 sm:col-span-2 border p-2 rounded text-sm sm:text-base" 
            onChange={handleChange} 
            required 
          />
          <textarea 
            name="orderNotes" 
            placeholder="Order notes (optional)" 
            className="col-span-1 sm:col-span-2 border p-2 rounded text-sm sm:text-base" 
            onChange={handleChange} 
            rows="3"
          />
        </form>

        <button 
          onClick={handlePayment} 
          className="col-span-1 sm:col-span-2 bg-[#1572A1] text-white w-full py-2 sm:py-3 mt-4 sm:mt-6 font-bold rounded-lg text-base sm:text-lg hover:bg-[#125a80] transition-colors"
        >
          Place Order
        </button>
      </div>

      {/* Right Section: Order Summary */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#1572A1]">Your Order</h2>
        <div className="space-y-3 sm:space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2 mb-2">
              <div className="flex items-center gap-2 sm:gap-4">
                <img src={item.image} alt={item.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                <div>
                  <p className="font-semibold text-sm sm:text-base">{item.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Amount: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm sm:text-base">₹ {(item.price * item.quantity).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 mt-4">
          <p className="flex justify-between text-sm sm:text-base">
            <span>Subtotal:</span> 
            <span>₹ {totalBill.toLocaleString("en-IN")}</span>
          </p>
          <p className="flex justify-between font-bold text-sm sm:text-base">
            <span>Shipping:</span> 
            <span>₹ {shipping.toLocaleString("en-IN")}</span>
          </p>
          <p className="flex justify-between font-bold text-base sm:text-lg border-t pt-2 mt-2">
            <span>Total:</span> 
            <span>₹ {(totalBill + shipping).toLocaleString("en-IN")}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
