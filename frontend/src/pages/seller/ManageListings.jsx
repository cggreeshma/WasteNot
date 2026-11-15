import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSellerProducts, deleteProduct, updateProduct } from '../../api/productApi';

export default function ManageListings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [toggling, setToggling] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    getSellerProducts()
      .then((res) => setProducts(res.data?.products || res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (product) => {
    setToggling(product._id);
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      await updateProduct(product._id, { status: newStatus });
      setProducts((prev) => prev.map((p) => p._id === product._id ? { ...p, status: newStatus } : p));
    } finally {
      setToggling(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Listings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{products.length} listing{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          to="/seller/add-listing"
          id="manage-add-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95"
        >
          + Add Listing
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="py-24 text-center bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No listings yet</p>
          <Link to="/seller/add-listing" className="inline-block mt-3 text-sm text-green-600 dark:text-green-400 hover:underline">
            Add your first listing →
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => {
            const discount = Math.round((1 - p.discountedPrice / p.originalPrice) * 100);
            return (
              <div key={p._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
                <div className="h-32 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 flex items-center justify-center text-4xl relative">
                  🥗
                  {discount > 0 && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-lg">-{discount}%</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-bold text-slate-900 dark:text-white leading-tight">{p.name}</p>
                    <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${
                      p.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                      p.status === 'inactive' ? 'bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>{p.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2 flex-1">{p.description}</p>
                  <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="font-black text-slate-900 dark:text-white">₹{p.discountedPrice} <span className="text-slate-400 font-normal line-through text-xs">₹{p.originalPrice}</span></span>
                    <span className="text-slate-400">Qty: {p.quantity}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      id={`toggle-${p._id}`}
                      onClick={() => handleToggleStatus(p)}
                      disabled={toggling === p._id}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
                    >
                      {toggling === p._id ? '…' : p.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      id={`delete-${p._id}`}
                      onClick={() => handleDelete(p._id)}
                      disabled={deleting === p._id}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all disabled:opacity-50"
                    >
                      {deleting === p._id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
