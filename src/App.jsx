import React, { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-amber-50 font-sans flex flex-col justify-between overflow-x-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-600/20 blur-[120px]" />
        <div className="absolute -top-[100px] left-1/4 w-[300px] h-[300px] rounded-full bg-orange-600/10 blur-[80px]" />
      </div>

      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
        <div className="flex items-center gap-3">
          {/* Spiritual Symbol / SVG Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-900/30">
            <span className="font-serif text-xl font-bold text-neutral-950">ॐ</span>
          </div>
          <span className="font-serif font-bold text-lg tracking-wider bg-gradient-to-r from-amber-200 to-orange-400 bg-clip-text text-transparent">
            Sanatan Dharma
          </span>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-500/80 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 whitespace-nowrap">
            Devotional Experience
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12 flex-grow flex flex-col items-center justify-center text-center z-10 max-w-4xl">
        {/* Glow Element around the Symbol */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all duration-700 scale-125" />
          <div className="relative w-28 h-28 rounded-full border-2 border-amber-500/30 flex items-center justify-center bg-neutral-900/80 backdrop-blur-md shadow-2xl transition-transform duration-500 hover:scale-105">
            <span className="font-serif text-5xl text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-orange-400 to-amber-600">
              ॐ
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-wide mb-6 bg-gradient-to-r from-amber-100 via-orange-200 to-amber-300 bg-clip-text text-transparent drop-shadow-md leading-tight">
          Sanatan Dharma App
        </h1>

        <p className="text-xl md:text-2xl font-light text-amber-200/70 max-w-2xl mb-4 tracking-wide font-sans">
          Coming Soon
        </p>

        <p className="text-sm md:text-base text-neutral-400 max-w-lg mb-8 leading-relaxed">
          Embark on a digital journey to explore sacred teachings, daily rituals, authentic scriptures, and spiritual wisdom.
        </p>

        {/* Newsletter Signup */}
        <div className="w-full max-w-md mb-16">
          {subscribed ? (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm animate-pulse">
              ✨ Thank you! We will notify you when we launch.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email for early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-5 py-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-amber-50 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-all duration-300 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-neutral-950 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-orange-950/40 active:scale-98 cursor-pointer"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>

        {/* App Highlights / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mt-4">
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 hover:border-amber-500/20 transition-all duration-300 backdrop-blur-sm group">
            <div className="text-2xl mb-2 text-amber-500 group-hover:scale-110 transition-transform duration-300">📖</div>
            <h3 className="font-semibold text-amber-200/90 mb-1">Sacred Wisdom</h3>
            <p className="text-xs text-neutral-500">Access Gita, Vedas, and Upanishads with English translations & commentaries.</p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 hover:border-amber-500/20 transition-all duration-300 backdrop-blur-sm group">
            <div className="text-2xl mb-2 text-amber-500 group-hover:scale-110 transition-transform duration-300">📅</div>
            <h3 className="font-semibold text-amber-200/90 mb-1">Vedic Calendar</h3>
            <p className="text-xs text-neutral-500">Track auspicious times, festivals, Panchang, and daily shloka reminders.</p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 hover:border-amber-500/20 transition-all duration-300 backdrop-blur-sm group">
            <div className="text-2xl mb-2 text-amber-500 group-hover:scale-110 transition-transform duration-300">🕉️</div>
            <h3 className="font-semibold text-amber-200/90 mb-1">Spiritual Tools</h3>
            <p className="text-xs text-neutral-500">Japa counter, audio stotrams, and virtual temple experiences.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-neutral-900/60 z-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
        <p>© 2026 Sanatan Dharma App. All spiritual rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
