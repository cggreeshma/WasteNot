import React, { useEffect, useState } from 'react';
import { getIncomingReservations, updateReservationStatus } from '../../api/reservationApi';

const statusColor = {
  pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  accepted: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  collected: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  cancelled: 'bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-400',
};

export default function IncomingReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchReservations = () => {
    setLoading(true);
    getIncomingReservations()
      .then((res) => setReservations(res.data?.reservations || res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleStatus = async (id, status) => {
    setUpdating(`${id}-${status}`);
    try {
      await updateReservationStatus(id, status);
      setReservations((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Incoming Reservations</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage buyer reservations for your listings</p>
      </div>

      {reservations.length === 0 ? (
        <div className="py-24 text-center bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No reservations yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div key={r._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 flex items-center justify-center text-2xl">
                    🥗
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{r.product?.name}</p>
                    <p className="text-xs text-slate-400">Buyer: {r.buyer?.name || '—'}</p>
                    <p className="text-xs text-slate-400">₹{r.product?.discountedPrice}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[r.status] || ''}`}>
                    {r.status}
                  </span>
                  {r.status === 'pending' && (
                    <>
                      <button
                        id={`accept-${r._id}`}
                        onClick={() => handleStatus(r._id, 'accepted')}
                        disabled={!!updating}
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        id={`reject-${r._id}`}
                        onClick={() => handleStatus(r._id, 'rejected')}
                        disabled={!!updating}
                        className="px-3 py-1.5 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {r.status === 'accepted' && (
                    <button
                      id={`collect-${r._id}`}
                      onClick={() => handleStatus(r._id, 'collected')}
                      disabled={!!updating}
                      className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
                    >
                      Mark Collected
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
