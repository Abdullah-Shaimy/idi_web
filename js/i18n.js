(function () {
    const STORAGE_KEY = 'idi_language';
    const DEFAULT_LANGUAGE = 'en';
    const SUPPORTED_LANGUAGES = ['en', 'ta'];

    const translations = {
        en: {
            common: {
                switcher: { en: 'EN', ta: 'தமிழ்' },
                modal: {
                    title: 'Choose your language',
                    copy: 'Select how you would like to explore the Institute website. Your choice will be saved for the next visit.',
                    englishTitle: 'English',
                    englishCopy: 'Continue in English',
                    tamilTitle: 'Tamil',
                    tamilCopy: 'தமிழில் தொடரவும்',
                },
                nav: {
                    home: 'Home',
                    about: 'About',
                    hifz: 'Hifz Program',
                    students: 'Students',
                    alumni: 'Alumni',
                    gallery: 'Gallery',
                    contact: 'Contact',
                },
                footer: {
                    brandTitle: "INSTITUTE OF DA'WA ISLAMIYYA",
                    brandCopy: 'A center of excellence for Quranic memorization and Islamic education, nurturing the next generation of scholars.',
                    quickLinks: 'Quick Links',
                    information: 'Information',
                    contact: 'Contact',
                    aboutUs: 'About Us',
                    studentLife: 'Student Life',
                    contactUs: 'Contact Us',
                    ourAlumni: 'Our Alumni',
                    checkResults: 'Check Results',
                    admissions: 'Admissions',
                    address: '123 Madrasa Lane, City',
                    phone: '+1 234 567 890',
                    email: 'info@idi.edu',
                    rights: "&copy; 2026 Institute of Da'wa Islamiyya. All rights reserved.",
                    designedBy: 'Web Solution by',
                },
            },
            pages: {
                index: {
                    meta: {
                        title: "Institute of Da'wa Islamiyya | Excellence in Hifz",
                        description: 'A peaceful and excellent Al Quran Hifz Madrasa. Nurturing hearts with the light of the Quran.',
                    },
                    hero: {
                        subtitle: 'Bismillahir Rahmanir Rahim',
                        title: 'Nurturing Hearts with the Light of Quran',
                        copy: "Welcome to the Institute of Da'wa Islamiyya, a dedicated Hifz academy committed to Quranic memorization, spiritual growth, and Islamic values.",
                        primary: 'Discover More',
                        secondary: 'Get in Touch',
                    },
                    foundation: {
                        subtitle: 'Our Foundation',
                        title: 'A Tradition of Excellence',
                    },
                    cards: [
                        {
                            title: 'Hifz Program',
                            copy: 'Comprehensive memorization of the Holy Quran with Tajweed and focused Tarbiyah for every student.',
                        },
                        {
                            title: 'Islamic Studies',
                            copy: 'Meaningful study of Fiqh, Hadith, and Seerah alongside the Hifz journey.',
                        },
                        {
                            title: 'Holistic Tarbiyah',
                            copy: 'Character building through mentorship, discipline, and a spiritually uplifting environment.',
                        },
                        {
                            title: 'School Studies',
                            copy: 'Academic guidance from Grade 6 to O/L so students can grow in both Hifz and formal studies.',
                        },
                    ],
                    featured: {
                        subtitle: 'Join Us',
                        title: 'Why Choose IDI?',
                        copy: 'We provide a serene and disciplined setting where students can strengthen their connection with the Quran under the guidance of experienced teachers.',
                        bullets: [
                            'Expert Tajweed Instruction',
                            'Personalized Learning Pathways',
                            'Strong Spiritual Mentorship',
                            'Comfortable Hostel Facilities',
                            'Nutritious Quality Meals',
                            'Student Welfare Focused Policies',
                            'Integrated Hifz and Academic Studies',
                        ],
                        cta: 'Explore Programs',
                    },
                },
                about: {
                    meta: {
                        title: "About Us | Institute of Da'wa Islamiyya",
                        description: "Learn about the history and mission of the Institute of Da'wa Islamiyya.",
                    },
                    hero: {
                        subtitle: 'Our History',
                        title: 'About the Institute',
                        copy: 'A journey toward faith, dedication, and Quranic excellence.',
                        cta: 'Meet Our Administration',
                    },
                    cards: [
                        {
                            title: 'Motto',
                            label: '(MOTTO)',
                            copy: 'Let us memorize the Holy Quran accurately and completely.',
                        },
                        {
                            title: 'Vision',
                            label: '(VISION)',
                            copy: 'A unique institution that develops exemplary, multidisciplinary Islamic personalities who carry the Quran.',
                        },
                        {
                            title: 'Mission',
                            label: '(MISSION)',
                            copy: 'To cultivate, through methods relevant to each era, balanced thinking, a knowledge legacy devoted to serving the Quran, and multidisciplinary Hafiz graduates who have memorized the Quran systematically.',
                        },
                    ],
                    legacy: {
                        subtitle: 'Our History',
                        title: 'A Heritage of Faith and Excellence',
                        copyOne: "Established with a lofty purpose, the Institute of Da'wa Islamiyya stands as a beacon that helps students who seek to memorize the Quran reflect its teachings in their lives.",
                        copyTwo: "We believe Hifz is not mere memorization. It is a lifelong bond with the words of Allah, expressed through noble Akhlaq, discipline, and beneficial knowledge.",
                        valuesTitle: 'Our Foundational Values',
                        values: [
                            'Ikhlas (Sincerity)',
                            'Ihsan (Excellence)',
                            'Adab (Discipline)',
                        ],
                    },
                    goals: {
                        title: 'Goals',
                        label: '(GOALS)',
                        items: [
                            'Build a generation that memorizes the Quran and remains in devoted service to it.',
                            'Develop multidisciplinary personalities enriched with Quranic knowledge.',
                            'Form personalities trained in both spiritual and cultural refinement.',
                            'Spread Islamic thought grounded in balance and completeness.',
                            'Raise righteous citizens who render service to both Deen and society.',
                            "Provide guidance to achieve Sri Lanka's general education goals and national professional competencies.",
                        ],
                    },
                },
                hifz: {
                    meta: {
                        title: "Hifz Program | Institute of Da'wa Islamiyya",
                        description: 'Explore our comprehensive Tahfeez-ul-Quran program. A systematic approach to memorizing the Holy Quran.',
                    },
                    hero: {
                        subtitle: 'Our Program',
                        title: 'Tahfeez-ul-Quran',
                        copy: 'A structured and spiritual path to memorizing the Holy Quran with sound Tajweed.',
                    },
                    journey: {
                        subtitle: 'The Journey',
                        title: 'Our Curriculum',
                    },
                    cards: [
                        {
                            title: 'Nazira and Tajweed',
                            copy: 'Students begin by strengthening fluent recitation, Makharij, and the rules of Tajweed before entering deep memorization.',
                        },
                        {
                            title: 'Daily Sabak and Dour',
                            copy: 'Every day combines new memorization, revision, and guided reinforcement for strong retention.',
                        },
                        {
                            title: 'Takmeel and Revision',
                            copy: 'Completion of the full Quran is followed by thorough revision, testing, and confident consolidation.',
                        },
                    ],
                    levels: {
                        title: 'Levels of Study',
                        intro: 'The memorization program is arranged across 6 levels, progressing through four academic years.',
                        items: [
                            { number: '01.', title: 'First Year', copy: '05 Juz - Level 01' },
                            { number: '02.', title: 'Second Year', copy: '10 Juz - Levels 02 and 03' },
                            { number: '03.', title: 'Third Year', copy: '15 Juz - Levels 04, 05 and 06' },
                            { number: '04.', title: 'Fourth Year', copy: 'Doura - Revision 3 times' },
                        ],
                    },
                    typicalDay: {
                        title: 'A Typical Day',
                        copy: 'Our daily routine is designed to protect focus in the early hours while balancing rest, revision, worship, and formal study.',
                        cta: 'View Daily Routine',
                    },
                },
                students: {
                    meta: {
                        title: "Student Life | Institute of Da'wa Islamiyya",
                        description: 'Explore the daily routine and spiritual environment for students at our Institute.',
                    },
                    hero: {
                        subtitle: 'Life at IDI',
                        title: 'Student Journey',
                        copy: 'A balanced environment of discipline, spirituality, and brotherhood.',
                    },
                    intro: {
                        subtitle: 'Routine',
                        title: 'A Day of Devotion',
                        copy: 'Explore the disciplined and spiritual daily journey of our students across different schedules.',
                    },
                    tabs: {
                        weekdays: 'Mon - Thu',
                        friday: 'Friday',
                        weekend: 'Sat - Sun',
                    },
                    schedules: {
                        weekdays: [
                            ['4:30 AM', 'Wake up and Prep', "Rising early and preparing for the day's spiritual journey."],
                            ['4:50 AM', 'Subah (Fajr) Prayer', 'Congregational morning prayer in the academy mosque.'],
                            ['5:15 AM', 'Morning Tea', 'A light morning refreshment before the first session.'],
                            ['5:25 AM', 'New Lesson (Sabaq)', 'Focused memorization of new Quran portions.'],
                            ['6:30 AM', 'Cleaning and Academy Prep', 'Cleaning the premises and preparing for school hours.'],
                            ['7:30 AM', 'Academy / School', 'Regular academic curriculum and structured learning.'],
                            ['2:00 PM', 'Body Wash and Prep', 'Personal hygiene and preparation for Zuhr prayer.'],
                            ['2:15 PM', 'Zuhr Prayer', 'Midday congregational prayer.'],
                            ['2:30 PM', 'Lunch Break', 'A nutritious midday meal with the student community.'],
                            ['3:00 PM', 'Compulsory Rest', 'Qailulah for physical and mental recovery.'],
                            ['4:00 PM', 'Asr and Tea', 'Afternoon prayer followed by a light tea break.'],
                            ['4:10 PM', 'Revision (Dour)', 'Systematic revision of previously memorized lessons.'],
                            ['5:30 PM', 'Rest and Leisure', 'Free time for relaxation or personal study.'],
                            ['6:00 PM', 'Maghrib Prep', 'Preparation for the evening congregational prayer.'],
                            ['6:10 PM', 'Evening Adhkar and Maghrib', 'Spiritual reflection followed by Maghrib prayer.'],
                            ['6:30 PM', 'Memorization Session', 'Evening session for memorizing new Quran portions.'],
                            ['8:00 PM', 'School and Self Study', 'Academic revision and personal study hour.'],
                            ['9:00 PM', 'Isha Prayer', 'The final congregational prayer of the day.'],
                            ['9:20 PM', 'Dinner', 'Evening meal before preparing for rest.'],
                            ['9:45 PM', 'Sleep Prep', 'Final hygiene routine and preparation for bed.'],
                            ['10:00 PM', 'Compulsory Sleep', 'Ensuring adequate rest for a fresh early start.'],
                        ],
                        friday: [
                            ['4:30 AM', 'Wake up and Prep', 'Rising early and preparing for the day.'],
                            ['4:50 AM', 'Subah Prayer', 'Morning congregational prayer.'],
                            ['5:15 AM', 'Morning Tea', 'A light morning refreshment.'],
                            ['5:25 AM', 'New Lesson (Sabaq)', 'Quran memorization session.'],
                            ['6:30 AM', 'Cleaning and Prep', 'Cleaning the academy and preparing for school.'],
                            ['7:30 AM', 'Academy / School', 'Morning academic sessions.'],
                            ['11:30 AM', "Jumu'ah Prep", 'Special preparation for Friday congregational prayer.'],
                            ['11:50 AM', "Jumu'ah Prayer", 'Friday Khutbah and congregational prayer.'],
                            ['1:30 PM', 'Friday Lunch', 'Special Friday midday meal.'],
                            ['2:15 PM', 'Compulsory Rest', 'Midday rest for physical recovery.'],
                            ['3:30 PM', 'Asr Prayer', 'Afternoon congregational prayer.'],
                            ['4:00 PM', 'Parents Meeting', 'Visiting hours and parent-faculty meetings.'],
                            ['6:00 PM', 'Maghrib Prayer', 'Evening congregational prayer.'],
                            ['6:30 PM', 'Rest Period', 'Free time for relaxation and personal study.'],
                            ['7:30 PM', 'Isha Prayer', 'Final congregational prayer.'],
                            ['8:00 PM', 'Dinner', 'Evening meal with the community.'],
                            ['8:30 PM', 'Sleep Preparation', 'Preparing for early rest.'],
                            ['9:00 PM', 'Compulsory Sleep', 'Night rest until 4:30 AM.'],
                        ],
                        weekend: [
                            ['4:30 AM', 'Wake up and Prep', 'Early morning rising and preparation.'],
                            ['4:50 AM', 'Subah Prayer', 'Morning congregational prayer.'],
                            ['5:15 AM', 'Morning Tea', 'Refreshing morning tea break.'],
                            ['5:25 AM', 'New Lesson (Sabaq)', 'Intense Quran memorization session.'],
                            ['6:45 AM', 'Cleaning and Prep', 'Academy cleaning and preparation.'],
                            ['8:00 AM', 'Breakfast', 'Morning meal with the academy community.'],
                            ['8:30 AM', 'Revision (Dour)', 'Detailed revision of memorized portions.'],
                            ['10:30 AM', 'Rest Period', 'Mid-morning leisure and relaxation.'],
                            ['11:00 AM', 'Arabic Class', 'Arabic language and linguistic study.'],
                            ['12:00 PM', 'Zuhr Prayer', 'Midday congregational prayer.'],
                            ['12:30 PM', 'Lunch Break', 'Midday meal with fellow students.'],
                            ['1:15 PM', 'Compulsory Rest', 'Extended afternoon nap for recovery.'],
                            ['3:45 PM', 'Asr Prayer', 'Afternoon congregational prayer.'],
                            ['4:15 PM', 'Revision (Dour)', 'Late afternoon Quranic revision.'],
                            ['5:30 PM', 'Rest Period', 'Free time before Maghrib.'],
                            ['6:00 PM', 'Evening Adhkar and Maghrib', 'Evening spiritual session and prayer.'],
                            ['6:30 PM', 'Memorization Session', 'Evening memorization session.'],
                            ['8:30 PM', 'Isha Prayer', 'Final congregational prayer.'],
                            ['9:00 PM', 'Dinner', 'Evening meal before rest.'],
                            ['9:30 PM', 'Sleep Preparation', 'Night hygiene and preparation.'],
                            ['9:45 PM', 'Compulsory Sleep', "Full night's rest until 4:30 AM."],
                        ],
                    },
                },
                alumni: {
                    meta: {
                        title: "Alumni | Institute of Da'wa Islamiyya",
                        description: 'Meet the proud graduates of our Hifz program. Torchbearers of the Quran across the globe.',
                    },
                    hero: {
                        subtitle: 'Our Graduates',
                        title: 'The Alumni',
                        copy: 'Torchbearers of the Quran spreading light across the wider community.',
                    },
                    filters: {
                        all: 'All',
                        '1995': '1st Convocation',
                        '1997': '2nd Convocation',
                        '1998': '3rd Convocation',
                        '1999': '4th Convocation',
                        '2000': '5th Convocation',
                        '2001': '6th Convocation',
                        '2006': '7th Convocation',
                        '2011': '8th Convocation',
                        '2014': '9th Convocation',
                        '2020': '10th Convocation',
                        Upcoming: 'Ready to Upcoming',
                        'Exam-New': 'Preparing to Exam',
                    },
                    loading: 'Summoning the Graduates...',
                    empty: 'No graduates found for this category.',
                    loadError: 'Failed to load alumni data.',
                    badge: {
                        convocation: 'Convocation',
                        upcoming: 'Ready to Upcoming',
                        examNew: 'Preparing to Exam',
                        newSyllabus: 'New Syllabus',
                    },
                    originPrefix: 'From ',
                },
                gallery: {
                    meta: {
                        title: "Gallery | Institute of Da'wa Islamiyya",
                        description: "View glimpses of life and learning at the Institute of Da'wa Islamiyya. Our proud moments captured.",
                    },
                    hero: {
                        subtitle: 'Moments Captured',
                        title: 'Our Gallery',
                        copy: 'Glimpses of life, learning, and spiritual growth at the Institute.',
                    },
                    filters: {
                        All: 'All Moments',
                        'Life at IDI': 'Life at IDI',
                        Campus: 'Our Campus',
                        Events: 'Special Events',
                    },
                    captions: {
                        1: 'Students studying the Quran in the main hall.',
                        2: 'Beautiful interior of the Madrasa Mosque.',
                        3: 'Annual gathering and prize distribution.',
                        4: 'Evening Dua after Maghrib prayers.',
                    },
                    loading: 'Unfolding Memories...',
                    empty: 'No images found in this category yet.',
                    loadError: 'Failed to load images.',
                },
                contact: {
                    meta: {
                        title: "Contact Us | Institute of Da'wa Islamiyya",
                        description: "Get in touch with the Institute of Da'wa Islamiyya for admissions and inquiries.",
                    },
                    hero: {
                        subtitle: 'Get in Touch',
                        title: 'Contact Us',
                        copy: 'We are here to assist you with any inquiries regarding our programs and admissions.',
                    },
                    info: {
                        subtitle: 'Reach Out',
                        title: "Let's Start a Conversation",
                        visitTitle: 'Visit Us',
                        visitCopy: '123 Madrasa Lane, Islamic District,<br>City, State 12345',
                        callTitle: 'Call Us',
                        callCopy: '+1 234 567 890<br>+1 987 654 321',
                        emailTitle: 'Email Us',
                        emailCopy: 'info@idi.edu<br>admissions@idi.edu',
                    },
                    form: {
                        subject: 'New Inquiry from IDI Website',
                        name: 'Full Name',
                        city: 'City / Location',
                        phone: 'Phone Number',
                        message: 'Your Message',
                        submit: 'Send Message',
                    },
                },
                management: {
                    meta: {
                        title: "Management | Institute of Da'wa Islamiyya",
                        description: "Meet the visionary leadership and dedicated staff behind the Institute of Da'wa Islamiyya.",
                    },
                    hero: {
                        subtitle: 'Our Team',
                        title: 'The Management',
                        copy: 'The dedicated team guiding the spiritual and academic journey of our students.',
                    },
                    intro: {
                        subtitle: 'Leadership',
                        title: 'Guiding Lights',
                    },
                    cards: [
                        {
                            role: 'Principal and Head of Hifz',
                            description: 'Leading the institution with decades of experience in Quranic sciences and educational management.',
                        },
                        {
                            role: 'Vice Principal and Tajweed Expert',
                            description: "Maintaining high standards of Qira'at while overseeing the students' daily spiritual curriculum.",
                        },
                        {
                            role: 'Chief Administrator',
                            description: 'Managing student affairs, admissions, and a calm learning environment for every resident.',
                        },
                    ],
                },
                result: {
                    meta: {
                        title: "Check Results | Institute of Da'wa Islamiyya",
                        description: "Official result checking portal for students of the Institute of Da'wa Islamiyya.",
                    },
                    hero: {
                        subtitle: 'Examination Portal',
                        title: 'Check Results',
                        copy: 'Access your academic performance and progress reports securely.',
                    },
                    search: {
                        title: 'Student Inquiry',
                        regLabel: 'Registration Number',
                        examLabel: 'Examination',
                        yearLabel: 'Academic Year',
                        examPlaceholder: 'Select Exam',
                        yearPlaceholder: 'Select Year',
                        exams: {
                            Annual: 'Annual Exam',
                            'Mid-Term': 'Mid-Term Exam',
                            Monthly: 'Monthly Test',
                        },
                        submit: 'Generate Report',
                        selectBoth: 'Please select both Examination and Academic Year.',
                        notFound: 'No result was found for the provided details.',
                        dbError: 'Error accessing result database. Please try again later.',
                        localBlocked: '<strong>Local file access blocked:</strong> open the website through a local server or host it online so the result database can be read.',
                    },
                    result: {
                        statement: 'Official Statement of Results',
                        labels: ['Registration No', 'Class / Level', 'Examination', 'Academic Year'],
                        tableHeaders: ['Subject / Study Area', 'Max Marks', 'Marks Obtained'],
                        summary: ['Aggregate Total', 'Letter Grade', 'Final Status'],
                        signatures: ['Class Teacher', 'Controller of Examinations', 'Principal'],
                        footerPrefix: 'Generated on:',
                        footerCenter: "Institute of Da'wa Islamiyya - Official Document",
                        footerRight: 'Seal Required for Validity',
                        print: 'Print Official Marksheet',
                        status: { pass: 'Pass', fail: 'Fail' },
                        subjects: {
                            'Quran Memorization': 'Quran Memorization',
                            Tajweed: 'Tajweed',
                            'Islamic Studies': 'Islamic Studies',
                            'Arabic Language': 'Arabic Language',
                        },
                    },
                },
                open: {
                    meta: {
                        title: "Official Launch - Institute of Da'wa Islamiyya",
                        description: "Official Website Launch of the Institute of Da'wa Islamiyya.",
                    },
                    page: {
                        bismillah: 'Bismillahir Rahmanir Rahim',
                        name: "Institute of Da'wa Islamiyya",
                        tagline: 'Nurturing Hearts with the Light of Quran',
                        welcome: 'We are <strong>honored and delighted</strong> to announce the official launch of our website - a digital home for our students, alumni, and all who seek <strong>knowledge, guidance, and light</strong> through the Quran.',
                        launch: 'Launch Website',
                        launched: 'Launched!',
                        ribbon: 'Official Launch',
                        celebrateTitle: 'Congratulations!',
                        celebrateCopy: "The official website of <strong style=\"color:var(--gold-l)\">Institute of Da'wa Islamiyya</strong> is now live. May Allah bless this endeavour and make it a source of benefit for all.",
                        quote: '"Read in the name of your Lord who created." - Al-Quran 96:1',
                        enter: 'Enter the Website',
                        dateLabel: 'Launch Date',
                    },
                },
            },
        },
        ta: {
            common: {
                switcher: { en: 'EN', ta: 'தமிழ்' },
                modal: {
                    title: 'மொழியை தேர்வு செய்யவும்',
                    copy: 'நிறுவனத்தின் இணையதளத்தை எந்த மொழியில் பார்க்க விரும்புகிறீர்கள் என்பதைத் தேர்வு செய்யுங்கள். உங்கள் தேர்வு அடுத்த வருகைக்கும் சேமிக்கப்படும்.',
                    englishTitle: 'English',
                    englishCopy: 'ஆங்கிலத்தில் தொடரவும்',
                    tamilTitle: 'தமிழ்',
                    tamilCopy: 'தமிழில் தொடரவும்',
                },
                nav: {
                    home: 'முகப்பு',
                    about: 'அறிமுகம்',
                    hifz: 'ஹிஃப்ழ் பாடத்திட்டம்',
                    students: 'மாணவர்கள்',
                    alumni: 'பழைய மாணவர்கள்',
                    gallery: 'கேலரி',
                    contact: 'தொடர்பு',
                },
                footer: {
                    brandTitle: 'தஃவா இஸ்லாமிய்யா நிறுவனம்',
                    brandCopy: 'குர்ஆன் மனனமும் இஸ்லாமியக் கல்வியும் மூலம் அடுத்த தலைமுறையை உருவாக்கும் சிறப்புமிக்க நிலையம்.',
                    quickLinks: 'விரைவு இணைப்புகள்',
                    information: 'தகவல்கள்',
                    contact: 'தொடர்பு',
                    aboutUs: 'எங்களை பற்றி',
                    studentLife: 'மாணவர் வாழ்க்கை',
                    contactUs: 'எங்களை தொடர்புகொள்ள',
                    ourAlumni: 'எங்கள் பழைய மாணவர்கள்',
                    checkResults: 'முடிவுகளை பார்க்க',
                    admissions: 'சேர்க்கை',
                    address: '123 மத்ரஸா லேன், நகரம்',
                    phone: '+1 234 567 890',
                    email: 'info@idi.edu',
                    rights: '&copy; 2026 தஃவா இஸ்லாமிய்யா கலாபீடம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
                    designedBy: 'NanoVext இணையத் தீர்வு',
                },
            },
            pages: {
                index: {
                    meta: {
                        title: 'தஃவா இஸ்லாமிய்யா கலாபீடம் | ஹிஃப்ழில் சிறப்பு',
                        description: 'அமைதியான மற்றும் சிறப்பான அல்குர்ஆன் ஹிஃப்ழ் மத்ரஸா. குர்ஆனின் ஒளியால் இதயங்களை வளர்த்திடும் கலாபீடம்.',
                    },
                    hero: {
                        subtitle: 'பிஸ்மில்லாஹிர் ரஹ்மானிர் ரஹீம்',
                        title: '<span class="hero-line">அல்-குர்ஆனின் ஒளியால்</span><span class="hero-line">இதயங்களை வளர்ப்போம்</span>',
                        copy: 'தஃவா இஸ்லாமிய்யா கலாபீடத்திற்கு வரவேற்கிறோம். குர்ஆன் மனனம், ஆன்மிக வளர்ச்சி, இஸ்லாமிய பண்புகள் ஆகியவற்றில் சிறப்பை நோக்கும் அர்ப்பணிப்புள்ள ஹிஃப்ழ் கல்வியகம் இது.',
                        primary: 'மேலும் அறிய',
                        secondary: 'தொடர்பு கொள்ள',
                    },
                    foundation: {
                        subtitle: 'எங்கள் அடித்தளம்',
                        title: 'சிறப்பின் பாரம்பரியம்',
                    },
                    cards: [
                        {
                            title: 'ஹிஃப்ழ் பாடத்திட்டம்',
                            copy: 'ஒவ்வொரு மாணவருக்கும் தஜ்வீதுடன் கூடிய முழுமையான குர்ஆன் மனனப் பயிற்சியும் தர்பியாவும்.',
                        },
                        {
                            title: 'இஸ்லாமியக் கல்வி',
                            copy: 'ஹிஃப்ழுடன் இணைந்து ஃபிக்ஹ், ஹதீஸ், ஸீரா போன்ற துறைகளில் அர்த்தமுள்ள பயிற்சி.',
                        },
                        {
                            title: 'முழுமையான தர்பியா',
                            copy: 'ஆன்மிக சூழல், வழிகாட்டுதல், ஒழுக்கம் ஆகியவற்றின் மூலம் குணநலன் வளர்ப்பு.',
                        },
                        {
                            title: 'பொதுக் கல்வி',
                            copy: '6ஆம் வகுப்பு முதல் O/L வரை ஹிஃப்ழும் பாடசாலைப் படிப்பும் ஒன்றாக முன்னேற வழிகாட்டல்.',
                        },
                    ],
                    featured: {
                        subtitle: 'எங்களுடன் சேருங்கள்',
                        title: 'ஏன் IDI?',
                        copy: 'அனுபவமிக்க உஸ்தாத்களின் வழிகாட்டுதலுடன் மாணவர்கள் குர்ஆனோடு ஆழமான தொடர்பை உருவாக்க அமைதியான மற்றும் ஒழுக்கமான சூழலை நாங்கள் வழங்குகிறோம்.',
                        bullets: [
                            'திறமையான தஜ்வீத் பயிற்சி',
                            'மாணவருக்கு ஏற்ற தனிப்பயன் கற்றல் பாதை',
                            'வலுவான ஆன்மிக வழிகாட்டுதல்',
                            'சௌகரியமான விடுதி வசதிகள்',
                            'தரமான சத்தான உணவு',
                            'மாணவர் நலனைக் கவனிக்கும் நடைமுறைகள்',
                            'ஹிஃப்ழும் பொதுக் கல்வியும் ஒருங்கிணைப்பு',
                        ],
                        cta: 'பாடத்திட்டங்களைப் பார்க்க',
                    },
                },
                about: {
                    meta: {
                        title: 'எங்களை பற்றி | தஃவா இஸ்லாமிய்யா கலாபீடம்',
                        description: 'தஃவா இஸ்லாமிய்யா கலாபீடத்தின் வரலாறும் பணி நோக்கமும் பற்றி அறிந்து கொள்ளுங்கள்.',
                    },
                    hero: {
                        subtitle: 'எங்கள் வரலாறு',
                        title: 'கலாபீடம் பற்றி',
                        copy: 'ஈமான், அர்ப்பணிப்பு, குர்ஆனிய சிறப்பை நோக்கிய ஒரு பயணம்.',
                        cta: 'எங்கள் நிர்வாகத்தை சந்திக்கவும்',
                    },
                    cards: [
                        {
                            title: 'மகுட வாசகம்',
                            label: '(MOTTO)',
                            copy: 'புனித அல்-குர் ஆனை செம்மையாகவும் முழுமையாகவும் மனனம் செய்வோம்',
                        },
                        {
                            title: 'தூர நோக்கு',
                            label: '(VISION)',
                            copy: 'அல் குர்ஆனைச் சுமக்கும் பல்துறை சார் முன்மாதிரி இஸ்லாமிய ஆளுமைகளை உருவாக்கும் தனித்துவமான நிறுவனம்',
                        },
                        {
                            title: 'பணி நோக்கம்',
                            label: '(MISSION)',
                            copy: 'காலத்திற்குக் காலம் பொருத்தமான வழி முறைகள் ஊடாக நடு நிலையான சிந்தனையை பிரதிபலித்து, அல்-குர்ஆனுக்கு பணிவிடை செய்யும் ஓர் அறிவுப் பரம்பரையையும் அல் - குர்ஆனை முறையாக மனனம் செய்த பல்துறை சார்ந்த "ஹாபிழ்"களையும் உருவாக்கல்',
                        },
                    ],
                    legacy: {
                        subtitle: 'எங்கள் வரலாறு',
                        title: 'ஈமான் மற்றும் சிறப்பின் பாரம்பரியம்',
                        copyOne: 'உயர்ந்த நோக்கத்துடன் தொடங்கப்பட்ட தஃவா இஸ்லாமிய்யா கலாபீடம், குர்ஆனை மனனம் செய்ய விரும்பும் மாணவர்களுக்கு அதன் போதனைகளை வாழ்வில் பிரதிபலிக்க உதவும் ஒரு ஒளிக்கோபுரமாக உள்ளது.',
                        copyTwo: 'ஹிஃப்ழ் என்பது வெறும் மனனம் அல்ல. அது அல்லாஹ்வின் வார்த்தைகளோடு ஆயுள் முழுவதும் தொடரும் உறவு. அது நல்ல அக்லாக், ஒழுக்கம், பயனுள்ள அறிவு ஆகியவற்றில் வெளிப்பட வேண்டும் என்பதே எங்கள் நம்பிக்கை.',
                        valuesTitle: 'எங்கள் அடிப்படை மதிப்புகள்',
                        values: [
                            'இக்லாஸ் (நேர்மை)',
                            'இஹ்சான் (சிறப்பு)',
                            'அதப் (ஒழுக்கம்)',
                        ],
                    },
                    goals: {
                        title: 'இலக்குகள்',
                        label: '(GOALS)',
                        items: [
                            'அல்-குர்ஆனை மனனம் செய்து அதற்கு பணிவிடை செய்யும் ஒரு பரம்பரையை உருவாக்கல்.',
                            'அல்-குர்ஆனிய அறிவைப் பெற்ற பல்துறை சார்ந்த ஆளுமைகளை உருவாக்கல்.',
                            'ஆன்மீக மற்றும் பண்பாட்டு ரீதியாக பயிற்றுவிக்கப்பட்ட ஆளுமைகளை உருவாக்கல்.',
                            'நடுநிலைமை மற்றும் முழுமைத்தன்மை ஆகிய பண்புகளைஅடிப்படையாகக் கொண்டு இஸ்லாமிய சிந்தனையைப் பரப்புதல்.',
                            'தீனுக்கும் சமூகத்திற்கும் நற்பணி புரியும் சாலிஹான பிரஜைகளை உருவாக்கல்.',
                            'இலங்கையின் பொதுக்கல்வியின் இலக்குகளை அடைந்து தேசிய தொழில் தகைமைகளை அடைவதற்கான வழிகாட்டல்.',
                        ],
                    },
                },
                hifz: {
                    meta: {
                        title: 'ஹிஃப்ழ் பாடத்திட்டம் | தஃவா இஸ்லாமிய்யா நிறுவனம்',
                        description: 'எங்கள் முழுமையான தஹ்ஃபீஸுல் குர்ஆன் திட்டத்தை அறிந்து கொள்ளுங்கள். புனித குர்ஆனை மனனம் செய்ய ஒரு ஒழுங்குபடுத்தப்பட்ட அணுகுமுறை.',
                    },
                    hero: {
                        subtitle: 'எங்கள் திட்டம்',
                        title: 'தஹ்ஃபீஸுல் குர்ஆன்',
                        copy: 'சரியான தஜ்வீதுடன் புனித குர்ஆனை மனனம் செய்ய ஒழுங்குபடுத்தப்பட்ட மற்றும் ஆன்மிகமான ஒரு பாதை.',
                    },
                    journey: {
                        subtitle: 'பயண பாதை',
                        title: 'எங்கள் பாடத்திட்டம்',
                    },
                    cards: [
                        {
                            title: 'நாழிரா மற்றும் தஜ்வீத்',
                            copy: 'மனனத்தை தொடங்கும் முன் சரளமான ஓதல், மஃகாரிஜ், தஜ்வீத் விதிகள் ஆகியவற்றில் வலிமை பெறுதல்.',
                        },
                        {
                            title: 'தினசரி சபக் மற்றும் தௌர்',
                            copy: 'ஒவ்வொரு நாளும் புதிய மனனப் பகுதி, திருப்புப் பயிற்சி, நினைவகத்தை உறுதிப்படுத்தும் வழிகாட்டப்பட்ட மீள்பார்வை.',
                        },
                        {
                            title: 'தக்மீல் மற்றும் முழு திருப்புப் பயிற்சி',
                            copy: 'முழு குர்ஆன் நிறைவு பெற்ற பின் முழுமையான திருப்புப் பயிற்சியும் பரிசோதனைகளும் மேற்கொள்ளப்படும்.',
                        },
                    ],
                    levels: {
                        title: 'நிலை வாரியான பாடத்திட்டம்',
                        intro: 'மனனப் பகுதி 6 நிலைகளைக் கொண்டு அமைக்கப்பட்டுள்ளது. ஒவ்வொரு முன்னேற்றமும் 4 வருடக் கட்டமைப்பில் தொடர்கிறது.',
                        items: [
                            { number: '01.', title: 'முதல் வருடம்', copy: '05 ஜூஸ்உக்கள் - 01ம் நிலை' },
                            { number: '02.', title: 'இரண்டாம் வருடம்', copy: '10 ஜூஸ்உக்கள் - 02, 03ம் நிலை' },
                            { number: '03.', title: 'மூன்றாம் வருடம்', copy: '15 ஜூஸ்உக்கள் - 04, 05, 06ம் நிலை' },
                            { number: '04.', title: 'நான்காம் வருடம்', copy: 'தெளரா - மீட்டல் 3 தடவைகள்' },
                        ],
                    },
                    typicalDay: {
                        title: 'ஒரு நாளின் ஒழுங்கு',
                        copy: 'அதிகாலை கவனம், போதுமான ஓய்வு, திருப்புப் பயிற்சி, இபாதத் மற்றும் பாடசாலைப் படிப்பு ஆகியவற்றை சமநிலைப்படுத்தும் வகையில் எங்கள் தினசரி அட்டவணை அமைக்கப்பட்டுள்ளது.',
                        cta: 'தினசரி ஒழுங்கைப் பார்க்க',
                    },
                },
                students: {
                    meta: {
                        title: 'மாணவர் வாழ்க்கை | தஃவா இஸ்லாமிய்யா நிறுவனம்',
                        description: 'எங்கள் நிறுவன மாணவர்களின் தினசரி ஒழுங்கையும் ஆன்மிக சூழலையும் அறியுங்கள்.',
                    },
                    hero: {
                        subtitle: 'IDIயில் வாழ்க்கை',
                        title: 'மாணவர் பயணம்',
                        copy: 'ஒழுக்கம், ஆன்மிகம், சகோதரத்துவம் ஆகியவற்றின் சமநிலையான சூழல்.',
                    },
                    intro: {
                        subtitle: 'ஒழுங்கு',
                        title: 'இபாதத் நிரம்பிய நாள்',
                        copy: 'வாரத்தின் பல்வேறு அட்டவணைகளில் எங்கள் மாணவர்களின் ஒழுக்கமான மற்றும் ஆன்மிகமான தினசரி பயணத்தை அறியுங்கள்.',
                    },
                    tabs: {
                        weekdays: 'திங்கள் - வியாழன்',
                        friday: 'வெள்ளிக்கிழமை',
                        weekend: 'சனி - ஞாயிறு',
                    },
                    schedules: {
                        weekdays: [
                            ['4:30 AM', 'எழுதல் மற்றும் தயாராகுதல்', 'அதிகாலையில் எழுந்து நாளின் ஆன்மிகப் பயணத்திற்கு தயாராகுதல்.'],
                            ['4:50 AM', 'சுபஹ் (பஜ்ர்) தொழுகை', 'கல்வியக பள்ளிவாசலில் ஜமாஅத் தொழுகை.'],
                            ['5:15 AM', 'காலை தேநீர்', 'முதல் அமர்வுக்கு முன் இலகுவான சிற்றுண்டி.'],
                            ['5:25 AM', 'புதிய சபக்', 'புதிய குர்ஆன் பகுதிகளை கவனத்துடன் மனனம் செய்தல்.'],
                            ['6:30 AM', 'சுத்தம் மற்றும் கல்வியகத் தயார்', 'வளாகத்தை சுத்தம் செய்து பாடசாலை நேரத்திற்கு தயாராகுதல்.'],
                            ['7:30 AM', 'கல்வியகம் / பாடசாலை', 'ஒழுங்கமைக்கப்பட்ட கல்விப் பாடங்களும் கற்றலும்.'],
                            ['2:00 PM', 'குளியல் மற்றும் தயாராகுதல்', 'துஹ்ர் தொழுகைக்கு முன் தனிநபர் சுத்தமும் தயார் செய்தலும்.'],
                            ['2:15 PM', 'துஹ்ர் தொழுகை', 'நண்பகல் ஜமாஅத் தொழுகை.'],
                            ['2:30 PM', 'மதிய உணவு', 'மாணவர் சமுதாயத்துடன் சத்தான உணவு.'],
                            ['3:00 PM', 'கட்டாய ஓய்வு', 'உடல் மன ஓய்வுக்கான கய்லூலா.'],
                            ['4:00 PM', 'அஸர் மற்றும் தேநீர்', 'மாலை தொழுகைக்குப் பின் இலகுவான தேநீர் நேரம்.'],
                            ['4:10 PM', 'திருப்புப் பயிற்சி (தௌர்)', 'முன்னர் மனனம் செய்த பாடங்களை முறைப்படுத்தி மீள்பார்த்தல்.'],
                            ['5:30 PM', 'ஓய்வு மற்றும் தனிநேரம்', 'சிறிது ஓய்வு அல்லது தனிப்பட்ட படிப்புக்கான நேரம்.'],
                            ['6:00 PM', 'மஃரிப் தயார்ப்பு', 'மாலை ஜமாஅத் தொழுகைக்கு தயாராகுதல்.'],
                            ['6:10 PM', 'மாலை அத்கார் மற்றும் மஃரிப்', 'மாலை திக்ரும் மஃரிப் தொழுகையும்.'],
                            ['6:30 PM', 'மனன அமர்வு', 'புதிய குர்ஆன் பகுதிகளை மனனம் செய்யும் மாலை அமர்வு.'],
                            ['8:00 PM', 'பாடசாலை / சுயபயிற்சி', 'கல்வி திருப்புப் பயிற்சியும் தனிப்பட்ட படிப்பும்.'],
                            ['9:00 PM', 'இஷா தொழுகை', 'நாளின் இறுதி ஜமாஅத் தொழுகை.'],
                            ['9:20 PM', 'இரவு உணவு', 'ஓய்விற்கு முன் இரவு உணவு.'],
                            ['9:45 PM', 'தூக்கத் தயார்ப்பு', 'இறுதி சுத்தம் மற்றும் தூக்கத்திற்கு தயாராகுதல்.'],
                            ['10:00 PM', 'கட்டாய நித்திரை', 'அடுத்த நாள் அதிகாலை புத்துணர்ச்சிக்குத் தேவையான ஓய்வு.'],
                        ],
                        friday: [
                            ['4:30 AM', 'எழுதல் மற்றும் தயாராகுதல்', 'அதிகாலையில் எழுந்து நாளுக்குத் தயாராகுதல்.'],
                            ['4:50 AM', 'சுபஹ் தொழுகை', 'காலை ஜமாஅத் தொழுகை.'],
                            ['5:15 AM', 'காலை தேநீர்', 'இலகுவான காலை பானம்.'],
                            ['5:25 AM', 'புதிய சபக்', 'குர்ஆன் மனன அமர்வு.'],
                            ['6:30 AM', 'சுத்தம் மற்றும் தயார்', 'கல்வியகத்தை சுத்தம் செய்து பாடசாலைக்குத் தயாராகுதல்.'],
                            ['7:30 AM', 'கல்வியகம் / பாடசாலை', 'காலை நேரக் கல்வி அமர்வுகள்.'],
                            ['11:30 AM', 'ஜுமுஆ தயார்ப்பு', 'வெள்ளிக்கிழமை ஜமாஅத் தொழுகைக்கான சிறப்பு தயார்ப்பு.'],
                            ['11:50 AM', 'ஜுமுஆ தொழுகை', 'குத்பாவும் ஜமாஅத் தொழுகையும்.'],
                            ['1:30 PM', 'வெள்ளி மதிய உணவு', 'வெள்ளிக்கிழமை சிறப்பு மதிய உணவு.'],
                            ['2:15 PM', 'கட்டாய ஓய்வு', 'உடல் ஓய்வுக்கான பிற்பகல் ஓய்வு.'],
                            ['3:30 PM', 'அஸர் தொழுகை', 'மாலை ஜமாஅத் தொழுகை.'],
                            ['4:00 PM', 'பெற்றோர் சந்திப்பு', 'வருகை நேரமும் பெற்றோர்-ஆசிரியர் சந்திப்பும்.'],
                            ['6:00 PM', 'மஃரிப் தொழுகை', 'மாலை ஜமாஅத் தொழுகை.'],
                            ['6:30 PM', 'ஓய்வு நேரம்', 'தளர்ச்சி மற்றும் தனிப்பட்ட படிப்புக்கான நேரம்.'],
                            ['7:30 PM', 'இஷா தொழுகை', 'இறுதி ஜமாஅத் தொழுகை.'],
                            ['8:00 PM', 'இரவு உணவு', 'சமூகத்துடன் இரவு உணவு.'],
                            ['8:30 PM', 'தூக்கத் தயார்ப்பு', 'முன்கூட்டியே ஓய்விற்கு தயார் செய்தல்.'],
                            ['9:00 PM', 'கட்டாய நித்திரை', 'அதிகாலை 4:30 வரை இரவு ஓய்வு.'],
                        ],
                        weekend: [
                            ['4:30 AM', 'எழுதல் மற்றும் தயாராகுதல்', 'அதிகாலையில் எழுந்து நாளுக்குத் தயாராகுதல்.'],
                            ['4:50 AM', 'சுபஹ் தொழுகை', 'காலை ஜமாஅத் தொழுகை.'],
                            ['5:15 AM', 'காலை தேநீர்', 'புத்துணர்ச்சி தரும் காலை தேநீர்.'],
                            ['5:25 AM', 'புதிய சபக்', 'கவனமிக்க குர்ஆன் மனன அமர்வு.'],
                            ['6:45 AM', 'சுத்தம் மற்றும் தயார்', 'கல்வியகச் சுத்தமும் அடுத்த அமர்விற்கான தயார் செய்தலும்.'],
                            ['8:00 AM', 'காலை உணவு', 'கல்வியக சமூகத்துடன் காலை உணவு.'],
                            ['8:30 AM', 'திருப்புப் பயிற்சி (தௌர்)', 'மனனம் செய்த பகுதிகளை விரிவாக மீள்பார்த்தல்.'],
                            ['10:30 AM', 'ஓய்வு நேரம்', 'காலை நடுப்பகுதி ஓய்வும் தளர்ச்சியும்.'],
                            ['11:00 AM', 'அரபு வகுப்பு', 'அரபு மொழியும் இலக்கணப் பயிற்சியும்.'],
                            ['12:00 PM', 'துஹ்ர் தொழுகை', 'நண்பகல் ஜமாஅத் தொழுகை.'],
                            ['12:30 PM', 'மதிய உணவு', 'மாணவர்களுடன் மதிய உணவு.'],
                            ['1:15 PM', 'கட்டாய ஓய்வு', 'மீள்ச்சி பெற நீண்ட பிற்பகல் ஓய்வு.'],
                            ['3:45 PM', 'அஸர் தொழுகை', 'மாலை ஜமாஅத் தொழுகை.'],
                            ['4:15 PM', 'திருப்புப் பயிற்சி (தௌர்)', 'பிற்பகல் குர்ஆன் திருப்புப் பயிற்சி.'],
                            ['5:30 PM', 'ஓய்வு நேரம்', 'மஃரிப் முன் தனிநேரம்.'],
                            ['6:00 PM', 'மாலை அத்கார் மற்றும் மஃரிப்', 'மாலை திக்ரும் தொழுகையும்.'],
                            ['6:30 PM', 'மனன அமர்வு', 'மாலை மனனப் பயிற்சி அமர்வு.'],
                            ['8:30 PM', 'இஷா தொழுகை', 'இறுதி ஜமாஅத் தொழுகை.'],
                            ['9:00 PM', 'இரவு உணவு', 'ஓய்விற்கு முன் இரவு உணவு.'],
                            ['9:30 PM', 'தூக்கத் தயார்ப்பு', 'இரவு சுத்தமும் தயாராகுதலும்.'],
                            ['9:45 PM', 'கட்டாய நித்திரை', 'அதிகாலை 4:30 வரை இரவு ஓய்வு.'],
                        ],
                    },
                },
                alumni: {
                    meta: {
                        title: 'பழைய மாணவர்கள் | தஃவா இஸ்லாமிய்யா நிறுவனம்',
                        description: 'எங்கள் ஹிஃப்ழ் திட்டத்தின் பெருமைக்குரிய பட்டதாரிகளை அறியுங்கள்.',
                    },
                    hero: {
                        subtitle: 'எங்கள் பட்டதாரிகள்',
                        title: 'பழைய மாணவர்கள்',
                        copy: 'குர்ஆனின் ஒளியை சமூகத்தின் பல திசைகளுக்கும் எடுத்துச் செல்லும் முன்னோடிகள்.',
                    },
                    filters: {
                        all: 'அனைத்தும்',
                        '1995': '1வது பட்டமளிப்பு',
                        '1997': '2வது பட்டமளிப்பு',
                        '1998': '3வது பட்டமளிப்பு',
                        '1999': '4வது பட்டமளிப்பு',
                        '2000': '5வது பட்டமளிப்பு',
                        '2001': '6வது பட்டமளிப்பு',
                        '2006': '7வது பட்டமளிப்பு',
                        '2011': '8வது பட்டமளிப்பு',
                        '2014': '9வது பட்டமளிப்பு',
                        '2020': '10வது பட்டமளிப்பு',
                        Upcoming: 'விரைவில் பட்டமளிப்பு',
                        'Exam-New': 'தேர்வுக்குத் தயாராகும்',
                    },
                    loading: 'பழைய மாணவர் தகவல்கள் ஏற்றப்படுகின்றன...',
                    empty: 'இந்த பிரிவில் மாணவர் பதிவுகள் இல்லை.',
                    loadError: 'பழைய மாணவர் தகவல்களை ஏற்ற முடியவில்லை.',
                    badge: {
                        convocation: 'பட்டமளிப்பு',
                        upcoming: 'விரைவில் பட்டமளிப்பு',
                        examNew: 'தேர்வுக்குத் தயாராகும்',
                        newSyllabus: 'புதிய பாடத்திட்டம்',
                    },
                    originPrefix: '',
                },
                gallery: {
                    meta: {
                        title: 'கேலரி | தஃவா இஸ்லாமிய்யா நிறுவனம்',
                        description: 'நிறுவனத்தின் வாழ்க்கை, கற்றல், ஆன்மிக வளர்ச்சி ஆகியவற்றின் நினைவுகளைப் பாருங்கள்.',
                    },
                    hero: {
                        subtitle: 'நினைவுகளின் தருணங்கள்',
                        title: 'எங்கள் கேலரி',
                        copy: 'நிறுவன வாழ்க்கை, கற்றல், ஆன்மிக வளர்ச்சி ஆகியவற்றின் அழகிய தருணங்கள்.',
                    },
                    filters: {
                        All: 'அனைத்து தருணங்களும்',
                        'Life at IDI': 'IDIயில் வாழ்க்கை',
                        Campus: 'எங்கள் வளாகம்',
                        Events: 'சிறப்பு நிகழ்வுகள்',
                    },
                    captions: {
                        1: 'முக்கிய மண்டபத்தில் குர்ஆன் பயிலும் மாணவர்கள்.',
                        2: 'மத்ரஸா பள்ளிவாசலின் அழகிய உட்புறம்.',
                        3: 'வருடாந்திர ஒன்று கூடலும் பரிசளிப்பு நிகழ்வும்.',
                        4: 'மஃரிப் தொழுகைக்குப் பிந்தைய மாலை துஆ.',
                    },
                    loading: 'நினைவுகள் விரிகின்றன...',
                    empty: 'இந்த பிரிவில் இதுவரை படங்கள் இல்லை.',
                    loadError: 'படங்களை ஏற்ற முடியவில்லை.',
                },
                contact: {
                    meta: {
                        title: 'தொடர்பு | தஃவா இஸ்லாமிய்யா நிறுவனம்',
                        description: 'சேர்க்கை மற்றும் விசாரணைகளுக்காக தஃவா இஸ்லாமிய்யா நிறுவனத்தை தொடர்புகொள்ளுங்கள்.',
                    },
                    hero: {
                        subtitle: 'தொடர்பில் இருங்கள்',
                        title: '<span class="hero-line">எங்களை</span><span class="hero-line">தொடர்புகொள்ளுங்கள்</span>',
                        copy: 'எங்கள் பாடத்திட்டங்கள் மற்றும் சேர்க்கை தொடர்பான உங்கள் கேள்விகளுக்கு உதவ எப்போதும் தயாராக உள்ளோம்.',
                    },
                    info: {
                        subtitle: 'தொடருங்கள்',
                        title: 'ஒரு உரையாடலைத் தொடங்குவோம்',
                        visitTitle: 'வருகை தரவும்',
                        visitCopy: '123 மத்ரஸா லேன், இஸ்லாமிய பகுதி,<br>நகரம், மாநிலம் 12345',
                        callTitle: 'அழைக்கவும்',
                        callCopy: '+1 234 567 890<br>+1 987 654 321',
                        emailTitle: 'மின்னஞ்சல் அனுப்பவும்',
                        emailCopy: 'info@idi.edu<br>admissions@idi.edu',
                    },
                    form: {
                        subject: 'IDI இணையதளத்திலிருந்து புதிய விசாரணை',
                        name: 'முழுப் பெயர்',
                        city: 'நகரம் / இருப்பிடம்',
                        phone: 'தொலைபேசி எண்',
                        message: 'உங்கள் செய்தி',
                        submit: 'செய்தியை அனுப்பவும்',
                    },
                },
                management: {
                    meta: {
                        title: 'நிர்வாகம் | தஃவா இஸ்லாமிய்யா நிறுவனம்',
                        description: 'தஃவா இஸ்லாமிய்யா நிறுவனத்தின் வழிகாட்டும் நிர்வாகத்தையும் அர்ப்பணிப்புள்ள பொறுப்பாளர்களையும் சந்திக்கவும்.',
                    },
                    hero: {
                        subtitle: 'எங்கள் அணி',
                        title: 'நிர்வாகம்',
                        copy: 'எங்கள் மாணவர்களின் ஆன்மிக மற்றும் கல்விப் பயணத்தை வழிநடத்தும் அர்ப்பணிப்புள்ள அணி.',
                    },
                    intro: {
                        subtitle: 'வழிகாட்டுதல்',
                        title: 'வழிகாட்டும் ஒளிகள்',
                    },
                    cards: [
                        {
                            role: 'அதிபரும் ஹிஃப்ழ் பொறுப்பாளரும்',
                            description: 'குர்ஆன் அறிவியல் மற்றும் கல்வி மேலாண்மையில் நீண்ட அனுபவத்துடன் நிறுவனத்தை வழிநடத்துபவர்.',
                        },
                        {
                            role: 'உப அதிபரும் தஜ்வீத் நிபுணரும்',
                            description: 'கிறாஅத் தரநிலைகளை பாதுகாத்து மாணவர்களின் தினசரி ஆன்மிக அட்டவணையை மேற்பார்வை செய்பவர்.',
                        },
                        {
                            role: 'முதன்மை நிர்வாகி',
                            description: 'மாணவர் விவகாரங்கள், சேர்க்கை, மற்றும் அமைதியான கற்றல் சூழலை மேற்பார்வை செய்பவர்.',
                        },
                    ],
                },
                result: {
                    meta: {
                        title: 'முடிவுகளை பார்க்க | தஃவா இஸ்லாமிய்யா நிறுவனம்',
                        description: 'மாணவர்களுக்கான அதிகாரப்பூர்வ முடிவு பார்வை தளம்.',
                    },
                    hero: {
                        subtitle: 'தேர்வு தளம்',
                        title: 'முடிவுகளை பார்க்க',
                        copy: 'உங்கள் கல்விசார் முன்னேற்றத்தையும் அறிக்கைகளையும் பாதுகாப்பாகப் பாருங்கள்.',
                    },
                    search: {
                        title: 'மாணவர் விசாரணை',
                        regLabel: 'பதிவு எண்',
                        examLabel: 'தேர்வு',
                        yearLabel: 'கல்வியாண்டு',
                        examPlaceholder: 'தேர்வைத் தேர்வு செய்யவும்',
                        yearPlaceholder: 'ஆண்டைத் தேர்வு செய்யவும்',
                        exams: {
                            Annual: 'வருடாந்திர தேர்வு',
                            'Mid-Term': 'இடைத் தவணை தேர்வு',
                            Monthly: 'மாதாந்திர தேர்வு',
                        },
                        submit: 'அறிக்கையை உருவாக்கவும்',
                        selectBoth: 'தேர்வும் கல்வியாண்டும் இரண்டையும் தேர்வு செய்யவும்.',
                        notFound: 'கொடுக்கப்பட்ட விவரங்களுக்கு முடிவு கிடைக்கவில்லை.',
                        dbError: 'முடிவுத் தரவுத்தளத்தை அணுக முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.',
                        localBlocked: '<strong>உள்ளக கோப்பு அணுகல் தடுக்கப்பட்டுள்ளது:</strong> இந்த முடிவுத் தரவைப் பயன்படுத்த இணையதளத்தை உள்ளக சேவையகத்தின் மூலம் அல்லது ஆன்லைனில் திறக்கவும்.',
                    },
                    result: {
                        statement: 'அதிகாரப்பூர்வ முடிவுத் தகவல்',
                        labels: ['பதிவு எண்', 'தரம் / நிலை', 'தேர்வு', 'கல்வியாண்டு'],
                        tableHeaders: ['பாடம் / பயிற்சி பகுதி', 'அதிகபட்ச மதிப்பெண்', 'பெற்ற மதிப்பெண்'],
                        summary: ['மொத்தம்', 'தரச் சுட்டி', 'இறுதி நிலை'],
                        signatures: ['வகுப்பு ஆசிரியர்', 'தேர்வு கட்டுப்பாளர்', 'அதிபர்'],
                        footerPrefix: 'உருவாக்கப்பட்ட தேதி:',
                        footerCenter: 'தஃவா இஸ்லாமிய்யா நிறுவனம் - அதிகாரப்பூர்வ ஆவணம்',
                        footerRight: 'செல்லுபடியாக முத்திரை அவசியம்',
                        print: 'அதிகாரப்பூர்வ மதிப்பெண் அறிக்கையை அச்சிடவும்',
                        status: { pass: 'தேர்ச்சி', fail: 'தோல்வி' },
                        subjects: {
                            'Quran Memorization': 'குர்ஆன் மனனம்',
                            Tajweed: 'தஜ்வீத்',
                            'Islamic Studies': 'இஸ்லாமியக் கல்வி',
                            'Arabic Language': 'அரபு மொழி',
                        },
                    },
                },
                open: {
                    meta: {
                        title: 'அதிகாரப்பூர்வ தொடக்கம் | தஃவா இஸ்லாமிய்யா நிறுவனம்',
                        description: 'தஃவா இஸ்லாமிய்யா நிறுவனத்தின் அதிகாரப்பூர்வ இணையதள தொடக்கம்.',
                    },
                    page: {
                        bismillah: 'பிஸ்மில்லாஹிர் ரஹ்மானிர் ரஹீம்',
                        name: 'தஃவா இஸ்லாமிய்யா நிறுவனம்',
                        tagline: 'குர்ஆனின் ஒளியால் இதயங்களை வளர்ப்போம்',
                        welcome: 'எங்கள் மாணவர்கள், பழைய மாணவர்கள், மற்றும் குர்ஆன் வழியாக <strong>அறிவு, வழிகாட்டல், ஒளி</strong> தேடுவோருக்கான டிஜிட்டல் இல்லமாக எங்கள் இணையதளம் அதிகாரப்பூர்வமாக தொடங்கப்படுவதில் <strong>மிகுந்த மகிழ்ச்சியும் நன்றியும்</strong> அடைகிறோம்.',
                        launch: 'இணையதளத்தைத் தொடங்கவும்',
                        launched: 'தொடங்கப்பட்டது!',
                        ribbon: 'அதிகாரப்பூர்வ தொடக்கம்',
                        celebrateTitle: 'வாழ்த்துக்கள்!',
                        celebrateCopy: '<strong style="color:var(--gold-l)">தஃவா இஸ்லாமிய்யா நிறுவனம்</strong> இணையதளம் இப்போது செயல்பாட்டில் உள்ளது. அல்லாஹ் இந்த முயற்சியை பேருபகாரமானதாக்கி எல்லோருக்கும் நன்மை தருவதாக ஆக்குவானாக.',
                        quote: '"உன்னைப் படைத்த உன் இறைவனின் பெயரால் ஓது." - அல்குர்ஆன் 96:1',
                        enter: 'இணையதளத்திற்குள் செல்லவும்',
                        dateLabel: 'தொடக்க தேதி',
                    },
                },
            },
        },
    };

    let currentLanguage = normalizeLanguage(readStoredLanguage()) || DEFAULT_LANGUAGE;

    const pageMap = {
        '': 'index',
        'index.html': 'index',
        'about.html': 'about',
        'hifz.html': 'hifz',
        'students.html': 'students',
        'alumni.html': 'alumni',
        'gallery.html': 'gallery',
        'contact.html': 'contact',
        'management.html': 'management',
        'result.html': 'result',
        'open.html': 'open',
    };

    function normalizeLanguage(language) {
        return SUPPORTED_LANGUAGES.includes(language) ? language : null;
    }

    function readStoredLanguage() {
        try {
            return window.localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            return null;
        }
    }

    function storeLanguage(language) {
        try {
            window.localStorage.setItem(STORAGE_KEY, language);
        } catch (error) {
            return;
        }
    }

    function getPageName() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        return pageMap[path] || 'index';
    }

    function getDictionary(language) {
        return translations[language] || translations[DEFAULT_LANGUAGE];
    }

    function getPageContent(pageName, language) {
        return getDictionary(language || currentLanguage).pages[pageName] || {};
    }

    function getText(path, fallback) {
        const parts = path.split('.');
        let cursor = getDictionary(currentLanguage);

        for (let index = 0; index < parts.length; index += 1) {
            if (!cursor || typeof cursor !== 'object' || !(parts[index] in cursor)) {
                return fallback;
            }
            cursor = cursor[parts[index]];
        }

        return cursor;
    }

    function query(selector, root) {
        return (root || document).querySelector(selector);
    }

    function queryAll(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    function setText(target, value) {
        const element = typeof target === 'string' ? query(target) : target;
        if (element && value !== undefined) {
            element.textContent = value;
        }
    }

    function setHtml(target, value) {
        const element = typeof target === 'string' ? query(target) : target;
        if (element && value !== undefined) {
            element.innerHTML = value;
        }
    }

    function setInputValue(selector, value) {
        const element = query(selector);
        if (element && value !== undefined) {
            element.value = value;
        }
    }

    function withIcon(element, text) {
        if (!element) {
            return;
        }
        const icon = element.querySelector('i');
        if (icon) {
            element.innerHTML = icon.outerHTML + ' ' + text;
        } else {
            element.textContent = text;
        }
    }

    function formatOrigin(text) {
        if (currentLanguage !== 'ta') {
            return text;
        }

        if (text.toLowerCase().startsWith('from ')) {
            return text.slice(5).trim() + ' இலிருந்து';
        }

        return text;
    }

    function translateSubject(subject) {
        return getText('pages.result.result.subjects.' + subject, subject) || subject;
    }

    function translateExam(examValue) {
        return getText('pages.result.search.exams.' + examValue, examValue) || examValue;
    }

    function translateClassName(className) {
        if (currentLanguage !== 'ta') {
            return className;
        }

        return className.replace(/^Hifz Level\s+/i, 'ஹிஃப்ழ் நிலை ');
    }

    function createLanguageSwitch(extraClassName) {
        const common = getText('common');
        const wrapper = document.createElement('div');
        wrapper.className = 'lang-switch ' + extraClassName;

        ['en', 'ta'].forEach((language) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'lang-switch-btn';
            button.dataset.language = language;
            button.textContent = common.switcher[language];
            wrapper.appendChild(button);
        });

        return wrapper;
    }

    function ensureDesktopLanguageSwitch() {
        const navContainer = query('.nav-container');
        const navLinks = query('.nav-links');

        if (!navContainer || !navLinks || query('.desktop-lang-switch', navContainer)) {
            return;
        }

        navContainer.insertBefore(createLanguageSwitch('desktop-lang-switch'), navLinks.nextSibling);
    }

    function ensureMobileLanguageSwitch() {
        const overlay = query('.mobile-nav-overlay');
        const navLinks = query('.mobile-nav-links', overlay);

        if (!overlay || !navLinks || query('.mobile-lang-switch-wrap', overlay)) {
            return;
        }

        const holder = document.createElement('div');
        holder.className = 'mobile-lang-switch-wrap';
        holder.appendChild(createLanguageSwitch('mobile-lang-switch'));
        overlay.appendChild(holder);
    }

    function ensureLanguageModal() {
        if (query('#language-modal')) {
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'language-modal';
        modal.className = 'language-modal hidden';
        modal.innerHTML = [
            '<div class="language-modal-card">',
            '  <h2 class="language-modal-title"></h2>',
            '  <p class="language-modal-copy"></p>',
            '  <div class="language-modal-actions">',
            '    <button type="button" class="language-modal-btn" data-language="en"><strong></strong><span></span></button>',
            '    <button type="button" class="language-modal-btn" data-language="ta"><strong></strong><span></span></button>',
            '  </div>',
            '</div>',
        ].join('');
        document.body.appendChild(modal);
    }

    function toggleLanguageModal(show) {
        const modal = query('#language-modal');
        if (!modal) {
            return;
        }

        modal.classList.toggle('hidden', !show);
        document.body.style.overflow = show ? 'hidden' : '';
    }

    function updateLanguageModal() {
        const modal = query('#language-modal');
        if (!modal) {
            return;
        }

        setText(query('.language-modal-title', modal), getText('common.modal.title', 'Choose your language'));
        setText(query('.language-modal-copy', modal), getText('common.modal.copy', 'Select your preferred language.'));

        const englishButton = query('.language-modal-btn[data-language="en"]', modal);
        const tamilButton = query('.language-modal-btn[data-language="ta"]', modal);

        setText(query('strong', englishButton), getText('common.modal.englishTitle', 'English'));
        setText(query('span', englishButton), getText('common.modal.englishCopy', 'Continue in English'));
        setText(query('strong', tamilButton), getText('common.modal.tamilTitle', 'Tamil'));
        setText(query('span', tamilButton), getText('common.modal.tamilCopy', 'Continue in Tamil'));
    }

    function updateLanguageSwitches() {
        const labels = getText('common.switcher');
        queryAll('.lang-switch-btn').forEach((button) => {
            setText(button, labels[button.dataset.language] || button.dataset.language.toUpperCase());
            button.classList.toggle('active', button.dataset.language === currentLanguage);
        });
    }

    function renderNavigation() {
        const nav = getText('common.nav');
        const links = [
            ['index.html', nav.home],
            ['about.html', nav.about],
            ['hifz.html', nav.hifz],
            ['students.html', nav.students],
            ['alumni.html', nav.alumni],
            ['gallery.html', nav.gallery],
            ['contact.html', nav.contact],
        ];

        links.forEach(([href, label]) => {
            queryAll('.nav-links a[href="' + href + '"], .mobile-nav-links a[href="' + href + '"]').forEach((link) => {
                setText(link, label);
            });
        });
    }

    function renderFooter() {
        const footer = getText('common.footer');
        const sections = queryAll('footer .footer-section');

        if (!sections.length) {
            return;
        }

        setText(query('h3', sections[0]), footer.brandTitle);
        setText(query('p', sections[0]), footer.brandCopy);

        setText(query('h3', sections[1]), footer.quickLinks);
        const quickLinks = queryAll('.footer-links a', sections[1]);
        if (quickLinks[0]) setText(quickLinks[0], footer.aboutUs);
        if (quickLinks[1]) setText(quickLinks[1], getText('common.nav.hifz', 'Hifz Program'));
        if (quickLinks[2]) setText(quickLinks[2], footer.studentLife);
        if (quickLinks[3]) setText(quickLinks[3], getText('common.nav.gallery', 'Gallery'));

        setText(query('h3', sections[2]), footer.information);
        const infoLinks = queryAll('.footer-links a', sections[2]);
        if (infoLinks[0]) setText(infoLinks[0], footer.contactUs);
        if (infoLinks[1]) setText(infoLinks[1], footer.ourAlumni);
        if (infoLinks[2]) setText(infoLinks[2], footer.checkResults);
        if (infoLinks[3]) setText(infoLinks[3], footer.admissions);

        setText(query('h3', sections[3]), footer.contact);
        const contactLines = queryAll('p', sections[3]);
        if (contactLines[0]) withIcon(contactLines[0], footer.address);
        if (contactLines[1]) withIcon(contactLines[1], footer.phone);
        if (contactLines[2]) withIcon(contactLines[2], footer.email);

        const footerBottom = queryAll('footer .footer-bottom p');
        if (footerBottom[0]) setHtml(footerBottom[0], footer.rights);
        if (footerBottom[1]) {
            const link = query('a', footerBottom[1]);
            if (link) {
                footerBottom[1].innerHTML = footer.designedBy + ' ' + link.outerHTML;
            }
        }
    }

    function renderIndexPage(content) {
        setText('.hero .subtitle', content.hero.subtitle);
        setHtml('.hero h1', content.hero.title);
        setText('.hero p', content.hero.copy);
        const heroButtons = queryAll('.hero-btns a');
        if (heroButtons[0]) setText(heroButtons[0], content.hero.primary);
        if (heroButtons[1]) setText(heroButtons[1], content.hero.secondary);

        const titleWrappers = queryAll('.section-title-wrapper');
        if (titleWrappers[0]) {
            setText(query('.subtitle', titleWrappers[0]), content.foundation.subtitle);
            setText(query('.section-title', titleWrappers[0]), content.foundation.title);
        }

        const cards = queryAll('.section-container .grid-container .card');
        content.cards.forEach((cardContent, index) => {
            if (!cards[index]) {
                return;
            }
            setText(query('.card-title', cards[index]), cardContent.title);
            setText(query('.card-text', cards[index]), cardContent.copy);
        });

        const featured = query('.featured-content');
        if (featured) {
            setText(query('.subtitle', featured), content.featured.subtitle);
            setText(query('.section-title', featured), content.featured.title);
            setText(query('p', featured), content.featured.copy);

            const bulletItems = queryAll('li', featured);
            content.featured.bullets.forEach((bullet, index) => {
                if (bulletItems[index]) {
                    withIcon(bulletItems[index], bullet);
                }
            });

            const cta = query('.btn', featured);
            if (cta) {
                setText(cta, content.featured.cta);
            }
        }
    }

    function renderAboutPage(content) {
        setText('.hero .subtitle', content.hero.subtitle);
        setHtml('.hero h1', content.hero.title);
        setText('.hero p', content.hero.copy);
        const heroButton = query('.hero-btns .btn');
        if (heroButton) {
            setText(heroButton, content.hero.cta);
        }

        const cards = queryAll('.section-container .grid-container .card');
        content.cards.forEach((cardContent, index) => {
            if (!cards[index]) {
                return;
            }
            setText(query('.card-title-tamil', cards[index]), cardContent.title);
            setText(query('.subtitle', cards[index]), cardContent.label);
            setText(query('.tamil-text', cards[index]), cardContent.copy);
        });

        const legacyGrid = query('.responsive-grid');
        if (legacyGrid) {
            const blocks = Array.from(legacyGrid.children);
            if (blocks[0]) {
                setText(query('.subtitle', blocks[0]), content.legacy.subtitle);
                setText(query('.section-title', blocks[0]), content.legacy.title);
                const paragraphs = queryAll('p', blocks[0]);
                if (paragraphs[0]) setText(paragraphs[0], content.legacy.copyOne);
                if (paragraphs[1]) setText(paragraphs[1], content.legacy.copyTwo);
            }
            if (blocks[1]) {
                setText(query('h3', blocks[1]), content.legacy.valuesTitle);
                const valueItems = queryAll('li', blocks[1]);
                content.legacy.values.forEach((value, index) => {
                    if (valueItems[index]) {
                        withIcon(valueItems[index], value);
                    }
                });
            }
        }

        const goalWrapper = queryAll('.section-title-wrapper')[0];
        if (goalWrapper) {
            setText(query('h2', goalWrapper), content.goals.title);
            setText(query('.subtitle', goalWrapper), content.goals.label);
        }

        const goalList = query('.goal-list');
        if (goalList) {
            goalList.innerHTML = content.goals.items.map((item) => {
                return [
                    '<li class="goal-item">',
                    '  <i class="fa-solid fa-star-and-crescent goal-icon"></i>',
                    '  <p class="tamil-text" style="font-size: 1.15rem; font-weight: 700;">' + item + '</p>',
                    '</li>',
                ].join('');
            }).join('');
        }
    }

    function renderHifzPage(content) {
        setText('.hero .subtitle', content.hero.subtitle);
        setHtml('.hero h1', content.hero.title);
        setText('.hero p', content.hero.copy);

        const titleWrappers = queryAll('.section-title-wrapper');
        if (titleWrappers[0]) {
            setText(query('.subtitle', titleWrappers[0]), content.journey.subtitle);
            setText(query('.section-title', titleWrappers[0]), content.journey.title);
        }

        const curriculumCards = queryAll('.section-container .grid-container .card');
        content.cards.forEach((cardContent, index) => {
            if (!curriculumCards[index]) {
                return;
            }
            setText(query('.card-title', curriculumCards[index]), cardContent.title);
            setText(query('.card-text', curriculumCards[index]), cardContent.copy);
        });

        const detailGrid = query('.responsive-grid');
        if (!detailGrid) {
            return;
        }

        const leftCard = detailGrid.children[0];
        const rightPanel = detailGrid.children[1];

        if (leftCard) {
            const listItems = queryAll('li', leftCard);
            setText(query('h3', leftCard), content.levels.title);
            const intro = query('p', leftCard);
            if (intro) {
                setText(intro, content.levels.intro);
            }
            content.levels.items.forEach((item, index) => {
                const listItem = listItems[index];
                if (!listItem) {
                    return;
                }
                const parts = queryAll('span, h4, p', listItem);
                if (parts[0]) setText(parts[0], item.number);
                if (parts[1]) setText(parts[1], item.title);
                if (parts[2]) setText(parts[2], item.copy);
            });
        }

        if (rightPanel) {
            setText(query('h3', rightPanel), content.typicalDay.title);
            setText(query('p', rightPanel), content.typicalDay.copy);
            setText(query('.btn', rightPanel), content.typicalDay.cta);
        }
    }

    function buildTimeline(entries) {
        return entries.map((entry) => {
            return [
                '<div class="timeline-item">',
                '  <div class="time-label">' + entry[0] + '</div>',
                '  <div class="timeline-dot"></div>',
                '  <div class="timeline-content">',
                '    <h3>' + entry[1] + '</h3>',
                '    <p>' + entry[2] + '</p>',
                '  </div>',
                '</div>',
            ].join('');
        }).join('');
    }

    function renderStudentsPage(content) {
        setText('.hero .subtitle', content.hero.subtitle);
        setHtml('.hero h1', content.hero.title);
        setText('.hero p', content.hero.copy);

        const intro = query('.section-title-wrapper');
        if (intro) {
            setText(query('.subtitle', intro), content.intro.subtitle);
            setText(query('.section-title', intro), content.intro.title);
            const introCopy = query('p', intro);
            if (introCopy) {
                setText(introCopy, content.intro.copy);
            }
        }

        const tabButtons = {
            weekdays: query('.tab-btn[data-tab="weekdays"]'),
            friday: query('.tab-btn[data-tab="friday"]'),
            weekend: query('.tab-btn[data-tab="weekend"]'),
        };
        setText(tabButtons.weekdays, content.tabs.weekdays);
        setText(tabButtons.friday, content.tabs.friday);
        setText(tabButtons.weekend, content.tabs.weekend);

        const weekdays = query('#weekdays');
        const friday = query('#friday');
        const weekend = query('#weekend');
        if (weekdays) weekdays.innerHTML = buildTimeline(content.schedules.weekdays);
        if (friday) friday.innerHTML = buildTimeline(content.schedules.friday);
        if (weekend) weekend.innerHTML = buildTimeline(content.schedules.weekend);
    }

    function renderAlumniPage(content) {
        setText('.hero .subtitle', content.hero.subtitle);
        setHtml('.hero h1', content.hero.title);
        setText('.hero p', content.hero.copy);

        queryAll('#alumni-filters .filter-btn').forEach((button) => {
            const key = button.dataset.filter === 'all' ? 'all' : button.dataset.filter;
            setText(button, content.filters[key] || button.textContent);
        });

        const loading = query('#loading');
        if (loading && loading.textContent.trim()) {
            const spinner = query('i', loading);
            loading.innerHTML = (spinner ? spinner.outerHTML + '<br><br>' : '') + content.loading;
        }
    }

    function renderGalleryPage(content) {
        setText('.hero .subtitle', content.hero.subtitle);
        setHtml('.hero h1', content.hero.title);
        setText('.hero p', content.hero.copy);

        queryAll('#filter-bar .filter-btn').forEach((button) => {
            setText(button, content.filters[button.dataset.filter] || button.textContent);
        });

        const loading = query('#loading');
        if (loading && loading.textContent.trim()) {
            const spinner = query('i', loading);
            loading.innerHTML = (spinner ? spinner.outerHTML + '<br><br>' : '') + content.loading;
        }
    }

    function renderContactPage(content) {
        setText('.hero .subtitle', content.hero.subtitle);
        setHtml('.hero h1', content.hero.title);
        setText('.hero p', content.hero.copy);

        const info = query('.contact-info');
        if (info) {
            setText(query('.subtitle', info), content.info.subtitle);
            setText(query('.section-title', info), content.info.title);
            const methods = queryAll('.contact-method', info);
            const details = [
                [content.info.visitTitle, content.info.visitCopy],
                [content.info.callTitle, content.info.callCopy],
                [content.info.emailTitle, content.info.emailCopy],
            ];
            methods.forEach((method, index) => {
                const pair = details[index];
                if (!pair) {
                    return;
                }
                setText(query('h4', method), pair[0]);
                setHtml(query('p', method), pair[1]);
            });
        }

        setInputValue('input[name="_subject"]', content.form.subject);
        setText(query('label[for="name"]'), content.form.name);
        setText(query('label[for="city"]'), content.form.city);
        setText(query('label[for="phone"]'), content.form.phone);
        setText(query('label[for="message"]'), content.form.message);
        setText(query('.form-card .btn'), content.form.submit);
    }

    function renderManagementPage(content) {
        setText('.hero .subtitle', content.hero.subtitle);
        setHtml('.hero h1', content.hero.title);
        setText('.hero p', content.hero.copy);

        const titleWrapper = query('.section-title-wrapper');
        if (titleWrapper) {
            setText(query('.subtitle', titleWrapper), content.intro.subtitle);
            setText(query('.section-title', titleWrapper), content.intro.title);
        }

        const cards = queryAll('.mgmt-card');
        content.cards.forEach((cardContent, index) => {
            if (!cards[index]) {
                return;
            }
            setText(query('.mgmt-role', cards[index]), cardContent.role);
            setText(query('p', cards[index]), cardContent.description);
        });
    }

    function renderResultPage(content) {
        setText('.hero .subtitle', content.hero.subtitle);
        setHtml('.hero h1', content.hero.title);
        setText('.hero p', content.hero.copy);
        setText('.result-search-card h2', content.search.title);
        setText(query('label[for="regNo"]'), content.search.regLabel);

        const formLabels = queryAll('.form-group > .form-label');
        if (formLabels[1]) setText(formLabels[1], content.search.examLabel);
        if (formLabels[2]) setText(formLabels[2], content.search.yearLabel);

        const detailLabels = queryAll('.detail-label');
        content.result.labels.forEach((label, index) => {
            if (detailLabels[index]) {
                setText(detailLabels[index], label);
            }
        });

        const tableHeaders = queryAll('.marks-table th');
        content.result.tableHeaders.forEach((label, index) => {
            if (tableHeaders[index]) {
                setText(tableHeaders[index], label);
            }
        });

        const summaryLabels = queryAll('.summary-label');
        content.result.summary.forEach((label, index) => {
            if (summaryLabels[index]) {
                setText(summaryLabels[index], label);
            }
        });

        const signatureLabels = queryAll('.sig-label');
        content.result.signatures.forEach((label, index) => {
            if (signatureLabels[index]) {
                setText(signatureLabels[index], label);
            }
        });

        const footerInfo = queryAll('.print-footer-info span');
        if (footerInfo[0]) {
            footerInfo[0].innerHTML = content.result.footerPrefix + ' <span id="current-date"></span>';
        }
        if (footerInfo[1]) setText(footerInfo[1], content.result.footerCenter);
        if (footerInfo[2]) setText(footerInfo[2], content.result.footerRight);

        const statement = queryAll('.result-content')[1];
        if (statement && statement.firstElementChild) {
            setText(statement.firstElementChild, content.result.statement);
        }

        const printButton = query('#print-result-btn');
        if (printButton) {
            const icon = query('i', printButton);
            printButton.innerHTML = (icon ? icon.outerHTML + ' ' : '') + content.result.print;
        }
    }

    function renderOpenPage(content) {
        setText('.bismillah', content.page.bismillah);
        setText('.inst-name', content.page.name);
        setText('.tagline', content.page.tagline);
        setHtml('.welcome', content.page.welcome);
        setText('.cel-ribbon', content.page.ribbon);
        setText('.cel-title', content.page.celebrateTitle);
        setHtml('.cel-sub', content.page.celebrateCopy);
        setText('.cel-quote', content.page.quote);

        const enterLink = query('.cel-go');
        if (enterLink) {
            const icon = query('i', enterLink);
            enterLink.innerHTML = (icon ? icon.outerHTML + ' ' : '') + content.page.enter;
        }

        const launchButton = query('#launchBtn');
        if (launchButton && !launchButton.dataset.launched) {
            const icon = query('i', launchButton);
            launchButton.innerHTML = [
                '<span class="pulse-ring"></span>',
                icon ? icon.outerHTML : '<i class="fa-solid fa-rocket"></i>',
                ' ' + content.page.launch,
            ].join('');
        }
    }

    function renderPageContent(pageName) {
        const content = getPageContent(pageName);
        if (document.body) {
            document.body.dataset.page = pageName;
        }
        if (content.meta) {
            document.title = content.meta.title;
            const description = query('meta[name="description"]');
            if (description) {
                description.setAttribute('content', content.meta.description);
            }
        }

        const pageRenderers = {
            index: renderIndexPage,
            about: renderAboutPage,
            hifz: renderHifzPage,
            students: renderStudentsPage,
            alumni: renderAlumniPage,
            gallery: renderGalleryPage,
            contact: renderContactPage,
            management: renderManagementPage,
            result: renderResultPage,
            open: renderOpenPage,
        };

        if (pageRenderers[pageName]) {
            pageRenderers[pageName](content);
        }
    }

    function applyLanguage(language, persistChoice) {
        const nextLanguage = normalizeLanguage(language) || DEFAULT_LANGUAGE;
        currentLanguage = nextLanguage;

        if (persistChoice) {
            storeLanguage(nextLanguage);
        }

        document.documentElement.lang = nextLanguage;
        ensureDesktopLanguageSwitch();
        ensureMobileLanguageSwitch();
        ensureLanguageModal();
        updateLanguageSwitches();
        updateLanguageModal();
        renderNavigation();
        renderFooter();
        renderPageContent(getPageName());

        document.dispatchEvent(new CustomEvent('idi:languagechange', {
            detail: { language: currentLanguage },
        }));
    }

    function onLanguageControlClick(event) {
        const control = event.target.closest('[data-language]');
        if (!control) {
            return;
        }

        const language = control.dataset.language;
        if (!normalizeLanguage(language)) {
            return;
        }

        applyLanguage(language, true);
        toggleLanguageModal(false);
    }

    function init() {
        ensureDesktopLanguageSwitch();
        ensureMobileLanguageSwitch();
        ensureLanguageModal();
        applyLanguage(currentLanguage, false);
        toggleLanguageModal(!normalizeLanguage(readStoredLanguage()));
    }

    document.addEventListener('click', onLanguageControlClick);

    document.addEventListener('DOMContentLoaded', init);

    window.IDI_I18N = {
        getLanguage: function () {
            return currentLanguage;
        },
        getPageName: getPageName,
        setLanguage: function (language) {
            applyLanguage(language, true);
        },
        getText: getText,
        getPageContent: function (pageName) {
            return getPageContent(pageName || getPageName(), currentLanguage);
        },
        translateSubject: translateSubject,
        translateExam: translateExam,
        translateClassName: translateClassName,
        formatOrigin: formatOrigin,
    };
})();
