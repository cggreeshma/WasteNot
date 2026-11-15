import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getProductById } from '../../api/productApi';
import { createReservation } from '../../api/reservationApi';
import { useAuth } from '../../context/AuthContext';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [toast, setToast] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setImageError(false);

    getProductById(id)
      .then((res) => {
        setProduct(res.data?.product || res.data);
      })
      .catch((err) => {
        console.error('Product loading error:', err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleReserve = async () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location.pathname
        }
      });
      return;
    }

    if (user.role !== 'buyer') {
      showToast('Only buyer accounts can reserve food.');
      return;
    }

    const selectedQuantity = Number(quantity);
    const available = Number(product.availableQuantity) || 0;

    if (
      !Number.isInteger(selectedQuantity) ||
      selectedQuantity < 1 ||
      selectedQuantity > available
    ) {
      showToast('Please select a valid quantity.');
      return;
    }

    setReserving(true);

    try {
      await createReservation({
        productId: id,
        quantity: selectedQuantity
      });

      showToast('Reservation successful!');

      setTimeout(() => {
        navigate('/buyer/reservations');
      }, 1200);

    } catch (err) {
      showToast(
        err.response?.data?.message || 'Unable to reserve this food.'
      );
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f2] flex justify-center items-center">
        <p className="text-[#527a49]">Loading food details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf8f2] text-center py-24">
        <h2 className="font-display text-3xl">
          Food listing not found
        </h2>

        <button
          onClick={() => navigate('/buyer/browse')}
          className="mt-5 text-[#527a49]"
        >
          Browse available food
        </button>
      </div>
    );
  }

  const available = Number(product.availableQuantity) || 0;
  const seller = product.sellerId || product.seller;

  const discount = product.originalPrice > 0
    ? Math.round(
        (1 - product.discountedPrice / product.originalPrice) * 100
      )
    : 0;

  const emoji = (() => {
    const name = `${product.name} ${product.category}`.toLowerCase();

    if (name.includes('pizza')) return '🍕';
    if (name.includes('egg roll') || name.includes('roll')) return '🌯';
    if (name.includes('sandwich')) return '🥪';
    if (name.includes('burger')) return '🍔';
    if (name.includes('cake')) return '🍰';
    if (name.includes('bread')) return '🍞';
    if (name.includes('rice') || name.includes('biryani')) return '🍚';

    return '🍽️';
  })();

  return (
    <div className="min-h-screen bg-[#faf8f2] py-12 px-5">

      {toast && (
        <div className="fixed top-20 right-5 z-50 bg-[#293f28] text-white px-5 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="mb-7 text-sm text-[#527a49]"
        >
          ← Back to food
        </button>

        <div className="bg-[#fffefa] border border-[#e8e6dc] rounded-xl overflow-hidden">

          {/* FOOD PHOTOGRAPH */}
          <div className="h-72 md:h-96 bg-[#e9eddf] relative overflow-hidden flex items-center justify-center">

            {product.imageUrl && !imageError ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-8xl">
                {emoji}
              </span>
            )}

            {discount > 0 && (
              <span className="absolute top-5 left-5 bg-[#3e6339] text-white text-sm px-4 py-2 font-bold shadow">
                {discount}% OFF
              </span>
            )}

          </div>

          {/* PRODUCT INFORMATION */}
          <div className="p-6 md:p-9">

            <p className="text-xs uppercase tracking-widest text-[#648357] font-bold">
              {product.category}
            </p>

            <h1 className="font-display text-4xl mt-2">
              {product.name}
            </h1>

            <p className="text-[#777d72] mt-3 leading-7">
              {product.description}
            </p>

            {/* PRICE */}
            <div className="flex items-center gap-4 mt-7">

              <span className="text-3xl font-bold text-[#3e6339]">
                ₹{product.discountedPrice}
              </span>

              <span className="line-through text-[#999]">
                ₹{product.originalPrice}
              </span>

            </div>

            <p className="text-sm text-[#777d72] mt-3">
              {available} portions available
            </p>

            {/* SELLER */}
            {seller && (
              <div className="mt-7 border-t border-[#e8e6dc] pt-5">

                <p className="text-xs uppercase tracking-wider text-[#648357] font-bold">
                  Sold by
                </p>

                <p className="font-semibold mt-1">
                  {seller.businessName || seller.name}
                </p>

              </div>
            )}

            {/* PICKUP LOCATION */}
            {product.pickupAddress && (
              <div className="mt-5">

                <p className="text-xs uppercase tracking-wider text-[#648357] font-bold">
                  Pickup location
                </p>

                <p className="text-sm mt-1">
                  {product.pickupAddress}
                </p>

              </div>
            )}

            {/* DEADLINE */}
            {product.availabilityDeadline && (
              <div className="mt-5">

                <p className="text-xs uppercase tracking-wider text-[#648357] font-bold">
                  Available until
                </p>

                <p className="text-sm mt-1">
                  {new Date(product.availabilityDeadline).toLocaleString()}
                </p>

              </div>
            )}

            {/* QUANTITY */}
            <div className="mt-8">

              <label className="block text-sm font-semibold mb-2">
                Select quantity
              </label>

              <input
                type="number"
                min="1"
                max={available}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="input"
                disabled={available <= 0}
              />

            </div>

            {/* RESERVE BUTTON */}
            <button
              onClick={handleReserve}
              disabled={
                reserving ||
                available <= 0 ||
                Number(quantity) < 1 ||
                Number(quantity) > available
              }
              className="mt-7 w-full bg-[#3e6339] hover:bg-[#293f28] text-white py-4 rounded-md font-semibold disabled:opacity-50"
            >
              {reserving
                ? 'Reserving...'
                : available <= 0
                ? 'Sold Out'
                : user
                ? 'Reserve This Food'
                : 'Login to Reserve'}
            </button>

            {!user && (
              <p className="text-center text-xs text-[#888] mt-4">
                Sign in or create a free account to reserve this food.
              </p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}