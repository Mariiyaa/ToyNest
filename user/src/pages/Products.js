import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState(""); // Dynamic Age Filter
  const [ageGroups, setAgeGroups] = useState([]); // Unique Age Groups
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || ""; // Get search query from URL
  const categoryParam = searchParams.get("category") || ""; // Get category from URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_PORT}/api/products`);
        const allProducts = response.data;

        // Extract unique age groups dynamically
        const uniqueAgeGroups = [...new Set(allProducts.map((p) => p.ageGroup))];
        setAgeGroups(uniqueAgeGroups);
        setProducts(allProducts);

        // Apply initial filtering based on search and category
        filterProducts(allProducts, searchQuery, selectedAgeRange, categoryParam);
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts(products, searchQuery, selectedAgeRange, categoryParam);
  }, [searchQuery, selectedAgeRange, products, categoryParam]);

  const filterProducts = (allProducts, query, ageRange, category) => {
    let filtered = allProducts;

    // Filter by search query
    if (query) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.category && typeof product.category === 'string' && product.category.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter((product) => {
        // Handle both string and array category types
        if (Array.isArray(product.category)) {
          return product.category.some(cat => 
            cat.toLowerCase() === category.toLowerCase()
          );
        } else if (typeof product.category === 'string') {
          return product.category.toLowerCase() === category.toLowerCase();
        }
        return false;
      });
    }

    // Filter by age range
    if (ageRange) {
      filtered = filtered.filter((product) => product.ageGroup === ageRange);
    }

    setFilteredProducts(filtered);
  };

  if (loading) return <p className="text-center text-lg py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 font-comfortaa">
      <h1 className="text-xl sm:text-2xl font-bold text-[#1572A1] mb-4 sm:mb-6">
        {categoryParam ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Toys` : 'Products'}
      </h1>

      {/* Age Range Filter */}
      <div className="my-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <label className="font-semibold text-sm sm:text-base">Filter by Age Range: </label>
        <select
          className="border p-2 rounded text-sm sm:text-base w-full sm:w-auto"
          value={selectedAgeRange}
          onChange={(e) => setSelectedAgeRange(e.target.value)}
        >
          <option value="">All Ages</option>
          {ageGroups.map((age) => (
            <option key={age} value={age}>{age}</option>
          ))}
        </select>
      </div>

      {/* Display Products */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="p-3 sm:p-4 shadow-lg border rounded-lg hover:shadow-xl transition-shadow relative">
              {product.stock === 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-bl-lg text-xs">
                  Out of Stock
                </div>
              )}
              <img
                src={product.images && product.images.length > 0 
                  ? product.images[0] 
                  : (product.variants && product.variants.length > 0 && product.variants[0].image 
                      ? product.variants[0].image 
                      : '')}
                alt={product.name}
                className="w-full h-36 sm:h-48 object-contain rounded"
              />
              <h2 className="text-base sm:text-lg font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-600 text-sm sm:text-base">₹ {product.price.toLocaleString("en-IN")}</p>
              <p className="text-xs sm:text-sm text-gray-500">Age Group: {product.ageGroup}</p>
              <Link to={`/products/${product._id}`} className="text-[#1572A1] hover:text-[#125a80] transition-colors text-sm sm:text-base inline-block mt-1">
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">No products found.</p>
      )}
    </div>
  );
};

export default Product;
