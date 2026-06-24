/** Landing page content aligned with SEEF public site mockup */

export const HERO_SLIDES = [
  {
    tag: 'Investing in Education, Empowering Futures',
    title: 'Empowering Students, Transforming Sindh',
    description:
      'SEEF is committed to providing equitable access to quality education for talented students across Sindh through merit and need-based scholarships.',
    image: '/landing/hero-slide-1.jpg',
    imageAlt: 'Students in an interview panel supported by SEEF scholarships',
    badges: ['Interview Panel', 'Merit Selection'],
  },
  {
    tag: 'Scholarships for Every Dream',
    title: 'Supporting Merit & Need Across Sindh',
    description:
      'From school to university, SEEF helps deserving students complete their education at HEC-recognized institutions in the province.',
    image: '/landing/hero-slide-2.jpg',
    imageAlt: 'University students studying together in a library',
    badges: ['Undergraduate', 'Panel Universities'],
  },
  {
    tag: 'Building Skills for Tomorrow',
    title: 'Technical Education & Vocational Growth',
    description:
      'Scholarships and training pathways help young people gain in-demand skills in IT, engineering, health sciences, and business.',
    image: '/landing/hero-slide-3.jpg',
    imageAlt: 'Students in a classroom and laboratory setting',
    badges: ['STEM Programs', 'Skills Development'],
  },
  {
    tag: 'Celebrating Every Achievement',
    title: 'Awarding Dreams Across the Province',
    description:
      'Each year SEEF honours recipients at award ceremonies — investing in Sindh\'s next generation of doctors, engineers, and leaders.',
    image: '/landing/hero-slide-4.jpg',
    imageAlt: 'SEEF scholarship award ceremony with students',
    badges: ['Award Ceremony', 'Need-Based Support'],
  },
] as const;

export const FEATURES = [
  {
    title: 'Merit-Based Scholarships',
    description: 'Rewarding academic excellence and supporting high-achieving students.',
    icon: 'graduation',
  },
  {
    title: 'Quality Education',
    description: 'Partnering with leading universities to ensure world-class learning.',
    icon: 'book',
  },
  {
    title: 'Inclusive Opportunities',
    description: 'Special quotas for orphans, minorities, and students with disabilities.',
    icon: 'hands',
  },
  {
    title: 'Transparent Process',
    description: 'Fair scrutiny, verification, and merit-based selection at every stage.',
    icon: 'star',
  },
  {
    title: 'Better Future',
    description: 'Building skilled graduates who contribute to Sindh and Pakistan.',
    icon: 'people',
  },
];

export const SCHOLARSHIP_PROCESS = {
  image: '/landing/scholarship-process.png',
  imageAlt:
    'Five steps to get your SEEF scholarship: Register with university email, complete your profile, apply, track status, and get awarded',
};

export const IMPACT_STATS = [
  { value: '25,000+', label: 'Students Supported', icon: 'users' },
  { value: '150+', label: 'Partner Institutions', icon: 'building' },
  { value: '500+', label: 'Scholarships Awarded Annually', icon: 'award' },
  { value: '30+', label: 'Districts Reached', icon: 'map' },
];

export const PROGRAMS = [
  {
    title: 'School Scholarships',
    description: 'Financial support for deserving students at the school level across Sindh.',
    image: '/landing/program-school.png',
    href: '/scholarships',
    icon: 'school',
  },
  {
    title: 'Undergraduate Scholarships',
    description: 'Tuition coverage for BS programs at SEEF panel universities.',
    image: '/landing/program-undergraduate.png',
    href: '/scholarships',
    icon: 'university',
  },
  {
    title: 'Need-Based Scholarships',
    description: 'Support for students from low-income families with verified income.',
    image: '/landing/program-need-based.png',
    href: '/scholarships',
    icon: 'heart',
  },
  {
    title: 'Technical & Vocational Support',
    description: 'Skills development and vocational training opportunities.',
    image: '/landing/program-technical.png',
    href: '/contact',
    icon: 'tools',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'SEEF scholarship changed my life. It gave me the opportunity to dream beyond limitations and pursue engineering at a top university.',
    name: 'Ayesha Khan',
    role: 'Scholarship Recipient',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
  },
  {
    quote:
      'As a first-generation university student, SEEF made it possible for me to focus on studies instead of worrying about tuition fees.',
    name: 'Bilal Ahmed Soomro',
    role: 'MBBS Candidate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
  },
];

