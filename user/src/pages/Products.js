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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_PORT}/api/products`);
        const allProducts = response.data;

        // Extract unique age groups dynamically
        const uniqueAgeGroups = [...new Set(allProducts.map((p) => p.ageGroup))];
        setAgeGroups(uniqueAgeGroups);
        setProducts(allProducts);

        // Apply initial filtering based on search
        filterProducts(allProducts, searchQuery, selectedAgeRange);
      } catch (err) {
        setError("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts(products, searchQuery, selectedAgeRange);
  }, [searchQuery, selectedAgeRange, products]);

  const filterProducts = (allProducts, query, ageRange) => {
    let filtered = allProducts;

    // Filter by search query
    if (query) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by age range
    if (ageRange) {
      filtered = filtered.filter((product) => product.ageGroup === ageRange);
    }

    setFilteredProducts(filtered);
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-[#1572A1]">Products</h1>

      {/* Age Range Filter */}
      <div className="my-4">
        <label className="font-semibold">Filter by Age Range: </label>
        <select
          className="border p-2 rounded"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="p-4 shadow-lg border rounded-lg">
              <img
                src={product.variants[0].image}
                alt={product.name}
                className="w-full h-48 object-contain rounded"
              />
              <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-600">₹ {product.price.toLocaleString("en-IN")}</p>
              <p className="text-sm text-gray-500">Age Group: {product.ageGroup}</p>
              <Link to={`/products/${product._id}`} className="text-blue-500">View Details</Link>
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
