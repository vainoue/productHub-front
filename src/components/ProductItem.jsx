import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";
import { toast } from "react-toastify";
import { 
  Edit3, 
  Trash2, 
  Heart, 
  User, 
  DollarSign, 
  Package,
  MoreVertical
} from "lucide-react";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export default function ProductItem({ product, onEdit, onRemove }) {
    const [isFavorited, setIsFavorited] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        checkIfFavorited();
    }, [product.id, user?.id]);

    const checkIfFavorited = async () => {
        if (!user?.id) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/favorites/user/${user.id}/product/${product.id}/check`);
            if (response.ok) {
                const favorited = await response.json();
                setIsFavorited(favorited);
            }
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
    };

    const toggleFavorite = async (e) => {
        e.stopPropagation();
        
        if (!user?.id) {
            toast.error('You need to be logged in to favorite products');
            return;
        }

        try {
            if (isFavorited) {
                // Remove from favorites
                const response = await fetch(`${API_BASE_URL}/favorites/user/${user.id}/product/${product.id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setIsFavorited(false);
                    toast.success('Product removed from favorites!');
                } else {
                    throw new Error('Error removing favorite');
                }
            } else {
                // Add to favorites
                const response = await fetch(`${API_BASE_URL}/favorites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        productId: product.id,
                    }),
                });

                if (response.ok) {
                    setIsFavorited(true);
                    toast.success('Product added to favorites!');
                } else {
                    const errorData = await response.text();
                    if (errorData.includes('already favorited')) {
                        toast.info('Product is already in favorites');
                        setIsFavorited(true);
                    } else {
                        throw new Error('Error adding favorite');
                    }
                }
            }
        } catch (error) {
            toast.error('Error managing favorite: ' + error.message);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const isOwner = user?.id === product.userId;

    return (
        <div className="card p-0 overflow-hidden group hover:scale-105 transition-transform duration-300">
            {/* Product Image */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                {product.image ? (
                    <img
                        src={`${API_BASE_URL}/products/${product.id}/image`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                
                {/* Fallback when no image or image fails to load */}
                <div className="w-full h-full flex items-center justify-center" style={{ display: product.image ? 'none' : 'flex' }}>
                    <Package className="w-16 h-16 text-gray-400" />
                </div>
                
                {/* Action buttons overlay */}
                <div className="absolute top-3 right-3 flex space-x-2">
                    {/* Favorite button */}
                    <button
                        onClick={toggleFavorite}
                        className={`p-2 backdrop-blur-sm rounded-full shadow-lg transition-all duration-200 ${
                            isFavorited 
                                ? 'bg-red-500 text-white hover:bg-red-600' 
                                : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                        }`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>

                    {/* Owner actions menu */}
                    {isOwner && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
                            >
                                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(product);
                                            setShowMenu(false);
                                        }}
                                        className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(product.id);
                                            setShowMenu(false);
                                        }}
                                        className="flex items-center space-x-3 w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Remove</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Owner badge */}
                {isOwner && (
                    <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200">
                            My product
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-2">
                        {product.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span>by {product.user?.username || 'Unknown user'}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                            {formatPrice(product.price)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Click outside to close menu */}
            {showMenu && (
                <div 
                    className="fixed inset-0 z-0" 
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}

