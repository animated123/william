import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, HelpCircle, Search, Scale, 
  FileText, ShieldCheck, Landmark, Users, 
  Briefcase, Phone, ArrowRight, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface FAQItem {
  id: string;
  category: 'Land & Property' | 'Corporate & Business' | 'Litigation & ADR' | 'Succession & Family' | 'Fees & Retainers' | 'Employment';
  question: string;
  answer: string;
  statutoryReference?: string;
  keywords?: string[];
}

export const LEGAL_FAQS: FAQItem[] = [
  {
    id: 'land-due-diligence',
    category: 'Land & Property',
    question: 'What due diligence is required before buying land in Kiambu County or Nairobi?',
    answer: 'Due diligence is mandatory to prevent fraud. Our comprehensive conveyancing verification includes: 1) Official search at the relevant Land Registry (e.g., Kiambu, Ruiru, Thika, or via ArdhiSasa) to verify current registered proprietor and encumbrances; 2) Land Rent and Rates Clearance certificates from Kiambu County Government; 3) Physical boundary beacon inspection conducted with a licensed surveyor; 4) Obtaining Land Control Board (LCB) consent for agricultural land under the Land Control Act (Cap 302); and 5) Vetting of seller identity cards, KRA PINs, and historical green cards. We draft and manage the complete sale agreement and transfer process.',
    statutoryReference: 'Land Registration Act 2012 & Land Control Act (Cap 302)',
    keywords: ['land', 'property', 'title', 'search', 'registry', 'ardhisasa', 'kiambu', 'conveyancing', 'purchase']
  },
  {
    id: 'legal-fees-structure',
    category: 'Fees & Retainers',
    question: 'How are legal fees determined and billed at William & Co. Advocates?',
    answer: 'Our fee structures are governed strictly by the Advocates Remuneration Order under the Advocates Act (Cap 16 of the Laws of Kenya). For property conveyancing, mortgages, and commercial transactions, fees follow the prescribed statutory scale based on the property or transaction value. For litigation, dispute representation, and corporate advisory retainers, we provide clear written fee proposals upfront outlining milestones, court disbursements, and statutory filing fees. We believe in total financial transparency with no unexpected charges.',
    statutoryReference: 'Advocates Act (Cap 16) & Advocates Remuneration Order',
    keywords: ['fees', 'cost', 'retainer', 'billing', 'advocates remuneration order', 'charges', 'quote']
  },
  {
    id: 'adr-out-of-court',
    category: 'Litigation & ADR',
    question: 'Can my commercial or land dispute be resolved without going to trial in court?',
    answer: 'Yes. Article 159(2)(c) of the Constitution of Kenya mandates courts to promote Alternative Dispute Resolution (ADR), including mediation, negotiation, and arbitration. Many commercial, boundary, and contractual disputes are settled much faster and more economically through court-annexed mediation or private advocacy negotiations. When a settlement is reached, our advocates draft and file a legally binding Consent Order in court, carrying the full legal weight and enforceability of a formal judicial decree.',
    statutoryReference: 'Constitution of Kenya (Art. 159) & Civil Procedure Act (Cap 21)',
    keywords: ['mediation', 'adr', 'dispute', 'settlement', 'out of court', 'negotiation', 'court']
  },
  {
    id: 'intestate-succession',
    category: 'Succession & Family',
    question: 'What is the procedure when a family member passes away without a Will (intestate)?',
    answer: 'Under the Law of Succession Act (Cap 160), immediate beneficiaries must apply for Letters of Administration Intestate in the High Court or Chief Magistrate Court (depending on estate net value). The process involves: 1) Filing the initial petition and supporting affidavits with chief\'s letter of family introduction; 2) Publication of a 30-day notice in the Kenya Gazette inviting objections; 3) Issuance of a Temporary Grant of Letters of Administration; and 4) Applying for Confirmation of Grant after 6 months to legally distribute land titles, vehicles, shares, and bank funds among lawful heirs.',
    statutoryReference: 'Law of Succession Act (Cap 160)',
    keywords: ['succession', 'will', 'inheritance', 'letters of administration', 'grant', 'estate', 'deceased', 'intestate']
  },
  {
    id: 'unfair-dismissal-process',
    category: 'Employment',
    question: 'What mandatory steps must an employer follow before terminating an employee?',
    answer: 'Under Section 41 and 45 of the Employment Act 2007, termination requires both substantive justification and strict procedural fairness. An employer must: 1) Issue a clear written notice/show-cause letter detailing allegations; 2) Provide reasonable time for the employee to prepare their defense; 3) Conduct an oral disciplinary hearing; and 4) Allow the employee to be accompanied by a fellow employee or union representative. Failure to comply makes the dismissal substantively or procedurally unfair, exposing the employer to awards of up to 12 months\' gross salary in damages.',
    statutoryReference: 'Employment Act 2007 (Sections 41, 43 & 45)',
    keywords: ['employment', 'termination', 'dismissal', 'labor', 'hearing', 'show cause', 'redundancy', 'workplace']
  },
  {
    id: 'company-incorporation',
    category: 'Corporate & Business',
    question: 'How long does company incorporation take in Kenya and what is required?',
    answer: 'Through the Business Registration Service (BRS) via eCitizen, registering a Private Limited Company takes approximately 3 to 5 business days after name reservation approval. Required documents include: national IDs/passports of proposed directors and shareholders, KRA PIN certificates, passport photos, designated physical registered office address, and Beneficial Ownership (BO) disclosures. William & Co. Advocates also drafts customized Articles of Association and Shareholder Agreements to govern shareholder voting and equity protection.',
    statutoryReference: 'Companies Act No. 17 of 2015',
    keywords: ['company', 'incorporation', 'brs', 'ecitizen', 'business', 'registration', 'cr12', 'directors']
  },
  {
    id: 'diaspora-representation',
    category: 'Land & Property',
    question: 'Can William & Co. Advocates represent Kenyans in the Diaspora for property purchases and court matters?',
    answer: 'Yes, we represent a significant number of clients residing in the United States, United Kingdom, Canada, Europe, Australia, and the Gulf. We prepare, execute, and register Registered Powers of Attorney at the Lands Registry, facilitate secure client escrow account administration for payments, conduct on-site verification with geo-tagged video walkthroughs, and handle court appearances without requiring you to travel back to Kenya.',
    statutoryReference: 'Powers of Attorney Act & Registration of Documents Act (Cap 285)',
    keywords: ['diaspora', 'abroad', 'overseas', 'power of attorney', 'remote', 'escrow', 'land purchase']
  },
  {
    id: 'advocate-client-privilege',
    category: 'Fees & Retainers',
    question: 'Is my initial legal consultation confidential, and how do you prevent conflicts of interest?',
    answer: 'All communications, disclosures, and documents shared with William & Co. Advocates are protected by statutory advocate-client professional privilege under Section 134 of the Evidence Act (Cap 80). Even if you do not ultimately retain our firm, your preliminary disclosures cannot be disclosed or subpoenaed. Before any initial consultation, our practice manager conducts a conflict-of-interest check against existing clients and active case files.',
    statutoryReference: 'Evidence Act (Cap 80, Section 134)',
    keywords: ['confidentiality', 'privilege', 'consultation', 'conflict of interest', 'privacy', 'secret']
  },
  {
    id: 'bail-bond-rights',
    category: 'Litigation & ADR',
    question: 'What are an arrested person\'s constitutional rights regarding bail and police bond in Kenya?',
    answer: 'Under Article 49(1)(h) of the Constitution of Kenya 2010, every arrested person has the right to be released on bond or bail on reasonable terms pending a charge or trial, unless there are compelling reasons not to be released. Furthermore, an arrestee must be presented before a competent court within 24 hours of arrest. Our litigation advocates provide emergency bail/bond applications at police stations and before Magistrate\'s Courts throughout Kiambu and Nairobi.',
    statutoryReference: 'Constitution of Kenya (Article 49) & National Bail and Bond Policy',
    keywords: ['bail', 'bond', 'arrest', 'criminal', 'police', 'court', 'rights']
  }
];

