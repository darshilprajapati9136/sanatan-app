import React, { useState, useMemo, useEffect } from 'react';
import { getPanchangam, Observer } from '@ishubhamx/panchangam-js';
import { supabase } from './supabaseClient';

const SAMPLE_MANTRAS = [
  {
    title: "Gayatri Mantra",
    sanskrit_text: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥",
    transliteration: "Om bhūr bhuvaḥ svaḥ tat savitur vareṇyaṃ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt.",
    meaning: "We meditate on the absolute splendour of the supreme source, who illuminates all realms (physical, mental, and spiritual). May that divine light inspire and guide our intellect.",
    category: "Gayatri"
  },
  {
    title: "Maha Mrityunjaya Mantra",
    sanskrit_text: "ॐ त्र्यम्बकम् यजामहे सुगन्धिम् पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्॥",
    transliteration: "Om tryambakaṃ yajāmahe sugandhiṃ puṣṭi-vardhanam, urvārukam-iva bandhanān mṛtyor-mukṣīya mā'mṛtāt.",
    meaning: "We worship the three-eyed Lord Shiva, who is fragrant and nourishes all beings. Just as a ripe cucumber is freed from its bondage to the vine, may he liberate us from death and guide us to immortality.",
    category: "Shiva"
  },
  {
    title: "Ganesha Mantra",
    sanskrit_text: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
    transliteration: "Vakratunda mahākāya sūryakoṭi samaprabha, nirvighnaṃ kuru me deva sarva-kāryeṣu sarvadā.",
    meaning: "O Lord of the curved trunk and massive body, whose brilliance is equal to millions of suns, please make all my endeavors free from obstacles, always.",
    category: "Ganesha"
  }
];

