export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  credentials: string;
  order: number;
  slug?: string;
}

/**
 * Returns a clean, consistent URL slug for a team member.
 * e.g., "William Mbugua" -> "william_mbugua"
 */
export function getTeamSlug(member: Partial<TeamMember> | null | undefined): string {
  if (!member) return '';
  if (member.slug) {
    return member.slug.toLowerCase().trim().replace(/[^a-z0-9_]+/g, '_');
  }
  if (member.name) {
    return member.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }
  return member.id || '';
}

/**
 * Normalizes any slug or identifier for matching.
 */
export function normalizeSlug(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

/**
 * Baseline firm team members matching William & Co. Advocates roster
 */
export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'partner-1',
    slug: 'william_mbugua',
    name: 'William Mbugua',
    role: 'Managing Partner',
    credentials: 'LL.B Hons (MKU), Dip. KSL, Commissioner for Oaths, Notary Public',
    imageUrl: 'https://res.cloudinary.com/dul9xvvap/image/upload/fl_preserve_transparency/v1792880287/IMG-20230402-WA0067_goy8b2.jpg?_s=public-apps',
    order: 1,
    bio: `William Mbugua is the Managing Partner of William & Co. Advocates with extensive experience guiding corporations, boards, and high-net-worth clients through complex legal challenges in Kenya.\n\nHe specializes in high-stakes negotiations, enterprise risk management, and overall firm strategy, delivering pragmatic legal solutions aligned with business growth.\n\nHis primary practice covers Corporate & Commercial Law, Conveyancing and Property Law, Intellectual Property, and Strategic Dispute Resolution across Nairobi and Kiambu County.`
  },
  {
    id: 'advocate-1',
    slug: 'michell_wambui',
    name: 'Michell Wambui',
    role: 'Associate Attorney',
    credentials: 'LL.B Hons, Dip. KSL',
    imageUrl: '/images/Mitchell_Wambui.jpeg',
    order: 2,
    bio: `Michell Wambui is a dynamic Associate Attorney dedicated to providing proactive legal support and strategic counsel across business and personal law matters.\n\nShe works closely with senior partners to draft complex contracts, conduct due diligence, and represent clients in alternative dispute resolutions, ensuring clear communication and meticulous attention to detail at every step.`
  },
  {
    id: 'staff-1',
    slug: 'priscilla_wanjiru',
    name: 'Priscilla Wanjiru',
    role: 'Office Manager',
    credentials: 'Dip. Legal Studies & Administration',
    imageUrl: '/images/Priscilla_Wanjiru.jpeg',
    order: 3,
    bio: `Priscilla Wanjiru oversees daily office operations, client intake, and administrative workflows to ensure the firm runs seamlessly.\n\nServing as the primary point of contact for clients, she manages scheduling, client communications, and court filing coordination, providing organized, professional, and efficient support across all practice areas.`
  },
  {
    id: 'partner-2',
    slug: 'anthony_ndongu_chege',
    name: 'Anthony Ndongu Chege',
    role: 'Senior Partner',
    credentials: 'LL.B Hons, Dip. KSL, Arbitrator',
    imageUrl: '/images/Anthony_Ndongu.jpeg',
    order: 4,
    bio: `Anthony Ndongu Chege is a Senior Partner specializing in complex commercial transactions, regulatory strategy, and enterprise risk management.\n\nWith years of proven leadership, he advises corporate clients, board executives, and investors on high-value deals, strategic partnerships, and governance, bringing a pragmatic, results-driven approach to every legal challenge.`
  }
];
