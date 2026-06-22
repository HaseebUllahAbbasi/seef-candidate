/** Static content inspired by https://seef.sindh.gov.pk/ and official SEEF publications */

export const SEEF = {
  name: 'Sindh Educational Endowment Fund',
  shortName: 'SEEF',
  tagline: 'Investing in Sindh\'s Future Through Education',
  established: '2002–03',
  department: 'College Education Department, Government of Sindh',
  website: 'https://seef.sindh.gov.pk/',
  email: 'info@seef.gov.pk',
  phone: '+92-21-99204201',
  address: 'Tughlaq House, Sindh Secretariat, Karachi, Pakistan',
};

export const MISSION =
  'To provide financial assistance to students hailing from low-income groups to acquire higher education from reputable public and private sector universities in Sindh.';

export const VISION =
  'Education is one of the most powerful instruments for reducing poverty and inequality. SEEF sets the foundation for sustainable economic growth of Sindh and Pakistan.';

export const OBJECTIVES = [
  'Award scholarships to deserving and needy students of Sindh',
  'Support graduate and post-graduate education in IT, Engineering, Medicine, and Business',
  'Enable talented youth to complete studies at HEC-recognized institutions',
  'Cover tuition fees for meritorious students from approved universities',
];

export const ELIGIBILITY = [
  { title: 'Sindh Domicile', desc: 'Applicant must be domiciled and permanent resident of Sindh' },
  { title: 'SEEF Panel University', desc: 'Enrolled in an institute included in the SEEF Trust Panel' },
  { title: 'Minimum Academic Standing', desc: 'GPA 2.5 or 60% marks in previous examinations' },
  { title: 'Income Criteria', desc: 'Family income within limits defined in the income range table' },
  { title: 'FBR / Revenue Certificate', desc: 'Income verified through FBR or Assistant Commissioner Revenue' },
];

export const QUOTAS = [
  { label: 'Poor, needy & meritorious', pct: '86%', color: 'bg-emerald-600' },
  { label: 'Students with special needs', pct: '2%', color: 'bg-green-600' },
  { label: 'Minority students', pct: '2%', color: 'bg-violet-600' },
  { label: 'Orphan students', pct: '5%', color: 'bg-amber-600' },
  { label: 'Children of Sindh govt. employees', pct: '5%', color: 'bg-teal-600' },
];

export const INCOME_GROUPS = [
  { group: 'A', from: 'Up to 100,000', to: '1,500,000', share: '80%' },
  { group: 'B', from: '1,500,000', to: '2,500,000', share: '10%' },
  { group: 'C', from: '2,500,000', to: '6,000,000', share: '10%' },
];

export const DISCIPLINES = [
  'MBBS / BDS / DPT / Pharmacy / Nursing',
  'BS Engineering (Electrical, Civil, Mechanical, CS)',
  'BS Information Technology & Computer Science',
  'BS Business Administration & Commerce',
  'BS Education, Agriculture & Allied Sciences',
];

export const STATS = [
  { value: '2002', label: 'Established' },
  { value: '8+', label: 'Panel Universities' },
  { value: '86%', label: 'Need-Based Quota' },
  { value: '100%', label: 'Tuition Coverage' },
];

/** Fallback cards when API has no published ads */
export const DEMO_SCHOLARSHIPS = [
  {
    id: 'demo-1',
    name: 'SEEF Merit Scholarship',
    year: new Date().getFullYear(),
    catchyLine: "Investing in Sindh's Future — Education for All",
    endDate: `${new Date().getFullYear()}-12-31`,
    status: 'PUBLISHED',
    programs: [
      { id: 'p1', programName: 'BS Computer Science' },
      { id: 'p2', programName: 'BS Electrical Engineering' },
      { id: 'p3', programName: 'MBBS' },
    ],
  },
  {
    id: 'demo-2',
    name: 'SEEF Need-Based Scholarship',
    year: new Date().getFullYear(),
    catchyLine: 'Supporting deserving students across Sindh',
    endDate: `${new Date().getFullYear()}-09-30`,
    status: 'PUBLISHED',
    programs: [
      { id: 'p4', programName: 'BS Education' },
      { id: 'p5', programName: 'BS Agriculture' },
    ],
  },
];
