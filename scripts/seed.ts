import { db } from '../src/lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const practiceAreas = [
  {
    id: 'commercial-corporate',
    title: 'Commercial & Corporate Law',
    slug: 'commercial-corporate',
    description: 'Comprehensive legal support for businesses, from startups to established corporations. We handle mergers, acquisitions, and day-to-day corporate governance.',
    statutoryFramework: 'Companies Act (No. 17 of 2015), Partnership Act (No. 16 of 2012), Insolvency Act (No. 18 of 2015).',
    caseScenarios: 'Shareholder agreement disputes, corporate restructuring, regulatory compliance audits, and commercial contract negotiations.',
    icon: 'Briefcase'
  },
  {
    id: 'property-conveyancing',
    title: 'Property & Conveyancing',
    slug: 'property-conveyancing',
    description: 'Expert guidance on all land-related transactions. We ensure secure property transfers and robust title due diligence.',
    statutoryFramework: 'Land Act (2012), Land Registration Act (2012), Sectional Properties Act (2020), Land Control Act.',
    caseScenarios: 'Purchase and sale of residential/commercial property, lease agreements, property subdivision, and charging of land.',
    icon: 'Home'
  },
  {
    id: 'employment-labour',
    title: 'Employment & Labour Law',
    slug: 'employment-labour',
    description: 'Balancing employer interests and employee rights within the Kenyan labour landscape.',
    statutoryFramework: 'Employment Act (2007), Labour Relations Act (2007), Occupational Safety and Health Act (2007).',
    caseScenarios: 'Unfair dismissal claims, redundancy processes, drafting of HR policies, and representation in the Employment and Labour Relations Court.',
    icon: 'Users'
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    slug: 'intellectual-property',
    description: 'Protecting your innovations and creative works. Our team includes certified Patent Agents.',
    statutoryFramework: 'Industrial Property Act (2001), Copyright Act (2001), Trademarks Act (Cap 506).',
    caseScenarios: 'Trademark registration, patent filing, copyright infringement litigation, and IP licensing agreements.',
    icon: 'Lightbulb'
  },
  {
    id: 'cyber-data-protection',
    title: 'Cyber & Data Protection',
    slug: 'cyber-data-protection',
    description: 'Navigating the digital legal landscape. We help organizations comply with modern privacy standards.',
    statutoryFramework: 'Data Protection Act (2019), Computer Misuse and Cybercrimes Act (2018).',
    caseScenarios: 'Data breach response planning, privacy policy drafting, and compliance audits for data controllers and processors.',
    icon: 'ShieldCheck'
  },
  {
    id: 'tax-revenue',
    title: 'Tax & Revenue',
    slug: 'tax-revenue',
    description: 'Strategic tax advice and dispute resolution with the Kenya Revenue Authority (KRA).',
    statutoryFramework: 'Income Tax Act, Value Added Tax Act (2013), Tax Procedures Act (2015).',
    caseScenarios: 'Tax planning for corporate transactions, representation before the Tax Appeals Tribunal, and KRA audit management.',
    icon: 'Receipt'
  },
  {
    id: 'adr',
    title: 'Alternative Dispute Resolution (ADR)',
    slug: 'adr',
    description: 'Efficient and private conflict resolution through mediation and arbitration.',
    statutoryFramework: 'Arbitration Act (1995), Civil Procedure Act (Cap 75) - Section 59.',
    caseScenarios: 'Commercial arbitration, family mediation, and out-of-court settlement negotiations.',
    icon: 'Scale'
  },
  {
    id: 'criminal-defence',
    title: 'Criminal Defence',
    slug: 'criminal-defence',
    description: 'Vigorous representation in criminal matters, ensuring the constitutional right to a fair trial.',
    statutoryFramework: 'Constitution of Kenya (2010) - Article 50, Penal Code (Cap 63), Criminal Procedure Code (Cap 75).',
    caseScenarios: 'Bail and bond applications, defence in white-collar crime cases, and representation in traffic and general criminal charges.',
    icon: 'Gavel'
  },
  {
    id: 'insurance-compensation',
    title: 'Insurance & Compensation',
    slug: 'insurance-compensation',
    description: 'Handling insurance claims and personal injury compensation with diligence.',
    statutoryFramework: 'Insurance Act (Cap 487), Occupiers Liability Act (Cap 34).',
    caseScenarios: 'Road traffic accident claims, work injury benefits (WIBA) claims, and insurance policy coverage disputes.',
    icon: 'HeartHandshake'
  },
  {
    id: 'banking-finance',
    title: 'Banking & Finance',
    slug: 'banking-finance',
    description: 'Legal advisory for financial institutions and borrowers on debt financing and securities.',
    statutoryFramework: 'Banking Act (Cap 488), Central Bank of Kenya Act (Cap 491), Movable Property Security Rights Act (2017).',
    caseScenarios: 'Preparation of bank charges, debt recovery, and legal audits for financial institutions.',
    icon: 'Landmark'
  },
  {
    id: 'family-matrimonial',
    title: 'Family & Matrimonial Law',
    slug: 'family-matrimonial',
    description: 'Compassionate and professional handling of sensitive family matters.',
    statutoryFramework: 'Marriage Act (2014), Matrimonial Property Act (2013), Children Act (2022).',
    caseScenarios: 'Divorce proceedings, child custody and maintenance cases, and succession/probate matters.',
    icon: 'Heart'
  }
];

async function seed() {
  console.log('Seeding practice areas...');
  for (const area of practiceAreas) {
    const docRef = doc(collection(db, 'practice_areas'), area.id);
    await setDoc(docRef, {
      ...area,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`Seeded: ${area.title}`);
  }
  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(console.error);
