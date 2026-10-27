import { db } from '../src/lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const blogs = [
  {
    id: 'blog-1',
    title: 'The Impact of the Data Protection Act 2019 on Kenyan Businesses',
    slug: 'impact-of-data-protection-act-2019',
    content: '<p>The Data Protection Act 2019 has fundamentally changed how businesses in Kenya handle personal data. From mandatory registration with the Office of the Data Protection Commissioner (ODPC) to the requirement for data protection impact assessments, organizations must now prioritize privacy.</p><p>Key areas of compliance include obtaining explicit consent, ensuring data security, and respecting the rights of data subjects such as the right to be forgotten and data portability.</p>',
    author: 'Sarah Maina',
    category: 'Cyber & Data Protection',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
    publishedAt: serverTimestamp()
  },
  {
    id: 'blog-2',
    title: 'Understanding Property Conveyancing in Kenya: A Step-by-Step Guide',
    slug: 'property-conveyancing-kenya-guide',
    content: '<p>Buying land in Kenya requires due diligence and a clear understanding of the legal process. The process involves several critical steps, starting with a land search at the relevant registry.</p><p>Subsequent steps include the execution of the sale agreement, payment of stamp duty, and the final registration of the transfer. Navigating the Land Act 2012 and the Land Registration Act 2012 is essential for a secure transaction.</p>',
    author: 'William Ngugi',
    category: 'Property & Conveyancing',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop',
    publishedAt: serverTimestamp()
  },
  {
    id: 'blog-3',
    title: 'Arbitration vs. Litigation: Choosing the Best Path for Commercial Disputes',
    slug: 'arbitration-vs-litigation-commercial-disputes',
    content: '<p>When commercial disputes arise, parties often face a choice between the traditional courtroom (litigation) and private dispute resolution (arbitration). Arbitration offers confidentiality, speed, and the ability to choose an expert arbitrator.</p><p>However, litigation provides a public record and a clear appellate process. Under the Arbitration Act 1995, Kenyan courts increasingly support ADR mechanisms to reduce case backlog.</p>',
    author: 'William Ngugi',
    category: 'ADR',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop',
    publishedAt: serverTimestamp()
  }
];

async function seedBlogs() {
  console.log('Seeding blog posts...');
  for (const blog of blogs) {
    const docRef = doc(collection(db, 'blogs'), blog.id);
    await setDoc(docRef, {
      ...blog,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`Seeded: ${blog.title}`);
  }
  console.log('Blog seeding complete.');
  process.exit(0);
}

seedBlogs().catch(console.error);
