import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { addToCart, fetchCart } from "../utils/cartUtils";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false); // Track cart status

  const storedUser = sessionStorage.getItem("user");
  const parsedUser = JSON.parse(storedUser);
  const userId = parsedUser?._id;
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_PORT}/api/products/${id}`);
        setProduct(response.data);

        // Set the main display image based on requirements
        if (response.data.image) {
          // If product.image exists, use it as the main display image
          setSelectedImage(response.data.image);
          setSelectedVariant(null);
        } else if (response.data.variants?.length > 0 && response.data.variants[0].image) {
          // Otherwise, use the first variant's image
          setSelectedImage(response.data.variants[0].image);
          setSelectedVariant(response.data.variants[0]);
        } else {
          // Fallback to first image in the images array if available
          setSelectedImage(response.data.images?.[0] || "");
        }
      } catch (err) {
        setError("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    // Check if the product is already in the cart
    const checkCartStatus = async () => {
      if (!userId || !product) return;
      const cartItems = await fetchCart(userId);
      const isInCart = cartItems?.some(
        (item) => item.id === product._id && item.variant === selectedVariant?.color
      );
      setIsAddedToCart(isInCart);
    };

    checkCartStatus();
  }, [product, selectedVariant, userId]);

  const handleAddToCart = async () => {
    if (!userId) {
      // Redirect to login or show login prompt
      alert("Please log in to add items to cart");
      return;
    }
    await addToCart(userId, product, selectedVariant);
    setIsAddedToCart(true);
  };

  if (loading) return <p className="font-comfortaa text-center py-8">Loading...</p>;
  if (error) return <p className="font-comfortaa text-center py-8 text-red-500">{error}</p>;
  if (!product) return <p className="font-comfortaa text-center py-8">Product not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg font-comfortaa">
      <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

      {/* Main Product Image Display */}
      <div className="flex gap-4 mt-4">
        {/* Thumbnail Selection */}
        <div className="flex flex-col gap-2">
          {product.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index}`}
              className={`w-16 h-16 object-contain cursor-pointer rounded border ${
                selectedImage === img ? "border-[#1572A1]" : "border-gray-300"
              }`}
              onClick={() => {
                setSelectedImage(img);
                setSelectedVariant(null);
              }}
            />
          ))}
          {/* Variant Images */}
          {product.variants?.map((variant, index) => (
            variant.image && (
              <img
                key={`variant-${index}`}
                src={variant.image}
                alt={`Variant ${variant.color}`}
                className={`w-16 h-16 object-contain cursor-pointer rounded border ${
                  selectedImage === variant.image ? "border-[#1572A1]" : "border-gray-300"
                }`}
                onClick={() => {
                  setSelectedImage(variant.image);
                  setSelectedVariant(variant);
                }}
              />
            )
          ))}
        </div>

        {/* Main Image Display */}
        <img
          src={selectedImage}
          alt="Selected Product"
          className="w-96 h-96 object-contain rounded-lg shadow-md"
        />
      </div>

      {/* Product Details */}
      <div className="mt-6 space-y-3">
        <p className="text-gray-600 italic">{product.description}</p>
        <p className="text-2xl font-bold text-[#1572A1]">₹ {product.price.toLocaleString("en-IN")}</p>
        <p className="text-gray-700"><span className="font-semibold">Category:</span> {product.category}</p>
        <p className="text-gray-700"><span className="font-semibold">Brand:</span> {product.brand}</p>
        <p className="text-gray-700"><span className="font-semibold">Age Group:</span> {product.ageGroup}</p>
        {/* <p className="text-gray-700"><span className="font-semibold">Size:</span> {product.size}</p> */}
        <p className="text-gray-700"><span className="font-semibold">Rating:</span> {product.rating}</p>
      </div>

      {/* Variants Section */}
      {product.variants?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Variants:</h2>
          {selectedVariant && (
            <p className="text-gray-700">
              <span className="font-semibold">Selected Variant:</span> {selectedVariant.color}
            </p>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      {product.stock === 0 ? (
        <div className="mt-6 px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg text-center">
          Out of Stock
        </div>
      ) : (
        <button
          className={`mt-6 px-6 py-3 text-white font-semibold rounded-lg transition-colors ${
            isAddedToCart 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-[#1572A1] hover:bg-[#125a80]"
          }`}
          onClick={handleAddToCart}
          disabled={isAddedToCart}
        >
          {isAddedToCart ? "Added to Cart" : "Add to Cart"}
        </button>
      )}
    </div>
  );
};

export default ProductDetail;