export const NEWS_ITEMS = [
  {
    id: 'news-2026-cycle',
    category: 'Announcement',
    title: 'SEEF Announces New Scholarship Cycle for 2026',
    excerpt: 'Applications are now open for merit and need-based scholarships across all panel universities.',
    body: 'The Sindh Educational Endowment Fund has opened the 2026 scholarship cycle for undergraduate students enrolled at SEEF panel universities. Candidates may register on the portal, complete their profile, and apply to published advertisements before the advertised deadline. Merit and need-based tracks are available with reserved quotas for orphans, minorities, and students with special needs.',
    date: 'May 10, 2026',
    image: '/landing/news-1.jpg',
  },
  {
    id: 'news-sukkur-interviews',
    category: 'Interviews',
    title: 'Interview Panels Conclude for Sukkur Region',
    excerpt: 'Committee members completed final interviews for shortlisted candidates this week.',
    body: 'Evaluation committees for the Sukkur region have concluded interview sessions for shortlisted applicants. Scores have been recorded in the SEEF portal and merit lists are being prepared for chairman review. Candidates can track application status after signing in to their account.',
    date: 'Apr 28, 2026',
    image: '/landing/news-2.jpg',
  },
  {
    id: 'news-new-universities',
    category: 'Partnership',
    title: 'SEEF Partners with Additional Universities',
    excerpt: 'Three new institutions join the SEEF trust panel, expanding access for students.',
    body: 'Three HEC-recognized universities have been added to the SEEF trust panel following approval by the fund\'s governing body. Students at these institutions may now register on the candidate portal and apply when scholarships are published for their university.',
    date: 'Apr 15, 2026',
    image: '/landing/news-3.jpg',
  },
  {
    id: 'news-income-guidelines',
    category: 'Guidelines',
    title: 'Income Verification Guidelines Updated',
    excerpt: 'Revised FBR and revenue certificate requirements for need-based applicants.',
    body: 'SEEF has updated income verification requirements for need-based scholarships. Applicants must submit FBR tax returns or Assistant Commissioner Revenue certificates as specified in the active advertisement. University focal persons verify documents before applications proceed to committee scrutiny.',
    date: 'Mar 30, 2026',
    image: '/landing/news-4.jpg',
  },
  {
    id: 'news-award-ceremony',
    category: 'Event',
    title: 'Annual Scholarship Award Ceremony 2026',
    excerpt: 'SEEF honoured outstanding recipients at a ceremony in Karachi.',
    body: 'The annual SEEF scholarship award ceremony recognised students from across Sindh who completed the merit and need-based selection process. Chairman and focal persons from partner universities attended. New recipients are encouraged to maintain academic standing to retain funding.',
    date: 'Mar 12, 2026',
    image: '/landing/program-need-based.png',
  },
  {
    id: 'news-portal-launch',
    category: 'Technology',
    title: 'Online Application Portal Now Live',
    excerpt: 'Students can apply, upload documents, and track status end-to-end online.',
    body: 'SEEF\'s integrated scholarship portal allows candidates to register with a university email, submit applications, upload verification documents, and follow progress from verification through interviews to final award. Universities and committees use the same platform for scrutiny, shortlisting, and merit lists.',
    date: 'Feb 20, 2026',
    image: '/landing/hero-collage.jpg',
  },
];

export const UPCOMING_EVENTS = [
  {
    title: 'University focal training workshop',
    date: 'Jun 15, 2026',
    location: 'Karachi',
    description: 'Orientation for university focal persons on document verification and portal workflows.',
  },
  {
    title: 'Merit list publication — Spring cycle',
    date: 'Jul 1, 2026',
    location: 'Online',
    description: 'Chairman-approved merit lists forwarded to SEEF for final scholarship award.',
  },
  {
    title: 'Student orientation webinar',
    date: 'Jul 20, 2026',
    location: 'Virtual',
    description: 'How to register, apply, and track your SEEF scholarship application.',
  },
];

export const ABOUT_TIMELINE = [
  { year: '2002–03', title: 'Establishment', text: 'SEEF established under the College Education Department, Government of Sindh, to support higher education in the province.' },
  { year: '2010s', title: 'Panel expansion', text: 'Trust panel grew to include major public and private universities across Sindh.' },
  { year: '2020s', title: 'Digital transformation', text: 'End-to-end online applications, verification, interviews, and merit lists on a unified platform.' },
  { year: 'Today', title: 'Ongoing impact', text: 'Thousands of students supported annually through merit and need-based scholarships.' },
];

export const ABOUT_VALUES = [
  { title: 'Equity', text: 'Reserved quotas and need-based support so talented students are not left behind by financial hardship.' },
  { title: 'Merit', text: 'Transparent scrutiny, interviews, and merit lists ensure fair selection at every stage.' },
  { title: 'Accountability', text: 'Document verification, audit trails, and committee oversight protect public trust.' },
  { title: 'Access', text: 'Partnerships with HEC-recognized institutions across Sindh widen opportunity statewide.' },
];

export const FOOTER_QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Scholarships', href: '/scholarships' },
  { label: 'Panel universities', href: '/universities' },
  { label: 'News & Events', href: '/news' },
  { label: 'Contact Us', href: '/contact' },
];

export const FOOTER_HELPFUL_LINKS = [
  { label: 'Apply for Scholarship', href: '/register' },
  { label: 'Panel universities', href: '/universities' },
  { label: 'Student Guidelines', href: '/scholarships' },
  { label: 'FAQs', href: '/contact' },
  { label: 'Downloads', href: 'https://seef.sindh.gov.pk/', external: true },
];
