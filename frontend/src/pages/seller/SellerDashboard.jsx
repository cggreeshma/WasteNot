import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSellerStats } from '../../api/dashboardApi';
import { getIncomingReservations } from '../../api/reservationApi';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
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
};

export default function SellerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSellerStats(), getIncomingReservations()])
      .then(([sRes, rRes]) => {
        setStats(sRes.data);
        setReservations(rRes.data?.reservations || rRes.data || []);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Seller Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/seller/add-listing"
          id="add-listing-cta"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-95"
        >
          + Add Listing
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Listings" value={stats?.totalListings} icon="📦" color="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard label="Active Listings" value={stats?.activeListings} icon="✅" color="bg-green-50 dark:bg-green-900/20" />
        <StatCard label="Total Reservations" value={stats?.totalReservations} icon="📋" color="bg-amber-50 dark:bg-amber-900/20" />
        <StatCard label="Revenue (₹)" value={stats?.revenue != null ? `₹${stats.revenue}` : '—'} icon="💰" color="bg-purple-50 dark:bg-purple-900/20" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-gray-700">
          <h2 className="font-bold text-slate-900 dark:text-white">Incoming Reservations</h2>
          <Link to="/seller/reservations" className="text-sm text-green-600 dark:text-green-400 hover:underline font-medium">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No incoming reservations</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-gray-700">
            {recent.map((r) => (
              <div key={r._id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{r.product?.name || 'Item'}</p>
                  <p className="text-xs text-slate-400">{r.buyer?.name || ''}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor[r.status] || ''}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
