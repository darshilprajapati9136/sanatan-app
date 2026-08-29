import React, { useState, useMemo, useEffect } from 'react';
import { getPanchangam, Observer } from '@ishubhamx/panchangam-js';
import { supabase } from './supabaseClient';

const SAMPLE_MANTRAS = [
  {
    id: 1,
    title: "Gayatri Mantra",
    deity: "Goddess Gayatri / Savitr",
    category: "Gayatri",
    symbol: "☀️",
    image_url: "/images/gayatri.jpg",
    sanskrit_text: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥",
    transliteration: "Om bhūr bhuvaḥ svaḥ tat savitur vareṇyaṃ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt.",
    meaning: "We meditate on the absolute splendour of the supreme divine sun (Savitr), who illuminates all realms (physical, mental, and spiritual). May that divine light inspire and awaken our intellect.",
    significance: "Considered the mother of all Vedic mantras from the Rigveda. Chanted for spiritual illumination, sharp intellect, and universal peace.",
    best_time: "Brahma Muhurta (early morning before sunrise) or midday and sunset (Sandhyavandanam)."
  },
  {
    id: 2,
    title: "Maha Mrityunjaya Mantra",
    deity: "Lord Shiva (Tryambaka)",
    category: "Shiva",
    symbol: "🔱",
    image_url: "/images/shiva.jpg",
    sanskrit_text: "ॐ त्र्यम्बकम् यजामहे सुगन्धिम् पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्॥",
    transliteration: "Om tryambakaṃ yajāmahe sugandhiṃ puṣṭi-vardhanam, urvārukam-iva bandhanān mṛtyor-mukṣīya mā'mṛtāt.",
    meaning: "We worship the three-eyed Lord Shiva, who is fragrant and nourishes all beings. Just as a ripe cucumber effortlessly detaches from its bondage to the vine, may he liberate us from the cycle of death and guide us to immortality.",
    significance: "Found in Rigveda (7.59.12). Known as the life-giving (Mrita-Sanjivani) mantra for healing, longevity, physical well-being, and removing fear of mortality.",
    best_time: "Morning or evening during Shiva puja, especially on Mondays or during Pradosham."
  },
  {
    id: 3,
    title: "Ganesha Vakratunda Mantra",
    deity: "Lord Ganesha",
    category: "Ganesha",
    symbol: "🐘",
    image_url: "/images/ganesha.jpg",
    sanskrit_text: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
    transliteration: "Vakratuṇḍa mahākāya sūryakoṭi samaprabha, nirvighnaṃ kuru me deva sarva-kāryeṣu sarvadā.",
    meaning: "O Lord of the curved trunk and immense cosmic form, whose brilliance equals millions of suns: please remove all obstacles from all my endeavors, always.",
    significance: "Invoked at the beginning of every sacred endeavor, study, journey, or ritual to ensure smooth progress and auspicious results.",
    best_time: "At the start of any new work, morning prayers, or Tuesdays/Sankashti Chaturthi."
  },
  {
    id: 4,
    title: "Shiva Panchakshara Stotram",
    deity: "Lord Shiva (Na-Ma-Shi-Va-Ya)",
    category: "Shiva",
    symbol: "🕉️",
    image_url: "/images/shiva.jpg",
    sanskrit_text: "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय। नित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय॥",
    transliteration: "Nāgendrahārāya trilocanāya bhasmāṅgarāgāya maheśvarāya, nityāya śuddhāya digambarāya tasmai 'na'kārāya namaḥ śivāya.",
    meaning: "Salutations to Lord Shiva, who wears the king of serpents as a garland, who has three divine eyes, whose body is smeared with sacred ash, the supreme lord of the universe, eternal, pure, and clothed in the cosmos — salutations to the syllable 'NA'.",
    significance: "Composed by Adi Shankaracharya to praise the five sacred syllables of 'Om Namah Shivaya', representing the five cosmic elements.",
    best_time: "During meditation, Shiva worship, or Maha Shivaratri."
  },
  {
    id: 5,
    title: "Hanuman Chalisa (Opening Shloka)",
    deity: "Lord Hanuman",
    category: "Hanuman",
    symbol: "🚩",
    image_url: "/images/hanuman.jpg",
    sanskrit_text: "श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि। बरनउँ रघुबर बिमल जसु जो दायकु फल चारि॥ बुद्धिहीन तनु जानिके सुमिरौं पवन कुमार। बल बुधि बिद्या देहु मोहिं हरहु कलेस बिकार॥",
    transliteration: "Śrī guru carana saroja raja, nija manu mukuru sudhāri; baranaũ raghubara bimala jasu, jo dāyaku phala cāri. Buddhihīna tanu jānike, sumiraũ pavana-kumāra; bala budhi bidyā dehu mohi, harahu kalesa bikāra.",
    meaning: "Purifying the mirror of my mind with the sacred dust from the lotus feet of the Guru, I describe the pure glory of Lord Ram, which grants the four fruits of life. Knowing myself to be deficient in wisdom, I meditate on the son of the Wind God — grant me strength, wisdom, and knowledge, and dispel my afflictions.",
    significance: "The foundation prayer composed by Goswami Tulsidas to invoke Hanuman's protection, courage, and pure devotion.",
    best_time: "Tuesdays, Saturdays, or daily before starting challenging tasks."
  },
  {
    id: 6,
    title: "Maha Lakshmi Ashtakam",
    deity: "Goddess Mahalakshmi",
    category: "Lakshmi",
    symbol: "🪷",
    image_url: "/images/lakshmi.jpg",
    sanskrit_text: "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते। शङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते॥",
    transliteration: "Namaste'stu mahāmāye śrīpīṭhe surapūjite, śaṅkha-cakra-gadā-haste mahālakṣmi namo'stu te.",
    meaning: "Salutations to You, O Great Divine Mother, supreme enchantress who abides in the holy Sri Pitha, worshipped by all celestial beings. Holder of the conch, discus, and mace — salutations unto You, O Mahalakshmi!",
    significance: "From the Padma Purana, chanted to invoke divine grace, spiritual contentment, prosperity, and auspicious fortune.",
    best_time: "Friday mornings, Diwali, and Varalakshmi Vratam."
  },
  {
    id: 7,
    title: "Hare Krishna Mahamantra",
    deity: "Lord Krishna & Radha",
    category: "Krishna",
    symbol: "🪈",
    image_url: "/images/krishna.jpg",
    sanskrit_text: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे। हरे राम हरे राम राम राम हरे हरे॥",
    transliteration: "Hare kṛṣṇa hare kṛṣṇa kṛṣṇa kṛṣṇa hare hare, hare rāma hare rāma rāma rāma hare hare.",
    meaning: "O supreme energy of the Lord (Hare), O all-attractive Supreme Lord (Krishna), O supreme reservoir of divine pleasure (Rama): please engage me in Your devotional service.",
    significance: "Prescribed in the Kali-Santarana Upanishad as the supreme chanting mantra for the Kali Yuga to cleanse the heart and cultivate divine love.",
    best_time: "Daily Japa chanting with Tulsi beads, at any time of day."
  },
  {
    id: 8,
    title: "Vishnu Sahasranama Dhyanam",
    deity: "Lord Vishnu",
    category: "Vishnu",
    symbol: "🐚",
    image_url: "/images/vishnu.jpg",
    sanskrit_text: "शुक्लांबरधरं विष्णुं शशिवर्णं चतुर्भुजम्। प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये॥",
    transliteration: "Śuklāmbaradharaṃ viṣṇuṃ śaśivarṇaṃ caturbhujam, prasannavadanaṃ dhyāyet sarvavighnopaśāntaye.",
    meaning: "We meditate upon Lord Vishnu, dressed in luminous white garments, radiant as the glowing moon, having four divine arms and a serene, blissful countenance — for the pacification and removal of all obstacles.",
    significance: "The Dhyana shloka opening the recitation of the 1,000 sacred names of Vishnu from the Mahabharata.",
    best_time: "Thursdays, Ekadashi, or during morning sandhya meditation."
  },
  {
    id: 9,
    title: "Saraswati Vandana",
    deity: "Goddess Saraswati",
    category: "Saraswati",
    symbol: "🪕",
    image_url: "/images/saraswati.jpg",
    sanskrit_text: "या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना। सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥",
    transliteration: "Yā kundendu-tuṣāra-hāra-dhavalā yā śubhra-vastrāvṛtā, yā vīṇā-vara-daṇḍa-maṇḍita-karā yā śveta-padmāsanā, sā māṃ pātu sarasvatī bhagavatī niḥśeṣa-jāḍyāpahā.",
    meaning: "May Goddess Saraswati, radiant as the white jasmine, moon, and snow, adorned in spotless white robes, whose hands grace the Veena, seated upon a pure white lotus and revered by Brahma, Vishnu, and Shiva — protect us and completely dispel all ignorance and lethargy.",
    significance: "Chanted by students, teachers, artists, and seekers of knowledge to bless memory, clear speech, and artistic eloquence.",
    best_time: "Before studying, starting musical practice, or on Vasant Panchami."
  },
  {
    id: 10,
    title: "Vedic Shanti Mantra",
    deity: "Universal Divine / Guru-Shishya",
    category: "Shanti",
    symbol: "🕊️",
    image_url: "/images/shanti.png",
    sanskrit_text: "ॐ सह नाववतु। सह नौ भुनक्तु। सह वीर्यं करवावहै। तेजस्वि नावधीतमस्तु मा विद्विषावहै। ॐ शान्तिः शान्तिः शान्तिः॥",
    transliteration: "Om saha nāvavatu, saha nau bhunaktu, saha vīryaṃ karavāvahai, tejasvi nāvadhītamastu mā vidviṣāvahai. Om śāntiḥ śāntiḥ śāntiḥ.",
    meaning: "May the Divine protect teacher and disciple together. May He nourish us together. May we work together with great vigor and zeal. May our study be brilliant and enlightened. May there never be discord between us. Om Peace, Peace, Peace.",
    significance: "From the Taittiriya and Katha Upanishads. Recited before study, satsang, or meditation to create harmonious group energy.",
    best_time: "Before classes, meetings, meditation, or prayers."
  }
];

