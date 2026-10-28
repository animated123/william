import { db } from '../src/lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const teamMembers = [
  {
    id: 'partner-1',
    slug: 'william_mbugua',
    name: 'William Mbugua',
    role: 'Managing Partner',
    credentials: 'LL.B Hons (MKU), Dip. KSL, Commissioner for Oaths, Notary Public',
    bio: 'William Mbugua is the Managing Partner with extensive experience guiding corporations, boards, and high-net-worth clients through complex legal challenges. He specializes in high-stakes negotiations, enterprise risk management, and overall firm strategy, delivering pragmatic legal solutions aligned with business growth.',
    order: 1,
    imageUrl: 'https://res.cloudinary.com/dul9xvvap/image/upload/fl_preserve_transparency/v1792880287/IMG-20230402-WA0067_goy8b2.jpg?_s=public-apps'
  },
  {
    id: 'advocate-1',
    slug: 'michell_wambui',
    name: 'Michell Wambui',
    role: 'Associate Attorney',
    credentials: 'LL.B Hons, Dip. KSL',
    bio: 'Michell Wambui is a dynamic Associate Attorney dedicated to providing proactive legal support and strategic counsel across business and personal law matters. She works closely with senior partners to draft complex contracts, conduct legal research, and represent clients in dispute resolutions.',
    order: 2,
    imageUrl: '/images/Mitchell_Wambui.jpeg'
  },
  {
    id: 'uagiqekdZicBWga2kjeW',
    slug: 'priscilla_wanjiru',
    name: 'Priscilla Wanjiru',
    role: 'Office Manager',
    credentials: 'Dip. Legal Studies & Administration',
    bio: 'Priscilla Wanjiru oversees daily office operations, client intake, and administrative workflows to ensure the firm runs seamlessly. Serving as the primary point of contact for clients, she manages scheduling, client communications, and court filing coordination.',
    order: 3,
    imageUrl: '/images/Priscilla_Wanjiru.jpeg'
  },
  {
    id: 'PLIXyHQdm4NbhRm4kvqJ',
    slug: 'anthony_ndongu_chege',
    name: 'Anthony Ndongu Chege',
    role: 'Senior Partner',
    credentials: 'LL.B Hons, Dip. KSL, Qualified Arbitrator',
    bio: 'Anthony Ndongu Chege is a Senior Partner specializing in complex commercial transactions, regulatory strategy, and enterprise risk management. With years of proven leadership, he advises corporate clients, board executives, and investors on high-value deals.',
    order: 4,
    imageUrl: '/images/Anthony_Ndongu.jpeg'
  }
];

async function seedTeam() {
  console.log('Seeding team members...');
  for (const member of teamMembers) {
    const docRef = doc(collection(db, 'team'), member.id);
    await setDoc(docRef, {
      ...member,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`Seeded: ${member.name} (${member.slug})`);
  }
  console.log('Team seeding complete.');
  process.exit(0);
}

seedTeam().catch(console.error);
