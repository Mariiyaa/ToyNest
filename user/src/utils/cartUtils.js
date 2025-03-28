import axios from "axios";


 // Avoid accessing _id from null
 const storedUser = sessionStorage.getItem("user");
 const parsedUser = storedUser ? JSON.parse(storedUser) : null; // Check if data exists
 const userId = parsedUser ? parsedUser._id : null;
 console.log(userId)
export const fetchCart = async () => {

  if (!userId){
     console.error("User is not logged in");
  return; // Prevent further execution
}

  try {
    const response = await axios.post(`${process.env.REACT_APP_BACK_PORT}/api/cart`,{userId});
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
};

// Add item to cart
export const addToCart = async (userId, product, selectedVariant) => {
    if (!userId){
        console.error("User is not logged in");
     return; // Prevent further execution
   }

  try {
    await axios.post(
        `${process.env.REACT_APP_BACK_PORT}/api/cart/add`,
      {userId, product, selectedVariant }
    );
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

// Remove item from cart
export const removeFromCart = async (userId, id, variant) => {
    if (!userId){
        console.error("User is not logged in");
     return; // Prevent further execution
   }

  try {
    await axios.post(
      `${process.env.REACT_APP_BACK_PORT}/api/cart/remove`,
      { userId,id, variant }
    );
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

export const updateCartItem = async (userId, id, variant, quantity) => {
  if (!userId) {
    console.error("User is not logged in");
    return;
  }

  try {
    await axios.post(`${process.env.REACT_APP_BACK_PORT}/api/cart/update`, {
      userId,
      id,
      variant,
      quantity,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
  }
};