function App() {
  const [page, setPage] = useState('home'); // 'home' | 'panchang' | 'mantras' | 'gita'
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Mantras state
  const [mantras, setMantras] = useState([]);
  const [loadingMantras, setLoadingMantras] = useState(true);
  const [mantrasError, setMantrasError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMantra, setSelectedMantra] = useState(null); // When non-null, shows Detail View
  const [seeding, setSeeding] = useState(false);

  // Japa counter state for Detail View
  const [japaCount, setJapaCount] = useState(0);
  const [japaTarget, setJapaTarget] = useState(108);
  const [isChantMode, setIsChantMode] = useState(false); // Mobile Full-Screen Focus Chant Mode
  const [toastMessage, setToastMessage] = useState(null);

  // Gita state
  const [gitaVerses, setGitaVerses] = useState([]);
  const [loadingGita, setLoadingGita] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(1);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // Trigger Toast Notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Tap handler for Japa chanting with mobile haptic vibration
  const handleChantTap = () => {
    setJapaCount(prev => {
      const next = prev + 1;
      if (next === japaTarget) {
        showToast(`🎉 Sacred Mala Completed (${japaTarget} Chants)! May you be blessed. 🙏`);
      }
      return next;
    });

    // Mobile haptic feedback (vibration)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(40);
      } catch {
        // Safe ignore
      }
    }
  };

  // Fetch mantras when page switches to 'mantras'
  useEffect(() => {
    if (page !== 'mantras') return;
    fetchMantrasList();
  }, [page]);

  // Fetch Gita verses when page switches to 'gita'
  useEffect(() => {
    if (page !== 'gita') return;
    fetchGitaChapter(selectedChapter);
  }, [page, selectedChapter]);

  async function fetchGitaChapter(chapterNum) {
    setLoadingGita(true);
    try {
      const { data, error } = await supabase
        .from('gita_verses')
        .select('*')
        .eq('chapter', chapterNum)
        .order('verse', { ascending: true });

      if (error) throw error;
      setGitaVerses(data || []);
    } catch (err) {
      console.error('Error fetching Gita verses:', err);
    } finally {
      setLoadingGita(false);
    }
  }

  async function fetchMantrasList() {
    setLoadingMantras(true);
    setMantrasError(null);
    try {
      const { data, error } = await supabase
        .from('mantras')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      if (data && data.length > 0) {
        // Merge Supabase data with sample metadata (deity, significance, image) if missing
        const enriched = data.map((item, idx) => {
          const sample = SAMPLE_MANTRAS.find(s => s.title?.toLowerCase() === item.title?.toLowerCase()) || SAMPLE_MANTRAS[idx % SAMPLE_MANTRAS.length];
          return {
            ...sample,
            ...item,
            deity: item.deity || sample?.deity || 'Vedic Deity',
            symbol: item.symbol || sample?.symbol || '🕉️',
            image_url: item.image_url || sample?.image_url,
            significance: item.significance || sample?.significance || 'Sacred Vedic recitation for peace, wisdom, and spiritual upliftment.',
            best_time: item.best_time || sample?.best_time || 'Morning or evening prayers.'
          };
        });
        setMantras(enriched);
      } else {
        setMantras(SAMPLE_MANTRAS);
      }
    } catch (err) {
      console.warn("Supabase fetch notice, using verified sample mantras:", err.message);
      setMantras(SAMPLE_MANTRAS);
    } finally {
      setLoadingMantras(false);
    }
  }

  // Helper function to seed sample data if database is empty
  async function seedDatabase() {
    setSeeding(true);
    try {
      const payload = SAMPLE_MANTRAS.map(({ title, sanskrit_text, transliteration, meaning, category }) => ({
        title, sanskrit_text, transliteration, meaning, category
      }));
      const { error } = await supabase
        .from('mantras')
        .insert(payload);
      
      if (error) throw error;
      showToast("✨ Successfully added mantras to your Supabase table!");
      await fetchMantrasList();
    } catch (err) {
      console.error("Error seeding database:", err);
      showToast("Notice: " + (err.message || "Could not seed table."));
    } finally {
      setSeeding(false);
    }
  }

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const list = new Set(mantras.map(m => m.category).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [mantras]);

  // Filtered mantras by category and search query
  const filteredMantras = useMemo(() => {
    return mantras.filter(m => {
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        m.title?.toLowerCase().includes(q) ||
        m.deity?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q) ||
        m.meaning?.toLowerCase().includes(q) ||
        m.transliteration?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [mantras, selectedCategory, searchQuery]);

  // Copy Mantra to clipboard
  const handleCopyMantra = (mantra) => {
    const text = `${mantra.title}\n\n${mantra.sanskrit_text}\n\n${mantra.transliteration}\n\nMeaning:\n${mantra.meaning}\n\n— Sanatan Dharma App`;
    navigator.clipboard.writeText(text).then(() => {
      showToast("🙏 Sacred Shloka copied to clipboard!");
    }).catch(() => {
      showToast("Copy failed, please select text manually.");
    });
  };

  // Open Mantra Detail View
  const handleOpenDetail = (mantra) => {
    setSelectedMantra(mantra);
    setIsChantMode(false);
    setJapaCount(0); // Reset counter for new mantra
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close Mantra Detail View (Back to library)
  const handleBackToLibrary = () => {
    setSelectedMantra(null);
    setIsChantMode(false);
    setJapaCount(0);
  };

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
    <div className="min-h-screen bg-neutral-950 text-amber-50 font-sans flex flex-col justify-between overflow-x-hidden relative selection:bg-amber-500/30 selection:text-amber-200" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Decorative Golden Ambient Glows - Optimized for mobile performance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none overflow-hidden opacity-20 hidden md:block">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-amber-600/20 blur-[80px]" />
        <div className="absolute -top-[100px] left-1/4 w-[350px] h-[350px] rounded-full bg-orange-600/10 blur-[60px]" />
        <div className="absolute top-[200px] right-1/4 w-[250px] h-[250px] rounded-full bg-amber-500/10 blur-[50px]" />
      </div>

      {/* Floating Toast Notification - Mobile safe area adjusted */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center gap-3 bg-neutral-900/95 border border-amber-500/40 text-amber-300 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md animate-bounce" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <span className="text-lg flex-shrink-0" aria-hidden="true">🕉️</span>
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ===== HEADER — sticky compact row: logo left, nav right ===== */}
      <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-900/80 shadow-md" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center max-w-5xl">
          {/* Logo */}
          <div
            onClick={() => { setPage('home'); setSelectedMantra(null); setIsChantMode(false); }}
            className="flex items-center gap-2.5 cursor-pointer group active:opacity-75"
            role="button"
            tabIndex="0"
            aria-label="Home"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
              <span className="font-serif text-base font-bold text-neutral-950">ॐ</span>
            </div>
            <div className="leading-tight">
              <span className="font-serif font-bold text-sm sm:text-base tracking-wide bg-gradient-to-r from-amber-200 via-orange-300 to-amber-400 bg-clip-text text-transparent block">
                Sanatan Dharma
              </span>
              <span className="text-[10px] text-amber-400/50 uppercase tracking-widest hidden sm:block font-medium">
                Vedic Wisdom &amp; Rituals
              </span>
            </div>
          </div>

          {/* Desktop Navigation — hidden on mobile (mobile uses bottom tab bar) */}
          <nav className="hidden sm:flex gap-1 bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-800/80 backdrop-blur-md">
            {[
              { id: 'home', label: 'Home' },
              { id: 'panchang', label: 'Panchang' },
              { id: 'mantras', label: 'Mantras' },
              { id: 'gita', label: 'Gita' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => { setPage(id); setSelectedMantra(null); setIsChantMode(false); }}
                className={`text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer min-h-[44px] flex items-center justify-center ${
                  page === id
                    ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30 shadow-sm'
                    : 'text-neutral-400 hover:text-amber-300 border border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ===== MOBILE BOTTOM TAB BAR — only on sm screens, hidden in Chant Mode ===== */}
      {!isChantMode && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-neutral-950/95 border-t border-neutral-800/80 backdrop-blur-xl grid grid-cols-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'panchang', label: 'Panchang', icon: '📅' },
            { id: 'mantras', label: 'Mantras', icon: '📿' },
            { id: 'gita', label: 'Gita', icon: '📖' },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => { setPage(id); setSelectedMantra(null); setIsChantMode(false); }}
              className={`flex flex-col items-center justify-center gap-0.5 py-3 px-2 cursor-pointer transition-all duration-200 min-h-[48px] active:opacity-75 ${
                page === id ? 'text-amber-400' : 'text-neutral-500'
              }`}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${page === id ? 'text-amber-400' : 'text-neutral-500'}`}>
                {label}
              </span>
              {page === id && <span className="w-1 h-1 rounded-full bg-amber-500 mt-0.5" />}
            </button>
          ))}
        </nav>
      )}

      {/* Main View Router */}
      {page === 'home' ? (
        <main className="container mx-auto px-6 py-12 flex-grow flex flex-col items-center justify-center text-center z-10 max-w-4xl pb-20 sm:pb-0">
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
        <main className="container mx-auto px-6 py-12 flex-grow flex flex-col items-center justify-center z-10 max-w-3xl pb-20 sm:pb-0">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-neutral-950/50 border border-neutral-800/40 flex items-center gap-4">
                    <div className="text-3xl select-none">🌅</div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block">Sunrise</span>
                      <span className="text-base font-semibold text-amber-300 whitespace-nowrap">{formatTime(panchangData.data.sunrise)}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-950/50 border border-neutral-800/40 flex items-center gap-4">
                    <div className="text-3xl select-none">🌇</div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block">Sunset</span>
                      <span className="text-base font-semibold text-amber-300 whitespace-nowrap">{formatTime(panchangData.data.sunset)}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Elements: Tithi, Nakshatra, Rahu Kaal */}
                <div className="space-y-6">
                  {/* Tithi Detail */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-950/60 to-neutral-950/20 border border-neutral-800/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800/40 pb-3 mb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl select-none">🌕</div>
                        <h3 className="font-serif text-lg font-bold text-amber-100">
                          {panchangData.data.tithis && panchangData.data.tithis.length > 0 
                            ? panchangData.data.tithis[0].name 
                            : `Tithi ${panchangData.data.tithi}`}
                        </h3>
                      </div>
                      <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                        Tithi
                      </span>
                    </div>
                    <div className="space-y-1">
                      {panchangData.data.tithis && panchangData.data.tithis.length > 0 ? (
                        <>
                          <p className="text-xs text-neutral-400">
                            Starts: <span className="text-amber-200/90">{formatTime(panchangData.data.tithiStartTime)}</span> ({formatShortDate(panchangData.data.tithiStartTime)})
                          </p>
                          <p className="text-xs text-neutral-400">
                            Ends: <span className="text-amber-200/90">{formatTime(panchangData.data.tithiEndTime)}</span> ({formatShortDate(panchangData.data.tithiEndTime)})
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-neutral-400">No transitions available.</p>
                      )}
                    </div>
                  </div>

                  {/* Nakshatra Detail */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-950/60 to-neutral-950/20 border border-neutral-800/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800/40 pb-3 mb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl select-none">✨</div>
                        <h3 className="font-serif text-lg font-bold text-amber-100">
                          {panchangData.data.nakshatras && panchangData.data.nakshatras.length > 0 
                            ? panchangData.data.nakshatras[0].name 
                            : `Nakshatra ${panchangData.data.nakshatra}`}
                        </h3>
                      </div>
                      <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                        Nakshatra
                      </span>
                    </div>
                    <div className="space-y-1">
                      {panchangData.data.nakshatras && panchangData.data.nakshatras.length > 0 ? (
                        <>
                          <p className="text-xs text-neutral-400">
                            Starts: <span className="text-amber-200/90">{formatTime(panchangData.data.nakshatraStartTime)}</span> ({formatShortDate(panchangData.data.nakshatraStartTime)})
                          </p>
                          <p className="text-xs text-neutral-400">
                            Ends: <span className="text-amber-200/90">{formatTime(panchangData.data.nakshatraEndTime)}</span> ({formatShortDate(panchangData.data.nakshatraEndTime)})
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-neutral-400">No transitions available.</p>
                      )}
                    </div>
                  </div>

                  {/* Rahu Kaal Detail */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-950/60 to-neutral-950/20 border border-neutral-800/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800/40 pb-3 mb-3 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl select-none">🌑</div>
                        <h3 className="font-serif text-lg font-bold text-amber-100">
                          Rahu Kaal
                        </h3>
                      </div>
                      <span className="self-start sm:self-auto text-[10px] font-bold uppercase tracking-wider text-red-500/80 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/25">
                        Rahu Kaal
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-neutral-400">
                        Period: <span className="text-amber-200/90">{formatTime(panchangData.data.rahuKalamStart)}</span> to <span className="text-amber-200/90">{formatTime(panchangData.data.rahuKalamEnd)}</span>
                      </p>
                      <p className="text-[10px] text-neutral-500 leading-relaxed pt-1">
                        Inauspicious time window. Avoid starting new projects or major tasks during this period.
                      </p>
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
      ) : page === 'gita' ? (
        <main className="container mx-auto px-4 sm:px-6 py-12 flex-grow flex flex-col items-center z-10 max-w-3xl pb-24 sm:pb-8">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
              Sacred Scripture
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide mt-3 mb-2 bg-gradient-to-r from-amber-100 to-orange-300 bg-clip-text text-transparent">
              Bhagavad Gita
            </h1>
            <p className="text-neutral-400 text-sm max-w-lg">
              Chapter {selectedChapter} — Verse by verse with Sanskrit, transliteration, and meaning.
            </p>
          </div>

              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {[1].map(ch => (
              <button
                key={ch}
                onClick={() => { setSelectedChapter(ch); setGitaVerses([]); }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
                  selectedChapter === ch
                    ? 'bg-amber-500 text-neutral-950'
                    : 'bg-neutral-900 text-neutral-400 hover:text-amber-300 border border-neutral-800'
                }`}
              >
                Chapter {ch}
              </button>
            ))}
          </div>

          {loadingGita ? (
            <div className="text-center text-neutral-500 py-20">Loading verses...</div>
          ) : gitaVerses.length === 0 ? (
            <div className="text-center text-neutral-500 py-20">No verses found for this chapter.</div>
          ) : (
            <div className="w-full space-y-6">
              {gitaVerses.map((verse) => (
                <div
                  key={verse.id}
                  className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-850 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      Ch.{verse.chapter} Verse {verse.verse}
                    </span>
                  </div>

                  <p className="font-serif text-xl sm:text-2xl font-bold text-amber-100 leading-relaxed mb-4">
                    {verse.sanskrit_text}
                  </p>

                  <p className="text-sm sm:text-base text-neutral-300 italic font-light leading-relaxed mb-4">
                    {verse.transliteration}
                  </p>

                  <div className="border-t border-neutral-800 pt-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-amber-400/90 mb-2">Meaning</p>
                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                      {verse.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      ) : selectedMantra ? (
        /* ========================================================================= */
        /* Day 15: Mantra Detail View with Deity Imagery, Sanskrit Shloka & 108 Japa */
        /* ========================================================================= */
        <main className="container mx-auto px-4 sm:px-6 py-8 flex-grow flex flex-col items-center z-10 max-w-4xl pb-24 sm:pb-8">
          {/* ========================================================================= */}
          {/* Full-Screen Focus Chant Mode (Naam Jap Dhyana Overlay)                   */}
          {/* ========================================================================= */}
          {isChantMode && (
            <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col justify-between p-4 sm:p-8 backdrop-blur-2xl overflow-y-auto">
              {/* Background ambient lighting */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

              {/* Chant Mode Header */}
              <div className="flex items-center justify-between z-10 border-b border-neutral-850 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">{selectedMantra.symbol || "🕉️"}</span>
                  <div>
                    <h2 className="font-serif text-sm sm:text-base font-bold text-amber-200 line-clamp-1">
                      {selectedMantra.title}
                    </h2>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500/80">
                      Naam Jap Mode
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsChantMode(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 hover:text-amber-200 border border-neutral-750 text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 min-h-[44px]"
                  aria-label="Exit chant mode"
                >
                  <span aria-hidden="true">✕</span> Exit
                </button>
              </div>

              {/* Central Sacred Shloka & Pronunciation Display (Always in view while chanting) */}
              <div className="my-auto py-6 text-center space-y-5 z-10 max-w-2xl mx-auto w-full">
                <span className="text-[10px] uppercase tracking-widest text-amber-500/70 font-semibold bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/15">
                  ॥ पवित्र श्लोक ॥
                </span>

                {/* Big Glowing Devanagari Sanskrit */}
                <p className="font-serif text-2xl sm:text-4xl font-bold bg-gradient-to-r from-amber-100 via-orange-200 to-amber-300 bg-clip-text text-transparent leading-relaxed sm:leading-loose tracking-wide select-none drop-shadow-md">
                  {selectedMantra.sanskrit_text}
                </p>

                {/* Syllable Transliteration for Recitation */}
                <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-850 max-w-lg mx-auto">
                  <p className="text-xs sm:text-sm text-neutral-300 italic font-light leading-relaxed select-none">
                    "{selectedMantra.transliteration}"
                  </p>
                </div>
              </div>

              {/* Bottom Chanting Disc Controller */}
              <div className="z-10 flex flex-col items-center gap-4 max-w-md mx-auto w-full pt-2">
                {/* Repetition Target Selector */}
                <div className="grid grid-cols-4 gap-1.5 w-full bg-neutral-900/80 p-1.5 rounded-2xl border border-neutral-800">
                  {[11, 21, 54, 108].map(target => (
                    <button
                      key={target}
                      onClick={() => setJapaTarget(target)}
                      className={`text-xs font-bold py-1.5 rounded-xl transition cursor-pointer text-center ${
                        japaTarget === target 
                          ? 'bg-amber-500 text-neutral-950 shadow-md' 
                          : 'text-neutral-400 hover:text-amber-300'
                      }`}
                    >
                      {target} Chants
                    </button>
                  ))}
                </div>

                {/* Circular Tap Counter Button */}
                <button
                  onClick={handleChantTap}
                  className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 transition-all duration-150 active:scale-92 cursor-pointer flex flex-col items-center justify-center shadow-2xl select-none group ${
                    japaCount >= japaTarget
                      ? 'border-amber-400 bg-amber-500/25 shadow-amber-500/40 animate-pulse'
                      : 'border-amber-500/50 bg-neutral-900 hover:border-amber-400 hover:bg-neutral-850 active:border-amber-300'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 group-hover:scale-105 transition-transform">
                    {japaCount}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400/90 mt-1">
                    / {japaTarget} Chants
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1 bg-neutral-950/70 px-2 py-0.5 rounded-full border border-neutral-800">
                    Tap to Count
                  </span>
                </button>

                {/* Linear Progress Bar */}
                <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-200"
                    style={{ width: `${Math.min(100, (japaCount / japaTarget) * 100)}%` }}
                  />
                </div>

                {/* Mala Complete Banner */}
                {japaCount >= japaTarget && (
                  <div className="w-full p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold text-center animate-bounce">
                    🎉 Sacred Mala Completed ({japaTarget} Chants)! Har Har Mahadev 🙏
                  </div>
                )}

                <div className="flex items-center justify-between w-full text-xs text-neutral-500 px-2">
                  <button
                    onClick={() => setJapaCount(0)}
                    className="hover:text-neutral-300 underline cursor-pointer p-1 active:opacity-75"
                    aria-label="Reset chant counter to zero"
                  >
                    Reset Count
                  </button>
                  <span className="text-[11px]">
                    {Math.round(Math.min(100, (japaCount / japaTarget) * 100))}% Completed
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Breadcrumb & Navigation Bar */}
          <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-neutral-900">
            <button
              onClick={handleBackToLibrary}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 bg-neutral-900/60 hover:bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-800 transition-all cursor-pointer shadow-sm min-h-[44px]"
              aria-label="Back to mantras library"
            >
              <span aria-hidden="true">←</span> Back to Mantras
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 hidden sm:inline">Category:</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                {selectedMantra.category}
              </span>
            </div>
          </div>

          {/* Deity Visual Banner & Darshan Artwork */}
          <div className="w-full relative rounded-3xl overflow-hidden border border-neutral-800/80 bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-6 sm:p-10 shadow-2xl mb-8">
            {/* Background Glow */}
            <div className="absolute top-0 right-1/4 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-8 z-10 relative">
              {/* Deity Portrait / Icon Box */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 opacity-30 blur-lg group-hover:opacity-50 transition duration-500" />
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-neutral-950 flex items-center justify-center shadow-xl">
                  {selectedMantra.image_url ? (
                    <img 
                      src={selectedMantra.image_url} 
                      alt={selectedMantra.deity || selectedMantra.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      width="176"
                      height="176"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-amber-950/40 to-neutral-950 text-5xl"
                    style={{ display: selectedMantra.image_url ? 'none' : 'flex' }}
                  >
                    <span>{selectedMantra.symbol || "🕉️"}</span>
                    <span className="text-[10px] uppercase font-bold text-amber-400/80 tracking-widest mt-2">Darshan</span>
                  </div>
                </div>
              </div>

              {/* Title & Deity Meta */}
              <div className="text-center md:text-left space-y-2 flex-grow">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    {selectedMantra.deity || "Sacred Deity"}
                  </span>
                  {selectedMantra.best_time && (
                    <span className="text-[10px] text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                      ⏰ {selectedMantra.best_time}
                    </span>
                  )}
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide bg-gradient-to-r from-amber-100 via-orange-200 to-amber-300 bg-clip-text text-transparent">
                  {selectedMantra.title}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                  {selectedMantra.significance}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <button
                    onClick={() => handleCopyMantra(selectedMantra)}
                    className="text-xs font-semibold flex items-center gap-2 bg-neutral-900 hover:bg-neutral-850 text-amber-300 px-4 py-2 rounded-xl border border-neutral-700 transition-all cursor-pointer active:scale-95"
                  >
                    <span>📋</span> Copy Shloka & Translation
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Shloka in Devanagari Typography */}
          <div className="w-full space-y-6">
            <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/60 border border-amber-500/20 shadow-2xl backdrop-blur-md text-center relative overflow-hidden">
              <div className="absolute top-4 left-4 text-xs font-serif uppercase tracking-widest text-amber-500/60">
                ॥ संस्कृत श्लोक ॥
              </div>
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-100 via-orange-200 to-amber-300 bg-clip-text text-transparent leading-relaxed tracking-wider py-4">
                {selectedMantra.sanskrit_text}
              </p>
            </div>

            {/* Prominent CTA to Launch Full-Screen Naam Jap Mode (Crucial for mobile users) */}
            <button
              onClick={() => setIsChantMode(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-neutral-950 font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-orange-950/40 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer min-h-[54px]"
              aria-label="Open full screen chanting mode for focused meditation"
            >
              <span aria-hidden="true">📿</span>
              <span>Open Naam Jap Mode (Chant & Read Shloka)</span>
              <span className="text-xs opacity-75 font-normal">→</span>
            </button>

            {/* Pronunciation & Meaning Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pronunciation Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-850 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400/90">
                  <span>🗣️</span> Phonetic Transliteration
                </div>
                <p className="text-sm sm:text-base text-neutral-300 italic font-light leading-relaxed">
                  "{selectedMantra.transliteration}"
                </p>
              </div>

              {/* Meaning Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-850 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400/90">
                  <span>✨</span> Sacred Meaning
                </div>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                  {selectedMantra.meaning}
                </p>
              </div>
            </div>
          </div>

          {/* Floating Mobile Bottom Quick-Chant Bar */}
          {!isChantMode && (
            <div className="fixed bottom-0 left-0 right-0 p-3.5 bg-neutral-950/95 border-t border-neutral-800/80 backdrop-blur-xl flex items-center justify-between sm:hidden z-30 px-5 shadow-2xl" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleChantTap}
                  className="w-12 h-12 rounded-full bg-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
                  aria-label="Increment chant count by 1"
                >
                  +1
                </button>
                <div>
                  <span className="text-xs font-bold text-amber-200 block">
                    {japaCount} / {japaTarget} Chants
                  </span>
                  <span className="text-[10px] text-neutral-500 block">Tap +1 or open focus</span>
                </div>
              </div>

              <button
                onClick={() => setIsChantMode(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                aria-label="Open full screen chanting mode"
              >
                <span aria-hidden="true">📿</span> Focus
              </button>
            </div>
          )}
        </main>
      ) : (
        /* ========================================================================= */
        /* Day 14: Mantra Library List View with Search, Category Filter & Cards     */
        /* ========================================================================= */
        <main className="container mx-auto px-4 sm:px-6 py-12 flex-grow flex flex-col items-center justify-start z-10 max-w-5xl pb-20 sm:pb-0">
          {/* Page Title */}
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
              Sacred Vedic Chants
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide mt-3 mb-2 bg-gradient-to-r from-amber-100 to-orange-300 bg-clip-text text-transparent">
              Mantra Library
            </h1>
            <p className="text-neutral-400 text-sm max-w-lg">
              Explore timeless Vedic mantras with authentic Sanskrit shlokas, English meanings, and meditation chanting tools.
            </p>
          </div>

          {/* Search Bar & Category Filter Controls */}
          <div className="w-full max-w-3xl space-y-4 mb-8">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-base" aria-hidden="true">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by mantra title, deity (e.g. Shiva, Gayatri, Ganesha), or meaning..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-neutral-900/70 border border-neutral-800 text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-all text-sm backdrop-blur-md min-h-[44px]"
                aria-label="Search mantras"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-amber-400 cursor-pointer p-1.5 active:opacity-75"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              {categories.map((cat) => {
                const count = cat === 'All' 
                  ? mantras.length 
                  : mantras.filter(m => m.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center gap-1.5 min-h-[44px] active:scale-95 ${
                      selectedCategory === cat
                        ? 'text-neutral-950 bg-gradient-to-r from-amber-400 to-orange-400 border-transparent shadow-md shadow-amber-950/40 font-bold'
                        : 'text-neutral-400 bg-neutral-900/50 border-neutral-850 hover:text-amber-200 hover:border-neutral-700'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat ? 'bg-neutral-950/20 text-neutral-950' : 'bg-neutral-950 text-neutral-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
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
              <div className="w-9 h-9 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-neutral-500 uppercase tracking-widest font-medium">Connecting to Sacred Database...</p>
            </div>
          ) : (
            <div className="w-full">
              {filteredMantras.length === 0 ? (
                /* Empty / No Match State */
                <div className="p-10 rounded-3xl bg-neutral-900/40 border border-neutral-850 text-center backdrop-blur-sm max-w-md mx-auto">
                  <span className="text-4xl block mb-3">📖</span>
                  <h3 className="text-lg font-serif font-bold text-amber-200/90 mb-2">No Mantras Found</h3>
                  <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                    {searchQuery ? `No results matching "${searchQuery}". Try a different keyword.` : "Your database table is currently empty. You can seed authentic Vedic mantras with 1 click."}
                  </p>
                  {searchQuery ? (
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                      className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      Clear Search & Filter
                    </button>
                  ) : (
                    <button
                      onClick={seedDatabase}
                      disabled={seeding}
                      className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-neutral-950 font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-950/20 text-xs min-h-[44px]"
                      aria-label="Seed database with sample Vedic mantras"
                    >
                      {seeding ? "Seeding database..." : "✨ Seed Sample Mantras to Supabase"}
                    </button>
                  )}}
                </div>
              ) : (
                /* Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMantras.map((mantra) => (
                    <div
                      key={mantra.id || mantra.title}
                      onClick={() => handleOpenDetail(mantra)}
                      className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-850 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between group relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-950/20 active:opacity-75"
                      role="button"
                      tabIndex="0"
                      aria-label={`View ${mantra.title} mantra`}
                      onKeyDown={(e) => e.key === 'Enter' && handleOpenDetail(mantra)}
                    >
                      {/* Ambient hover glow */}
                      <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="space-y-4">
                        {/* Header: Deity Symbol / Avatar & Category */}
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                              {mantra.symbol || "🕉️"}
                            </div>
                            <div>
                              <h3 className="font-serif text-lg font-bold text-amber-200 group-hover:text-amber-100 transition-colors line-clamp-1">
                                {mantra.title}
                              </h3>
                              <p className="text-[11px] text-amber-400/70 font-medium">
                                {mantra.deity || mantra.category}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full shrink-0">
                            {mantra.category}
                          </span>
                        </div>

                        {/* Sanskrit Shloka Box Preview */}
                        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-850 text-center py-4 leading-relaxed group-hover:border-amber-500/20 transition-colors">
                          <p className="font-serif text-base font-bold bg-gradient-to-b from-amber-200 to-orange-300 bg-clip-text text-transparent line-clamp-2 leading-relaxed">
                            {mantra.sanskrit_text}
                          </p>
                        </div>

                        {/* Transliteration Preview */}
                        <p className="text-xs text-neutral-400 italic line-clamp-2 font-light">
                          "{mantra.transliteration}"
                        </p>

                        {/* Meaning Preview */}
                        <p className="text-xs text-neutral-400/90 line-clamp-2 leading-relaxed font-light">
                          {mantra.meaning}
                        </p>
                      </div>

                      {/* Card Footer Action */}
                      <div className="pt-5 mt-4 border-t border-neutral-850/80 flex items-center justify-between text-xs">
                        <span className="text-neutral-500 group-hover:text-neutral-400 text-[11px]" aria-hidden="true">
                          📿 108 Japa Chanting
                        </span>
                        <span className="font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Read Shloka <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* Footer - Hidden on mobile to prevent duplicate navigation with bottom tab bar */}
      <footer className="container mx-auto px-6 py-8 border-t border-neutral-900/60 z-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500 mt-12 hidden sm:flex">
        <div className="flex items-center gap-2">
          <span className="text-amber-500" aria-hidden="true">ॐ</span>
          <p>© 2026 Sanatan Dharma App. All spiritual rights reserved.</p>
        </div>
        <div className="flex gap-6">
          <button onClick={() => { setPage('home'); setSelectedMantra(null); }} className="hover:text-amber-500 transition-colors cursor-pointer">Home</button>
          <button onClick={() => { setPage('panchang'); setSelectedMantra(null); }} className="hover:text-amber-500 transition-colors cursor-pointer">Panchang</button>
          <button onClick={() => { setPage('mantras'); setSelectedMantra(null); setIsChantMode(false); }} className="hover:text-amber-500 transition-colors cursor-pointer">Mantra Library</button>
          <button onClick={() => { setPage('gita'); setSelectedMantra(null); setIsChantMode(false); }} className="hover:text-amber-500 transition-colors cursor-pointer">Bhagavad Gita</button>
        </div>
      </footer>
    </div>
  );
}

export default App;
