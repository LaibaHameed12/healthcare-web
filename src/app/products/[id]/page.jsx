'use client'
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetProductByIdQuery } from '@/redux/slices/products/productsApi';

export default function SingleProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);

    const { data: product, isLoading, error } = useGetProductByIdQuery(id);

    const handleBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-6 py-8">
                    {/* Loading Header */}
                    <div className="flex items-center mb-8">
                        <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Loading Image */}
                            <div className="w-full h-96 bg-gray-200 rounded-2xl animate-pulse"></div>

                            {/* Loading Content */}
                            <div className="space-y-6">
                                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                </div>
                                <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Product Not Found</h3>
                    <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={handleBack}
                        className="bg-gradient-to-r cursor-pointer from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-semibold"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-6 py-8">
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors group"
                >
                    <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Products
                </button>

                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Product Image Placeholder */}
                        <div className="space-y-4">
                            <div className="w-full h-96 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 font-medium">{product.name}</p>
                                </div>
                            </div>

                            {/* Additional product images placeholder */}
                            <div className="grid grid-cols-4 gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-square bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-gray-200"></div>
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            {/* Product Header */}
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {product.category}
                                    </span>
                                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {product.brand}
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                                        ${product.price}
                                    </span>
                                    <div className={`flex items-center gap-1 ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">
                                            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Ingredients */}
                            {product.ingredients && product.ingredients.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Ingredients</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.ingredients.map((ingredient, index) => (
                                            <span
                                                key={index}
                                                className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200"
                                            >
                                                {ingredient}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Dosage */}
                            {product.dosage && (
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Recommended Dosage</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700 font-medium">{product.dosage}</span>
                                    </div>
                                </div>
                            )}

                            {/* Product Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 text-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-600">Stock</p>
                                    <p className="font-semibold text-gray-800">{product.stock} units</p>
                                </div>

                                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 text-center">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-600">Brand</p>
                                    <p className="font-semibold text-gray-800">{product.brand}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}