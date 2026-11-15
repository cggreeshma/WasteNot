import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: '',
    businessName: '',
    email: '',
    password: '',
    role: 'buyer'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await register(form);

      const destination = location.state?.from;

      if (data.user.role === 'buyer' && destination) {
        navigate(destination, { replace: true });
      } else {
        navigate(
          data.user.role === 'seller'
            ? '/seller/dashboard'
            : '/buyer/dashboard',
          { replace: true }
        );
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f2] px-4 py-12">

      <div className="w-full max-w-md">

        <div className="bg-[#fffefa] rounded-xl border border-[#e8e6dc] p-8 md:p-10">

          <div className="text-center mb-8">

            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#e9eddf] flex items-center justify-center">
              <span className="font-display text-3xl text-[#3e6339]">
                W
              </span>
            </div>

            <h1 className="font-display text-3xl text-[#29352a]">
              Join WasteNot
            </h1>

            <p className="text-[#85897e] text-sm mt-2">
              A little good goes a long way.
            </p>

          </div>

          {location.state?.from && (
            <div className="mb-5 p-4 bg-[#e9eddf] rounded-lg text-sm text-[#3e6339]">
              Create your free account to continue with your food reservation.
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div className="flex gap-2 mb-6 p-1 bg-[#f0efe7] rounded-lg">

            {['buyer', 'seller'].map((role) => (

              <button
                key={role}
                type="button"
                id={`role-${role}`}
                onClick={() => setForm({ ...form, role })}
                className={`flex-1 py-3 text-sm font-semibold rounded-md capitalize transition-all ${
                  form.role === role
                    ? 'bg-[#3e6339] text-white'
                    : 'text-[#777d72] hover:text-[#29352a]'
                }`}
              >
                {role === 'buyer' ? 'Buyer' : 'Seller'}
              </button>

            ))}

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="label" htmlFor="reg-name">
                Full Name
              </label>

              <input
                id="reg-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="input"
                placeholder="Your full name"
              />
            </div>

            {/* Business Name */}
            {form.role === 'seller' && (
              <div>
                <label className="label" htmlFor="reg-business">
                  Business Name
                </label>

                <input
                  id="reg-business"
                  name="businessName"
                  type="text"
                  required
                  value={form.businessName}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g. Green Bakery"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="label" htmlFor="reg-email">
                Email Address
              </label>

              <input
                id="reg-email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="reg-password">
                Password
              </label>

              <input
                id="reg-password"
                name="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className="input"
                placeholder="Minimum 6 characters"
              />
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#3e6339] hover:bg-[#293f28] disabled:opacity-60 text-white font-semibold rounded-md transition-colors"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

          </form>

          <p className="text-center text-sm text-[#85897e] mt-7">
            Already have an account?{' '}
            <Link
              to="/login"
              state={location.state}
              className="text-[#527a49] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}