'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

interface Graduate {
  id: number;
  name: string;
  batch: string;
  currentStatus: string;
  image?: string;
}

export default function StudentsContent() {
  const { t, language, formatOrigin, formatGraduateName } = useLanguage();
  const isTamil = language === 'ta';

  const [alumniData, setAlumniData] = useState<Graduate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  // Fetch graduates from alumni.json
  useEffect(() => {
    fetch('/data/alumni.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch alumni data');
        return res.json();
      })
      .then((data: Graduate[]) => {
        setAlumniData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading graduates:', err);
        setLoading(false);
      });
  }, []);

  // Format Convocation Batch Label via i18n
  const getBatchLabel = (batch: string) => {
    const customLabel = t(`pages.students.graduates.batchLabels.${batch}`);
    if (customLabel && typeof customLabel === 'string') return customLabel;

    if (batch === 'Upcoming') {
      return isTamil ? 'பட்டமளிப்பிற்குத் தயாராகும் தொகுதி' : 'Ready for Convocation';
    }
    if (batch === 'Exam-New') {
      return isTamil ? 'பரீட்சைக்குத் தயாராகும் தொகுதி' : 'Preparing for Exam';
    }
    const convNumEn: Record<string, string> = {
      '1995': '1st',
      '1997': '2nd',
      '1998': '3rd',
      '1999': '4th',
      '2000': '5th',
      '2001': '6th',
      '2006': '7th',
      '2011': '8th',
      '2014': '9th',
      '2020': '10th',
    };
    const convNumTa: Record<string, string> = {
      '1995': '1வது',
      '1997': '2வது',
      '1998': '3வது',
      '1999': '4வது',
      '2000': '5வது',
      '2001': '6வது',
      '2006': '7வது',
      '2011': '8வது',
      '2014': '9வது',
      '2020': '10வது',
    };
    if (isTamil) {
      return `${convNumTa[batch] || batch} பட்டமளிப்பு (${batch})`;
    }
    return `${convNumEn[batch] || batch} Convocation (${batch})`;
  };

  // Distinct Batch Options with Counts
  const batchOptions = useMemo(() => {
    const definedOrder = [
      'all',
      '2020',
      '2014',
      '2011',
      '2006',
      '2001',
      '2000',
      '1999',
      '1998',
      '1997',
      '1995',
      'Upcoming',
      'Exam-New',
    ];

    const counts: Record<string, number> = { all: alumniData.length };
    alumniData.forEach((item) => {
      counts[item.batch] = (counts[item.batch] || 0) + 1;
    });

    return definedOrder
      .filter((batchKey) => batchKey === 'all' || counts[batchKey])
      .map((batchKey) => ({
        key: batchKey,
        label:
          batchKey === 'all'
            ? t('pages.students.graduates.filterAll', isTamil ? 'அனைத்துப் பட்டமளிப்புகளும்' : 'All Convocations')
            : getBatchLabel(batchKey),
        count: counts[batchKey] || 0,
      }));
  }, [alumniData, isTamil, t]);

  // Filtered Graduates based on Batch and Search Query
  const filteredGraduates = useMemo(() => {
    let result = alumniData;

    if (selectedBatch !== 'all') {
      result = result.filter((g) => g.batch === selectedBatch);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.name?.toLowerCase().includes(q) ||
          g.currentStatus?.toLowerCase().includes(q) ||
          g.batch?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [alumniData, selectedBatch, searchQuery]);

  const displayedGraduates = useMemo(() => {
    return filteredGraduates.slice(0, visibleCount);
  }, [filteredGraduates, visibleCount]);

  const normalizeImgSrc = (src?: string) => {
    if (!src) return '/assets/images/alumni_profile.webp';
    if (src.startsWith('http')) return src;
    return src.startsWith('/') ? src : '/' + src;
  };

  const handleBatchSelect = (batchKey: string) => {
    setSelectedBatch(batchKey);
    setVisibleCount(12);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(12);
  };

  // Pillars translated from i18n
  const rawPillars = t('pages.students.history.pillars');
  const pillars = useMemo(() => {
    const fallbackPillars = [
      {
        icon: 'fa-book-quran',
        title: isTamil ? 'குர்ஆன் மனனம் (ஹிஃப்ழ்)' : 'Hifz-ul-Quran',
        desc: isTamil
          ? 'தகுதியான தஜ்வீத் ஆசான்களின் வழிகாட்டலில் தினசரி புதிய சபக் மற்றும் தொடர் தௌர் பயிற்சிகள் மூலம் வாழ்நாள் முழுதும் குர்ஆனை நெஞ்சில் நிலைநிறுத்துதல்.'
          : 'Systematic daily memorization (Sabaq) and rigorous cyclic revision (Dour) supervised by qualified Tajweed experts to ensure lifetime retention.',
        colorClass: 'card-emerald',
        iconClass: 'card-icon-emerald',
      },
      {
        icon: 'fa-heart',
        title: isTamil ? 'தர்பியாவும் நற்பண்புகளும்' : 'Akhlaq & Tarbiyyah',
        desc: isTamil
          ? 'நபிகளாரின் முன்மாதிரியில் ஆன்மிகப் பணிவு (இக்லாஸ்), சுய ஒழுக்கம், சகோதரத்துவம் மற்றும் உயரிய இஸ்லாமிய ஒழுக்கங்களை மாணவர்களிடம் ஆழமாக விதைத்தல்.'
          : 'Nurturing sincere devotion (Ikhlas), spiritual humility, brotherly love, and exemplary Islamic etiquette based on the Prophetic character.',
        colorClass: 'card-gold',
        iconClass: 'card-icon-gold',
      },
      {
        icon: 'fa-graduation-cap',
        title: isTamil ? 'ஒருங்கிணைந்த பொதுக்கல்வி' : 'Academic Schooling',
        desc: isTamil
          ? 'ஹிஃப்ழுடன் தரம் 6 முதல் 11 (க.பொ.த சாதாரண தரம்) வரையிலான தேசிய பாடசாலைக் கல்வி மற்றும் அரபு மொழிப் புலமையை ஒருங்கிணைத்து வழங்குதல்.'
          : 'Comprehensive secondary school curriculum from Grade 6 to 11 (G.C.E. O/L) paired with Arabic language and modern literacy.',
        colorClass: 'card-emerald',
        iconClass: 'card-icon-emerald',
      },
      {
        icon: 'fa-earth-asia',
        title: isTamil ? 'சமூகத் தலைமைத்துவம்' : 'Community Leadership',
        desc: isTamil
          ? 'சமூகப் பொறுப்புணர்வுடன் தேசத்திற்கும் சமூகத்திற்கும் நற்பணி புரியக்கூடிய இமாம்கள், ஆசிரியர்கள், புத்திஜீவிகள் மற்றும் சிறந்த பிரஜைகளை உருவாக்குதல்.'
          : 'Instilling a deep sense of social responsibility, equipping graduates to serve with dignity as spiritual leaders, imams, and moral guides.',
        colorClass: 'card-gold',
        iconClass: 'card-icon-gold',
      },
    ];

    if (Array.isArray(rawPillars) && rawPillars.length === 4) {
      return rawPillars.map((p, idx) => ({
        icon: p.icon || fallbackPillars[idx].icon,
        title: p.title || fallbackPillars[idx].title,
        desc: p.desc || fallbackPillars[idx].desc,
        colorClass: idx % 2 === 0 ? 'card-emerald' : 'card-gold',
        iconClass: idx % 2 === 0 ? 'card-icon-emerald' : 'card-icon-gold',
      }));
    }
    return fallbackPillars;
  }, [rawPillars, isTamil]);

  // Milestones translated from i18n
  const rawMilestones = t('pages.students.history.milestones');
  const milestones = useMemo(() => {
    const fallbackMilestones = [
      {
        year: '1987 - 1995',
        badge: isTamil ? 'துவக்கம் & 1வது பட்டமளிப்பு' : 'Foundation & 1st Batch',
        title: isTamil ? 'நிறுவனத்தின் ஸ்தாபிதம்' : 'Foundation & 1st Convocation',
        desc: isTamil
          ? '1987 இல் தஃவா இஸ்லாமிய்யா கலாபீடம் முறைப்படி ஸ்தாபிக்கப்பட்டு புனித ஹிஃப்ழ் பணி ஆரம்பமானது. முதல் தொகுதி மாணவர்கள் குர்ஆனை முழுமையாக மனனம் செய்து 1995 இல் வரலாற்றுச் சிறப்புமிக்க 1வது பட்டமளிப்பில் பட்டம் பெற்றனர்.'
          : "The Institute of Da'wa Islamiyya was established in 1987. Following years of dedicated Quranic memorization, the pioneering batch of students successfully completed the memorization of the entire Holy Quran, celebrated at the historic 1st Convocation in 1995.",
      },
      {
        year: '1997 - 2001',
        badge: isTamil ? 'விரைவான வளர்ச்சி' : 'Rapid Growth',
        title: isTamil ? 'நிறுவனக் கட்டமைப்பு விரிவாக்கம்' : 'Institutional Expansion',
        desc: isTamil
          ? 'மாணவர் சேர்க்கையும் விடுதி வசதிகளும் விரைவாக விரிவுபடுத்தப்பட்டன. தொடர்ச்சியாக 2, 3, 4, 5, 6 ஆவது பட்டமளிப்புகள் மூலம் பல ஹாஃபிழ்கள் உருவாக்கப்பட்டு தேசத்திற்கு அர்ப்பணிக்கப்பட்டனர்.'
          : 'Rapid growth in student enrollment and boarding facilities. Successive convocations (2nd, 3rd, 4th, 5th, and 6th) graduated dozens of dedicated Huffaz, establishing IDI as a trusted center of Quranic learning.',
      },
      {
        year: '2006 - 2014',
        badge: isTamil ? 'பாடத்திட்ட வளர்ச்சி' : 'Curriculum Evolution',
        title: isTamil ? 'பாடசாலைக் கல்வியும் தஜ்வீத் மேன்மையும்' : 'Holistic Schooling & Tajweed Mastery',
        desc: isTamil
          ? 'க.பொ.த சாதாரண தரப் பாடசாலைக் கல்வி, நவீன நூலக வசதிகள், மேம்பட்ட தஜ்வீத் முறைகள் அறிமுகப்படுத்தப்பட்டு 7, 8, 9 ஆவது பட்டமளிப்பு விழாக்கள் நடந்தேறின.'
          : 'Formal introduction of the national school curriculum (Grade 6 to 11 O/L), enhanced library and residential facilities, and the celebration of the 7th, 8th, and 9th Convocations with high academic honors.',
      },
      {
        year: '2020',
        badge: isTamil ? 'வெள்ளி விழா' : 'Silver Jubilee',
        title: isTamil ? '10வது வரலாற்றுப் பட்டமளிப்பு விழா' : 'The Landmark 10th Convocation',
        desc: isTamil
          ? '25 ஆண்டுகால புனித சேவையின் வெள்ளி விழா மைல்கல்லை எட்டி, 10வது பட்டமளிப்பு விழா மூலம் அடுத்த தலைமுறை ஹாஃபிழ்களுக்கு பட்டங்கள் மற்றும் சனதுகள் வழங்கப்பட்டன.'
          : 'Commemorating 25 years of educational service with the grand 10th Convocation ceremony, honoring new Huffaz-ul-Quran and marking a quarter-century of divine blessing and community trust.',
      },
      {
        year: '2024 - 2026+',
        badge: isTamil ? 'எதிர்காலப் பார்வை' : 'Future Horizons',
        title: isTamil ? 'டிஜிட்டல் தளங்களும் புதிய தலைமுறைகளும்' : 'Digital Horizons & Future Batches',
        desc: isTamil
          ? 'நவீன கல்வித் தொழில்நுட்பங்கள், டிஜிட்டல் மாணவர் தளங்கள் மற்றும் அடுத்த பட்டமளிப்பிற்கு தயாராகி வரும் புதிய மாணவத் தொகுதிகளுடன் நிறுவனம் தொடர்ந்து பயணிக்கிறது.'
          : 'Embracing modern educational infrastructure, digital student portals, and preparing upcoming cohorts who are currently completing their final examinations and preparing for future convocations.',
      },
    ];

    if (Array.isArray(rawMilestones) && rawMilestones.length > 0) {
      return rawMilestones.map((m, idx) => ({
        year: m.year || fallbackMilestones[idx]?.year || '',
        badge: m.badge || fallbackMilestones[idx]?.badge || '',
        title: m.title || fallbackMilestones[idx]?.title || '',
        desc: m.desc || fallbackMilestones[idx]?.desc || '',
      }));
    }
    return fallbackMilestones;
  }, [rawMilestones, isTamil]);

  // Distinctions list translated from i18n
  const rawDistinctions = t('pages.students.history.distinctions');
  const distinctions = useMemo(() => {
    const fallbackDistinctions = isTamil
      ? [
          'முழுமையான கட்டணமில்லா கல்வி மற்றும் விடுதி',
          'க.பொ.த (O/L) பாடசாலைக் கல்வி ஒருங்கிணைப்பு',
          'தஜ்வீத் மற்றும் கிராஅத் சிறப்புப் பயிற்சி',
          'வாழ்நாள் முழுவதும் தொடரும் தௌர் கண்காணிப்பு',
        ]
      : [
          'Full Residential Accommodation & Welfare',
          'Integrated G.C.E. O/L Secondary Education',
          'Specialized Tajweed & Qira’at Mastery',
          'Lifelong Quranic Retention Network',
        ];

    return Array.isArray(rawDistinctions) && rawDistinctions.length > 0
      ? rawDistinctions
      : fallbackDistinctions;
  }, [rawDistinctions, isTamil]);

  // Testimonials / Reflections translated from i18n
  const rawReflections = t('pages.students.reflections.items');
  const reflections = useMemo(() => {
    const fallbackReflections = [
      {
        quote: isTamil
          ? 'அர்ப்பணிப்புமிக்க ஆசான்களின் அன்பான வழிகாட்டலில் குர்ஆனை மனனம் செய்தது எனது வாழ்க்கைக்கு ஆழமான தெளிவையும் நற்பண்புகளையும் தந்தது.'
          : 'Memorizing the Holy Quran at IDI under the patient guidance of our dedicated teachers gave me an unshakeable moral compass and a lifelong love for the Deen.',
        name: isTamil ? 'அல் ஹாபிள் சி.எம்.எஸ். முஹம்மத் பௌசான்' : 'Al Hafil Cms. Mohamed Fowsan',
        batch: isTamil ? '1வது பட்டமளிப்பு (1995)' : '1st Convocation (1995)',
        location: isTamil ? 'சம்மாந்துறை' : 'Sammanthurai',
      },
      {
        quote: isTamil
          ? 'ஆன்மிக ஹிஃப்ழ் பயிற்சியுடன் பாடசாலைக் கல்வியும் ஒருங்கிணைந்து கிடைத்தமை எங்களை மார்க்க ரீதியாகவும் உலக ரீதியாகவும் பிரகாசிக்கச் செய்தது.'
          : 'The unique integration of Hifz with school education gave us the confidence to excel both as Hafiz leaders and as academically accomplished individuals.',
        name: isTamil ? 'அல் ஹாபிள் எம்.ஏ. முஹம்மத் சல்ஸபீல்' : 'Al Hafil Ma. Mohamed Salsabil',
        batch: isTamil ? '2வது பட்டமளிப்பு (1997)' : '2nd Convocation (1997)',
        location: isTamil ? 'அட்டாளச்சேனை' : 'Addalaichenai',
      },
      {
        quote: isTamil
          ? 'தஃவா கலாபீடத்தின் சகோதரத்துவமும் ஒழுக்கமும் எப்போதும் மறக்க முடியாதவை. அது வெறும் கல்விக்கூடம் அல்ல; குர்ஆனை நேசிக்கும் ஒரு புனித குடும்பம்.'
          : 'The brotherhood, discipline, and spiritual atmosphere at IDI leave a mark that stays with you forever. It is more than an institution; it is a family of Quran.',
        name: isTamil ? 'அல் ஹாபிள் எம்.ஏ. முஹம்மத் சனாஸ்' : 'Al Hafil Ma. Mohamed Sanas',
        batch: isTamil ? '3வது பட்டமளிப்பு (1998)' : '3rd Convocation (1998)',
        location: isTamil ? 'சாய்ந்தமருது' : 'Sainthamaruthu',
      },
    ];

    if (Array.isArray(rawReflections) && rawReflections.length > 0) {
      return rawReflections.map((r, idx) => ({
        quote: r.quote || fallbackReflections[idx]?.quote || '',
        name: r.name || fallbackReflections[idx]?.name || '',
        batch: r.batch || fallbackReflections[idx]?.batch || '',
        location: r.location || fallbackReflections[idx]?.location || '',
      }));
    }
    return fallbackReflections;
  }, [rawReflections, isTamil]);

  return (
    <>
      {/* 1. Hero Section */}
      <section className="hero page-head">
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter">
          <span className="subtitle">
            {t('pages.students.hero.subtitle', isTamil ? 'எங்கள் வரலாற்றுப் பாரம்பரியம்' : 'Our Legacy & Milestones')}
          </span>
          <h1>
            {t('pages.students.hero.title', isTamil ? 'எங்கள் பயணம்' : 'Our Journey')}
          </h1>
          <p style={{ maxWidth: '780px', margin: '0 auto' }}>
            {t(
              'pages.students.hero.copy',
              isTamil
                ? 'அல்-குர்ஆனுக்கான ஏறத்தாழ நான்கு தசாப்த கால அர்ப்பணிப்பு — 1987 இல் எமது ஸ்தாபிதம் முதல் 87 இற்கும் மேற்பட்ட ஹாஃபிழ்களின் வரலாற்றுப் பட்டமளிப்பு வரை.'
                : 'Nearly four decades of unwavering devotion to the Holy Quran — from our founding in 1987 to raising over 87 certified Huffaz across generations.'
            )}
          </p>
          <div className="hero-btns" style={{ marginTop: '2.25rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#history" className="btn btn-primary">
              <i className="fa-solid fa-landmark" style={{ marginRight: '0.6rem' }}></i>
              {t('pages.students.hero.exploreHistory', isTamil ? 'வரலாற்றை அறிக' : 'Explore History')}
            </a>
            <a href="#graduates" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#ffffff' }}>
              <i className="fa-solid fa-graduation-cap" style={{ marginRight: '0.6rem' }}></i>
              {t('pages.students.hero.exploreGraduates', isTamil ? 'எங்கள் பட்டதாரிகள்' : 'Our Graduates')}
            </a>
          </div>
        </div>
      </section>

      {/* 2. Key Stats Summary Bar */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)', padding: '2.5rem 1.5rem' }}>
        <div className="section-container" style={{ padding: 0 }}>
          <div className="home-stat-grid" style={{ marginBottom: 0 }}>
            <div className="home-stat-box">
              <div className="home-stat-num" style={{ color: 'var(--accent-emerald)' }}>
                {t('pages.students.stats.years', '35+')}
              </div>
              <div className="home-stat-label">
                {t('pages.students.stats.yearsLabel', isTamil ? 'ஆண்டுகள் சிறப்பான பணி' : 'Years of Excellence')}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {t('pages.students.stats.yearsDesc', isTamil ? '1987 முதல் தொடரும் பணி' : 'Preserving the Quran since 1987')}
              </p>
            </div>

            <div className="home-stat-box">
              <div className="home-stat-num" style={{ color: 'var(--accent-gold)' }}>
                {t('pages.students.stats.graduates', '87+')}
              </div>
              <div className="home-stat-label">
                {t('pages.students.stats.graduatesLabel', isTamil ? 'ஹாஃபிழ் பட்டதாரிகள்' : 'Certified Huffaz')}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {t('pages.students.stats.graduatesDesc', isTamil ? 'குர்ஆனை நெஞ்சில் ஏந்தியவர்கள்' : 'Graduated Huffaz')}
              </p>
            </div>

            <div className="home-stat-box">
              <div className="home-stat-num" style={{ color: 'var(--accent-emerald)' }}>
                {t('pages.students.stats.convocations', '10')}
              </div>
              <div className="home-stat-label">
                {t('pages.students.stats.convocationsLabel', isTamil ? 'வரலாற்றுப் பட்டமளிப்புகள்' : 'Historic Convocations')}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {t('pages.students.stats.convocationsDesc', isTamil ? 'சிறப்பான பட்டமளிப்பு விழாக்கள்' : 'Milestone Ceremonies')}
              </p>
            </div>

            <div className="home-stat-box">
              <div className="home-stat-num" style={{ color: 'var(--accent-gold)' }}>
                {t('pages.students.stats.commitment', '100%')}
              </div>
              <div className="home-stat-label">
                {t('pages.students.stats.commitmentLabel', isTamil ? 'முழுமையான தர்பியா' : 'Dedicated Tarbiyyah')}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {t('pages.students.stats.commitmentDesc', isTamil ? 'ஒழுக்கம் & O/L கல்வி' : 'Hifz & Academic Schooling')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: HISTORY ("Hostory") */}
      <section id="history" className="section-container" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>
        <div className="section-title-wrapper" style={{ marginBottom: '3rem' }}>
          <span className="subtitle">
            {t('pages.students.history.subtitle', isTamil ? 'எங்கள் பாரம்பரியம்' : 'Our Heritage')}
          </span>
          <h2 className="section-title">
            {t('pages.students.history.title', isTamil ? 'தஃவா இஸ்லாமிய்யாவின் வரலாற்றுப் பயணம்' : 'The Historic Journey of IDI')}
          </h2>
          <p style={{ maxWidth: '820px', margin: '1rem auto 0', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {t(
              'pages.students.history.copy',
              isTamil
                ? '1987 ஆம் ஆண்டு ஸ்தாபிக்கப்பட்ட தஃவா இஸ்லாமிய்யா நிறுவனம், புனித அல்-குர்ஆனை மனனம் செய்து அதன் போதனைகளை வாழ்வில் பிரதிபலிக்கும் சிறந்த பண்புகளுடைய இளம் தலைமுறையை உருவாக்கும் உயரிய நோக்கோடு தனது பயணத்தைத் தொடங்கியது.'
                : "Established in 1987, the Institute of Da'wa Islamiyya was founded with a divine mission: to nurture a noble generation who memorize the Holy Quran, reflect its teachings in their character, and serve humanity with wisdom and upright leadership."
            )}
          </p>
        </div>

        {/* Narrative Box */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem',
            marginBottom: '4.5rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="responsive-grid" style={{ alignItems: 'center', gap: '2.5rem' }}>
            <div>
              <span className="timeline-badge-pill">
                {t('pages.students.history.foundationBadge', isTamil ? '1987 முதல்' : 'Since 1987')}
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--accent-emerald)', marginBottom: '1rem' }}>
                {t('pages.students.history.foundationTitle', isTamil ? 'புனித இலட்சியத்தில் உருவான நிறுவனம்' : 'Founded on Sacred Principles')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                {t(
                  'pages.students.history.foundationCopy1',
                  isTamil
                    ? '1987 ஆம் ஆண்டு, அர்ப்பணிப்புமிக்க இஸ்லாமிய மார்க்க அறிஞர்கள் மற்றும் சமூக ஆர்வலர்களால் பாரம்பரிய ஹிஃப்ழ் கல்வியுடன் சிறந்த நற்பண்புப் பயிற்சி (தர்பியா) மற்றும் முறையான பாடசாலைக் கல்வியை ஒருங்கிணைக்கும் நோக்கில் இந்நிறுவனம் உருவாக்கப்பட்டது.'
                    : 'In 1987, a group of dedicated Islamic scholars and community visionaries recognized the urgent need for an academy that combines traditional Quranic Hifz with disciplined character formation (Tarbiyyah) and recognized academic education.'
                )}
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {t(
                  'pages.students.history.foundationCopy2',
                  isTamil
                    ? 'கடந்த ஏறத்தாழ நான்கு தசாப்தங்களில், ஒரு சிறிய கல்விக்கூடமாக ஆரம்பிக்கப்பட்ட இந்நிறுவனம் இன்று நாட்டின் தலைசிறந்த குர்ஆனிய கலாபீடமாக மலர்ந்து, உலகெங்கும் சமூகத்திற்குப் பணியாற்றும் பல தலைமுறை ஹாஃபிழ்களை உருவாக்கியுள்ளது.'
                    : 'Over nearly four decades, what began as a humble sanctuary of learning has flourished into a premier center of Islamic excellence, producing generations of Huffaz who serve as Imams, teachers, professionals, and beacons of righteousness across Sri Lanka and abroad.'
                )}
              </p>
            </div>

            <div
              style={{
                background: '#ffffff',
                padding: '2rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)', marginBottom: '1.25rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <i className="fa-solid fa-star-and-crescent"></i>
                {t('pages.students.history.distinctionsTitle', isTamil ? 'முக்கிய சிறப்பம்சங்கள்' : 'Core Distinctions')}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {distinctions.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: idx === distinctions.length - 1 ? 0 : '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    <i className="fa-solid fa-circle-check" style={{ color: 'var(--accent-emerald)' }}></i>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* The 4 Pillars of the Journey */}
        <div className="section-title-wrapper" style={{ marginBottom: '3rem' }}>
          <span className="subtitle" style={{ color: 'var(--accent-gold)' }}>
            {t('pages.students.history.pillarsSubtitle', isTamil ? 'அடிப்படைத் தூண்கள்' : 'The Core Pillars')}
          </span>
          <h3 className="section-title" style={{ fontSize: '2rem' }}>
            {t('pages.students.history.pillarsTitle', isTamil ? 'எங்கள் பயணத்தின் நான்கு முக்கிய தூண்கள்' : 'The Four Pillars of Our Journey')}
          </h3>
        </div>

        <div className="grid-container" style={{ gap: '2rem', marginBottom: '5rem' }}>
          {pillars.map((pillar, idx) => (
            <div key={idx} className={`about-feature-card ${pillar.colorClass}`} style={{ textAlign: 'left', padding: '2.5rem 2rem' }}>
              <div className={`card-icon ${pillar.iconClass}`} style={{ marginBottom: '1.5rem' }}>
                <i className={`fa-solid ${pillar.icon}`}></i>
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                {pillar.title}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, margin: 0 }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Milestones Timeline */}
        <div className="section-title-wrapper" style={{ marginBottom: '3.5rem' }}>
          <span className="subtitle">
            {t('pages.students.history.milestonesSubtitle', isTamil ? 'வளர்ச்சியின் வரலாறு' : 'Decades of Growth')}
          </span>
          <h3 className="section-title" style={{ fontSize: '2rem' }}>
            {t('pages.students.history.milestonesTitle', isTamil ? 'தசாப்தங்கள் கடந்த முக்கிய மைல்கற்கள்' : 'Milestones Across the Decades')}
          </h3>
        </div>

        <div className="timeline-wrapper active" style={{ maxWidth: '950px' }}>
          {milestones.map((item, idx) => (
            <div key={idx} className="timeline-item">
              <div className="time-label" style={{ color: 'var(--accent-gold)' }}>
                {item.year}
              </div>
              <div className="timeline-dot" style={{ borderColor: 'var(--accent-emerald)' }}></div>
              <div className="timeline-content">
                <span className="timeline-badge-pill">{item.badge}</span>
                <h3 style={{ color: 'var(--accent-emerald)' }}>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Section: OUR GRADUATES ("OUR GRADUATES") */}
      <section
        id="graduates"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)',
          paddingTop: '5.5rem',
          paddingBottom: '5.5rem',
        }}
      >
        <div className="section-container" style={{ padding: 0 }}>
          <div className="section-title-wrapper">
            <span className="subtitle" style={{ color: 'var(--accent-emerald)' }}>
              {t('pages.students.graduates.subtitle', isTamil ? 'எங்கள் பெருமை' : 'Our Pride & Legacy')}
            </span>
            <h2 className="section-title">
              {t('pages.students.graduates.title', isTamil ? 'எங்கள் பட்டதாரிகள்' : 'Our Graduates')}
            </h2>
            <p style={{ maxWidth: '780px', margin: '1rem auto 0', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {t(
                'pages.students.graduates.copy',
                isTamil
                  ? 'தஃவா இஸ்லாமிய்யாவில் தமது புனிதப் பயணத்தை நிறைவுசெய்து, உலகெங்கும் குர்ஆனின் ஒளியைப் பரப்பும் 87 இற்கும் மேற்பட்ட ஹாஃபிழ் பட்டதாரிகள்.'
                  : 'Honoring 87+ certified Huffaz-ul-Quran who journeyed through our academy and carry the luminous message of the Quran into the world.'
              )}
            </p>
          </div>

          {/* Interactive Search Box */}
          <div className="journey-search-container">
            <i className="fa-solid fa-magnifying-glass journey-search-icon"></i>
            <input
              type="text"
              className="journey-search-input"
              placeholder={t(
                'pages.students.graduates.searchPlaceholder',
                isTamil ? 'பெயர், ஊர் அல்லது பட்டமளிப்பு மூலம் தேடுங்கள்...' : 'Search graduate by name, town, or batch...'
              )}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                type="button"
                className="journey-clear-search"
                onClick={() => setSearchQuery('')}
                title="Clear Search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Convocation / Batch Filter Pills */}
          <div className="journey-filters-scroll">
            {batchOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`journey-filter-pill ${selectedBatch === opt.key ? 'active' : ''}`}
                onClick={() => handleBatchSelect(opt.key)}
              >
                <span>{opt.label}</span>
                <span className="pill-count">{opt.count}</span>
              </button>
            ))}
          </div>

          {/* Results Summary Counter */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
              padding: '0 0.5rem',
            }}
          >
            <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              {t('pages.students.graduates.showing', isTamil ? 'காட்டப்படுகிறது' : 'Showing')}{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{displayedGraduates.length}</strong>{' '}
              {t('pages.students.graduates.of', isTamil ? 'மொத்தம்' : 'of')}{' '}
              <strong style={{ color: 'var(--accent-emerald)' }}>{filteredGraduates.length}</strong>{' '}
              {t('pages.students.graduates.graduatesText', isTamil ? 'பட்டதாரிகள்' : 'Graduates')}
            </div>

            {(selectedBatch !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedBatch('all');
                  setSearchQuery('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-gold)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                <i className="fa-solid fa-rotate-left" style={{ marginRight: '0.4rem' }}></i>
                {t('pages.students.graduates.resetBtn', isTamil ? 'அனைவரையும் காட்டுக' : 'Show All Graduates')}
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--accent-emerald)' }}>
              <i className="fa-solid fa-circle-notch fa-spin fa-2x" style={{ marginBottom: '1rem' }}></i>
              <p style={{ fontWeight: 600 }}>{isTamil ? 'பட்டதாரிகள் விபரம் ஏற்றப்படுகிறது...' : 'Loading Graduates...'}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredGraduates.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                maxWidth: '600px',
                margin: '2rem auto',
              }}
            >
              <i className="fa-solid fa-user-slash" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                {t('pages.students.graduates.emptyTitle', isTamil ? 'பட்டதாரிகள் கிடைக்கவில்லை' : 'No Graduates Found')}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {t(
                  'pages.students.graduates.emptyCopy',
                  isTamil
                    ? 'உங்கள் தேடலுக்குரிய பட்டதாரிகள் கிடைக்கவில்லை. தயவுசெய்து வேறு பெயரை அல்லது பட்டமளிப்பை தேர்வு செய்யவும்.'
                    : 'No graduates matched your search query. Try resetting filters or using a different name or town.'
                )}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSelectedBatch('all');
                  setSearchQuery('');
                }}
              >
                {t('pages.students.graduates.resetBtn', isTamil ? 'அனைவரையும் காட்டுக' : 'Show All Graduates')}
              </button>
            </div>
          )}

          {/* Graduates Grid */}
          {!loading && displayedGraduates.length > 0 && (
            <div className="grid-container" id="alumni-grid">
              {displayedGraduates.map((graduate) => (
                <div key={graduate.id} className="alumni-card">
                  <div className="alumni-order-badge">#{graduate.id}</div>
                  <div className="alumni-img-wrapper">
                    <img
                      src={normalizeImgSrc(graduate.image)}
                      alt={graduate.name}
                      className="alumni-img"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/alumni_profile.webp';
                      }}
                    />
                  </div>
                  <div>
                    <span className="alumni-batch">{getBatchLabel(graduate.batch)}</span>
                  </div>
                  <h3 className="alumni-name">{formatGraduateName(graduate.name)}</h3>
                  <p className="alumni-status">
                    <i className="fa-solid fa-location-dot" style={{ marginRight: '0.4rem', color: 'var(--accent-emerald)' }}></i>
                    {formatOrigin(graduate.currentStatus)}
                  </p>
                  <div>
                    <span className="alumni-hafiz-tag">
                      <i className="fa-solid fa-certificate"></i>
                      {t('pages.students.graduates.hafizStatus', isTamil ? 'ஹாஃபிழுல் குர்ஆன்' : 'Hafiz-ul-Quran')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {!loading && filteredGraduates.length > visibleCount && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button
                type="button"
                className="journey-load-more-btn"
                onClick={() => setVisibleCount((prev) => prev + 12)}
              >
                <i className="fa-solid fa-arrow-down"></i>
                {t('pages.students.graduates.loadMore', isTamil ? 'மேலும் பட்டதாரிகளைக் காட்டுக' : 'Load More Graduates')}{' '}
                ({filteredGraduates.length - visibleCount} {t('pages.students.graduates.remaining', isTamil ? 'மீதமுள்ளது' : 'remaining')})
              </button>
            </div>
          )}

          {/* Banner: Explore Full Alumni Portal */}
          <div
            style={{
              marginTop: '4.5rem',
              background: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <span className="subtitle" style={{ color: 'var(--accent-gold)' }}>
                {t('pages.students.graduates.portalSubtitle', isTamil ? 'முழுமையான தரவுத்தளம்' : 'Comprehensive Network')}
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                {t('pages.students.graduates.portalTitle', isTamil ? 'பழைய மாணவர் பிரத்தியேக தளம்' : 'Looking for the Dedicated Alumni Directory?')}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.4rem' }}>
                {t(
                  'pages.students.graduates.portalCopy',
                  isTamil
                    ? 'எமது பட்டதாரிகள் மற்றும் பழைய மாணவர்களின் முழுமையான விபரங்களையும் அவர்களின் பணிகளையும் விரிவாக பார்வையிடுங்கள்.'
                    : 'Explore the full alumni portal to browse convocations, verify certificates, and stay connected with our graduated Huffaz.'
                )}
              </p>
            </div>
            <Link href="/alumni" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              <i className="fa-solid fa-users" style={{ marginRight: '0.6rem' }}></i>
              {t('pages.students.graduates.viewFullAlumni', isTamil ? 'முழுமையான பழைய மாணவர் தளம்' : 'Explore Full Alumni Portal')}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Section: Reflections of the Journey (Alumni Voices) */}
      <section className="section-container" style={{ paddingTop: '5.5rem', paddingBottom: '5.5rem' }}>
        <div className="section-title-wrapper" style={{ marginBottom: '3.5rem' }}>
          <span className="subtitle" style={{ color: 'var(--accent-gold)' }}>
            {t('pages.students.reflections.subtitle', isTamil ? 'பட்டதாரிகளின் குரல்' : 'Alumni Voices')}
          </span>
          <h2 className="section-title">
            {t('pages.students.reflections.title', isTamil ? 'பயணத்தின் அனுபவங்கள்' : 'Reflections on the Journey')}
          </h2>
          <p style={{ maxWidth: '750px', margin: '1rem auto 0', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            {t(
              'pages.students.reflections.copy',
              isTamil
                ? 'தஃவா இஸ்லாமிய்யாவில் கழித்த ஆன்மிக நாட்களும் சகோதரத்துவமும் தங்கள் வாழ்க்கையை எவ்வாறு மாற்றியது என்பது பற்றி பட்டதாரிகள் பகிரும் கருத்துக்கள்.'
                : 'Hear from our graduates whose lives were shaped by their years of devotion, brotherhood, and Quranic study at IDI.'
            )}
          </p>
        </div>

        <div className="grid-container" style={{ gap: '2rem' }}>
          {reflections.map((ref, idx) => (
            <div key={idx} className="journey-reflection-card">
              <i className="fa-solid fa-quote-left journey-quote-icon"></i>
              <p className="journey-quote-text">"{ref.quote}"</p>
              <div className="journey-quote-author">
                <div className="journey-quote-name">{ref.name}</div>
                <div className="journey-quote-batch">{ref.batch}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  <i className="fa-solid fa-location-dot" style={{ marginRight: '0.3rem', fontSize: '0.75rem' }}></i>
                  {ref.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Section: Call To Action */}
      <section
        style={{
          background: 'linear-gradient(135deg, #004d30 0%, #006d44 50%, #004d30 100%)',
          color: '#ffffff',
          padding: '5rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span
            style={{
              display: 'inline-block',
              color: 'var(--accent-gold-light)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 700,
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {t('pages.students.cta.badge', isTamil ? 'புனிதப் பயணம்' : 'Embark on the Journey')}
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              color: '#ffffff',
              marginBottom: '1.25rem',
              lineHeight: 1.3,
            }}
          >
            {t('pages.students.cta.title', isTamil ? 'உங்கள் ஆன்மிகப் பயணத்தைத் தொடங்குங்கள்' : 'Begin Your Spiritual Journey')}
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
              maxWidth: '700px',
              margin: '0 auto 2.5rem',
            }}
          >
            {t(
              'pages.students.cta.copy',
              isTamil
                ? 'முப்பது ஆண்டுகால குர்ஆனிய பாரம்பரியத்தில் இணையுங்கள். புனித குர்ஆனை நெஞ்சில் சுமக்க விரும்பும் இளம் மாணவர்களை நாம் அன்புடன் வரவேற்கிறோம்.'
                : 'Be part of a thirty-year legacy of Quranic excellence, noble character, and academic achievement. We welcome aspiring students who desire to memorize the Book of Allah.'
            )}
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-primary" style={{ background: 'var(--accent-gold)', borderColor: 'var(--accent-gold)', color: '#ffffff' }}>
              <i className="fa-solid fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
              {t('pages.students.cta.primaryBtn', isTamil ? 'சேர்க்கை தொடர்புக்கு' : 'Contact Admissions')}
            </Link>
            <Link href="/hifz" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.8)', color: '#ffffff' }}>
              <i className="fa-solid fa-book-open" style={{ marginRight: '0.5rem' }}></i>
              {t('pages.students.cta.secondaryBtn', isTamil ? 'ஹிஃப்ழ் பாடத்திட்டம்' : 'Explore Hifz Curriculum')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