function App() {
  const [page, setPage] = useState('home'); // 'home' | 'panchang' | 'mantras'
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Mantras state
  const [mantras, setMantras] = useState([]);
  const [loadingMantras, setLoadingMantras] = useState(true);
  const [mantrasError, setMantrasError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [seeding, setSeeding] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // Fetch mantras when page switches to 'mantras'
  useEffect(() => {
    if (page !== 'mantras') return;
    fetchMantrasList();
  }, [page]);

  async function fetchMantrasList() {
    setLoadingMantras(true);
    setMantrasError(null);
    try {
      const { data, error } = await supabase
        .from('mantras')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setMantras(data || []);
    } catch (err) {
      console.error("Error fetching mantras:", err);
      setMantrasError(err.message || "Failed to load mantras.");
    } finally {
      setLoadingMantras(false);
    }
  }

  // Helper function to seed sample data if database is empty
  async function seedDatabase() {
    setSeeding(true);
    try {
      const { error } = await supabase
        .from('mantras')
        .insert(SAMPLE_MANTRAS);
      
      if (error) throw error;
      await fetchMantrasList();
    } catch (err) {
      console.error("Error seeding database:", err);
      alert("Seeding failed: " + err.message);
    } finally {
      setSeeding(false);
    }
  }

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const list = new Set(mantras.map(m => m.category));
    return ['All', ...Array.from(list)];
  }, [mantras]);

  // Filtered mantras
  const filteredMantras = useMemo(() => {
    if (selectedCategory === 'All') return mantras;
    return mantras.filter(m => m.category === selectedCategory);
  }, [mantras, selectedCategory]);

  // Panchang calculations for Mumbai (Lat: 19.0760, Lon: 72.8777)
  const panchangData = useMemo(() => {
    try {
      const observer = new Observer(19.0760, 72.8777, 0);
      const date = new Date();
      const timezoneOffset = 330; // IST (UTC+5:30)
      const data = getPanchangam(date, observer, { timezoneOffset });
      return { data, date };
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  const formatTime = (d) => {
    return d ? d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'N/A';
  };

  const formatDate = (d) => {
    return d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
  };

  const formatShortDate = (d) => {
    return d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A';
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
        
        {/* Navigation */}
        <nav className="flex gap-1 bg-neutral-900/50 p-1 rounded-xl border border-neutral-800/80 backdrop-blur-md">
          <button 
            onClick={() => setPage('home')}
            className={`text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
              page === 'home' 
                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25 shadow-sm' 
                : 'text-neutral-400 hover:text-amber-300 border border-transparent'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => setPage('panchang')}
            className={`text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
              page === 'panchang' 
                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25 shadow-sm' 
                : 'text-neutral-400 hover:text-amber-300 border border-transparent'
            }`}
          >
            Panchang
          </button>
          <button 
            onClick={() => setPage('mantras')}
            className={`text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
              page === 'mantras' 
                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25 shadow-sm' 
                : 'text-neutral-400 hover:text-amber-300 border border-transparent'
            }`}
          >
            Mantras
          </button>
        </nav>
      </header>

      {/* Main View Router */}
      {page === 'home' ? (
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
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 hover:border-amber-500/20 transition-all duration-300 backdrop-blur-sm group cursor-pointer" onClick={() => setPage('mantras')}>
              <div className="text-2xl mb-2 text-amber-500 group-hover:scale-110 transition-transform duration-300">📖</div>
              <h3 className="font-semibold text-amber-200/90 mb-1">Sacred Wisdom</h3>
              <p className="text-xs text-neutral-500">Access Gita, Vedas, and Upanishads with English translations & commentaries.</p>
            </div>
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-900 hover:border-amber-500/20 transition-all duration-300 backdrop-blur-sm group cursor-pointer" onClick={() => setPage('panchang')}>
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
      ) : page === 'panchang' ? (
        <main className="container mx-auto px-6 py-12 flex-grow flex flex-col items-center justify-center z-10 max-w-3xl">
          {/* Page Title */}
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
              Vedic Astrology
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide mt-3 mb-2 bg-gradient-to-r from-amber-100 to-orange-300 bg-clip-text text-transparent">
              Today's Panchang
            </h1>
            <p className="text-neutral-400 text-sm">
              Daily celestial alignments & solar timings for Mumbai, India
            </p>
          </div>

          {panchangData ? (
            <div className="w-full space-y-6">
              {/* Main Card */}
              <div className="p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800/80 backdrop-blur-md shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Date & Location Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-800/80 pb-6 mb-6 gap-3">
                  <div>
                    <h2 className="text-xs font-semibold text-amber-500/80 uppercase tracking-widest">Current Date</h2>
                    <p className="text-lg font-semibold text-amber-100">{formatDate(panchangData.date)}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-950/60 px-4 py-2 rounded-xl border border-neutral-800/80">
                    <span className="text-base">📍</span>
                    <span className="text-xs font-medium text-amber-200/90">Mumbai (19.0760, 72.8777)</span>
                  </div>
                </div>

                {/* Sunrise/Sunset Widget */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-neutral-950/50 border border-neutral-800/40 flex items-center gap-4">
                    <div className="text-3xl">🌅</div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block">Sunrise</span>
                      <span className="text-base font-semibold text-amber-300">{formatTime(panchangData.data.sunrise)}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-950/50 border border-neutral-800/40 flex items-center gap-4">
                    <div className="text-3xl">🌇</div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block">Sunset</span>
                      <span className="text-base font-semibold text-amber-300">{formatTime(panchangData.data.sunset)}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Elements: Tithi, Nakshatra, Rahu Kaal */}
                <div className="space-y-6">
                  {/* Tithi Detail */}
                  <div className="relative p-5 rounded-2xl bg-gradient-to-r from-neutral-950/60 to-neutral-950/20 border border-neutral-800/40">
                    <div className="absolute right-4 top-4 text-xs font-semibold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/10">
                      Tithi
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-2xl mt-1">🌕</div>
                      <div className="space-y-1">
                        {/* Get first tithi details using true start/end times */}
                        {panchangData.data.tithis && panchangData.data.tithis.length > 0 ? (
                          <>
                            <h3 className="font-serif text-lg font-bold text-amber-100">
                              {panchangData.data.tithis[0].name}
                            </h3>
                            <p className="text-xs text-neutral-400">
                              Starts: <span className="text-amber-200/90">{formatTime(panchangData.data.tithiStartTime)}</span> ({formatShortDate(panchangData.data.tithiStartTime)})
                            </p>
                            <p className="text-xs text-neutral-400">
                              Ends: <span className="text-amber-200/90">{formatTime(panchangData.data.tithiEndTime)}</span> ({formatShortDate(panchangData.data.tithiEndTime)})
                            </p>
                          </>
                        ) : (
                          <h3 className="font-serif text-lg font-bold text-amber-100">Tithi Index: {panchangData.data.tithi}</h3>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nakshatra Detail */}
                  <div className="relative p-5 rounded-2xl bg-gradient-to-r from-neutral-950/60 to-neutral-950/20 border border-neutral-800/40">
                    <div className="absolute right-4 top-4 text-xs font-semibold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/10">
                      Nakshatra
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-2xl mt-1">✨</div>
                      <div className="space-y-1">
                        {/* Get first nakshatra details using true start/end times */}
                        {panchangData.data.nakshatras && panchangData.data.nakshatras.length > 0 ? (
                          <>
                            <h3 className="font-serif text-lg font-bold text-amber-100">
                              {panchangData.data.nakshatras[0].name}
                            </h3>
                            <p className="text-xs text-neutral-400">
                              Starts: <span className="text-amber-200/90">{formatTime(panchangData.data.nakshatraStartTime)}</span> ({formatShortDate(panchangData.data.nakshatraStartTime)})
                            </p>
                            <p className="text-xs text-neutral-400">
                              Ends: <span className="text-amber-200/90">{formatTime(panchangData.data.nakshatraEndTime)}</span> ({formatShortDate(panchangData.data.nakshatraEndTime)})
                            </p>
                          </>
                        ) : (
                          <h3 className="font-serif text-lg font-bold text-amber-100">Nakshatra Index: {panchangData.data.nakshatra}</h3>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rahu Kaal Detail */}
                  <div className="relative p-5 rounded-2xl bg-gradient-to-r from-neutral-950/60 to-neutral-950/20 border border-neutral-800/40">
                    <div className="absolute right-4 top-4 text-xs font-semibold uppercase tracking-wider text-red-500/80 bg-red-500/10 px-2.5 py-0.5 rounded border border-red-500/25">
                      Rahu Kaal
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="text-2xl mt-1">🌑</div>
                      <div className="space-y-1">
                        <h3 className="font-serif text-lg font-bold text-amber-100">
                          Rahu Kaal
                        </h3>
                        <p className="text-xs text-neutral-400">
                          Period: <span className="text-amber-200/90">{formatTime(panchangData.data.rahuKalamStart)}</span> to <span className="text-amber-200/90">{formatTime(panchangData.data.rahuKalamEnd)}</span>
                        </p>
                        <p className="text-[10px] text-neutral-500 leading-relaxed">
                          Inauspicious time window. Avoid starting new projects or major tasks during this period.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata Limbs Footer */}
                <div className="grid grid-cols-3 gap-2 border-t border-neutral-800/80 mt-6 pt-6 text-center">
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">Weekday (Vara)</span>
                    <span className="text-xs font-medium text-amber-200/80">
                      {panchangData.data.vara === 0 ? 'Ravivara' : 
                       panchangData.data.vara === 1 ? 'Somavara' :
                       panchangData.data.vara === 2 ? 'Mangalavara' :
                       panchangData.data.vara === 3 ? 'Budhavara' :
                       panchangData.data.vara === 4 ? 'Guruvara' :
                       panchangData.data.vara === 5 ? 'Shukravara' : 'Shanivara'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">Yoga</span>
                    <span className="text-xs font-medium text-amber-200/80 truncate block px-1">
                      {panchangData.data.yogas && panchangData.data.yogas.length > 0 ? panchangData.data.yogas[0].name : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold tracking-wider">Karana</span>
                    <span className="text-xs font-medium text-amber-200/80 truncate block px-1">
                      {panchangData.data.karana || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-center text-amber-400">
              ⚠️ Failed to load Panchang calculations.
            </div>
          )}
        </main>
      ) : (
        /* Mantras Page View */
        <main className="container mx-auto px-6 py-12 flex-grow flex flex-col items-center justify-start z-10 max-w-4xl">
          {/* Page Title */}
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
              Sacred Chants
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide mt-3 mb-2 bg-gradient-to-r from-amber-100 to-orange-300 bg-clip-text text-transparent">
              Vedic Mantras
            </h1>
            <p className="text-neutral-400 text-sm">
              Discover and meditate upon timeless spiritual chants
            </p>
          </div>

          {/* Error State */}
          {mantrasError && (
            <div className="w-full p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              ⚠️ {mantrasError}
            </div>
          )}

          {/* Loader */}
          {loadingMantras ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-neutral-500 uppercase tracking-widest">Connecting to Temple Database...</p>
            </div>
          ) : (
            <div className="w-full">
              {mantras.length === 0 ? (
                /* Empty Database State */
                <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-900 text-center backdrop-blur-sm max-w-lg mx-auto">
                  <span className="text-4xl block mb-4">📖</span>
                  <h3 className="text-lg font-semibold text-amber-200/90 mb-2">No Mantras Found</h3>
                  <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                    Your database table <code className="bg-neutral-950 px-2 py-1 rounded">mantras</code> is currently empty or loading credentials. You can seed some beautiful default Vedic mantras immediately.
                  </p>
                  <button
                    onClick={seedDatabase}
                    disabled={seeding}
                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-neutral-950 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-950/20"
                  >
                    {seeding ? "Seeding database..." : "✨ Seed Sample Mantras"}
                  </button>
                </div>
              ) : (
                /* Main list view with categories */
                <div className="space-y-6">
                  {/* Category Filter Tabs */}
                  <div className="flex flex-wrap gap-2 justify-center pb-4 border-b border-neutral-900/60">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                          selectedCategory === cat
                            ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                            : 'text-neutral-500 border-neutral-800 hover:text-amber-200 hover:border-neutral-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Mantras List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredMantras.map((mantra) => (
                      <div
                        key={mantra.id}
                        className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-900 hover:border-amber-500/15 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between group relative overflow-hidden"
                      >
                        {/* Soft corner gradient on hover */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/2 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="space-y-4">
                          {/* Title & Category */}
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="font-serif text-lg font-bold text-amber-200 group-hover:text-amber-100 transition-colors duration-300">
                              {mantra.title}
                            </h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/5 border border-amber-500/10 px-2.5 py-0.5 rounded-full">
                              {mantra.category}
                            </span>
                          </div>

                          {/* Sanskrit Text */}
                          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-900 text-center py-6 leading-relaxed">
                            <p className="font-serif text-xl font-bold bg-gradient-to-b from-amber-200 to-orange-300 bg-clip-text text-transparent leading-loose tracking-wide">
                              {mantra.sanskrit_text}
                            </p>
                          </div>

                          {/* Phonetic Transliteration */}
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 block">Pronunciation</span>
                            <p className="text-xs text-neutral-300/80 italic font-light leading-relaxed">
                              {mantra.transliteration}
                            </p>
                          </div>

                          {/* Meaning */}
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 block">Meaning</span>
                            <p className="text-xs text-neutral-400 leading-relaxed font-light">
                              {mantra.meaning}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      )}

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
