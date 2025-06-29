import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { Heart, Package, User, DollarSign, Loader2 } from 'lucide-react';

const API_BASE_URL = 'https://product-back-latest.onrender.com/api';

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchFavorites();
    }, [user]);

    const fetchFavorites = async () => {
        if (!user?.id) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/favorites/user/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setFavorites(data);
            } else {
                throw new Error('Error loading favorites');
            }
        } catch (error) {
            toast.error('Error loading favorites: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (productId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/favorites/user/${user.id}/product/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setFavorites(favorites.filter(product => product.id !== productId));
                toast.success('Product removed from favorites!');
            } else {
                throw new Error('Error removing favorite');
            }
        } catch (error) {
            toast.error('Error removing favorite: ' + error.message);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="flex items-center space-x-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                    <span className="text-gray-600 dark:text-gray-400">Loading favorites...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="p-3 bg-accent-100 dark:bg-accent-900/20 rounded-xl">
                    <Heart className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        My Favorites
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {favorites.length} {favorites.length === 1 ? 'favorite product' : 'favorite products'}
                    </p>
                </div>
            </div>

            {/* Favorites Grid */}
            {favorites.length === 0 ? (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                        <Heart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No favorites yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                        Explore products and add your favorites by clicking the heart icon.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((product) => (
                        <div key={product.id} className="card p-0 overflow-hidden group hover:scale-105 transition-transform duration-300">
                            {/* Product Image */}
                            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={`${API_BASE_URL}/products/${product.id}/image`}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                                
                                {/* Remove from favorites button */}
                                <button
                                    onClick={() => removeFavorite(product.id)}
                                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200 group"
                                >
                                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                                </button>
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

