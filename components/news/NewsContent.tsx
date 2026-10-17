'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

interface NewsItem {
  id: string;
  category: 'admissions' | 'academic' | 'events' | 'community';
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  en: {
    title: string;
    excerpt: string;
    content: string[];
    quote?: string;
  };
  ta: {
    title: string;
    excerpt: string;
    content: string[];
    quote?: string;
  };
}

const NEWS_DATA: NewsItem[] = [
  {
    id: 'admissions-2026-2027',
    category: 'admissions',
    date: 'October 12, 2026',
    readTime: '3 min read',
    featured: true,
    image: '/assets/images/hero_bg.webp',
    en: {
      title: 'Admissions Open for Hifz & Integrated School Studies (Academic Year 2026/2027)',
      excerpt:
        'The Institute of Da\'wa Islamiyya announces the commencement of student admissions for the upcoming academic year. Applications are now invited for boys who wish to pursue full-time Tahfeez-ul-Quran along with secondary school curriculum.',
      quote:
        '“The best amongst you are those who learn the Quran and teach it.” — Sahih Al-Bukhari',
      content: [
        'The Institute of Da\'wa Islamiyya (IDI) is pleased to announce that registrations and intake applications for the upcoming 2026/2027 academic session are officially open. Students completed Grade 5 or aged between 10 to 14 are eligible to apply.',
        'Our program integrates traditional Quran memorization with Tajweed, Islamic jurisprudence (Fiqh), Arabic language studies, and standard national curriculum school education (Grades 6–11) to prepare students for both spiritual success and national exams (G.C.E. O/L).',
        'Interested parents and guardians are requested to submit applications online or visit the institute administration office directly. Entrance interviews and recitation assessments will commence from mid-November.',
      ],
    },
    ta: {
      title: '2026/2027 கல்வியாண்டுக்கான ஹிஃப்ழ் மற்றும் பாடசாலைக் கல்விக்கான புதிய மாணவர் சேர்க்கை ஆரம்பம்',
      excerpt:
        'தஃவா இஸ்லாமிய்யா கலாபீடத்தின் எதிர்வரும் கல்வியாண்டுக்கான புதிய மாணவர் சேர்க்கை ஆரம்பமாகியுள்ளது. புனித குர்ஆனை மனனம் செய்வதுடன் அரச பாடசாலைக் கல்வியையும் தொடர விரும்பும் மாணவர்களிடமிருந்து விண்ணப்பங்கள் கோரப்படுகின்றன.',
      quote:
        '“உங்களில் சிறந்தவர் யாரெனில் குர்ஆனைக் கற்று அதனை பிறருக்குக் கற்பிப்பவரே ஆவார்.” — ஸஹீஹுல் புஹாரி',
      content: [
        'தஃவா இஸ்லாமிய்யா கலாபீடத்தின் (IDI) 2026/2027 கல்வியாண்டுக்கான புதிய மாணவர் சேர்க்கை உத்தியோகபூர்வமாக ஆரம்பிக்கப்பட்டுள்ளது. தரம் 5 ஐ பூர்த்தி செய்த அல்லது 10 முதல் 14 வயதுக்குட்பட்ட மாணவர்கள் விண்ணப்பிக்கத் தகுதியுடையவர்கள்.',
        'இங்கு தூய தஜ்வீதுடன் கூடிய குர்ஆன் ஹிஃப்ழ் பாடநெறியுடன், ஃபிக்ஹ், அரபு மொழி மற்றும் தரம் 6 முதல் 11 (சா/த) வரையிலான அரச கல்விப் பாடத்திட்டமும் சமநிலையாகக் கற்பிக்கப்படுகிறது.',
        'ஆர்வமுள்ள பெற்றோர்கள் எமது இணையத்தளம் வழியாகவோ அல்லது கலாபீட நிர்வாக அலுவலகத்திற்கு நேரடியாக வருகை தந்தோ விண்ணப்பங்களைப் பெற்றுக்கொள்ளலாம். நேர்முகப் பரீட்சைகள் நவம்பர் மாதம் முதல் வாரத்தில் நடைபெறும்.',
      ],
    },
  },
  {
    id: 'khatm-ul-quran-convocation-2026',
    category: 'events',
    date: 'September 28, 2026',
    readTime: '4 min read',
    image: '/assets/images/about_hero.webp',
    en: {
      title: 'Annual Khatm-ul-Quran Convocation: Honoring 24 New Huffaz Graduates',
      excerpt:
        'A joyous and spiritually uplifting graduation convocation held at the IDI Grand Hall honored 24 students who completed the memorization of the entire Holy Quran with sanad and distinction.',
      quote:
        '“To see these young scholars preserve Allah’s words in their hearts while demonstrating outstanding moral character is the true fruition of our mission.”',
      content: [
        'The IDI auditorium was filled with tears of joy and supplication as twenty-four students were formally awarded their Hafiz-ul-Quran certification and Sanad upon completing the memorization of all 30 Juz.',
        'The ceremony was attended by renowned scholars, community elders, faculty members, and proud families. Keynote addresses emphasized the responsibility of preserving the Quran through righteous living and dedicated service to society.',
        'Special awards were presented to high achievers in Tajweed accuracy, speed of revision (Dour), and academic excellence in school subjects.',
      ],
    },
    ta: {
      title: 'வருடாந்த குர்ஆன் நிறைவு விழா: 24 புதிய ஹாபிழ்களுக்கு சான்றிதழ் வழங்கி கௌரவிப்பு',
      excerpt:
        'தஃவா இஸ்லாமிய்யா கலாபீடத்தின் பிரதான மண்டபத்தில் நடைபெற்ற பாக்கியம் நிறைந்த பட்டமளிப்பு விழாவில், புனித குர்ஆனை முழுமையாக மனனம் செய்து முடித்த 24 புதிய ஹாபிழ்களுக்கு சனதுகளும் சான்றிதழ்களும் வழங்கப்பட்டன.',
      quote:
        '“இளம் மாணவர்கள் இறைவனின் வார்த்தைகளைத் தங்கள் உள்ளங்களில் சுமந்து, சிறந்த நற்பண்புகளோடு விளங்குவதைக் காண்பதே எமது பெரும் வெற்றியாகும்.”',
      content: [
        'தஃவா இஸ்லாமிய்யா கலாபீடத்தின் (IDI) கேட்போர் கூடத்தில் நடைபெற்ற நிகழ்வில், புனித குர்ஆனின் 30 ஜூஸ்உகளையும் செம்மையாக மனனம் செய்து முடித்த இருபத்து நான்கு மாணவர்களுக்கு ஹாபிழ் பட்டமும் சனதும் வழங்கி வைக்கப்பட்டன.',
        'இந்நிகழ்வில் நாட்டின் முக்கிய மார்க்க அறிஞர்கள், சமூகத் தலைவர்கள், பெற்றோர்கள் மற்றும் ஆசிரியர்கள் கலந்துகொண்டு மாணவர்களை வாழ்த்தினர்.',
        'குர்ஆனை மனனம் செய்வதுடன் நின்றுவிடாமல் அதனை வாழ்விலும் சமூகத்திலும் நடைமுறைப்படுத்தும் உன்னதப் பணியை முன்னெடுக்க வேண்டும் என வருகை தந்த அதிதிகள் அறிவுறுத்தினர்.',
      ],
    },
  },
  {
    id: 'tajweed-and-qiraat-masterclass',
    category: 'academic',
    date: 'August 19, 2026',
    readTime: '3 min read',
    image: '/assets/images/hero_bg2.webp',
    en: {
      title: 'Specialized Tajweed & Qira\'at Workshop Conducted for Senior Hifz Students',
      excerpt:
        'An intensive three-day masterclass on the nuances of Makharij, Sifat, and classic recitation styles was delivered by visiting international scholars to elevate students’ recitation precision.',
      quote:
        '“Reciting the Quran with proper Tajweed is an obligation and a sacred art that protects the divine word across generations.”',
      content: [
        'Senior students at the Institute attended an intensive 3-day practical training workshop on advanced Tajweed rulings, vocal articulation (Makharij al-Huruf), and classical melodious recitation (Tartil).',
        'Guest instructors conducted individual one-on-one assessments for each student, providing tailored corrections and certification of vocal mastery.',
        'IDI continues to prioritize not merely speed of memorization, but strict phonetic adherence and profound reverence for Quranic recitation.',
      ],
    },
    ta: {
      title: 'மூத்த ஹிஃப்ழ் மாணவர்களுக்கான சிறப்பு தஜ்வீத் மற்றும் கிராஅத் செயலமர்வு',
      excerpt:
        'சர்வதேச மார்க்க அறிஞர்களின் வழிகாட்டலில் மஃகாரிஜ்கள், சிஃபாத்துகள் மற்றும் தஜ்வீத் சட்டங்களின் நுணுக்கங்களை உள்ளடக்கிய 3 நாள் விசேட பயிற்சிப் பட்டறை வெற்றிகரமாக நடைபெற்றது.',
      quote:
        '“குர்ஆனை தஜ்வீதுடன் ஓதுவது கடமையாகும். அது இறை வார்த்தைகளை தூய்மையாக அடுத்த தலைமுறைக்குக் கடத்தும் புனிதக் கலையாகும்.”',
      content: [
        'தஃவா கலாபீடத்தின் சிரேஷ்ட ஹிஃப்ழ் மாணவர்களுக்கு உச்சரிப்பு முறை, எழுத்துக்களின் பண்புகள் மற்றும் தர்த்தீல் முறையிலான ஓதுதல் குறித்த 3 நாள் செய்முறைப் பயிற்சி வழங்கப்பட்டது.',
        'வருகை தந்த விசேட போதகர்கள் ஒவ்வொரு மாணவரையும் தனித்தனியாகக் கண்காணித்து ஒலிப்பு மற்றும் தஜ்வீத் நுணுக்கங்களை நெறிப்படுத்தினர்.',
        'மனனம் செய்வதன் வேகத்தை விட தஜ்வீதின் நேர்த்தியையும் பொருளுணர்ந்து ஓதும் ஆன்மீக உணர்வையும் வளர்ப்பதே கலாபீடத்தின் முக்கிய நோக்கமாகும்.',
      ],
    },
  },
  {
    id: 'smart-learning-resource-center',
    category: 'academic',
    date: 'July 10, 2026',
    readTime: '2 min read',
    image: '/assets/images/hero_bg3.webp',
    en: {
      title: 'Inauguration of the New Digital Quranic Library and Smart Resource Center',
      excerpt:
        'IDI officially opens its modernized digital resource lab equipped with audio stations, reference tafseer manuscripts, and educational tools to support student research and academic studies.',
      quote:
        '“Merging classical Islamic scholarship with modern digital resources enriches our students’ horizon.”',
      content: [
        'To facilitate a deeper appreciation of the Quran and its sciences, IDI has established a dedicated digital learning hub with access to world-renowned reciters, classic exegesis (Tafseer), and academic journals.',
        'Students can now listen to various Qira’at recordings in high-fidelity audio booths to refine their phonetic precision and intonation.',
        'The center also provides computer access for school study research, online examinations, and educational development.',
      ],
    },
    ta: {
      title: 'நவீன டிஜிட்டல் குர்ஆனிய நூலகம் மற்றும் வள நிலையம் திறந்துவைப்பு',
      excerpt:
        'மாணவர்களின் மார்க்க மற்றும் பொதுக்கல்வி ஆய்வுகளுக்கு உதவும் வகையில் நவீன கணினி வசதிகள், ஒலிப் பெட்டகங்கள் மற்றும் தப்ஸீர் குறிப்புகளுடன் கூடிய புதிய வள நிலையம் திறந்துவைக்கப்பட்டது.',
      quote:
        '“பாரம்பரிய இஸ்லாமியக் கல்வியோடு நவீன தொழில்நுட்ப வளங்களை இணைப்பது மாணவர்களின் அறிவுப் பார்வையை விசாலமாக்குகிறது.”',
      content: [
        'மாணவர்கள் குர்ஆனின் ஆழமான கருத்துக்களையும் தப்ஸீர்களையும் ஆராய்வதற்கு வசதியாக புதிய டிஜிட்டல் நூலகம் கலாபீட வளாகத்தில் ஆரம்பிக்கப்பட்டுள்ளது.',
        'உலகப் புகழ்பெற்ற காரீக்களின் ஓதுதல்களைக் கேட்டு தங்களது கிராஅத்தை மெருகூட்டக்கூடிய அதிநவீன ஒலி நிலையங்கள் இங்கு அமைக்கப்பட்டுள்ளன.',
        'அத்துடன் பாடசாலைக் கல்விக்கான இணையவழித் தேடல்கள் மற்றும் பரீட்சைப் பயிற்சிகளுக்கும் இந்த மையம் பெரும் உதவியாக அமையும்.',
      ],
    },
  },
  {
    id: 'alumni-reunion-and-career-guidance',
    category: 'community',
    date: 'June 04, 2026',
    readTime: '3 min read',
    image: '/assets/images/alumni_profile.webp',
    en: {
      title: 'Annual Alumni Gathering: Past Graduates Return to Mentor Current Students',
      excerpt:
        'Over 80 IDI alumni now serving as university lecturers, doctors, software engineers, and community leaders joined hands for the 2026 Alumni Symposium.',
      quote:
        '“The Quran was the beacon that guided my character and discipline through medical school and beyond.” — Dr. Rizwan (Alumnus)',
      content: [
        'The 2026 Alumni Symposium brought together past graduates from across Sri Lanka and abroad to reflect on their years at IDI and mentor current senior students.',
        'Panel discussions focused on navigating higher education, maintaining Quranic identity in professional careers, and launching community service initiatives.',
        'An Alumni Mentorship Fund was established to support scholarship grants for promising students from underprivileged backgrounds.',
      ],
    },
    ta: {
      title: 'பழைய மாணவர் மாநாடு: தற்போதைய மாணவர்களுக்கு வழிகாட்ட ஒன்றிணைந்த பட்டதாரிகள்',
      excerpt:
        'பல்கலைக்கழக விரிவுரையாளர்கள், மருத்துவர்கள், பொறியியலாளர்கள் மற்றும் மார்க்கப் பணியாளர்களாக விளங்கும் 80-க்கும் மேற்பட்ட பழைய மாணவர்கள் கலாபீடத்தில் ஒன்றுகூடினர்.',
      quote:
        '“எனது மருத்துவக் கல்லூரிப் படிப்பிலும் வாழ்விலும் சிறந்த ஒழுக்கத்தை எனக்குத் தந்தது இங்கு கற்ற குர்ஆனேயாகும்.” — டாக்டர் ரிஸ்வான் (பழைய மாணவர்)',
      content: [
        'இலங்கையிலும் வெளிநாடுகளிலும் பல்வேறு உயர் துறைகளில் பணியாற்றும் தஃவா கலாபீடத்தின் பழைய மாணவர்கள் 2026 ஆம் ஆண்டுக்கான மாநாட்டில் பங்குபற்றினர்.',
        'உயர்கல்வி வாய்ப்புகள், தொழில்சார் வாழ்விலும் குர்ஆனிய விழுமியங்களைப் பேணுதல் மற்றும் சமூகப் பணிகள் குறித்து தற்போதைய மாணவர்களோடு அனுபவங்களைப் பகிர்ந்துகொண்டனர்.',
        'பொருளாதார ரீதியாக பின்தங்கிய மாணவர்களின் கல்விக்கு உதவும் வகையில் பழைய மாணவர் புலமைப்பரிசில் நிதியமும் இதன்போது அங்குரார்ப்பணம் செய்து வைக்கப்பட்டது.',
      ],
    },
  },
  {
    id: 'community-quran-and-welfare-drive',
    category: 'community',
    date: 'May 15, 2026',
    readTime: '2 min read',
    image: '/assets/images/about_hero.webp',
    en: {
      title: 'Community Outreach: IDI Students Lead Ramadan Quran Distribution & Relief Drive',
      excerpt:
        'In the spirit of sharing the blessings of the Quran, students and faculty distributed over 500 copies of the Holy Quran and provided seasonal ration packs to vulnerable rural families.',
      quote:
        '“True learning of the Quran translates into compassionate action for the needy.”',
      content: [
        'As part of IDI’s holistic Tarbiyah philosophy, students participated in hands-on community service projects during the blessed month of Ramadan.',
        'Working in coordinated teams, students organized the distribution of high-quality Uthmani script Mus’hafs to local rural masajid and distributed food baskets to underprivileged families.',
        'These initiatives instill empathy, humility, and civic responsibility in future Islamic personalities.',
      ],
    },
    ta: {
      title: 'சமூக நற்பணி: புனித குர்ஆன் பிரதிகள் மற்றும் ரமழான் உலர் உணவுப் பொதிகள் விநியோகம்',
      excerpt:
        'கலாபீட மாணவர்கள் மற்றும் ஆசிரியர்களின் பங்களிப்புடன் 500-க்கும் மேற்பட்ட புனித குர்ஆன் பிரதிகளும் தேவையுடைய குடும்பங்களுக்கான உலர் உணவுப் பொதிகளும் வழங்கி வைக்கப்பட்டன.',
      quote:
        '“குர்ஆனைக் கற்பதன் உண்மையான வெளிப்பாடு எளிய மனிதர்களுக்கு உதவும் கருணையுள்ள செயல்களிலேயே தங்கியுள்ளது.”',
      content: [
        'மாணவர்களிடையே சமூகப் பொறுப்புணர்வையும் கருணையையும் வளர்க்கும் தர்பிய்யாத் திட்டத்தின் கீழ் ரமழான் மாதத்தில் இச்சேவை முன்னெடுக்கப்பட்டது.',
        'கிராமப்புற பள்ளிவாசல்களுக்கு புதிய உஸ்மானி குர்ஆன் பிரதிகள் கையளிக்கப்பட்டதுடன், வறிய குடும்பங்களுக்கு உணவுப் பொதிகளும் பகிர்ந்தளிக்கப்பட்டன.',
        'இத்தகைய நற்பணிகள் மூலம் எமது மாணவர்கள் சமூகத்தோடு பின்னிப்பிணைந்த முன்மாதிரி மனிதர்களாக வளர்வதற்கு வாய்ப்பு ஏற்படுகிறது.',
      ],
    },
  },
];

