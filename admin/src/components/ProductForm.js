import { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ product, onSubmit, mode = 'create' }) => {
  const initialState = {
    name: '',
    description: '',
    price: '',
    ageGroup: '',
    category: [],
    stock: '',
    images: [],
    variants: [],
    rating: 0,
    isFeatured: false,
    isBestSeller: false,
    onSale: false
  };

  const [formData, setFormData] = useState(initialState);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedVariantFile, setSelectedVariantFile] = useState(null);

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        ...product,
        images: product.images || [],
        variants: product.variants || []
      });
    }
  }, [product, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special handling for category field
    if (name === 'category') {
      const categoryArray = value ? value.split(',').map(c => c.trim()).filter(c => c !== '') : [];
      setFormData(prev => ({
        ...prev,
        category: categoryArray
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create preview URLs for selected files
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...previewUrls]
    }));
  };

  const handleVariantImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedVariantFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, {
          size: '',
          color: '',
          available: true,
          image: previewUrl,
          file: file
        }]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      
      // Create a copy of formData without the file objects and preview URLs
      const cleanFormData = {
        ...formData,
        // Ensure category is an array of strings
        category: Array.isArray(formData.category) ? formData.category : [formData.category],
        // Convert stock to a number
        stock: parseInt(formData.stock, 10) || 0,
        images: formData.images.filter(img => !img.startsWith('blob:')), // Remove blob URLs
        variants: formData.variants.map(variant => ({
          size: variant.size,
          color: variant.color,
          available: variant.available,
          image: variant.image.startsWith('blob:') ? '' : variant.image // Remove blob URLs
        }))
      };
      
      formDataToSend.append('productData', JSON.stringify(cleanFormData));
      
      // Append all selected image files
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Append variant image files
      formData.variants.forEach((variant, index) => {
        if (variant.file) {
          formDataToSend.append('images', variant.file);
        }
      });

      onSubmit(formDataToSend);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setUploading(false);
    }
  };

  const updateVariant = (index, field, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{mode === 'create' ? 'Add New Product' : 'Edit Product'}</h2>

      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Age Group</label>
          <input
            type="text"
            name="ageGroup"
            value={formData.ageGroup}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <select
            name="category"
            value={Array.isArray(formData.category) ? formData.category.join(', ') : ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a category</option>
            <option value="playset">Playset</option>
            <option value="control">Control</option>
            <option value="educational">Educational</option>
            <option value="eco-friendly">Eco-friendly</option>
            <option value="stuffed">Stuffed</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">Select one or more categories (comma-separated)</p>
        </div>

        <div>
          <label className="block mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Rating</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            max="5"
            step="0.1"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="4"
          required
        />
      </div>

      {/* Flags */}
      <div className="flex gap-4 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="mr-2"
          />
          Featured
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="isBestSeller"
            checked={formData.isBestSeller}
            onChange={handleChange}
            className="mr-2"
          />
          Best Seller
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="onSale"
            checked={formData.onSale}
            onChange={handleChange}
            className="mr-2"
          />
          On Sale
        </label>
      </div>

      {/* Images */}
      <div className="mb-6">
        <label className="block mb-2">Product Images</label>
        <input
          type="file"
          multiple
          onChange={handleImageSelect}
          accept="image/*"
          className="mb-2"
        />
        <div className="grid grid-cols-4 gap-4">
          {formData.images && formData.images.length > 0 && formData.images.map((image, index) => (
            <div key={index} className="relative">
              <img src={image} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Variants */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Variants</h3>
        <div className="mb-4">
          <input
            type="file"
            onChange={handleVariantImageSelect}
            accept="image/*"
            className="mb-2"
          />
        </div>

        <div className="space-y-4">
          {formData.variants && formData.variants.length > 0 && formData.variants.map((variant, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded">
              <img src={variant.image} alt={`Variant ${index + 1}`} className="w-20 h-20 object-cover rounded" />
              <div className="flex-grow grid grid-cols-3 gap-4">
                <input
                  type="text"
                  value={variant.size}
                  onChange={(e) => updateVariant(index, 'size', e.target.value)}
                  placeholder="Size"
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  value={variant.color}
                  onChange={(e) => updateVariant(index, 'color', e.target.value)}
                  placeholder="Color"
                  className="p-2 border rounded"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={variant.available}
                    onChange={(e) => updateVariant(index, 'available', e.target.checked)}
                    className="mr-2"
                  />
                  Available
                </label>
              </div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : mode === 'create' ? 'Create Product' : 'Update Product'}
      </button>
    </form>
  );
};

export default ProductForm; 