const CATEGORIES = [
  'All Categories',
  'Land & Property',
  'Corporate & Business',
  'Litigation & ADR',
  'Succession & Family',
  'Fees & Retainers',
  'Employment'
] as const;

export const FAQSection: React.FC<{
  title?: string;
  subtitle?: string;
  defaultCategory?: string;
  showCategories?: boolean;
}> = ({
  title = "Frequently Asked Questions",
  subtitle = "Clear, practical answers to common legal questions governed by Kenyan law and court procedure.",
  defaultCategory = 'All Categories',
  showCategories = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<string[]>(['land-due-diligence']); // First one open by default

  const toggleItem = (id: string) => {
    setOpenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = useMemo(() => {
    return LEGAL_FAQS.filter(item => {
      const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchQuestion = item.question.toLowerCase().includes(q);
      const matchAnswer = item.answer.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some(k => k.toLowerCase().includes(q));
      const matchStatute = item.statutoryReference?.toLowerCase().includes(q);

      return matchQuestion || matchAnswer || matchKeywords || matchStatute;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section className="py-20 bg-brand-light border-t border-gray-100" id="faqs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest mb-3">
            <HelpCircle size={14} className="text-brand-gold" />
            Legal Guidance & Clarity
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-navy mb-4">
            {title}
          </h2>
          <div className="w-20 h-1 bg-brand-gold mx-auto mb-4" />
          <p className="text-gray-600 text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Search Bar & Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search legal queries (e.g. land search, fees, succession, dismissal, bail)..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold shadow-xs placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase font-bold text-gray-400 hover:text-brand-navy"
              >
                Clear
              </button>
            )}
          </div>

          {showCategories && (
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-sm uppercase tracking-wider transition-all ${
                    selectedCategory === category
                      ? 'bg-brand-navy text-brand-gold shadow-xs'
                      : 'bg-white text-gray-600 hover:text-brand-navy border border-gray-200 hover:border-brand-gold/40'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-sm border border-gray-200">
              <Scale className="mx-auto text-gray-300 mb-3" size={40} />
              <h3 className="font-serif font-bold text-lg text-brand-navy mb-2">No matching questions found</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                We couldn't find an answer matching "{searchQuery}". You can speak directly with our advocates for personalized counsel.
              </p>
              <Link to="/book" className="btn-primary inline-flex items-center gap-2 text-xs uppercase tracking-widest">
                Book a Consultation <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-sm border transition-all duration-200 overflow-hidden ${
                    isOpen 
                      ? 'border-brand-gold/60 shadow-sm ring-1 ring-brand-gold/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full px-6 py-5 flex items-start justify-between text-left gap-4 group focus:outline-none"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-brand-light text-brand-blue border border-brand-blue/10 rounded-xs">
                          {faq.category}
                        </span>
                        {faq.statutoryReference && (
                          <span className="text-[10px] text-gray-400 font-mono hidden sm:inline-block">
                            Ref: {faq.statutoryReference}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-brand-navy group-hover:text-brand-blue transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-brand-navy text-brand-gold rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-brand-light group-hover:text-brand-navy'
                    }`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-gray-100 text-gray-700 leading-relaxed text-sm sm:text-base space-y-3">
                          <p>{faq.answer}</p>
                          {faq.statutoryReference && (
                            <div className="pt-2 flex items-center gap-2 text-xs text-brand-navy/70 font-semibold bg-brand-light p-3 rounded-xs border-l-2 border-brand-gold">
                              <FileText size={14} className="text-brand-gold shrink-0" />
                              <span>Governing Legal Framework: {faq.statutoryReference}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Consultation CTA Card */}
        <div className="mt-12 bg-brand-navy text-white p-8 sm:p-10 rounded-sm shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10 pointer-events-none">
            <Scale size={240} className="text-brand-gold" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Need Tailored Legal Advice?</span>
              <h3 className="text-2xl font-serif font-bold text-white">Have a Specific Matter Not Answered Here?</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Every legal situation possesses unique facts. Schedule an in-person conference at our Wakulima House chambers in Ruiru or via teleconference.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <Link 
                to="/book" 
                className="bg-brand-gold text-brand-navy font-bold px-6 py-3 rounded-sm text-xs uppercase tracking-widest hover:bg-brand-gold/90 transition-all text-center"
              >
                Book Consultation
              </Link>
              <a 
                href="tel:+254712220470" 
                className="border border-white/30 text-white font-bold px-6 py-3 rounded-sm text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-center"
              >
                <Phone size={14} className="text-brand-gold" /> +254 712 220 470
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