export default function NewsContent() {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  const categories = useMemo(() => [
    { id: 'all', label: isTamil ? 'அனைத்தும்' : 'All Updates', icon: 'fa-layer-group' },
    { id: 'admissions', label: isTamil ? 'சேர்க்கை' : 'Admissions', icon: 'fa-id-card' },
    { id: 'academic', label: isTamil ? 'கல்வி & ஹிஃப்ழ்' : 'Academic & Hifz', icon: 'fa-book-open' },
    { id: 'events', label: isTamil ? 'நிகழ்வுகள்' : 'Events', icon: 'fa-calendar-days' },
    { id: 'community', label: isTamil ? 'சமூக நலம்' : 'Community', icon: 'fa-hands-holding-child' },
  ], [isTamil]);

  const filteredNews = useMemo(() => {
    return NEWS_DATA.filter((item) => {
      const langContent = isTamil ? item.ta : item.en;
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        langContent.title.toLowerCase().includes(query) ||
        langContent.excerpt.toLowerCase().includes(query) ||
        item.date.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, isTamil]);

  const featuredArticle = useMemo(() => {
    return NEWS_DATA.find((item) => item.featured) || NEWS_DATA[0];
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="hero news-hero"
        style={{
          height: '55vh',
          minHeight: '480px',
          backgroundImage: "url('/assets/images/about_hero.webp')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          position: 'relative',
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter" style={{ position: 'relative', zIndex: 2 }}>
          <span className="subtitle" style={{ color: 'var(--accent-gold)', letterSpacing: '2px' }}>
            {isTamil ? 'அறிவிப்புகள் & செய்திகள்' : 'Latest News & Updates'}
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0.8rem 0 1rem' }}>
            {isTamil ? 'கலாபீட செய்தி மடல்' : 'News & Announcements'}
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.1rem', opacity: 0.95 }}>
            {isTamil
              ? 'தஃவா இஸ்லாமிய்யா கலாபீடத்தின் முக்கிய அறிவிப்புகள், மாணவர் சாதனைகள் மற்றும் கல்வி நிகழ்வுகள் பற்றிய தகவல்கள்.'
              : 'Stay up to date with the latest milestones, official admissions announcements, academic achievements, and community events at the Institute of Da\'wa Islamiyya.'}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section-container" style={{ paddingTop: '3.5rem', paddingBottom: '5rem' }}>
        
        {/* Featured Story Banner (Shown when no search/filtering is active) */}
        {activeCategory === 'all' && searchQuery.trim() === '' && featuredArticle && (
          <div className="news-featured-banner">
            <div className="featured-banner-badge">
              <i className="fa-solid fa-bullhorn"></i> {isTamil ? 'முக்கிய அறிவிப்பு' : 'Featured Announcement'}
            </div>
            <div className="featured-banner-grid">
              <div className="featured-banner-media">
                <img
                  src={featuredArticle.image}
                  alt={isTamil ? featuredArticle.ta.title : featuredArticle.en.title}
                  loading="lazy"
                />
                <span className="featured-category-pill">
                  {categories.find(c => c.id === featuredArticle.category)?.label || 'Announcement'}
                </span>
              </div>
              <div className="featured-banner-content">
                <div className="news-meta-row">
                  <span><i className="fa-regular fa-calendar"></i> {featuredArticle.date}</span>
                  <span><i className="fa-regular fa-clock"></i> {featuredArticle.readTime}</span>
                </div>
                <h2 className="featured-title">
                  {isTamil ? featuredArticle.ta.title : featuredArticle.en.title}
                </h2>
                <p className="featured-excerpt">
                  {isTamil ? featuredArticle.ta.excerpt : featuredArticle.en.excerpt}
                </p>
                <div style={{ marginTop: '1.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setSelectedArticle(featuredArticle)}
                  >
                    <span>{isTamil ? 'முழு விபரம் வாசிக்க' : 'Read Full Announcement'}</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="news-filter-bar">
          <div className="news-search-box">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTamil ? 'செய்திகளைத் தேடுங்கள்...' : 'Search news, announcements, events...'}
              aria-label="Search news"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          <div className="news-category-pills" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <i className={`fa-solid ${cat.icon}`}></i>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="news-results-info">
          <span>
            {isTamil
              ? `${filteredNews.length} செய்திகள் கண்டறியப்பட்டன`
              : `Showing ${filteredNews.length} ${filteredNews.length === 1 ? 'article' : 'articles'}`}
          </span>
          {(activeCategory !== 'all' || searchQuery.trim() !== '') && (
            <button
              type="button"
              className="reset-filter-btn"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            >
              <i className="fa-solid fa-rotate-left"></i> {isTamil ? 'வடிகட்டியை மீட்டமை' : 'Reset filters'}
            </button>
          )}
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="news-grid">
            {filteredNews.map((item) => {
              const content = isTamil ? item.ta : item.en;
              const catObj = categories.find((c) => c.id === item.category);

              return (
                <article key={item.id} className="news-card">
                  <div className="news-card-image-wrap">
                    <img src={item.image} alt={content.title} loading="lazy" />
                    <span className={`news-card-tag tag-${item.category}`}>
                      {catObj ? catObj.label : item.category}
                    </span>
                  </div>

                  <div className="news-card-body">
                    <div className="news-card-meta">
                      <span><i className="fa-regular fa-calendar"></i> {item.date}</span>
                      <span><i className="fa-regular fa-clock"></i> {item.readTime}</span>
                    </div>

                    <h3 className="news-card-title">
                      {content.title}
                    </h3>

                    <p className="news-card-excerpt">
                      {content.excerpt}
                    </p>

                    <div className="news-card-footer">
                      <button
                        type="button"
                        className="read-more-link"
                        onClick={() => setSelectedArticle(item)}
                      >
                        <span>{isTamil ? 'முழுமையாக வாசிக்க' : 'Read Story'}</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="news-empty-state">
            <div className="empty-icon-wrap">
              <i className="fa-solid fa-newspaper"></i>
            </div>
            <h3>{isTamil ? 'செய்திகள் எதுவும் காணப்படவில்லை' : 'No news found'}</h3>
            <p>
              {isTamil
                ? 'உங்கள் தேடலுக்கு ஏற்ற செய்திகள் எதுவும் இல்லை. வேறு வார்த்தைகளைப் பயன்படுத்தி முயற்சிக்கவும்.'
                : 'No articles matched your current search or category filter. Try refining your keywords.'}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            >
              {isTamil ? 'அனைத்து செய்திகளையும் பார்க்க' : 'View All News'}
            </button>
          </div>
        )}

        {/* Newsletter & Contact Callout Banner */}
        <div className="news-cta-card">
          <div className="news-cta-content">
            <span className="subtitle" style={{ color: 'var(--accent-gold)' }}>
              {isTamil ? 'தொடர்பில் இருங்கள்' : 'Stay Connected'}
            </span>
            <h2>
              {isTamil
                ? 'கலாபீடத்தின் அறிவிப்புகளைப் பெற விரும்புகிறீர்களா?'
                : 'Have questions about admissions or upcoming events?'}
            </h2>
            <p>
              {isTamil
                ? 'மாணவர் சேர்க்கை, பரீட்சை முடிவுகள் மற்றும் விசேட நிகழ்வுகள் பற்றிய தகவல்களைப் பெற எமது நிர்வாக அலுவலகத்தைத் தொடர்பு கொள்ளுங்கள்.'
                : 'Reach out to the Institute administration office for official inquiries, prospectus requests, or event participations.'}
            </p>
          </div>
          <div className="news-cta-actions">
            <Link href="/contact" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              <i className="fa-solid fa-envelope"></i> {isTamil ? 'தொடர்புகொள்ள' : 'Contact Office'}
            </Link>
            <Link href="/hifz" className="btn btn-outline" style={{ whiteSpace: 'nowrap' }}>
              <i className="fa-solid fa-book-quran"></i> {isTamil ? 'பாடத்திட்டம்' : 'Hifz Program'}
            </Link>
          </div>
        </div>

      </section>

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div
          className="article-modal-overlay"
          onClick={() => setSelectedArticle(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="article-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="article-modal-close"
              onClick={() => setSelectedArticle(null)}
              aria-label="Close article modal"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="article-modal-hero">
              <img
                src={selectedArticle.image}
                alt={isTamil ? selectedArticle.ta.title : selectedArticle.en.title}
              />
              <div className="article-modal-hero-badge">
                {categories.find((c) => c.id === selectedArticle.category)?.label || selectedArticle.category}
              </div>
            </div>

            <div className="article-modal-content">
              <div className="news-meta-row" style={{ marginBottom: '1rem' }}>
                <span><i className="fa-regular fa-calendar"></i> {selectedArticle.date}</span>
                <span><i className="fa-regular fa-clock"></i> {selectedArticle.readTime}</span>
                <span><i className="fa-solid fa-building-columns"></i> IDI Secretariat</span>
              </div>

              <h2 className="article-modal-title">
                {isTamil ? selectedArticle.ta.title : selectedArticle.en.title}
              </h2>

              {/* Blockquote if available */}
              {(isTamil ? selectedArticle.ta.quote : selectedArticle.en.quote) && (
                <blockquote className="article-modal-quote">
                  <i className="fa-solid fa-quote-left quote-icon"></i>
                  <p>{isTamil ? selectedArticle.ta.quote : selectedArticle.en.quote}</p>
                </blockquote>
              )}

              {/* Article Paragraphs */}
              <div className="article-modal-body">
                {(isTamil ? selectedArticle.ta.content : selectedArticle.en.content).map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Article Footer & Action */}
              <div className="article-modal-footer">
                <div className="article-share-note">
                  <i className="fa-solid fa-share-nodes"></i>{' '}
                  <span>{isTamil ? 'கலாபீட உத்தியோகபூர்வ அறிவிப்பு' : 'Official Institute Announcement'}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link
                    href="/contact"
                    className="btn btn-primary"
                    style={{ padding: '0.65rem 1.4rem', fontSize: '0.9rem' }}
                    onClick={() => setSelectedArticle(null)}
                  >
                    {isTamil ? 'விசாரிக்க' : 'Inquire Now'}
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '0.65rem 1.4rem', fontSize: '0.9rem' }}
                    onClick={() => setSelectedArticle(null)}
                  >
                    {isTamil ? 'மூடுக' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
