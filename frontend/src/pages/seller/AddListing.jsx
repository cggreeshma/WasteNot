import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../api/productApi';

const categories = ['Meals', 'Bakery', 'Beverages', 'Snacks', 'Groceries', 'Other'];

export default function AddListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Meals',
    originalPrice: '',
    discountedPrice: '',
    quantity: '',
    pickupWindow: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createProduct({
        ...form,
        originalPrice: Number(form.originalPrice),
        discountedPrice: Number(form.discountedPrice),
        quantity: Number(form.quantity),
      });
      navigate('/seller/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Add New Listing</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">List your surplus food for buyers to discover</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-100 dark:border-gray-700 shadow-sm p-8">
        {error && (
          <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label" htmlFor="add-name">Item Name</label>
            <input id="add-name" name="name" value={form.name} onChange={handleChange} required className="input" placeholder="e.g. Butter Chicken" />
          </div>
          <div>
            <label className="label" htmlFor="add-desc">Description</label>
            <textarea id="add-desc" name="description" value={form.description} onChange={handleChange} rows={3} className="input resize-none" placeholder="Describe the food item…" />
          </div>
          <div>
            <label className="label" htmlFor="add-category">Category</label>
            <select id="add-category" name="category" value={form.category} onChange={handleChange} className="input">
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="add-orig">Original Price (₹)</label>
              <input id="add-orig" name="originalPrice" type="number" min="0" value={form.originalPrice} onChange={handleChange} required className="input" placeholder="150" />
            </div>
            <div>
              <label className="label" htmlFor="add-disc">Discounted Price (₹)</label>
              <input id="add-disc" name="discountedPrice" type="number" min="0" value={form.discountedPrice} onChange={handleChange} required className="input" placeholder="60" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="add-qty">Quantity</label>
              <input id="add-qty" name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} required className="input" placeholder="10" />
            </div>
            <div>
              <label className="label" htmlFor="add-pickup">Pickup Window</label>
              <input id="add-pickup" name="pickupWindow" value={form.pickupWindow} onChange={handleChange} className="input" placeholder="e.g. 7–9 PM today" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/seller/listings')}
              className="px-5 py-2.5 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              id="add-submit"
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-60 text-white font-semibold rounded-xl shadow transition-all active:scale-95"
            >
              {loading ? 'Adding…' : 'Add Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
