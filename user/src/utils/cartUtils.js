import axios from "axios";

export const fetchCart = async (userId) => {
  if (!userId) {
    console.error("User is not logged in");
    return []; // Return empty array instead of undefined
  }

  try {
    const response = await axios.post(`${process.env.REACT_APP_BACK_PORT}/api/cart`, { userId });
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
            '/api/cart/add',
            {userId, product, selectedVariant }
        );
        // Dispatch cartUpdated event
        window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
};

// Remove item from cart
export const removeFromCart = async (userId, productId, variant) => {
    if (!userId) {
        console.error("User is not logged in");
        return false;
    }

    try {
        const response = await axios.post('/api/cart/remove', { userId, productId, variant });
        // Dispatch cartUpdated event
        window.dispatchEvent(new Event('cartUpdated'));
        return response.data;
    } catch (error) {
        console.error("Error removing from cart:", error);
        return false;
    }
};

export const updateCartItem = async (userId, productId, variant, quantity) => {
    if (!userId) {
        console.error("User is not logged in");
        return;
    }

    try {
        await axios.post('/api/cart/update', { userId, productId, variant, quantity });
        // Dispatch cartUpdated event
        window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
        console.error("Error updating cart item:", error);
    }
};

