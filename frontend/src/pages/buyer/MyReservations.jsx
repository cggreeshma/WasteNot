import React, { useEffect, useState } from 'react';
import { getMyReservations } from '../../api/reservationApi';

const statusColor = {
  pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  accepted: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  collected: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  cancelled: 'bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-400',
};

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReservations()
      .then((res) => setReservations(res.data?.reservations || res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Reservations</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track all your food reservations</p>
      </div>

      {reservations.length === 0 ? (
        <div className="py-24 text-center bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No reservations yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div key={r._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 flex items-center justify-center text-2xl">
                  🥗
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{r.product?.name || 'Item'}</p>
                  <p className="text-sm text-slate-400">{r.seller?.name || ''}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.product?.pickupWindow || ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <span className="text-lg font-black text-slate-900 dark:text-white">₹{r.product?.discountedPrice}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[r.status] || ''}`}>
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
