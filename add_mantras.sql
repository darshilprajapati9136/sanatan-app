-- ============================================================
-- Add 5 well-known mantras to the 'mantras' table (Supabase / Postgres)
-- Structure matches existing rows: (title, sanskrit_text, transliteration, meaning, category)
-- Run this in the Supabase Dashboard -> SQL Editor, or via psql.
-- ============================================================

INSERT INTO mantras (title, sanskrit_text, transliteration, meaning, category)
VALUES
-- 1. Shanti Mantra (Taittiriya / Katha / Mandukya Upanishads)
(
  'Shanti Mantra',
  'ॐ सह नाववतु। सह नौ भुनक्तु। सह वीर्यं करवावहै। तेजस्वि नावधीतमस्तु मा विद्विषावहै। ॐ शान्तिः शान्तिः शान्तिः॥',
  'Om saha nāv avatu, saha nau bhunaktu, saha vīryaṃ karavāvahai, tejasvi nāv adhītam astu mā vidviṣāvahai. Om śāntiḥ śāntiḥ śāntiḥ.',
  'May the Divine protect us both (teacher and student), may He nourish us both, and may we work together with great strength and energy. May our study be brilliant and enlightening, and may we never harbour ill will towards each other. Om, peace, peace, peace — peace in body, mind, and spirit.',
  'Shanti'
),
-- 2. Hanuman Chalisa Opening Verse (Doha) — composed by Tulsidas in Awadhi
(
  'Hanuman Chalisa (Opening Doha)',
  'श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि। बरनउँ रघुबर बिमल जसु जो दायकु फल चारि॥ बुद्धिहीन तनु जानिके सुमिरौं पवन कुमार। बल बुधि बिद्या देहु मोहिं हरहु कलेस बिकार॥',
  'Śrī guru charana saroja raja, nija manu mukuru sudhāri; baranau raghubara bimala jasu, jo dāyaku phala chāri. Buddhihīna tanu jānike, sumirau pavana-kumāra; bala budhi bidyā dehu mohi, harahu kalesa bikāra.',
  'Having polished the mirror of my mind with the dust of the lotus feet of my Guru, I describe the pure glory of Lord Ram, the best of the Raghu dynasty, who grants the four fruits of life. Knowing myself to be lacking in wisdom, I remember Hanuman, the son of the Wind God — please bless me with strength, intelligence, and true knowledge, and remove my sorrows and imperfections.',
  'Hanuman'
),
-- 3. Vishnu Sahasranama Opening Verse (Dhyana Shloka, Mahabharata Anushasana Parva)
(
  'Vishnu Sahasranama (Dhyana Shloka)',
  'शुक्लांबरधरं विष्णुं शशिवर्णं चतुर्भुजम्। प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये॥',
  'Śuklāmbara-dharaṃ viṣṇuṃ śaśi-varṇaṃ catur-bhujam, prasanna-vadanaṃ dhyāyet sarva-vighnopa-śāntaye.',
  'One should meditate upon Lord Vishnu, clad in white garments, whose radiance resembles the moon, who is four-armed, and whose face beams with serene grace — for the pacification of all obstacles. This is the meditation verse with which the traditional recitation of the thousand names of Vishnu begins.',
  'Vishnu'
),
-- 4. Saraswati Vandana (Ya Kundendu Stotra) — for knowledge and learning
(
  'Saraswati Vandana',
  'या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता। या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना॥ या ब्रह्माच्युतशङ्करप्रभृतिभिर्देवैः सदा वन्दिता। सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥',
  'Yā kundendu-tuṣāra-hāra-dhavalā yā śubhra-vastrāvṛtā, yā vīṇā-vara-daṇḍa-maṇḍita-karā yā śveta-padmāsanā. Yā brahmācyuta-śaṅkara-prabhṛtibhir devaiḥ sadā vanditā, sā māṃ pātu sarasvatī bhagavatī niḥśeṣa-jāḍyāpahā.',
  'May Goddess Saraswati, who is as fair as the jasmine flower, the moon, and snow, who is draped in spotless white garments, whose hands hold the veena and the staff of blessing, who is seated upon a white lotus, and who is worshipped forever by Brahma, Vishnu, Shiva, and all the gods — may that divine Mother protect me and completely remove my dullness and ignorance.',
  'Saraswati'
),
-- 5. Surya Namaskar Mantra — twelve salutations to the Sun (one per pose)
(
  'Surya Namaskar Mantra',
  'ॐ मित्राय नमः। ॐ रवये नमः। ॐ सूर्याय नमः। ॐ भानवे नमः। ॐ खगाय नमः। ॐ पूष्णे नमः। ॐ हिरण्यगर्भाय नमः। ॐ मरीचये नमः। ॐ आदित्याय नमः। ॐ सावित्रे नमः। ॐ अर्काय नमः। ॐ भास्कराय नमः॥',
  'Om mitrāya namaḥ, om ravaye namaḥ, om sūryāya namaḥ, om bhānave namaḥ, om khagāya namaḥ, om puṣṇe namaḥ, om hiraṇya-garbhāya namaḥ, om marīcaye namaḥ, om ādityāya namaḥ, om sāvitre namaḥ, om arkāya namaḥ, om bhāskarāya namaḥ.',
  'Salutations to the Sun God in his twelve divine aspects: Mitra, the friend of all; Ravi, the shining one; Surya, the radiant guide; Bhanu, the bestower of beauty; Khaga, who moves across the sky; Pushan, the nourisher of all life; Hiranyagarbha, the golden womb of creation; Marichi, the lord of countless rays; Aditya, the son of Aditi and sustainer of the world; Savitr, the vivifier; Arka, worthy of all praise; and Bhaskara, the giver of light and wisdom. Each name is chanted at one of the twelve poses of the sun salutation.',
  'Surya'
);
