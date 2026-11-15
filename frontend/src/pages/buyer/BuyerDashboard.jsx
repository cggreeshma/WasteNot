import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBuyerStats } from '../../api/dashboardApi';
import { getMyReservations } from '../../api/reservationApi';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-100 dark:border-gray-700 shadow-sm flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-black text-slate-900 dark:text-white">{value ?? '—'}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

const statusColor = {
  pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  accepted: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  rejected: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  collected: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  cancelled: 'bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-slate-400',
};

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBuyerStats(), getMyReservations()])
      .then(([statsRes, resRes]) => {
        setStats(statsRes.data);
        setReservations(resRes.data?.reservations || resRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const recent = reservations.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Hey, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's your food rescue dashboard</p>
        </div>
        <Link
          to="/buyer/browse"
          id="browse-cta"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <span>Browse Food</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Reservations" value={stats?.totalReservations} icon="📋" color="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard label="Accepted" value={stats?.accepted} icon="✅" color="bg-green-50 dark:bg-green-900/20" />
        <StatCard label="Collected" value={stats?.collected} icon="🎉" color="bg-purple-50 dark:bg-purple-900/20" />
        <StatCard label="Total Saved (₹)" value={stats?.totalSaved != null ? `₹${stats.totalSaved}` : '—'} icon="💰" color="bg-amber-50 dark:bg-amber-900/20" />
      </div>

      {/* Recent Reservations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-gray-700">
          <h2 className="font-bold text-slate-900 dark:text-white">Recent Reservations</h2>
          <Link to="/buyer/reservations" className="text-sm text-green-600 dark:text-green-400 hover:underline font-medium">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No reservations yet</p>
            <Link to="/buyer/browse" className="inline-block mt-3 text-sm text-green-600 dark:text-green-400 hover:underline">
              Browse listings →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-gray-700">
            {recent.map((r) => (
              <div key={r._id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{r.product?.name || 'Unnamed Item'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.seller?.name || ''}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">₹{r.product?.discountedPrice}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor[r.status] || ''}`}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
