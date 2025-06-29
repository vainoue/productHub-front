import { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import ConfirmToast from '../components/ConfirmToast';
import { getProducts, removeProduct } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Plus, Filter, SortAsc, SortDesc, Package, Search } from 'lucide-react';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const list = await getProducts();
      setProducts(list);
    } catch (error) {
      toast.error('Error loading products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    navigate(`/edit-product/${product.id}`);
  };

  const handleRemove = async (id) => {
    const onConfirm = async () => {
      try {
        await removeProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Product removed successfully!");
      } catch (error) {
        toast.error("Error removing product: " + error.message);
      }
    };

    const onCancel = () => { };

    toast.info(<ConfirmToast message="Do you want to remove this product?" onConfirm={onConfirm} onCancel={onCancel} />, {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    });
  };

  const filteredAndSortedProducts = () => {
    let filtered = products;
    
    // Filter by search term
    if (searchTerm) {
      filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.user?.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    return [...filtered].sort((a, b) =>
      sortOrder === "asc" ? a.id - b.id : b.id - a.id
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-xl">
            <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {products.length} {products.length === 1 ? 'product found' : 'products found'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/new-product")}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Product</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="input-field min-w-0 w-auto"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
            {sortOrder === "asc" ? (
              <SortAsc className="w-5 h-5 text-gray-500" />
            ) : (
              <SortDesc className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* Products List */}
      <ProductList
        products={filteredAndSortedProducts()}
        onRemove={handleRemove}
        onEdit={handleEditClick}
        loading={loading}
        searchTerm={searchTerm}
      />
    </div>
  );
}

