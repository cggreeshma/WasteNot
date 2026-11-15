import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/productApi';
import { createReservation } from '../../api/reservationApi';

const categories = ['All', 'Meals', 'Bakery', 'Beverages', 'Snacks', 'Groceries', 'Other'];

export default function BrowseListings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [reserving, setReserving] = useState(null);
  const [toast, setToast] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (sort) params.sort = sort;
      const res = await getProducts(params);
      setProducts(res.data?.products || res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search, category, sort]);

  const handleReserve = async (productId) => {
    setReserving(productId);
    try {
      await createReservation({ productId });
      setToast('Reserved successfully! 🎉');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast(err.response?.data?.message || 'Failed to reserve.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setReserving(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-xl shadow-xl animate-slide-up">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Browse Listings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Discover surplus food near you at amazing prices</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          id="browse-search"
          type="text"
          placeholder="Search food…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input md:max-w-xs"
        />
        <select id="browse-category" value={category} onChange={(e) => setCategory(e.target.value)} className="input md:max-w-[160px]">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select id="browse-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="input md:max-w-[200px]">
          <option value="">Sort: Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No listings found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((p) => {
            const discount = Math.round((1 - p.discountedPrice / p.originalPrice) * 100);
            return (
              <div key={p._id} className="group bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                {/* Image placeholder */}
                <div className="h-40 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 flex items-center justify-center text-5xl relative">
                  <span>🥗</span>
                  {discount > 0 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-lg">
                      -{discount}%
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{p.category}</p>
                  <Link to={`/buyer/listings/${p._id}`} className="font-bold text-slate-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors line-clamp-2 mb-1">
                    {p.name}
                  </Link>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2 flex-1">{p.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-black text-slate-900 dark:text-white">₹{p.discountedPrice}</span>
                      <span className="ml-2 text-xs text-slate-400 line-through">₹{p.originalPrice}</span>
                    </div>
                    <span className="text-xs text-slate-400">Qty: {p.quantity}</span>
                  </div>
                  <button
                    id={`reserve-${p._id}`}
                    onClick={() => handleReserve(p._id)}
                    disabled={reserving === p._id || p.quantity === 0}
                    className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
                  >
                    {reserving === p._id ? 'Reserving…' : p.quantity === 0 ? 'Sold Out' : 'Reserve Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
