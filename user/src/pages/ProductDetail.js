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

        if (response.data.variants?.length > 0 && response.data.variants[0].image) {
          setSelectedImage(response.data.variants[0].image);
          setSelectedVariant(response.data.variants[0]);
        } else {
          setSelectedImage(response.data.images?.[0] || ""); // Fallback to first image
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
      if (!userId) return;
      const cartItems = await fetchCart(userId);
      const isInCart = cartItems.some(
        (item) => item.id === product?._id && item.variant === selectedVariant?.color
      );
      setIsAddedToCart(isInCart);
    };

    checkCartStatus();
  }, [product, selectedVariant, userId]);

  const handleAddToCart = async () => {
    await addToCart(userId, product, selectedVariant);
    setIsAddedToCart(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
                selectedImage === img ? "border-blue-500" : "border-gray-300"
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
                  selectedImage === variant.image ? "border-blue-500" : "border-gray-300"
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
      <p className="text-gray-600 italic mt-4">{product.description}</p>
      <p className="text-gray-600">₹ {product.price.toLocaleString("en-IN")}</p>
      <p className="text-gray-700"><strong>Category:</strong> {product.category}</p>
      <p className="text-gray-700"><strong>Brand:</strong> {product.brand}</p>
      <p className="text-gray-700"><strong>Age Group:</strong> {product.ageGroup}</p>
      <p className="text-gray-700"><strong>Size:</strong> {product.size}</p>
      <p className="text-gray-700"><strong>Rating:</strong> {product.rating}</p>

      {/* Variants Section */}
      {product.variants?.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Variants:</h2>
          {selectedVariant && (
            <p className="mt-2 text-gray-700">
              <strong>Selected Variant:</strong> {selectedVariant.color}
            </p>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        className={`mt-4 px-4 py-2 text-white font-semibold rounded 
          ${isAddedToCart ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}
        `}
        onClick={handleAddToCart}
        disabled={isAddedToCart}
      >
        {isAddedToCart ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductDetail;
