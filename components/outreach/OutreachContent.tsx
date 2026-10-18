'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

type TabId =
  | 'all'
  | 'school-studies'
  | 'special-classes'
  | 'coaching-seminars'
  | 'hijaza-training'
  | 'personality-development'
  | 'thrabiya-programme';

interface Pillar {
  icon: string;
  title: string;
  copy: string;
}

interface ProgramData {
  id: TabId;
  themeClass: string;
  badgeClass: string;
  headerIcon: string;
  badge: string;
  title: string;
  subtitle: string;
  copy: string;
  pillars: Pillar[];
  highlights: string[];
  target: string;
  schedule: string;
  mentors: string;
  chips?: string[];
}

export default function OutreachContent() {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // 6 Core Outreach Programs Data
  const programs: ProgramData[] = [
    {
      id: 'school-studies',
      themeClass: 'card-school',
      badgeClass: 'badge-school',
      headerIcon: 'fa-solid fa-graduation-cap',
      badge: t(
        'pages.outreach.programs.schoolStudies.badge',
        isTamil ? 'அரசுக் கல்வித் திட்டம் • தேசிய பாடத்திட்டம்' : 'Academic Foundation • National Syllabus'
      ),
      title: t(
        'pages.outreach.programs.schoolStudies.title',
        isTamil ? 'பாடசாலைக் கல்வி (School Studies)' : 'School Studies'
      ),
      subtitle: t(
        'pages.outreach.programs.schoolStudies.subtitle',
        isTamil
          ? 'ஹிஃப்ழுடன் இணைந்த இடைநிலைப் பாடசாலைக் கல்வி (தரம் 6 முதல் 11 O/L)'
          : 'Secondary School Education (Grades 6–11 O/L) Alongside Hifz'
      ),
      copy: t(
        'pages.outreach.programs.schoolStudies.copy',
        isTamil
          ? 'ஆன்மீக ஒளியையும் நவீன பொதுக்கல்வி ஆற்றலையும் சமநிலையில் பேணி, தரம் 6 முதல் க.பொ.த சாதாரண தரம் (O/L) வரையிலான அரச பாடத்திட்டக் கல்வியை தஃவா கலாபீடம் வழங்குகிறது. தகுதிவாய்ந்த பாட ஆசிரியர்களின் வழிகாட்டலில், மாணவர்கள் தமது ஹிஃப்ழ் பயணத்திற்கு எவ்வித பாதிப்புமின்றி சிறந்த பரீட்சைப் பேறுகளை அடைகின்றனர்.'
          : 'Balancing spiritual devotion with modern academic excellence, IDI provides structured, government-recognized schooling for students from Grade 6 up to the G.C.E. Ordinary Level (O/L) examination. Guided by qualified educators, students master core sciences and humanities in dedicated daytime blocks without compromising their Quranic studies.'
      ),
      pillars: [
        {
          icon: 'fa-solid fa-square-root-variable',
          title: t('pages.outreach.programs.schoolStudies.pillars.0.title', isTamil ? 'கணித & விஞ்ஞான ஆய்வு' : 'STEM & Analytical Science'),
          copy: t(
            'pages.outreach.programs.schoolStudies.pillars.0.copy',
            isTamil
              ? 'ஆய்வுகூடப் பயிற்சிகள், பகுப்பாய்வுச் சிந்தனை மற்றும் விஞ்ஞானக் கோட்பாடுகளைத் துல்லியமாகக் கற்றல்.'
              : 'Hands-on laboratories, mathematical reasoning, and scientific inquiry to cultivate critical analysis.'
          ),
        },
        {
          icon: 'fa-solid fa-language',
          title: t('pages.outreach.programs.schoolStudies.pillars.1.title', isTamil ? 'மும்மொழித் தேர்ச்சி' : 'Trilingual Mastery'),
          copy: t(
            'pages.outreach.programs.schoolStudies.pillars.1.copy',
            isTamil
              ? 'ஆங்கிலம், தமிழ் மற்றும் அரபு ஆகிய மும்மொழிகளிலும் சரளமாக வாசிக்கும் எழுதும் ஆற்றல்.'
              : 'Strong linguistic foundation across English, Tamil, and Arabic for modern academic fluency.'
          ),
        },
        {
          icon: 'fa-solid fa-laptop-code',
          title: t('pages.outreach.programs.schoolStudies.pillars.2.title', isTamil ? 'ICT கணினி ஆய்வுகூடம்' : 'ICT & Digital Literacy'),
          copy: t(
            'pages.outreach.programs.schoolStudies.pillars.2.copy',
            isTamil
              ? 'நடைமுறைக் கணினிப் பயன்பாடு, தகவல் தொடர்பாடல் மற்றும் நவீன டிஜிட்டல் தளப் பயிற்சிகள்.'
              : 'Computer education, productivity tools, and digital competency in our dedicated tech lab.'
          ),
        },
        {
          icon: 'fa-solid fa-chart-line',
          title: t('pages.outreach.programs.schoolStudies.pillars.3.title', isTamil ? 'தொடர் மதிப்பீட்டு முறைமை' : 'Continuous Assessment'),
          copy: t(
            'pages.outreach.programs.schoolStudies.pillars.3.copy',
            isTamil
              ? 'ஒவ்வொரு மாணவரினதும் கல்வி அடைவுமட்டத்தை நாளாந்தம் பின்தொடர்ந்து தனிப்பயிற்சி அளித்தல்.'
              : 'Regular unit evaluations and personal academic tracking to ensure every student succeeds.'
          ),
        },
      ],
      highlights: [
        t(
          'pages.outreach.programs.schoolStudies.highlights.0',
          isTamil
            ? 'முழுமையான தேசிய பாடத்திட்டம்: கணிதம், விஞ்ஞானம், ஆங்கிலம், தமிழ், வரலாறு, ICT, புவியியல், வணிகக் கல்வி'
            : 'Complete national curriculum coverage: Mathematics, Science, English, Tamil, History, ICT, Geography, and Commerce'
        ),
        t(
          'pages.outreach.programs.schoolStudies.highlights.1',
          isTamil
            ? 'ஹிஃப்ழ் நேரங்களுக்கு இசைவாக திட்டமிடப்பட்ட பகல்நேர வகுப்பறைப் பாடங்கள்'
            : 'Structured daytime academic classes scheduled in harmony with Hifz sessions'
        ),
        t(
          'pages.outreach.programs.schoolStudies.highlights.2',
          isTamil
            ? 'தவணைப் பரீட்சை ஒத்திகைகள், அலகுப் பரிசோதனைகள் மற்றும் தீவிர கடந்தகால வினாத்தாள் செயலமர்வுகள்'
            : 'Term-test mock examinations, unit reviews, and intensive past-paper workshops'
        ),
        t(
          'pages.outreach.programs.schoolStudies.highlights.3',
          isTamil
            ? '100% பரீட்சை சித்தி சாதனை — உயர்தரம் (A/L) மற்றும் பல்கலைக்கழகக் கல்விக்கான உறுதியான அடித்தளம்'
            : 'Proven 100% pass track record enabling seamless transition to Advanced Level (A/L) and university streams'
        ),
      ],
      target: t('pages.outreach.programs.schoolStudies.target', isTamil ? 'தரம் 6 முதல் 11 வரை (சா/த மாணவர்கள்)' : 'Grades 6 to 11 (O/L Candidates)'),
      schedule: t('pages.outreach.programs.schoolStudies.schedule', isTamil ? 'திங்கள் முதல் வெள்ளி வரை (காலை & பகல்)' : 'Monday to Friday (Morning & Midday Blocks)'),
      mentors: t('pages.outreach.programs.schoolStudies.mentors', isTamil ? 'அரசு தகைமை பெற்ற பட்டதாரி ஆசிரியர்கள்' : 'Certified Secondary School Subject Teachers'),
      chips: isTamil
        ? ['கணிதம்', 'விஞ்ஞானம்', 'ஆங்கிலம்', 'தமிழ்', 'இஸ்லாம்', 'வரலாறு', 'ICT கணினி', 'வணிகக் கல்வி']
        : ['Mathematics', 'Science', 'English', 'Tamil', 'Islam', 'History', 'ICT & Tech', 'Commerce'],
    },
    {
      id: 'special-classes',
      themeClass: 'card-special',
      badgeClass: 'badge-special',
      headerIcon: 'fa-solid fa-chalkboard-user',
      badge: t(
        'pages.outreach.programs.specialClasses.badge',
        isTamil ? 'துரிதக் கற்றல் • தனிநபர் மீட்டல்' : 'Accelerated Learning • Remedial Tutoring'
      ),
      title: t(
        'pages.outreach.programs.specialClasses.title',
        isTamil ? 'விசேட வகுப்புகள் (Special Classes)' : 'Special Classes'
      ),
      subtitle: t(
        'pages.outreach.programs.specialClasses.subtitle',
        isTamil
          ? 'விசேட பாட வழிகாட்டல், அரபு மொழிப் பிரயோகம் & மீட்டல் பயிற்சிகள்'
          : 'Targeted Subject Mastery, Arabic Language & Remedial Guidance'
      ),
      copy: t(
        'pages.outreach.programs.specialClasses.copy',
        isTamil
          ? 'ஒவ்வொரு மாணவரும் தனித்துவமான கற்கும் வேகத்தைக் கொண்டவர்கள். எமது விசேட வகுப்புகள் கடினமான பாடங்களுக்கான தனிப்பயிற்சிகள், அரபு மொழிப் பிரயோகப் பட்டறைகள் மற்றும் பின்தங்கிய மாணவர்களுக்கான மீட்டல் வழிகாட்டல்களை வழங்கி, அனைத்து மாணவர்களையும் சாதனையாளர்களாக மாற்றுகின்றன.'
          : 'Recognizing that every learner possesses unique capabilities, our Special Classes provide small-cohort tutorials, remedial clinics for challenging subjects, and conversational Arabic immersion. This ensures no student is left behind and high achievers are propelled to greater heights.'
      ),
      pillars: [
        {
          icon: 'fa-solid fa-comments',
          title: t('pages.outreach.programs.specialClasses.pillars.0.title', isTamil ? 'அரபு உரையாடற் பயிற்சி' : 'Spoken Arabic Immersion'),
          copy: t(
            'pages.outreach.programs.specialClasses.pillars.0.copy',
            isTamil
              ? 'குர்ஆனையும் ஹதீஸையும் நேரடியாகப் புரிந்து பேசக்கூடிய சொல்வளமும் இலக்கணப் பயிற்சியும்.'
              : 'Active conversational circles and classical syntax (Nahw & Sarf) to comprehend the Quran directly.'
          ),
        },
        {
          icon: 'fa-solid fa-calculator',
          title: t('pages.outreach.programs.specialClasses.pillars.1.title', isTamil ? 'கணித அடிப்படை பயிற்சிகள்' : 'Mathematics Booster Clinics'),
          copy: t(
            'pages.outreach.programs.specialClasses.pillars.1.copy',
            isTamil
              ? 'கணித சூத்திரங்களை எளிமையாக்கும் பயிற்சிகள் மற்றும் வினாத்தாள் அணுகுமுறை உத்திகள்.'
              : 'Step-by-step problem-solving drills that simplify complex topics and build numeracy confidence.'
          ),
        },
        {
          icon: 'fa-solid fa-pen-fancy',
          title: t('pages.outreach.programs.specialClasses.pillars.2.title', isTamil ? 'ஆங்கில மொழி வளர்ப்பு' : 'English Language Skills'),
          copy: t(
            'pages.outreach.programs.specialClasses.pillars.2.copy',
            isTamil
              ? 'இலக்கண உறுதி, வாசிப்புப் பழக்கம், கட்டுரை வரைதல் மற்றும் ஆங்கிலத்தில் பேசும் தன்னம்பிக்கை.'
              : 'Grammar reinforcement, vocabulary building, essay writing, and verbal expression.'
          ),
        },
        {
          icon: 'fa-solid fa-user-check',
          title: t('pages.outreach.programs.specialClasses.pillars.3.title', isTamil ? '1-on-1 பிரத்தியேக வழிகாட்டல்' : '1-on-1 Remedial Mentoring'),
          copy: t(
            'pages.outreach.programs.specialClasses.pillars.3.copy',
            isTamil
              ? 'பாடங்களில் சிரமங்களை எதிர்கொள்ளும் மாணவர்களுக்கு தனிப்பட்ட ஆசிரியர் ஆலோசனை.'
              : 'Individual diagnostic support for students needing extra time and personalized pedagogical assistance.'
          ),
        },
      ],
      highlights: [
        t(
          'pages.outreach.programs.specialClasses.highlights.0',
          isTamil
            ? 'அரபு மொழி உரையாடல் மற்றும் குர்ஆனிய இலக்கணப் பயிற்சிகள் (நஹ்வு & சர்ஃப்)'
            : 'Intensive Spoken & Classical Arabic (Lughat-ul-Quran) vocabulary and grammar clinics'
        ),
        t(
          'pages.outreach.programs.specialClasses.highlights.1',
          isTamil
            ? 'கணிதம், விஞ்ஞானம் மற்றும் ஆங்கிலப் பாடங்களுக்கான பிரத்தியேக மீளாய்வு வகுப்புகள்'
            : 'Targeted remedial tutoring in Mathematics, Science, and English for conceptual clarity'
        ),
        t(
          'pages.outreach.programs.specialClasses.highlights.2',
          isTamil
            ? 'குறைந்த எண்ணிக்கையிலான மாணவர் குழுக்களுடன் தனிநபர் கவனம் செலுத்துதல்'
            : 'Small group sizes ensuring individualized attention and customized pacing'
        ),
        t(
          'pages.outreach.programs.specialClasses.highlights.3',
          isTamil
            ? 'மாலை மற்றும் வார இறுதி விசேட கல்வி வழிகாட்டல் அமர்வுகள்'
            : 'Evening and weekend booster sessions supervised by dedicated academic mentors'
        ),
      ],
      target: t('pages.outreach.programs.specialClasses.target', isTamil ? 'மேலதிக வழிகாட்டல் தேவைப்படும் மாணவர்கள்' : 'Enrolled Students Seeking Subject Reinforcement'),
      schedule: t('pages.outreach.programs.specialClasses.schedule', isTamil ? 'மாலை நேரங்கள் & வார இறுதி நாட்கள்' : 'Evenings & Weekends (Flexible Cohorts)'),
      mentors: t('pages.outreach.programs.specialClasses.mentors', isTamil ? 'துறைசார் விசேட பயிற்றுநர்கள்' : 'Subject Specialists & Language Instructors'),
      chips: isTamil
        ? ['லுஃகதுல் குர்ஆன்', 'நஹ்வு & சர்ஃப்', 'கணித சூத்திரங்கள்', 'ஆங்கில இலக்கணம்', 'தனிநபர் வழிகாட்டல்']
        : ['Lughat-ul-Quran', 'Nahw & Sarf', 'Math Formula Clinic', 'English Fluency', '1-on-1 Remedial'],
    },
    {
      id: 'coaching-seminars',
      themeClass: 'card-seminars',
      badgeClass: 'badge-seminars',
      headerIcon: 'fa-solid fa-chalkboard',
      badge: t(
        'pages.outreach.programs.coachingSeminars.badge',
        isTamil ? 'செயலமர்வுகள் • துறைசார் வழிகாட்டல்' : 'Masterclasses • Expert Strategy'
      ),
      title: t(
        'pages.outreach.programs.coachingSeminars.title',
        isTamil ? 'பயிற்சி கருத்தரங்குகள் (Coaching Seminars)' : 'Coaching Seminars'
      ),
      subtitle: t(
        'pages.outreach.programs.coachingSeminars.subtitle',
        isTamil
          ? 'பரீட்சை அணுகுமுறை, நினைவாற்றல் கலை & எதிர்காலக் கல்வி கருத்தரங்குகள்'
          : 'High-Impact Seminars, Exam Strategies & Career Masterclasses'
      ),
      copy: t(
        'pages.outreach.programs.coachingSeminars.copy',
        isTamil
          ? 'முக்கிய மார்க்க அறிஞர்கள், பல்கலைக்கழக விரிவுரையாளர்கள், மனோதத்துவ நிபுணர்கள் மற்றும் துறைசார் ஆளுமைகளால் நடத்தப்படும் செயலமர்வுகள். மாணவர்களுக்கு பரீட்சை அணுகுமுறை உத்திகள், மன அழுத்த முகாமைத்துவம், நேர முகாமைத்துவம் மற்றும் எதிர்கால உயர்கல்வித் தெரிவுகள் பற்றிய தெளிவான வழிகாட்டல்கள் வழங்கப்படுகின்றன.'
          : 'Periodic, high-impact seminars led by prominent educationalists, senior examiners, university lecturers, and Islamic scholars. These intensive sessions equip students with cutting-edge exam techniques, memory retention psychology, and inspiring career orientation for their future journey.'
      ),
      pillars: [
        {
          icon: 'fa-solid fa-file-signature',
          title: t('pages.outreach.programs.coachingSeminars.pillars.0.title', isTamil ? 'பரீட்சை விடைத்தாள் உத்திகள்' : 'Exam Strategy & Time Mastery'),
          copy: t(
            'pages.outreach.programs.coachingSeminars.pillars.0.copy',
            isTamil
              ? 'புள்ளி வழங்கும் திட்டத்திற்கு ஏற்ப விடையளிக்கும் முறைமை மற்றும் நேர முகாமைத்துவம்.'
              : 'Techniques for answering exam papers accurately, time allocation, and avoiding common pitfalls.'
          ),
        },
        {
          icon: 'fa-solid fa-brain',
          title: t('pages.outreach.programs.coachingSeminars.pillars.1.title', isTamil ? 'நினைவாற்றல் உளவியல்' : 'Cognitive Memory Science'),
          copy: t(
            'pages.outreach.programs.coachingSeminars.pillars.1.copy',
            isTamil
              ? 'மனனத் திறனை பலமடங்கு அதிகரிக்கும் அறிவியல் ரீதியான மீட்டல் யுக்திகள்.'
              : 'Mnemonic systems, associative recall, and neuro-learning strategies for effortless retention.'
          ),
        },
        {
          icon: 'fa-solid fa-compass',
          title: t('pages.outreach.programs.coachingSeminars.pillars.2.title', isTamil ? 'உயர்கல்வி & தொழில் வழிகாட்டல்' : 'Career & University Pathways'),
          copy: t(
            'pages.outreach.programs.coachingSeminars.pillars.2.copy',
            isTamil
              ? 'உள்நாட்டு மற்றும் வெளிநாட்டுப் பல்கலைக்கழக வாய்ப்புகள் பற்றிய விழிப்புணர்வு.'
              : 'Comprehensive guidance on national and international university options and professional fields.'
          ),
        },
        {
          icon: 'fa-solid fa-microphone',
          title: t('pages.outreach.programs.coachingSeminars.pillars.3.title', isTamil ? 'சிறப்பு அதிதிகள் உரைத் தொடர்' : 'Distinguished Guest Lectures'),
          copy: t(
            'pages.outreach.programs.coachingSeminars.pillars.3.copy',
            isTamil
              ? 'நாடறிந்த கல்விமான்கள் மற்றும் சர்வதேச அறிஞர்களின் உத்வேகமளிக்கும் உரைகள்.'
              : 'Inspirational addresses by scholars, innovators, and achievers from Sri Lanka and abroad.'
          ),
        },
      ],
      highlights: [
        t(
          'pages.outreach.programs.coachingSeminars.highlights.0',
          isTamil
            ? 'பிரதான பரீட்சை மதிப்பீட்டாளர்களால் வழிநடத்தப்படும் க.பொ.த (சா/த) பரீட்சை உத்திக் கருத்தரங்குகள்'
            : 'G.C.E. O/L Examination Strategy Masterclasses led by Chief Examiners and marking directors'
        ),
        t(
          'pages.outreach.programs.coachingSeminars.highlights.1',
          isTamil
            ? 'குர்ஆன் மனன உளவியல், நினைவாற்றல் பெருக்கும் நவீன நுட்பங்கள் மற்றும் தௌர் மீட்டல் வழிகாட்டல்கள்'
            : 'Quran Memorization Psychology, mnemonic techniques, and cognitive memory retention'
        ),
        t(
          'pages.outreach.programs.coachingSeminars.highlights.2',
          isTamil
            ? 'மருத்துவம், பொறியியல், தகவல் தொழில்நுட்பம், சட்டம் மற்றும் இஸ்லாமிய பொருளியல் வழிகாட்டல்'
            : 'Career Guidance Symposia exploring pathways in Medicine, Engineering, IT, Finance, Law, and Shariah'
        ),
        t(
          'pages.outreach.programs.coachingSeminars.highlights.3',
          isTamil
            ? 'இளம் மாணவர்களை ஆளுமைகளாக வளர்ப்பதற்கான பெற்றோர்-ஆசிரியர் விழிப்புணர்வு அமர்வுகள்'
            : 'Parent-Educator Alignment Workshops on supporting adolescent students in contemporary times'
        ),
      ],
      target: t('pages.outreach.programs.coachingSeminars.target', isTamil ? 'மாணவர்கள், ஹாபிழ்கள் மற்றும் பெற்றோர்கள்' : 'Junior & Senior Students, Huffaz & Parents'),
      schedule: t('pages.outreach.programs.coachingSeminars.schedule', isTamil ? 'மாதாந்த மற்றும் தவணைக்கால சிறப்பு செயலமர்வுகள்' : 'Monthly & Termly Weekend Intensives'),
      mentors: t('pages.outreach.programs.coachingSeminars.mentors', isTamil ? 'பல்கலைக்கழக விரிவுரையாளர்கள் & நிபுணர்கள்' : 'Guest Scholars, Chief Examiners & Career Consultants'),
      chips: isTamil
        ? ['சா/த பரீட்சை உத்திகள்', 'நினைவாற்றல் கலை', 'தொழில் வழிகாட்டல்', 'மன அழுத்த முகாமைத்துவம்']
        : ['O/L Exam Masterclass', 'Mnemonic Retention', 'Career Roadmap', 'Stress Management'],
    },
    {
      id: 'hijaza-training',
      themeClass: 'card-hijaza',
      badgeClass: 'badge-hijaza',
      headerIcon: 'fa-solid fa-certificate',
      badge: t(
        'pages.outreach.programs.hijazaTraining.badge',
        isTamil ? 'புனித சனது • முறியாத சங்கிலித்தொடர்' : 'Sacred Accreditation • Connected Chain'
      ),
      title: t(
        'pages.outreach.programs.hijazaTraining.title',
        isTamil ? 'ஹிஜாஸா பயிற்சி (Hijaza Training)' : 'Hijaza Training'
      ),
      subtitle: t(
        'pages.outreach.programs.hijazaTraining.subtitle',
        isTamil
          ? 'நபி ﷺ அவர்கள் வரை தொடரும் சனதுடன் கூடிய உயர் ஹிஜாஸா தகுதிப் பயிற்சி'
          : 'Classical Quranic Recitation & Sanad Al-Ittisal Certification'
      ),
      copy: t(
        'pages.outreach.programs.hijazaTraining.copy',
        isTamil
          ? 'புனித நபி ﷺ அவர்கள் வரை தொடரும் முறியாத சங்கிலித்தொடர் (இஸ்னாத்) மூலமாக மாணவர்களை இணைக்கும் உன்னத உயர் கற்கைநெறி. சர்வதேச அங்கீகாரம் பெற்ற முஸ்னித் காரீக்கள் முன்னிலையில் முழு குர்ஆனையும் தஜ்வீத் விதிகளுடன் பிழையற ஓதிக் காண்பித்து, அதிகாரப்பூர்வ சனது மற்றும் இஜாஸா பெறும் உயரிய பயிற்சி.'
          : 'An elite, sacred specialization connecting students directly to the Prophet Muhammad ﷺ through an unbroken chain of transmission (Isnad). Students recite the entire Holy Quran by heart before certified Musnid Qaris, mastering microscopic Tajweed phonetics, Qira’at rules, and vocal precision.'
      ),
      pillars: [
        {
          icon: 'fa-solid fa-link',
          title: t('pages.outreach.programs.hijazaTraining.pillars.0.title', isTamil ? 'நபிகளார் வரை தொடரும் சனது' : 'Unbroken Prophetic Chain'),
          copy: t(
            'pages.outreach.programs.hijazaTraining.pillars.0.copy',
            isTamil
              ? 'தலைமுறை தலைமுறையாகப் பாதுகாக்கப்பட்ட முறியாத இஸ்னாத் சங்கிலித்தொடர் தொடர்பு.'
              : 'Direct Sanad linking the reciter through generations of master scholars back to the Prophet ﷺ.'
          ),
        },
        {
          icon: 'fa-solid fa-book-quran',
          title: t('pages.outreach.programs.hijazaTraining.pillars.1.title', isTamil ? 'செந்நெறி தஜ்வீத் கவிதைகள்' : 'Classical Matn Mastery'),
          copy: t(
            'pages.outreach.programs.hijazaTraining.pillars.1.copy',
            isTamil
              ? 'இமாம் இப்னுல் ஜஸரி போன்ற பெரும் தஜ்வீத் இமாம்களின் மூல நூல்களில் ஆழ்ந்த புலமை.'
              : 'Memorization and theoretical commentary on foundational Tajweed didactic poetry and manuals.'
          ),
        },
        {
          icon: 'fa-solid fa-microphone-lines',
          title: t('pages.outreach.programs.hijazaTraining.pillars.2.title', isTamil ? 'ஒலிப்பிறப்பிட நுணுக்கம்' : 'Micro-Phonetics & Articulation'),
          copy: t(
            'pages.outreach.programs.hijazaTraining.pillars.2.copy',
            isTamil
              ? 'எழுத்துக்களின் பிறப்பிடங்கள், ஒலி நயங்கள் மற்றும் மூச்சுப் பயிற்சியை செம்மைப்படுத்துதல்.'
              : 'Auditory perfection of vocal acoustics, breath capacity, and immaculate letter pronunciation.'
          ),
        },
        {
          icon: 'fa-solid fa-stamp',
          title: t('pages.outreach.programs.hijazaTraining.pillars.3.title', isTamil ? 'கற்பித்தலுக்கான அங்கீகாரம்' : 'Certified Teaching License'),
          copy: t(
            'pages.outreach.programs.hijazaTraining.pillars.3.copy',
            isTamil
              ? 'உலகெங்கிலும் புனித குர்ஆனை மாணவர்களுக்குக் கற்பிப்பதற்கான அதிகாரப்பூர்வ இஜாஸா பத்திரம்.'
              : 'Official authorization (Ijazah) granting graduates permission to transmit and teach worldwide.'
          ),
        },
      ],
      highlights: [
        t(
          'pages.outreach.programs.hijazaTraining.highlights.0',
          isTamil
            ? 'நம்பகமான சனதுடைய முஸ்னித் ஷெய்க்குகள் முன்னிலையில் நேரடியாக ஓதிக்காட்டி சான்றிதழ் பெறுதல்'
            : 'Direct one-on-one recitation before licensed Musnid Shaykhs possessing authentic Sanad'
        ),
        t(
          'pages.outreach.programs.hijazaTraining.highlights.1',
          isTamil
            ? 'செந்நெறி தஜ்வீத் மூல நூல்களான அல்-ஜஸரிய்யா மற்றும் துஹ்பதுல் அத்பால் ஆகியவற்றை கற்றல்'
            : 'Rigorous study and memorization of classical Tajweed texts (Al-Jazariyyah, Tuhfat al-Atfal)'
        ),
        t(
          'pages.outreach.programs.hijazaTraining.highlights.2',
          isTamil
            ? 'மஃகாரிஜ், சிஃபாத், வக்ஃப் மற்றும் இப்திதா ஆகியவற்றின் நுணுக்கமான உச்சரிப்புத் தேர்ச்சி'
            : 'Exacting standards in Makharij (articulation), Sifaat (characteristics), Waqf, and Ibtida’'
        ),
        t(
          'pages.outreach.programs.hijazaTraining.highlights.3',
          isTamil
            ? 'அனைத்துலக ரீதியில் குர்ஆனைக் கற்பிப்பதற்கும் சனது வழங்குவதற்குமான உத்தியோகபூர்வ அங்கீகாரம்'
            : 'Formal awarding of the authenticated Sanad Al-Ittisal with global teaching accreditation'
        ),
      ],
      target: t('pages.outreach.programs.hijazaTraining.target', isTamil ? 'ஹாபிழ்கள் மற்றும் திறமைமிக்க காரீக்கள்' : 'Huffaz Graduates & Advanced Reciters'),
      schedule: t('pages.outreach.programs.hijazaTraining.schedule', isTamil ? 'தினசரி தனிநபர் ஓதல் வட்டங்கள் (ஹலகாக்கள்)' : 'Daily Individual Recitation Sessions (Halaqat)'),
      mentors: t('pages.outreach.programs.hijazaTraining.mentors', isTamil ? 'அங்கீகாரம் பெற்ற சர்வதேச முஸ்னித் காரீக்கள்' : 'Accredited Musnid Shaykhs & Senior Qaris'),
      chips: isTamil
        ? ['சனது அல்-இத்திஸால்', 'அல்-ஜஸரிய்யா', 'துஹ்பதுல் அத்பால்', 'மஃகாரிஜ் & சிஃபாத்', 'இஜாஸா சான்றிதழ்']
        : ['Sanad Al-Ittisal', 'Matn Al-Jazariyyah', 'Tuhfat al-Atfal', 'Makharij & Sifaat', 'Teaching License'],
    },
    {
      id: 'personality-development',
      themeClass: 'card-personality',
      badgeClass: 'badge-personality',
      headerIcon: 'fa-solid fa-user-tie',
      badge: t(
        'pages.outreach.programs.personalityDevelopment.badge',
        isTamil ? 'தலைமைத்துவம் • மேடைப்பேச்சு & நற்பண்புகள்' : 'Leadership • Character & Oratory'
      ),
      title: t(
        'pages.outreach.programs.personalityDevelopment.title',
        isTamil ? 'ஆளுமை விருத்தி (Personality Development)' : 'Personality Development'
      ),
      subtitle: t(
        'pages.outreach.programs.personalityDevelopment.subtitle',
        isTamil
          ? 'தலைமைத்துவப் பண்பு, மேடைப் பேச்சாற்றல், உணர்ச்சி முகாமைத்துவம் & சமூக ஆளுமை'
          : 'Leadership, Public Speaking, Emotional Intelligence & Ethics'
      ),
      copy: t(
        'pages.outreach.programs.personalityDevelopment.copy',
        isTamil
          ? 'உண்மையான மார்க்கக் கல்வி உன்னதமான நற்பண்புகளாலும் தலைமைத்துவ ஆளுமையாலும் மட்டுமே முழுமைபெறும். மாணவர்களிடம் மேடைப் பேச்சாற்றல், தலைமைத்துவப் பண்பு, உணர்ச்சி முகாமைத்துவம், தொடர்பாடல் திறன் மற்றும் சமூகப் பொறுப்புணர்வை வளர்த்து, சமூகத்தை வழிநடத்தும் முன்மாதிரிகளாக அவர்களை உருவாக்குகிறோம்.'
          : 'True scholarship is distinguished by refined character and persuasive eloquence. Our Personality Development curriculum nurtures public speaking confidence, emotional maturity, organizational leadership, and social responsibility, moulding students into inspiring ambassadors of Islam.'
      ),
      pillars: [
        {
          icon: 'fa-solid fa-bullhorn',
          title: t('pages.outreach.programs.personalityDevelopment.pillars.0.title', isTamil ? 'தஃவா & மேடைப் பேச்சாற்றல்' : 'Da’wah Eloquence & Speech'),
          copy: t(
            'pages.outreach.programs.personalityDevelopment.pillars.0.copy',
            isTamil
              ? 'பார்வையாளர்களை ஈர்க்கும் உரை வடிவமைப்பு, சொல் நயம் மற்றும் தர்க்கரீதியான விவாதத் திறன்.'
              : 'Mastering rhetorical skills, speech writing, structured debate, and public presentation.'
          ),
        },
        {
          icon: 'fa-solid fa-people-group',
          title: t('pages.outreach.programs.personalityDevelopment.pillars.1.title', isTamil ? 'தலைமைத்துவப் பட்டறைகள்' : 'Ethical Leadership Labs'),
          copy: t(
            'pages.outreach.programs.personalityDevelopment.pillars.1.copy',
            isTamil
              ? 'கூட்டு முயற்சி, திட்டமிடல், பொறுப்புணர்வு மற்றும் விரைவான முடிவெடுக்கும் ஆற்றல்.'
              : 'Collaborative team leadership, project coordination, and proactive problem-solving.'
          ),
        },
        {
          icon: 'fa-solid fa-handshake',
          title: t('pages.outreach.programs.personalityDevelopment.pillars.2.title', isTamil ? 'இஸ்லாமிய ஒழுக்கம் (அதப்)' : 'Adab & Social Etiquette'),
          copy: t(
            'pages.outreach.programs.personalityDevelopment.pillars.2.copy',
            isTamil
              ? 'பணிவு, இன்முகம், பெரியோரை மதித்தல் மற்றும் பண்பான சமூக உரையாடல் நெறிகள்.'
              : 'Cultivating humility, courteous manners, emotional regulation, and respectful dialogue.'
          ),
        },
        {
          icon: 'fa-solid fa-hand-holding-heart',
          title: t('pages.outreach.programs.personalityDevelopment.pillars.3.title', isTamil ? 'சமூகப் பணி (கித்மத்)' : 'Community Khidmah'),
          copy: t(
            'pages.outreach.programs.personalityDevelopment.pillars.3.copy',
            isTamil
              ? 'ஏழை எளியோருக்கு உதவுதல், சுற்றுச்சூழல் தூய்மை மற்றும் சமூக மேம்பாட்டுப் பணிகள்.'
              : 'Student-led charitable initiatives, environmental stewardship, and humanitarian engagement.'
          ),
        },
      ],
      highlights: [
        t(
          'pages.outreach.programs.personalityDevelopment.highlights.0',
          isTamil
            ? 'தமிழ் மற்றும் ஆங்கில மொழிகளில் மேடைப்பேச்சு, விவாத மன்றங்கள் மற்றும் ஜும்ஆ குத்பா பயிலரங்குகள்'
            : 'Platform speech, debate tournaments, and Friday sermon (Khutbah) training in English and Tamil'
        ),
        t(
          'pages.outreach.programs.personalityDevelopment.highlights.1',
          isTamil
            ? 'மாணவர் தலைவர் சபை மற்றும் கலாபீட நிகழ்வுகளை திட்டமிட்டு நடாத்தும் தலைமைப் பொறுப்புகள்'
            : 'Student prefect councils, event coordination responsibilities, and team management roles'
        ),
        t(
          'pages.outreach.programs.personalityDevelopment.highlights.2',
          isTamil
            ? 'இஸ்லாமிய நடத்தை விதிகள் (அதப்), பிறரை மதித்தல், பொறுமை மற்றும் முரண்பாடுகளைத் தீர்க்கும் கலை'
            : 'Islamic etiquette (Adab al-Mu’amalat), empathy, active listening, and conflict resolution'
        ),
        t(
          'pages.outreach.programs.personalityDevelopment.highlights.3',
          isTamil
            ? 'சமூக நலப் பணிகள், இரத்ததான முகாம்கள் மற்றும் நிவாரணப் பணிகளில் மாணவர்களின் நேரடிப் பங்களிப்பு'
            : 'Social welfare projects, disaster relief initiatives, and community service drives'
        ),
      ],
      target: t('pages.outreach.programs.personalityDevelopment.target', isTamil ? 'அனைத்து கலாபீட மாணவர்கள்' : 'All Enrolled Students (Weekly Workshops)'),
      schedule: t('pages.outreach.programs.personalityDevelopment.schedule', isTamil ? 'வாராந்த நடைமுறைப் பயிலரங்குகள் & ஒன்று கூடல்கள்' : 'Weekly Interactive Labs & Practice Assemblies'),
      mentors: t('pages.outreach.programs.personalityDevelopment.mentors', isTamil ? 'ஆளுமை மேம்பாட்டுப் பயிற்றுநர்கள்' : 'Leadership Mentors & Communication Trainers'),
      chips: isTamil
        ? ['மேடைப் பேச்சாற்றல்', 'குத்பா பயிலரங்கு', 'மாணவர் சபை', 'இஸ்லாமிய ஒழுக்கம் (அதப்)', 'சமூக நலப் பணிகள்']
        : ['Public Speaking', 'Khutbah Lab', 'Student Council', 'Prophetic Adab', 'Community Service'],
    },
    {
      id: 'thrabiya-programme',
      themeClass: 'card-thrabiya',
      badgeClass: 'badge-thrabiya',
      headerIcon: 'fa-solid fa-hands-praying',
      badge: t(
        'pages.outreach.programs.thrabiyaProgramme.badge',
        isTamil ? 'ஆன்மிக தூய்மை • தஸ்கியா & சுன்னாஹ்' : 'Spiritual Core • Tazkiyah & Sunnah'
      ),
      title: t(
        'pages.outreach.programs.thrabiyaProgramme.title',
        isTamil ? 'தர்பியா நிகழ்ச்சித்திட்டம் (Thrabiya Programme)' : 'Thrabiya Programme'
      ),
      subtitle: t(
        'pages.outreach.programs.thrabiyaProgramme.subtitle',
        isTamil
          ? 'ஆன்ம சுத்தி, சுன்னாஹ் வாழ்வியல் நெறிகள் & ஆன்மீக வழிகாட்டல்'
          : 'Spiritual Purification, Prophetic Character & Soul Nurturing'
      ),
      copy: t(
        'pages.outreach.programs.thrabiyaProgramme.copy',
        isTamil
          ? 'தர்பியா என்பது தஃவா கலாபீடத்தின் ஆன்மீக உயிர்த்துடிப்பாகும். உள்ளத் தூய்மை (தஸ்கியா), இறைபக்தி (தக்வா), தூய எண்ணம் (இக்லாஸ்) மற்றும் நபிகளாரின் அழகிய சுன்னாஹ்க்களை நாளாந்த வாழ்வில் கடைப்பிடிக்க வைக்கும் உன்னதமான ஆன்மீகக் கட்டமைப்பு. வழிகாட்டல் வட்டங்கள், தஹஜ்ஜுத் தொழுகைகள் மற்றும் முரப்பி முறைமை மூலம் மாணவர்களின் உள்ளங்கள் பக்குவப்படுத்தப்படுகின்றன.'
          : 'Tarbiyah is the beating spiritual heart of IDI. Rooted in Tazkiyat an-Nafs (purification of the soul), this program instills sincere devotion (Ikhlas), God-consciousness (Taqwa), and the sublime Sunnah of Prophet Muhammad ﷺ through intimate spiritual circles, night prayers (Tahajjud), and devoted mentorship.'
      ),
      pillars: [
        {
          icon: 'fa-solid fa-seedling',
          title: t('pages.outreach.programs.thrabiyaProgramme.pillars.0.title', isTamil ? 'உள்ளத் தூய்மை (தஸ்கியா)' : 'Tazkiyat an-Nafs (Purification)'),
          copy: t(
            'pages.outreach.programs.thrabiyaProgramme.pillars.0.copy',
            isTamil
              ? 'சுயபரிசோதனை, எண்ணங்களைச் சீர்செய்தல் மற்றும் உள்ளத்தின் நோய்களைக் களைதல்.'
              : 'Internal reflection, rectifying intentions, and cleansing the heart from spiritual ailments.'
          ),
        },
        {
          icon: 'fa-solid fa-moon',
          title: t('pages.outreach.programs.thrabiyaProgramme.pillars.1.title', isTamil ? 'இரவுத் தொழுகை & திக்ருகள்' : 'Qiyam-ul-Layl & Adhkar'),
          copy: t(
            'pages.outreach.programs.thrabiyaProgramme.pillars.1.copy',
            isTamil
              ? 'தஹஜ்ஜுத் மற்றும் இறை நினைவுகூறல் மூலம் இறைவனோடு நெருக்கமான பிணைப்பை ஏற்படுத்துதல்.'
              : 'Developing an intimate bond with Allah in the tranquility of dawn and late-night vigils.'
          ),
        },
        {
          icon: 'fa-solid fa-heart-pulse',
          title: t('pages.outreach.programs.thrabiyaProgramme.pillars.2.title', isTamil ? 'முரப்பி வழிகாட்டல் கட்டமைப்பு' : 'The Murabbi Pastoral Model'),
          copy: t(
            'pages.outreach.programs.thrabiyaProgramme.pillars.2.copy',
            isTamil
              ? 'மாணவர்களின் உளவியல் மற்றும் ஆன்மீக நலனைக் கண்காணிக்கும் பாசமிகு ஆசிரிய வழிகாட்டல்.'
              : 'Warm, personal mentorship by spiritual counselors ensuring emotional and moral well-being.'
          ),
        },
        {
          icon: 'fa-solid fa-shield-halved',
          title: t('pages.outreach.programs.thrabiyaProgramme.pillars.3.title', isTamil ? 'சுன்னாஹ் வாழ்வியல் வழக்கம்' : 'Steadfast Sunnah Lifestyle'),
          copy: t(
            'pages.outreach.programs.thrabiyaProgramme.pillars.3.copy',
            isTamil
              ? 'நபிகளாரின் சொல், செயல், ஒழுக்கங்களை நாளாந்த வாழ்வில் உயிர்ப்பிக்கும் வழிகாட்டல்.'
              : 'Embedding Prophetic habits, modesty, honesty, and grateful contentment in daily conduct.'
          ),
        },
      ],
      highlights: [
        t(
          'pages.outreach.programs.thrabiyaProgramme.highlights.0',
          isTamil
            ? 'ஸீரா, ஹதீஸ் மற்றும் உள்ளத்தை உருக்கும் அறிவுரைகளை உள்ளடக்கிய வாராந்த தர்பியா ஹலகாக்கள்'
            : 'Weekly Tarbiyah Halaqahs reflecting on the Seerah, Hadith, and spiritual purification (Riqaaq)'
        ),
        t(
          'pages.outreach.programs.thrabiyaProgramme.highlights.1',
          isTamil
            ? 'வழிகாட்டப்பட்ட தஹஜ்ஜுத் தொழுகைகள், காலை மாலை திக்ருகள் மற்றும் சுன்னத்தான நோன்புப் பழக்கங்கள்'
            : 'Guided Tahajjud (Qiyam-ul-Layl), dawn Adhkar routines, and voluntary Sunnah fasting habits'
        ),
        t(
          'pages.outreach.programs.thrabiyaProgramme.highlights.2',
          isTamil
            ? 'ஒவ்வொரு மாணவருக்கும் பிரத்தியேகமாக நியமிக்கப்பட்ட ஆன்மீக வழிகாட்டி (முரப்பி) முறைமை'
            : 'Dedicated Murabbi (pastoral mentor) assigned to each student for personal moral guidance'
        ),
        t(
          'pages.outreach.programs.thrabiyaProgramme.highlights.3',
          isTamil
            ? 'இறைபக்தி, சகோதரத்துவ பாசம், பெற்றோருக்கு பணிவிடை செய்தல் மற்றும் தியாக சிந்தனை வளர்ப்பு'
            : 'Deep cultivation of brotherhood, humility, filial duty to parents, and steadfast faith'
        ),
      ],
      target: t('pages.outreach.programs.thrabiyaProgramme.target', isTamil ? 'முழு கலாபீட மாணவர்கள் (முழு நேரமும்)' : 'Whole-Madrasa Immersion (All Students)'),
      schedule: t('pages.outreach.programs.thrabiyaProgramme.schedule', isTamil ? 'தினசரி வாழ்வியல் ஒழுங்கு & சிறப்பு ஹலகாக்கள்' : 'Daily Living Routine & Weekly Intensive Halaqahs'),
      mentors: t('pages.outreach.programs.thrabiyaProgramme.mentors', isTamil ? 'ஆன்மீக வழிகாட்டிகள் (முரப்பிகள்)' : 'Resident Murabbis & Senior Spiritual Guides'),
      chips: isTamil
        ? ['தஸ்கியா & இக்லாஸ்', 'தஹஜ்ஜுத் தொழுகை', 'காலை மாலை அத்கார்', 'முரப்பி வழிகாட்டல்', 'சுன்னாஹ் வாழ்வியல்']
        : ['Tazkiyah & Ikhlas', 'Tahajjud (Qiyam)', 'Morning & Evening Adhkar', 'Pastoral Murabbi', 'Sunnah Lifestyle'],
    },
  ];

  // Selected program for deep dive
  const selectedProgram = programs.find((p) => p.id === activeTab) || programs[0];

  // FAQ Items
  const faqItems = [
    {
      q: t('pages.outreach.faq.items.0.q', isTamil ? 'ஹிஃப்ழ் மனனத்தோடு பாடசாலைக் கல்வியை எவ்வாறு சமநிலையாக முன்னெடுக்க முடிகிறது?' : 'How does IDI balance School Studies with full-time Quran memorization?'),
      a: t('pages.outreach.faq.items.0.a', isTamil ? 'நவீன கல்வி உளவியல் அடிப்படையில் எமது நேர அட்டவணை வகுக்கப்பட்டுள்ளது. நினைவாற்றல் உச்சத்தில் இருக்கும் அதிகாலை நேரம் மனனத்திற்கும், பகல் நேரம் இடைநிலைப் பாடசாலைப் படிப்பிற்கும், மாலை நேரம் மீட்டல் மற்றும் தர்பியாவிற்கும் ஒதுக்கப்பட்டு, மாணவர்களுக்கு சோர்வின்றி சமநிலை உறுதி செய்யப்படுகிறது.' : 'Our timetable is engineered using scientifically proven study cycles. The early morning hours are dedicated to memorization when cognitive retention is highest. The daytime is devoted to structured secondary school classes. Afternoon and evening sessions incorporate revision, special coaching, and Tarbiyah without academic overload.'),
    },
    {
      q: t('pages.outreach.faq.items.1.q', isTamil ? 'ஹிஜாஸா பயிற்சி என்றால் என்ன? அதில் யார் சனது பெற முடியும்?' : 'What is the Hijaza Training program and who can earn the Sanad?'),
      a: t('pages.outreach.faq.items.1.a', isTamil ? 'ஹிஜாஸா என்பது நபி ﷺ அவர்கள் வரை தொடரும் முறியாத சங்கிலித்தொடர் (இஸ்னாத்) உடைய உயர் குர்ஆன் ஓதல் சான்றிதழாகும். தஜ்வீத் விதிகளில் தேர்ச்சி பெற்ற மாணவர்களும் ஹாபிழ்களும் சர்வதேச முஸ்னித் காரீக்கள் முன்னிலையில் முழு குர்ஆனையும் ஓதிக்காட்டி இச்சான்றிதழைப் பெறலாம்.' : 'The Hijaza Training program is an advanced Quranic recitation track for students and Huffaz who demonstrate exceptional Tajweed precision. Under certified Musnid Shaykhs, the candidate recites the complete Quran from memory and is examined rigorously before being awarded the official Sanad connecting them to the Prophet Muhammad ﷺ.'),
    },
    {
      q: t('pages.outreach.faq.items.2.q', isTamil ? 'பாடங்களில் பின்தங்கும் மாணவர்களுக்கு விசேட வகுப்புகள் எவ்வாறு உதவுகின்றன?' : 'How do Special Classes support students who find certain subjects difficult?'),
      a: t('pages.outreach.faq.items.2.a', isTamil ? 'மாணவர்களின் அடைவுமட்டத்தை தொடர்ச்சியாகக் கண்காணித்து, கணிதம், விஞ்ஞானம், ஆங்கிலம் போன்ற பாடங்களில் உள்ள பலவீனங்களைக் கண்டறிந்து, சிறிய குழுக்களாக 1-on-1 ஆசிரியர் வழிகாட்டல் மூலம் அவர்களின் தன்னம்பிக்கை உயர்த்தப்படுகிறது.' : 'We run diagnostic assessments to identify individual learning gaps. Special Classes offer small-cohort tutorials and 1-on-1 attention in subjects like Mathematics, Science, English, or Arabic grammar, transforming weak areas into confident strengths.'),
    },
    {
      q: t('pages.outreach.faq.items.3.q', isTamil ? 'தர்பியா நிகழ்ச்சித்திட்டம் சாதாரண வகுப்புகளிலிருந்து எவ்வாறு வேறுபடுகிறது?' : 'What distinguishes the Thrabiya Programme from standard classroom teaching?'),
      a: t('pages.outreach.faq.items.3.a', isTamil ? 'தர்பியா என்பது ஏட்டுச் சுரைக்காய் அல்ல; அது ஒரு நடைமுறை வாழ்வியல் நெறிமுறை. முரப்பி (ஆன்மீக வழிகாட்டி) முறைமை ஊடாக மாணவர்களின் உளவியல் மற்றும் ஆன்மீக வளர்ச்சி கண்காணிக்கப்பட்டு, தஹஜ்ஜுத், சுன்னத்தான நோன்பு மற்றும் சமூக சேவைகள் பழக்கப்படுத்தப்படுகின்றன.' : 'Tarbiyah is not merely textbook knowledge—it is a lived lifestyle. Through our dedicated Murabbi mentorship system, students receive ongoing moral guidance, practice voluntary night prayers (Tahajjud), cultivate Sunnah habits, and learn empathy and community service.'),
    },
    {
      q: t('pages.outreach.faq.items.4.q', isTamil ? 'இங்கு பயிலும் மாணவர்கள் பல்கலைக்கழகம் மற்றும் உயர்கல்விக்கு செல்ல முடியுமா?' : 'Are students prepared for higher education and university entrance?'),
      a: t('pages.outreach.faq.items.4.a', isTamil ? 'நிச்சயமாக. எமது மாணவர்கள் க.பொ.த (சா/த) பரீட்சையில் 100% தேர்ச்சி பெற்று வருகின்றனர். எமது கருத்தரங்குகள் மூலம் உயர்கல்வி வழிகாட்டல்கள் வழங்கப்பட்டு, மருத்துவம், பொறியியல், சட்டம், தகவல் தொழில்நுட்பம் மற்றும் மார்க்கப் புலங்களில் பல்கலைக்கழகப் பிரவேசத்திற்குத் தகுதி பெறுகின்றனர்.' : 'Yes. Our students sit for the national G.C.E. Ordinary Level (O/L) examinations with a proven 100% pass record. Through our Coaching Seminars, they receive comprehensive career roadmaps, preparing them to enter Advanced Level (A/L) and subsequently top universities in fields such as Medicine, Engineering, Law, IT, and Islamic Studies.'),
    },
  ];

  useEffect(() => {
    const handleUrlHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const tabParam = (hash || params.get('tab') || '').toLowerCase();

      const validTabs: TabId[] = [
        'school-studies',
        'special-classes',
        'coaching-seminars',
        'hijaza-training',
        'personality-development',
        'thrabiya-programme',
      ];

      if (validTabs.includes(tabParam as TabId)) {
        setActiveTab(tabParam as TabId);
        setTimeout(() => {
          const filterElem = document.getElementById('outreach-filter-bar');
          if (filterElem) {
            filterElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
      } else if (tabParam === 'all') {
        setActiveTab('all');
      }
    };

    handleUrlHash();
    window.addEventListener('hashchange', handleUrlHash);
    return () => window.removeEventListener('hashchange', handleUrlHash);
  }, []);

  const handleTabSelect = (tab: TabId) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const newUrl = tab === 'all' ? window.location.pathname : `${window.location.pathname}#${tab}`;
      window.history.replaceState(null, '', newUrl);
    }
    const filterElem = document.getElementById('outreach-filter-bar');
    if (filterElem) {
      filterElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* 1. Hero Section */}
      <section className="hero page-head">
        <div className="hero-overlay"></div>
        <div className="hero-content page-enter">
          <span className="subtitle">
            {t('pages.outreach.hero.subtitle', isTamil ? 'விரிவாக்கத் திட்டங்கள்' : 'Academic & Spiritual Extension')}
          </span>
          <h1>
            {t(
              'pages.outreach.hero.title',
              isTamil ? 'தஃவா கலாபீட விழிப்புணர்வு & விரிவாக்கம்' : 'IDI Outreach Programs'
            )}
          </h1>
          <p>
            {t(
              'pages.outreach.hero.copy',
              isTamil
                ? 'பாரம்பரிய குர்ஆன் மனன எல்லைகளைத் தாண்டி, அரச பாடசாலைக் கல்வி, சனதுடன் கூடிய ஹிஜாஸா சான்றிதழ், விசேட வழிகாட்டல், தலைமைத்துவ ஆளுமை மற்றும் ஆன்மிக தர்பியாவை இணைத்து வழங்கும் தனித்துவமான கட்டமைப்பு.'
                : 'Extending Quranic education beyond traditional boundaries through integrated school curricula, advanced Ijazah certification, targeted coaching, leadership cultivation, and spiritual Tarbiyah.'
            )}
          </p>
        </div>
      </section>

      {/* 2. Filter & Tabs Navigation */}
      <section id="outreach-filter-bar" className="programs-filter-section">
        <div className="section-container" style={{ paddingBottom: '1.25rem', paddingTop: '2.5rem' }}>
          <div className="program-tabs-wrapper">
            <button
              type="button"
              className={`program-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabSelect('all')}
            >
              <i className="fa-solid fa-layer-group"></i>
              <span>{t('pages.outreach.filter.all', isTamil ? 'அனைத்து திட்டங்களும்' : 'All Programs (6)')}</span>
            </button>

            {programs.map((prog) => {
              const isActive = activeTab === prog.id;
              return (
                <button
                  key={prog.id}
                  type="button"
                  className={`program-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabSelect(prog.id)}
                >
                  <i className={prog.headerIcon}></i>
                  <span>{prog.title.split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Main Programs Content Area */}
      <section className="section-container" style={{ paddingTop: '3rem', paddingBottom: '3.5rem' }}>
        {activeTab === 'all' ? (
          /* ==================== ALL PROGRAMS: CLEAN 6-CARD GRID ==================== */
          <div>
            <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
              <span className="subtitle" style={{ color: 'var(--accent-emerald)' }}>
                {isTamil ? 'முழுமையான பாடத்திட்டம்' : 'Comprehensive Curriculum Framework'}
              </span>
              <h2 className="section-title" style={{ marginTop: '0.4rem', marginBottom: '0.8rem' }}>
                {isTamil
                  ? 'தஃவா கலாபீடத்தின் 6 முதன்மை விரிவாக்கப் பிரிவுகள்'
                  : 'The 6 Integrated Pillars of IDI Outreach'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7' }}>
                {isTamil
                  ? 'ஒவ்வொரு பிரிவும் மாணவரின் மார்க்க ஞானம், பொதுக்கல்வித் தகைமை, தலைமைத்துவம் மற்றும் ஆன்ம பரிசுத்தத்தை ஒருங்கிணைத்து வளர்க்கும் வகையில் வடிவமைக்கப்பட்டுள்ளது.'
                  : 'Each pillar is engineered to cultivate well-rounded Muslim scholars equipped with Quranic mastery, government-recognized academic qualifications, and high moral character.'}
              </p>
            </div>

            <div className="outreach-programs-grid">
              {programs.map((prog) => (
                <div key={prog.id} className={`outreach-grid-card ${prog.themeClass}`}>
                  <div className="outreach-grid-card-body">
                    <div className="outreach-card-topbar">
                      <span className={`outreach-card-badge ${prog.badgeClass}`}>
                        {prog.badge.split('•')[0].trim()}
                      </span>
                      <div className="outreach-icon-circle">
                        <i className={prog.headerIcon}></i>
                      </div>
                    </div>

                    <h3 className="outreach-card-name">{prog.title}</h3>
                    <div className="outreach-card-tagline">{prog.subtitle}</div>
                    <p className="outreach-card-desc">{prog.copy}</p>

                    <ul className="outreach-card-checklist">
                      {prog.highlights.slice(0, 4).map((highlight, idx) => (
                        <li key={idx}>
                          <i className="fa-solid fa-circle-check"></i>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="outreach-card-meta-chips">
                      <div className="outreach-meta-row">
                        <i className="fa-solid fa-user-group"></i>
                        <span>{prog.target}</span>
                      </div>
                      <div className="outreach-meta-row">
                        <i className="fa-solid fa-clock"></i>
                        <span>{prog.schedule}</span>
                      </div>
                      <div className="outreach-meta-row">
                        <i className="fa-solid fa-chalkboard-user"></i>
                        <span>{prog.mentors}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="outreach-card-action-btn"
                      onClick={() => handleTabSelect(prog.id)}
                    >
                      <span>{isTamil ? 'முழு விபரம் மற்றும் பாடங்கள்' : 'Explore Full Pillar & Modules'}</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Why IDI Outreach Grid */}
            <div style={{ marginTop: '5rem' }}>
              <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
                <span className="subtitle" style={{ color: 'var(--accent-emerald)' }}>
                  {isTamil ? 'எமது விசேடத்துவம்' : 'Why IDI Outreach'}
                </span>
                <h3 style={{ fontSize: '2rem', color: 'var(--accent-emerald)', marginTop: '0.4rem', marginBottom: '0.6rem' }}>
                  {isTamil ? 'நான்கு அடிப்படைத் தூண்கள்' : 'The Four Pillars of Excellence'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
                  {isTamil
                    ? 'இஸ்லாமிய விழுமியங்களை நவீன உலகளாவிய தகைமைகளோடு இணைக்கும் சமநிலைக் கல்வி.'
                    : 'A harmonized educational model bringing together sacred scholarship, modern credentials, and character development.'}
                </p>
              </div>

              <div className="outreach-why-grid">
                <div className="outreach-why-card">
                  <div className="outreach-why-icon">
                    <i className="fa-solid fa-school"></i>
                  </div>
                  <h4>{isTamil ? 'அரச பாடசாலைக் கல்வி' : 'Academic Rigor'}</h4>
                  <p>
                    {isTamil
                      ? 'தரம் 6 முதல் க.பொ.த (சா/த) வரை தேசிய பாடத்திட்டம், நவீன விஞ்ஞான ஆய்வுகூடம் மற்றும் 100% பரீட்சை சித்தி.'
                      : 'National syllabus (Grades 6–11 O/L) with science laboratories, ICT education, and 100% exam pass rate.'}
                  </p>
                </div>

                <div className="outreach-why-card">
                  <div className="outreach-why-icon">
                    <i className="fa-solid fa-certificate"></i>
                  </div>
                  <h4>{isTamil ? 'புனித சனது ஹிஜாஸா' : 'Sacred Tradition'}</h4>
                  <p>
                    {isTamil
                      ? 'நபி ﷺ அவர்கள் வரை தொடரும் முறியாத சங்கிலித்தொடர் கொண்ட சனது அல்-இத்திஸால் உயர் சான்றிதழ்.'
                      : 'Sanad Al-Ittisal with an unbroken chain of transmission tracing directly back to the Prophet Muhammad ﷺ.'}
                  </p>
                </div>

                <div className="outreach-why-card">
                  <div className="outreach-why-icon">
                    <i className="fa-solid fa-microphone-lines"></i>
                  </div>
                  <h4>{isTamil ? 'ஆளுமை & மேடைப்பேச்சு' : 'Leadership & Eloquence'}</h4>
                  <p>
                    {isTamil
                      ? 'மும்மொழி மேடைப்பேச்சு, விவாத மன்றங்கள், மாணவர் தலைமைத்துவ சபை மற்றும் ஜும்ஆ குத்பா பயிலரங்குகள்.'
                      : 'Multi-language platform speech, debate forums, student leadership councils, and Friday sermon training.'}
                  </p>
                </div>

                <div className="outreach-why-card">
                  <div className="outreach-why-icon">
                    <i className="fa-solid fa-hands-praying"></i>
                  </div>
                  <h4>{isTamil ? 'உள்ளத் தூய்மை (தர்பியா)' : 'Inner Purification'}</h4>
                  <p>
                    {isTamil
                      ? 'தஹஜ்ஜுத் இரவுத் தொழுகை, முரப்பி தனிநபர் ஆன்மீக வழிகாட்டல் மற்றும் சுன்னாஹ் வாழ்வியல் நெறிமுறைகள்.'
                      : 'Dedicated Murabbi spiritual mentoring, Tahajjud vigils, daily Adhkar, and deep-rooted Sunnah ethics.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ==================== DEEP DIVE VIEW FOR A SINGLE PROGRAM ==================== */
          <div className="outreach-deep-banner">
            <div className="outreach-deep-topbar">
              <button
                type="button"
                className="outreach-back-btn"
                onClick={() => handleTabSelect('all')}
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>{isTamil ? 'அனைத்துத் திட்டங்களுக்கும் திரும்புக' : '← Back to All Programs'}</span>
              </button>

              <span className={`outreach-card-badge ${selectedProgram.badgeClass}`}>
                <i className={selectedProgram.headerIcon}></i>
                {selectedProgram.badge}
              </span>
            </div>

            <div className="outreach-deep-layout">
              {/* Left Column: Titles, copy, 4 sub-pillars */}
              <div>
                <h2 className="outreach-deep-title">{selectedProgram.title}</h2>
                <div className="outreach-deep-subtitle">{selectedProgram.subtitle}</div>
                <p className="outreach-deep-copy">{selectedProgram.copy}</p>

                <h4 style={{ fontSize: '1.15rem', color: 'var(--accent-emerald)', marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-diagram-project"></i>
                  <span>{isTamil ? 'கற்கைநெறியின் 4 முக்கிய கூறுகள்' : '4 Core Curriculum Pillars'}</span>
                </h4>

                <div className="outreach-pillars-subgrid">
                  {selectedProgram.pillars.map((pil, idx) => (
                    <div key={idx} className="outreach-pillar-subcard">
                      <div className="outreach-pillar-subicon">
                        <i className={pil.icon}></i>
                      </div>
                      <div className="outreach-pillar-subtext">
                        <h5>{pil.title}</h5>
                        <p>{pil.copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive Deep-Dive Showcase Box */}
              <div className="outreach-deep-showcase">
                <div className="outreach-deep-showcase-title">
                  <i className="fa-solid fa-star" style={{ color: 'var(--accent-gold)' }}></i>
                  <span>{isTamil ? 'பாடநெறி சிறப்பம்சங்கள்' : 'Curriculum & Key Highlights'}</span>
                </div>

                <ul className="outreach-deep-list">
                  {selectedProgram.highlights.map((item, idx) => (
                    <li key={idx}>
                      <i className="fa-solid fa-circle-check"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Modules / Chips if available */}
                {selectedProgram.chips && selectedProgram.chips.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {isTamil ? 'பாடப்பிரிவுகள் & விசேட தலைப்புகள்' : 'Key Modules & Subjects'}
                    </div>
                    <div className="outreach-subjects-chips">
                      {selectedProgram.chips.map((chip, idx) => (
                        <span key={idx} className="outreach-subject-badge">
                          <i className="fa-solid fa-check" style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}></i>
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specific metadata specifications */}
                <div className="outreach-spec-box">
                  <div className="outreach-spec-item">
                    <span className="outreach-spec-label">
                      <i className="fa-solid fa-user-group" style={{ color: 'var(--accent-emerald)' }}></i>
                      {isTamil ? 'இலக்கு' : 'Target'}:
                    </span>
                    <span className="outreach-spec-value">{selectedProgram.target}</span>
                  </div>

                  <div className="outreach-spec-item">
                    <span className="outreach-spec-label">
                      <i className="fa-solid fa-clock" style={{ color: 'var(--accent-gold)' }}></i>
                      {isTamil ? 'நேரம்' : 'Schedule'}:
                    </span>
                    <span className="outreach-spec-value">{selectedProgram.schedule}</span>
                  </div>

                  <div className="outreach-spec-item">
                    <span className="outreach-spec-label">
                      <i className="fa-solid fa-chalkboard-user" style={{ color: 'var(--accent-emerald)' }}></i>
                      {isTamil ? 'பயிற்றுநர்' : 'Faculty'}:
                    </span>
                    <span className="outreach-spec-value">{selectedProgram.mentors}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <Link
                    href="/admissions"
                    className="btn btn-primary"
                    style={{ flex: 1, minWidth: '160px', justifyContent: 'center' }}
                  >
                    <i className="fa-solid fa-file-signature" style={{ marginRight: '6px' }}></i>
                    {isTamil ? 'விண்ணப்பிக்க' : 'Apply for Program'}
                  </Link>
                  <Link
                    href="/contact"
                    className="btn btn-secondary"
                    style={{ flex: 1, minWidth: '160px', justifyContent: 'center' }}
                  >
                    <i className="fa-solid fa-circle-question" style={{ marginRight: '6px' }}></i>
                    {isTamil ? 'விசாரிக்க' : 'Inquire Details'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. FAQ Accordion Section */}
      <section className="section-container" style={{ padding: '4.5rem 2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
          <span className="subtitle" style={{ color: 'var(--accent-emerald)' }}>
            {isTamil ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}
          </span>
          <h2 className="section-title" style={{ marginTop: '0.4rem', marginBottom: '0.8rem' }}>
            {isTamil ? 'விரிவாக்கத் திட்டங்கள் பற்றிய விளக்கங்கள்' : 'Everything You Need to Know'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            {isTamil
              ? 'ஹிஃப்ழுடன் கூடிய பாடசாலைக் கல்வி மற்றும் சனது சான்றிதழ் தொடர்பான முக்கிய கேள்விகளுக்கான விடைகள்.'
              : 'Clear answers regarding academic exams, Hifz balance, Sanad accreditation, and student support.'}
          </p>
        </div>

        <div className="outreach-faq-list">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className={`outreach-faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="outreach-faq-question"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <span>{item.q}</span>
                  <span className="outreach-faq-icon">
                    <i className="fa-solid fa-chevron-down"></i>
                  </span>
                </button>
                {isOpen && <div className="outreach-faq-answer">{item.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Call To Action Banner */}
      <section className="section-container" style={{ paddingBottom: '5rem' }}>
        <div className="outreach-cta-banner">
          <div className="outreach-cta-content">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(218, 165, 32, 0.2)', border: '1px solid rgba(218, 165, 32, 0.4)', color: 'var(--accent-gold-light)', padding: '0.35rem 1.1rem', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              <i className="fa-solid fa-star"></i>
              {isTamil ? 'புதிய மாணவர் அனுமதி' : 'Admissions Open'}
            </span>

            <h2 className="outreach-cta-title">
              {isTamil
                ? 'தஃவா கலாபீடத்தில் உங்களது சமநிலைக் கல்வியைத் தொடங்குங்கள்'
                : 'Begin Your Balanced Journey of Sacred & Academic Excellence'}
            </h2>

            <p className="outreach-cta-copy">
              {isTamil
                ? 'குர்ஆன் மனனத்துடன் அரச பாடசாலைக் கல்வி மற்றும் சர்வதேச சனது சான்றிதழைப் பெற்று, சமூகத்தை வழிநடத்தும் ஆளுமையாக உயர இன்றே விண்ணப்பியுங்கள்.'
                : 'Equip your child with Quranic mastery, government-recognized academic success, and authentic Prophetic character under the care of certified educators and spiritual mentors.'}
            </p>

            <div className="outreach-cta-btns">
              <Link href="/admissions" className="btn btn-primary" style={{ padding: '0.95rem 2.25rem' }}>
                <i className="fa-solid fa-file-signature" style={{ marginRight: '8px' }}></i>
                {isTamil ? 'மாணவர் அனுமதிக்கு விண்ணப்பிக்க' : 'Apply for Admission'}
              </Link>
              <Link href="/contact" className="btn btn-secondary" style={{ padding: '0.95rem 2.25rem', color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                <i className="fa-solid fa-building-columns" style={{ marginRight: '8px' }}></i>
                {isTamil ? 'கலாபீடத்தைத் தொடர்பு கொள்ள' : 'Contact Admissions Office'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
