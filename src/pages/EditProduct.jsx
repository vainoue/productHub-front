import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getProductById, editProduct as updateProduct } from '../services/api';
import { toast } from 'react-toastify';
import { 
  Edit3, 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Upload, 
  X,
  Loader2,
  Image as ImageIcon,
  Save
} from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(id);
        if (productData) {
          // Check if user owns this product
          if (productData.userId !== user?.id) {
            toast.error('You can only edit your own products');
            navigate('/products');
            return;
          }

          setProduct(productData);
          setName(productData.name);
          setPrice(productData.price.toString());
          
          // Set current image URL if product has an image
          if (productData.image || productData.id) {
            setCurrentImageUrl(`${API_BASE_URL}/products/${productData.id}/image`);
          }
        } else {
          toast.error('Product not found');
          navigate('/products');
        }
      } catch (error) {
        toast.error('Error loading product: ' + error.message);
        navigate('/products');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id && user?.id) {
      loadProduct();
    }
  }, [id, navigate, user?.id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeNewImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const removeCurrentImage = () => {
    setCurrentImageUrl(null);
    // We'll handle the actual deletion on save
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !price) {
      toast.warn('Please fill in all required fields');
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setLoading(true);

    try {
      // Update product data
      const updatedProduct = {
        ...product,
        name: name.trim(),
        price: priceValue
      };

      await updateProduct(product.id, updatedProduct);

      // Handle image upload if new image is provided
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const response = await fetch(`${API_BASE_URL}/products/${product.id}/image`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          console.warn('Failed to upload new image, but product was updated successfully');
        }
      }

      toast.success('Product updated successfully!');
      navigate('/products');
    } catch (error) {
      toast.error('Error updating product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading product...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/products')}
          className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-accent-100 dark:bg-accent-900/20 rounded-xl">
            <Edit3 className="w-6 h-6 text-accent-600 dark:text-accent-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Product
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your product information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Product Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Product Image
            </label>
            
            {imagePreview ? (
              // New image preview
              <div className="relative">
                <div className="aspect-square max-w-xs bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="New product preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeNewImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  New image selected (will replace current image)
                </div>
              </div>
            ) : currentImageUrl ? (
              // Current image display
              <div className="relative">
                <div className="aspect-square max-w-xs bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                  <img
                    src={currentImageUrl}
                    alt="Current product"
                    className="w-full h-full object-cover"
                    onError={() => setCurrentImageUrl(null)}
                  />
                </div>
                <button
                  type="button"
                  onClick={removeCurrentImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-4">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="btn-secondary inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Change Image</span>
                  </label>
                </div>
              </div>
            ) : (
              // No image upload area
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors duration-200">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Product Name *
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name"
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Product Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (CAD) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={loading}
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center space-x-2 flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/products')}
              disabled={loading}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}