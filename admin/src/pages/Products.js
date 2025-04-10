import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '../components/ProductForm';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_PORT}/api/products`);
      console.log(response.data)
      setProducts(response.data);
    } catch (err) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (productData) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACK_PORT}/api/products`, productData);
      fetchProducts();
      setShowForm(false);
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const handleUpdate = async (productData) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACK_PORT}/api/products/${editingProduct._id}`,
        productData
      );
      fetchProducts();
      setEditingProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACK_PORT}/api/products/${productId}`);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  if (showForm || editingProduct) {
    return (
      <div className="p-6">
        <button
          onClick={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          className="mb-6 text-blue-500 hover:text-blue-600"
        >
          ← Back to Products
        </button>
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          mode={editingProduct ? 'edit' : 'create'}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map(product => (
          <div
            key={product._id}
            className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4"
          >
            <img
              src={product.images && product.images.length > 0 
                ? product.images[0] 
                : (product.variants && product.variants.length > 0 && product.variants[0]?.image 
                    ? product.variants[0].image 
                    : '')}
              alt={product.name}
              className="w-24 h-24 object-cover rounded"
            />
            
            <div className="flex-grow">
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-gray-600">₹ {product.price.toLocaleString('en-IN')}</p>
              <p className="text-sm text-gray-500">
                Stock: {product.stock} | Category: {product.category}
              </p>
              <div className="flex gap-2 mt-2">
                {product.isFeatured && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Featured</span>
                )}
                {product.isBestSeller && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Best Seller</span>
                )}
                {product.onSale && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">On Sale</span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingProduct(product)}
                className="text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products; 