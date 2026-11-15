import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🥗',
    title: 'Save Food, Save Money',
    desc: 'Get restaurant-quality meals at up to 70% off. Discover surplus dishes from top local eateries before they go to waste.',
  },
  {
    icon: '🌍',
    title: 'Real Environmental Impact',
    desc: "Every purchase directly reduces CO\u2082 emissions. Track your personal impact and see how much food you've saved from landfill.",
  },
  {
    icon: '⚡',
    title: 'Simple & Fast',
    desc: "Browse, reserve, and pick up — in just three taps. No delivery wait, no guesswork. Your food is ready when you arrive.",
  },
  {
    icon: '🏪',
    title: 'Grow Your Business',
    desc: "Sellers recover revenue from unsold stock and attract new customers. Zero risk, pure upside.",
  },
];

const stats = [
  { value: '50k+', label: 'Meals Saved' },
  { value: '1.2t', label: 'CO₂ Avoided' },
  { value: '300+', label: 'Partner Sellers' },
  { value: '70%', label: 'Average Discount' },
];

const testimonials = [
  {
    name: 'Priya S.',
    role: 'Regular Buyer',
    text: 'I save over ₹3000 a month on lunches. The food is always fresh and delicious — I actually look forward to checking WasteNot every morning.',
    avatar: 'P',
  },
  {
    name: 'Rahul K.',
    role: 'Café Owner',
    text: "We used to throw away a third of our daily bakes. With WasteNot, our surplus sells out before closing every day. It's a game changer.",
    avatar: 'R',
  },
  {
    name: 'Ananya M.',
    role: 'Food Lover',
    text: "The variety is incredible. I've discovered so many amazing restaurants through this app that I never would have tried otherwise.",
avatar: 'A',},
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-green-950/30 dark:to-gray-950" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-300/30 dark:bg-green-700/20 rounded-full blur-3xl -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-200/40 dark:bg-emerald-800/20 rounded-full blur-3xl translate-y-16 -translate-x-16" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-200/20 dark:bg-teal-700/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-8 border border-green-200/60 dark:border-green-700/60 backdrop-blur-sm animate-fade-in">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Surplus food marketplace — open now
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight animate-slide-up">
            Rescue{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                delicious food.
              </span>
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-60" />
            </span>
            <br />
            <span className="text-4xl md:text-6xl font-bold text-slate-500 dark:text-slate-400">
              Save the planet.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Connect with local restaurants and bakeries selling surplus food at <strong className="text-green-600 dark:text-green-400">up to 70% off</strong>. Reduce food waste, discover hidden gems, and eat well for less.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              id="hero-get-started"
              to="/register"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-base font-semibold rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
            >
              <span>Start Saving Today</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              id="hero-learn-more"
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 text-base font-semibold rounded-2xl border border-slate-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
            >
              I already have an account
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-slate-400 dark:text-slate-500 animate-fade-in">
            🌱 Trusted by <strong className="text-slate-600 dark:text-slate-300">12,000+</strong> eco-conscious users across India
          </p>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {stats.map(({ value, label }) => (
              <div key={label} className="group">
                <div className="text-3xl md:text-4xl font-black mb-1 group-hover:scale-110 transition-transform">
                  {value}
                </div>
                <div className="text-green-100 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Why choose WasteNot?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              A marketplace built for impact — good for your wallet, great for the planet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">{icon}</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              How it works
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Three simple steps to rescue your next meal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-300 to-emerald-300 dark:from-green-700 dark:to-emerald-700" />

            {[
              { step: '01', emoji: '🔍', title: 'Browse Listings', desc: 'Explore surplus food near you, filtered by category and price.' },
              { step: '02', emoji: '📋', title: 'Reserve Instantly', desc: 'Pick your favourites and confirm your reservation in seconds.' },
              { step: '03', emoji: '🎉', title: 'Pick It Up', desc: 'Head to the seller at the pickup window and enjoy amazing food.' },
            ].map(({ step, emoji, title, desc }) => (
              <div key={step} className="relative text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform duration-300">
                  {emoji}
                </div>
                <div className="absolute -top-2 -right-2 md:right-auto md:-top-2 md:left-16 w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.replace('0', '')}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-slate-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
              Loved by thousands
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Real stories from people saving food and money every day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, avatar }) => (
              <div
                key={name}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{name}</p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">"{text}"</p>
                <div className="flex gap-0.5 mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-y-16 -translate-x-16" />
        <div className="relative max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to rescue your next meal?</h2>
          <p className="text-green-100 mb-8 text-lg">
            Join thousands of food lovers making a difference — one rescued plate at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              id="cta-buyer"
              to="/register"
              className="px-8 py-4 bg-white text-green-700 font-bold rounded-2xl hover:bg-green-50 hover:-translate-y-0.5 transition-all shadow-lg"
            >
              Join as a Buyer
            </Link>
            <Link
              id="cta-seller"
              to="/register"
              className="px-8 py-4 bg-green-800/60 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/20 hover:bg-green-800/80 hover:-translate-y-0.5 transition-all"
            >
              List My Surplus Food
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
