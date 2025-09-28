"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useGetProductsQuery,
  useSearchByTitleQuery,
  useSearchByIntentMutation,
} from "@/redux/slices/products/productsApi";
import { getUser } from "@/redux/slices/auth/authSlice";
import { useRouter } from 'next/navigation';
import ChatBot from "@/Components/ChatBot";
import ProtectedRoute from "@/Components/ProtectedRoute";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isIntent, setIsIntent] = useState(false);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const user = useSelector(getUser);
  const router = useRouter();

const handleViewDetails = (productId) => {
  router.push(`/products/${productId}`);
};

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Get products for browse mode. Grab refetch so we can force-refresh on clear.
  const {
    data: productsData,
    isFetching: isLoadingProducts,
    refetch: refetchProducts,
  } = useGetProductsQuery({
    page,
    limit: 20,
  });

  const { data: titleResults } = useSearchByTitleQuery(debouncedSearch, {
    skip: !debouncedSearch || isIntent,
  });

  const [searchByIntent, { data: intentResults, isLoading: isIntentLoading }] =
    useSearchByIntentMutation();

  // Handle products accumulation for load more
  useEffect(() => {
    if (!productsData?.items) return;

    if (page === 1) {
      setAllProducts(productsData.items);
    } else {
      // avoid duplicates when appending
      setAllProducts((prev) => {
        const ids = new Set(prev.map((p) => p._id || p.id));
        const newOnes = productsData.items.filter((it) => !ids.has(it._id || it.id));
        return [...prev, ...newOnes];
      });
    }
  }, [productsData, page]);

  // Reset page when search/intent changes and manage allProducts accordingly
  useEffect(() => {
    setPage(1);

    if (debouncedSearch || isIntent) {
      // entering search mode -> hide browse list
      setAllProducts([]);
      return;
    }

    // leaving search mode -> try to restore from cached productsData
    if (productsData?.items && productsData.items.length) {
      setAllProducts(productsData.items);
      return;
    }

    // If productsData is not available (rare), try to refetch.
    (async () => {
      try {
        const r = await refetchProducts();
        if (r?.data?.items) setAllProducts(r.data.items);
      } catch (err) {
        // keep failure non-fatal; log for debugging
        console.error("Failed to restore products after clearing search", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, isIntent]);

  const handleIntentSearch = async () => {
    if (!debouncedSearch) return;
    try {
      await searchByIntent(debouncedSearch).unwrap();
    } catch (err) {
      console.error("Intent search failed", err);
    }
  };

  // Clear search and restore browse products
  const handleClearSearch = useCallback(async () => {
    setSearch("");
    setDebouncedSearch("");
    setIsIntent(false);
    setPage(1);

    try {
      // If we already have cached browse data, use it immediately
      if (productsData?.items && productsData.items.length) {
        setAllProducts(productsData.items);
        return;
      }

      // otherwise force a refetch and set
      const result = await refetchProducts();
      if (result?.data?.items) {
        setAllProducts(result.data.items);
      }
    } catch (err) {
      console.error("Failed to clear search and restore products:", err);
    }
  }, [productsData, refetchProducts]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Choose products to display.
  // Browse mode: prefer accumulated `allProducts`, fallback to productsData items from cache.
  const products = isIntent
    ? intentResults?.products || []
    : debouncedSearch
      ? titleResults || []
      : (allProducts && allProducts.length) ? allProducts : (productsData?.items || []);

  // Calculate pagination meta
  const totalPages = productsData?.meta ? Math.ceil(productsData.meta.total / productsData.meta.limit) : 0;
  const hasMore = totalPages > page && !debouncedSearch && !isIntent;

  const isShowingEmptyState = products.length === 0 && !isLoadingProducts && !debouncedSearch && !isIntent;

  return (
    <ProtectedRoute authRequired={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href={'/'} className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Products
            </Link>
            <p className="text-gray-600 text-lg">Discover amazing products tailored for you</p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Search for products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {search ? (
                    <button
                      onClick={handleClearSearch}
                      className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsIntent(false)}
                  className={`px-6 py-3 cursor-pointer rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md ${!isIntent
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Title Search
                </button>
                <button
                  onClick={() => {
                    setIsIntent(true);
                    handleIntentSearch();
                  }}
                  className={`px-6 py-3 cursor-pointer rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-md ${isIntent
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-emerald-200'
                    }`}
                >
                  AI Intent Search
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p._id || p.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col h-full">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {p.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                      ${p.price}
                    </span>
                    <button className="bg-gradient-to-r cursor-pointer from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {isShowingEmptyState && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse all products</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoadingProducts && page === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isIntent && isIntentLoading ? (
            <div className="flex justify-center items-center py-16">
              <svg
                className="animate-spin h-10 w-10 text-emerald-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">{p.name}</h2>
                  <p className="text-gray-600 text-sm mb-4">{p.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold text-emerald-600">${p.price}</span>
                    <button
                      onClick={() => handleViewDetails(p._id)}
                      className="bg-emerald-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingProducts}
                className="bg-gradient-to-r cursor-pointer from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoadingProducts ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Load More Products'
                )}
              </button>
            </div>
          )}
        </div>

        {/* ChatBot */}
        {user && <ChatBot userId={user._id} />}
      </div>
    </ProtectedRoute>
  );
}
