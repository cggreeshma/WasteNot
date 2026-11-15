import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../api/productApi';
import { createReservation } from '../../api/reservationApi';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data?.product || res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReserve = async () => {
    setReserving(true);
    try {
      await createReservation({ productId: id });
      setToast('Reserved! 🎉 Check My Reservations.');
      setTimeout(() => navigate('/buyer/reservations'), 2500);
    } catch (err) {
      setToast(err.response?.data?.message || 'Failed to reserve.');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setReserving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!product) return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <div className="text-5xl mb-4">❓</div>
      <p className="text-slate-500 dark:text-slate-400 font-medium">Listing not found</p>
    </div>
  );

  const discount = Math.round((1 - product.discountedPrice / product.originalPrice) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium rounded-xl shadow-xl animate-slide-up">
          {toast}
        </div>
      )}

      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 mb-6 transition-colors">
        ← Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-slate-100 dark:border-gray-700 overflow-hidden">
        {/* Hero image placeholder */}
        <div className="h-56 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 flex items-center justify-center text-7xl relative">
          🥗
          {discount > 0 && (
            <span className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-xl shadow">
              -{discount}% off
            </span>
          )}
        </div>

        <div className="p-6 md:p-8 space-y-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">{product.category}</span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{product.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{product.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-slate-50 dark:bg-gray-700 rounded-xl px-4 py-3">
              <p className="text-slate-400 text-xs mb-1">Discounted Price</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">₹{product.discountedPrice}</p>
            </div>
            <div className="bg-slate-50 dark:bg-gray-700 rounded-xl px-4 py-3">
              <p className="text-slate-400 text-xs mb-1">Original Price</p>
              <p className="text-lg font-semibold text-slate-400 line-through">₹{product.originalPrice}</p>
            </div>
            <div className="bg-slate-50 dark:bg-gray-700 rounded-xl px-4 py-3">
              <p className="text-slate-400 text-xs mb-1">Available Qty</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{product.quantity}</p>
            </div>
          </div>

          {product.pickupWindow && (
            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800">
              <span>🕐</span>
              <span><strong>Pickup window:</strong> {product.pickupWindow}</span>
            </div>
          )}

          {product.seller && (
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-gray-700 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                {product.seller.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{product.seller.name}</p>
                <p className="text-xs text-slate-400">Seller</p>
              </div>
            </div>
          )}

          <button
            id="details-reserve"
            onClick={handleReserve}
            disabled={reserving || product.quantity === 0}
            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all active:scale-95 text-base"
          >
            {reserving ? 'Reserving…' : product.quantity === 0 ? 'Sold Out' : 'Reserve This Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
