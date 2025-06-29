import React from "react";
import ProductItem from "./ProductItem";
import { Package, Search, Loader2 } from "lucide-react";

export default function ProductList({ products, onEdit, onRemove, loading, searchTerm }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="flex items-center space-x-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                    <span className="text-gray-600 dark:text-gray-400">Loading products...</span>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    {searchTerm ? (
                        <Search className="w-8 h-8 text-gray-400" />
                    ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                    )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchTerm ? 'No products found' : 'No products yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                    {searchTerm 
                        ? `We couldn't find any products matching "${searchTerm}". Try a different search.`
                        : 'Start by adding your first product by clicking the "New Product" button.'
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductItem
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}

