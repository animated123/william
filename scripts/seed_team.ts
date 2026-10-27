import { db } from '../src/lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const teamMembers = [
  {
    id: 'partner-1',
    name: 'William Ngugi',
    role: 'Managing Partner',
    credentials: 'LL.B Hons (MKU), Dip. KSL, Commissioner for Oaths, Notary Public',
    bio: 'With over 15 years of experience in corporate law and property conveyancing, William leads the firm with a commitment to integrity and excellence.',
    order: 1,
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2069&auto=format&fit=crop'
  },
  {
    id: 'advocate-1',
    name: 'Sarah Maina',
    role: 'Senior Associate',
    credentials: 'LL.B Hons, Dip. KSL, Patent Agent',
    bio: 'Sarah specializes in Intellectual Property and Cyber Law, helping clients navigate the digital legal landscape in Kenya.',
    order: 2,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop'
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
    console.log(`Seeded: ${member.name}`);
  }
  console.log('Team seeding complete.');
  process.exit(0);
}

seedTeam().catch(console.error);
