import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../api/productApi';

const getFoodEmoji = (name = '', category = '') => {
  const text = `${name} ${category}`.toLowerCase();

  if (text.includes('pizza')) return '🍕';
  if (text.includes('egg roll') || text.includes('roll')) return '🌯';
  if (text.includes('sandwich')) return '🥪';
  if (text.includes('burger')) return '🍔';
  if (text.includes('cake') || text.includes('pastry')) return '🍰';
  if (text.includes('bread')) return '🍞';
  if (text.includes('rice') || text.includes('biryani')) return '🍚';
  if (text.includes('juice') || text.includes('drink')) return '🥤';
  if (text.includes('salad')) return '🥗';

  return '🍽️';
};

// Food image component with emoji fallback
function FoodImage({ product }) {
  const [imageError, setImageError] = useState(false);

  const emoji = getFoodEmoji(product.name, product.category);

  return (
    <div className="h-48 bg-[#e9eddf] relative overflow-hidden flex items-center justify-center">

      {product.imageUrl && !imageError ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="text-7xl group-hover:scale-110 transition-transform">
          {emoji}
        </span>
      )}

    </div>
  );
}

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();

        const data = response.data;

        const productList = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        setProducts(productList);

      } catch (err) {
        console.error('Unable to fetch food listings:', err);
        setError('We could not load food listings right now.');

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-[#faf8f2] text-[#29352a] overflow-hidden">

      {/* HERO */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-20">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="max-w-xl">

            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-[#527a49]" />
              <p className="text-xs uppercase tracking-[0.22em] font-semibold text-[#527a49]">
                A little good goes a long way
              </p>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.08] mb-7">
              Good food
              <br />
              deserves
              <br />
              <span className="text-[#648357] italic">
                another chance.
              </span>
            </h1>

            <p className="text-[#73796e] text-base md:text-lg leading-8 max-w-md mb-9">
              Discover delicious surplus food from local businesses.
              Save money on your favourite meals and help reduce food waste,
              one collection at a time.
            </p>

            <Link
              to="/buyer/browse"
              className="inline-flex items-center gap-3 bg-[#3e6339] text-white px-7 py-4 text-sm font-semibold rounded-md hover:bg-[#293f28] transition-colors"
            >
              Explore available food
              <span className="text-lg">↗</span>
            </Link>

            <div className="mt-12 pt-7 border-t border-[#e8e6dc]">
              <p className="text-xs text-[#85897e] leading-5">
                Discover local food.
                <br />
                <span className="font-semibold text-[#3e6339]">
                  Save money. Waste less.
                </span>
              </p>
            </div>

          </div>

          <div className="relative">

            <div className="h-[430px] md:h-[570px] overflow-hidden rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85"
                alt="Fresh food arranged on a table"
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-6 left-6 right-6 bg-[#faf8f2] p-5 md:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#648357] font-bold mb-2">
                  The WasteNot philosophy
                </p>
                <p className="font-display text-2xl md:text-3xl">
                  Every meal deserves to be enjoyed.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* LIVE FOOD MARKETPLACE */}
      <section className="py-20 bg-[#f0efe7]" id="available-food">

        <div className="max-w-[1250px] mx-auto px-6 md:px-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#648357] font-bold mb-4">
                Fresh finds
              </p>

              <h2 className="font-display text-4xl md:text-5xl">
                Available to rescue.
              </h2>

              <p className="text-sm text-[#777d72] mt-4">
                Discover surplus food listed by local businesses.
              </p>
            </div>

            <Link
              to="/buyer/browse"
              className="text-sm font-semibold text-[#527a49] hover:text-[#293f28]"
            >
              View all food →
            </Link>

          </div>


          {loading ? (

            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-[#527a49] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-[#777d72]">
                Finding available food...
              </p>
            </div>

          ) : error ? (

            <div className="bg-white p-8 text-center rounded-lg">
              <p className="text-[#777d72]">{error}</p>
            </div>

          ) : products.length === 0 ? (

            <div className="bg-[#faf8f2] border border-[#e5e4da] p-10 text-center">
              <div className="text-5xl mb-4">🥗</div>

              <h3 className="font-display text-2xl mb-3">
                Nothing on the menu just yet.
              </h3>

              <p className="text-sm text-[#777d72]">
                New food listings will appear here as local sellers add them.
              </p>
            </div>

          ) : (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {products.slice(0, 6).map((product) => {

                const discount = product.originalPrice > 0
                  ? Math.round(
                      (1 - product.discountedPrice / product.originalPrice) * 100
                    )
                  : 0;

                const seller = product.sellerId || product.seller;

                return (

                  <Link
                    key={product._id}
                    to={`/buyer/listings/${product._id}`}
                    className="group bg-[#faf8f2] border border-[#e5e4da] hover:border-[#a4bd91] transition-all"
                  >

                    {/* ACTUAL FOOD PHOTOGRAPH */}
                    <div className="relative">

                      <FoodImage product={product} />

                      {discount > 0 && (
                        <span className="absolute top-4 left-4 bg-[#3e6339] text-white text-xs font-bold px-3 py-2">
                          {discount}% OFF
                        </span>
                      )}

                    </div>


                    {/* PRODUCT DETAILS */}
                    <div className="p-5">

                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#648357] font-bold mb-2">
                        {product.category}
                      </p>

                      <h3 className="font-display text-2xl mb-2 group-hover:text-[#527a49] transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#85897e] mb-4">
                        {seller?.businessName || seller?.name || 'Local food seller'}
                      </p>

                      <div className="flex items-center justify-between border-t border-[#e5e4da] pt-4">

                        <div>
                          <span className="text-xl font-bold text-[#3e6339]">
                            ₹{product.discountedPrice}
                          </span>

                          <span className="text-xs text-[#999] line-through ml-2">
                            ₹{product.originalPrice}
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-[#527a49]">
                          View food ↗
                        </span>

                      </div>

                      <p className="text-xs text-[#85897e] mt-3">
                        {product.availableQuantity} available
                      </p>

                    </div>

                  </Link>

                );
              })}

            </div>

          )}

        </div>
      </section>


      {/* INTRODUCTION */}
      <section className="bg-[#e9eddf] py-16 md:py-20">

        <div className="max-w-4xl mx-auto px-6 text-center">

          <p className="text-xs uppercase tracking-[0.25em] text-[#648357] font-bold mb-5">
            A different kind of marketplace
          </p>

          <h2 className="font-display text-3xl md:text-5xl leading-tight">
            Making good food accessible
            <span className="italic text-[#648357]"> shouldn't </span>
            come at the cost of the planet.
          </h2>

          <p className="text-[#73796e] text-sm md:text-base leading-7 max-w-2xl mx-auto mt-6">
            WasteNot brings food businesses and everyday food lovers together
            to give surplus food a second life.
          </p>

        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="py-20 md:py-24">

        <div className="max-w-[1100px] mx-auto px-6 md:px-12">

          <div className="text-center mb-16">

            <p className="text-xs uppercase tracking-[0.2em] text-[#648357] font-bold mb-4">
              The process
            </p>

            <h2 className="font-display text-4xl md:text-5xl">
              Three steps. One better habit.
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-10">

            {[
              {
                number: '01',
                title: 'Discover food',
                description: 'Explore available surplus food from local sellers.'
              },
              {
                number: '02',
                title: 'Reserve your pick',
                description: 'Choose your quantity and reserve your favourite meal.'
              },
              {
                number: '03',
                title: 'Collect & enjoy',
                description: 'Visit the seller, collect your food and enjoy.'
              }
            ].map((step) => (

              <div key={step.number} className="text-center">

                <div className="w-16 h-16 rounded-full border border-[#a9b995] flex items-center justify-center mx-auto mb-6">
                  <span className="font-display text-xl text-[#527a49]">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-display text-2xl mb-3">
                  {step.title}
                </h3>

                <p className="text-sm text-[#777d72] leading-7 max-w-xs mx-auto">
                  {step.description}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* SELLER SECTION */}
      <section className="bg-[#293f28] py-20">

        <div className="max-w-4xl mx-auto px-6 text-center text-[#faf8f2]">

          <p className="text-xs uppercase tracking-[0.2em] text-[#b9c9a9] font-bold mb-5">
            For food businesses
          </p>

          <h2 className="font-display text-4xl md:text-5xl mb-6">
            Don't throw it away.
            <br />
            Sell it.
          </h2>

          <p className="text-sm text-[#d1d8ca] leading-7 max-w-xl mx-auto mb-8">
            Turn unsold food into an opportunity. List your surplus,
            reach new customers and recover value from food that would
            otherwise go to waste.
          </p>

          <Link
            to="/register"
            className="inline-flex bg-[#faf8f2] text-[#293f28] px-8 py-4 rounded-md text-sm font-bold hover:bg-white transition-colors"
          >
            Become a seller ↗
          </Link>

        </div>
      </section>


      {/* FINAL CTA */}
      <section className="py-20 text-center px-6">

        <p className="text-xs uppercase tracking-[0.2em] text-[#648357] font-bold mb-5">
          Make every meal count
        </p>

        <h2 className="font-display text-4xl md:text-5xl mb-6">
          Good food shouldn't go to waste.
        </h2>

        <p className="text-sm text-[#777d72] mb-8">
          Discover food, save money and make a difference.
        </p>

        <Link
          to="/register"
          className="inline-flex bg-[#3e6339] text-white px-8 py-4 rounded-md text-sm font-semibold hover:bg-[#293f28] transition-colors"
        >
          Join WasteNot
        </Link>

      </section>

    </div>
  );
}