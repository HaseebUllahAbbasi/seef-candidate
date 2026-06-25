export const DEMO_PASSWORD = 'password123';

export type DemoCandidateAccount = {
  username: string;
  password: string;
  label: string;
  university: string;
};

/** Sukkur IBA University demo students — matches backend seed. */
export const SIBA_DEMO_ACCOUNTS: DemoCandidateAccount[] = [
  {
    username: 'candidate.siba.ali',
    password: DEMO_PASSWORD,
    label: 'Ali Abbasi',
    university: 'Sukkur IBA University',
  },
  {
    username: 'candidate.siba.sana',
    password: DEMO_PASSWORD,
    label: 'Sana Memon',
    university: 'Sukkur IBA University',
  },
  {
    username: 'candidate.siba.hassan',
    password: DEMO_PASSWORD,
    label: 'Hassan Soomro',
    university: 'Sukkur IBA University',
  },
];
