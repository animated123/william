import { db } from '../src/lib/firebase';
import { collection, doc, updateDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';

export interface CaseScenarioItem {
  title: string;
  context: string;
  statute: string;
  action: string;
  outcome: string;
}

const realScenariosBySlug: Record<string, CaseScenarioItem[]> = {
  'property-conveyancing': [
    {
      title: "Resolving Conflicting Ancestral Title Claims & Due Diligence in Ruiru",
      context: "A commercial developer acquiring a 3.5-acre prime development parcel off the Thika Superhighway encountered conflicting inheritance caveats from extended family members of a deceased original allottee.",
      statute: "Land Registration Act (2012) & Law of Succession Act (Cap 160)",
      action: "Our conveyancing team conducted official historical green-card searches at the Kiambu Land Registry, requisitioned beacon verification with the Ministry of Lands surveyor, and facilitated a negotiated consent probate distribution order.",
      outcome: "Successfully expunged third-party encumbrances, registered an unencumbered Freehold Title Transfer, and averted potential multi-year land litigation."
    },
    {
      title: "Sectional Properties Conversion & Gated Community Scheme in Juja",
      context: "A residential developer with 48 completed townhouses faced delays securing mortgage disbursements because buyers' commercial banks required individual sectional titles rather than sub-leases.",
      statute: "Sectional Properties Act (2020) & Physical and Land Use Planning Act (2019)",
      action: "Structured the conversion process under the 2020 Act, prepared sectional plans approved by the Director of Survey, lodged management corporation by-laws, and surrendered the mother title.",
      outcome: "Issued 48 individual Certificate of Sectional Titles within 90 days, enabling KES 320 Million in bank mortgage drawdowns."
    },
    {
      title: "Distress for Rent & High-Value Commercial Lease Negotiation",
      context: "A commercial landlord in Ruiru town faced persistent rent default from an anchor supermarket tenant with over KES 14 Million in accumulated arrears and unauthorized sub-letting.",
      statute: "Landlord and Tenant (Shops, Hotels and Catering Establishments) Act (Cap 301) & Distress for Rent Act (Cap 293)",
      action: "Conducted legal audit of lease covenants, served statutory cure notices, and instituted lawful distress for rent through licensed auctioneers while negotiating a structured settlement deed with personal director guarantees.",
      outcome: "Recovered 100% of arrears without terminating tenancy, securing renegotiated bank-guaranteed lease terms."
    }
  ],
  'commercial-corporate': [
    {
      title: "Shareholder Deadlock & Cross-Option Minority Buyout",
      context: "Two 50/50 shareholders in an agro-processing enterprise in Kiambu reached an operational impasse regarding capital injection, crippling banking operations and vendor supplier contracts.",
      statute: "Companies Act (No. 17 of 2015) & Kenyan Arbitration Act (1995)",
      action: "Invoked the deadlock dispute clause in the memorandum of association, initiated structured mediation with an independent valuation mechanism, and drafted a comprehensive share purchase and non-compete settlement agreement.",
      outcome: "Facilitated a smooth equity transfer of 50% shares, protected uninterrupted enterprise operations, and avoided involuntary court winding-up."
    },
    {
      title: "Private Equity Debt Financing & Debenture Perfection",
      context: "A regional logistics company based along the Ruiru Bypass required KES 75 Million in asset financing from an institutional development fund.",
      statute: "Companies Act (2015) & Movable Property Security Rights Act (2017)",
      action: "Drafted the bilateral facility agreement, created floating debentures over fleet assets, registered security charges at the Business Registration Service (BRS), and rendered formal legal opinions on enforceability.",
      outcome: "Successful disbursement of funds with zero regulatory non-compliance flags during lender due diligence."
    },
    {
      title: "Beneficial Ownership Compliance & Corporate Governance Restructuring",
      context: "A medium-sized family-owned conglomerate faced administrative penalties and frozen registry services due to non-disclosure of beneficial ownership and lapsed annual returns.",
      statute: "Companies (Beneficial Ownership Information) Regulations (2020)",
      action: "Conducted a comprehensive corporate secretarial audit, prepared statutory e-register filings with the Registrar of Companies, and instituted a modern board charter.",
      outcome: "Full regulatory clearance obtained, company status restored to active standing, and compliance certificates issued."
    }
  ],
  'employment-labour': [
    {
      title: "Collective Redundancy Management for Manufacturing Plant",
      context: "A Ruiru-based beverage manufacturing plant reorganizing its operations required the lawful retrenchment of 42 employees without triggering labour union industrial strikes.",
      statute: "Employment Act (No. 11 of 2007) - Section 40 & Labour Relations Act",
      action: "Formulated the redundancy criteria based on seniority, skills, and merit; issued mandatory 30-day statutory notifications to the Kiambu County Labour Office and union representatives; and oversaw structured consultation meetings.",
      outcome: "Executed settlement agreements and severance payment releases with 100% of affected workers, with zero post-termination claims filed before the ELRC."
    },
    {
      title: "Executive Non-Compete & Trade Secrets Injunction at ELRC",
      context: "A former sales director resigned abruptly, unlawfully copied proprietary enterprise pricing models, and solicited top-tier institutional accounts for a direct rival.",
      statute: "Employment and Labour Relations Court Act & Law of Contract Act (Cap 23)",
      action: "Filed an urgent certificate of urgency application at the Employment and Labour Relations Court (ELRC) in Nairobi, seeking temporary injunctive orders restraining client poaching and trade secret dissemination.",
      outcome: "Secured interlocutory injunction preserving client relationships, followed by a consent judgment with substantial damages awarded to our client."
    },
    {
      title: "Unfair Termination Defence & Workplace Disciplinary Advisory",
      context: "A corporate employer was sued for KES 8.5 Million by a dismissed financial controller alleging lack of procedural fairness and discrimination.",
      statute: "Employment Act (2007) - Sections 41, 43, 45",
      action: "Demonstrated full compliance with statutory show-cause notices, documented evidence of the internal disciplinary hearing, and proved gross insubordination and financial manipulation.",
      outcome: "The ELRC dismissed the claim with costs awarded to our client, affirming the lawful disciplinary procedure."
    }
  ],
  'intellectual-property': [
    {
      title: "Anti-Counterfeiting Raid & High Court Trademark Litigation",
      context: "A fast-moving consumer goods client discovered counterfeit personal care products bearing an identical phonetic mark and packaging circulating in markets across Kiambu and Nairobi.",
      statute: "Anti-Counterfeit Act (2008) & Trade Marks Act (Cap 506)",
      action: "Coordinated with the Anti-Counterfeit Authority (ACA) and National Police Service for simultaneous intelligence-led warehouse raids, seizing KES 15 Million in illicit goods, and filed an infringement suit in the High Court.",
      outcome: "Obtained permanent injunctive orders restraining further importation and sale, destruction of seized stock, and an order for account of profits."
    },
    {
      title: "SaaS Software Licensing & Pan-African Intellectual Property Escrow",
      context: "A software development firm developed an automated SACCO loan underwriting system and needed to license the platform to financial cooperatives in Kenya, Uganda, and Rwanda.",
      statute: "Industrial Property Act (2001) & Copyright Act (2001)",
      action: "Drafted master enterprise software licenses, source code escrow agreements, and registered copyright assignments with the Kenya Copyright Board (KECOBO).",
      outcome: "Secured proprietary rights, established recurring royalty revenue channels, and prevented unauthorized reverse-engineering."
    }
  ],
  'cyber-data-protection': [
    {
      title: "ODPC Breach Notification & Emergency Regulatory Mitigation",
      context: "An online retail platform suffered a phishing breach exposing names, phone numbers, and encrypted order logs of over 12,000 customers.",
      statute: "Data Protection Act (2019) - Section 43 & Data Protection (General) Regulations",
      action: "Steered the incident response protocol within the strict 72-hour statutory window, drafted formal notification to the Office of the Data Protection Commissioner (ODPC), notified affected subjects, and instituted containment measures.",
      outcome: "The ODPC closed the regulatory inquiry without administrative fines, commending the organization's swift compliance and transparent mitigation."
    },
    {
      title: "Enterprise Data Protection Compliance Audit & DPIA Implementation",
      context: "A multi-branch private hospital network collecting health metrics and biometric employee records required registration as a Data Controller and Processor.",
      statute: "Data Protection Act (2019) & ODPC Directives",
      action: "Conducted data mapping across all internal departments, performed Data Protection Impact Assessments (DPIAs), authored patient privacy policies, and trained medical and IT personnel.",
      outcome: "Secured official ODPC Data Controller and Data Processor registration certificates and built robust governance frameworks."
    }
  ],
  'banking-finance': [
    {
      title: "Commercial Mortgage Charge Perfection & Cross-Collateralization",
      context: "A Tier-2 commercial bank required the perfection of security documentation for a KES 120 Million facility extended to an industrial packaging firm.",
      statute: "Land Act (2012) & Banking Act (Cap 488)",
      action: "Drafted legal charges over prime freehold industrial titles, secured Land Control Board consents and stamp duty assessments on Ardhisasa, and perfected simultaneous debentures at the BRS.",
      outcome: "Completed perfection within 21 business days, enabling on-schedule loan drawdown without priority risk."
    },
    {
      title: "Statutory Power of Sale Realization under Section 96 of Land Act",
      context: "A non-bank financial institution sought to recover KES 34 Million in defaulted business debt secured by a commercial building in Thika.",
      statute: "Land Act (2012) & Auctioneers Act (Cap 526)",
      action: "Served mandatory 90-day default notices, 40-day statutory notices of intention to sell, and defended an eleventh-hour injunction application by the debtor.",
      outcome: "Successfully lifted the injunction, conducted a public auction, and recovered the full outstanding debt plus all accrued legal and auctioneer costs."
    }
  ],
  'tax-revenue': [
    {
      title: "KRA Tax Appeals Tribunal Defense Against Default VAT Assessment",
      context: "Kenya Revenue Authority issued an automated assessment demanding KES 38 Million in disallowed input VAT and backdated corporation tax from a logistics contractor.",
      statute: "Tax Procedures Act (No. 29 of 2015) & Value Added Tax Act (2013)",
      action: "Lodged a formal Notice of Objection under Section 51 of the TPA, reconciled electronic tax invoices (e-TIMS) with customs bills of entry, and prosecuted an appeal before the Tax Appeals Tribunal (TAT).",
      outcome: "Secured a complete vacating of the KES 38 Million assessment, with KRA confirming our client's clean compliance standing."
    },
    {
      title: "Capital Gains Tax (CGT) Advisory on Corporate Land Disposition",
      context: "A property investment company disposing of multi-million shilling land holdings sought lawful tax optimization and compliance.",
      statute: "Income Tax Act (Cap 470) - Eighth Schedule",
      action: "Conducted asset valuation review, structured transfer documentation to leverage allowable statutory deductions, and expedited KRA CGT acknowledgment slips.",
      outcome: "Saved over KES 4.2 Million in erroneous tax assessments while ensuring zero delay in property transfer registration."
    }
  ],
  'adr': [
    {
      title: "High-Stakes Commercial Construction Arbitration",
      context: "A main contractor and real estate developer were deadlocked in a KES 55 Million claim involving variation costs, weather delays, and liquidated damages on a commercial mall.",
      statute: "Arbitration Act (No. 4 of 1995) & Civil Procedure Act",
      action: "Substituted lengthy court litigation with private arbitral proceedings, prepared comprehensive witness statements and forensic quantity surveyor reports, and argued the claim before an experienced CIArb sole arbitrator.",
      outcome: "Obtained a final enforceable arbitral award within 7 months, saving both parties years of high court backlog."
    },
    {
      title: "Family Business Succession & Inheritance Mediation",
      context: "Four siblings inheriting a retail hardware chain in Kiambu County were embroiled in bitter disputes threatening company liquidation and emotional estrangement.",
      statute: "Court Annexed Mediation (CAM) Rules & Law of Succession Act",
      action: "Conducted structured, confidential mediation sessions focused on preserving enterprise value, drafting an amicable separation agreement where siblings acquired distinct operational divisions.",
      outcome: "Executed a comprehensive Deed of Family Settlement adopted as an order of the High Court, preserving family wealth and continuous employment for 80 workers."
    }
  ],
  'criminal-defence': [
    {
      title: "White-Collar Economic Crime Bail & Pre-Trial Discharge",
      context: "A senior procurement officer in a semi-autonomous government agency was arrested over allegations of unprocedural tender awards and fraudulent billing.",
      statute: "Anti-Corruption and Economic Crimes Act (ACECA) & Criminal Procedure Code",
      action: "Secured immediate bail under Article 49 of the Constitution of Kenya at arraignment, challenged the charge sheet's lack of specificity, and conducted pre-trial disclosure scrutiny exposing flawed investigation.",
      outcome: "Successfully secured an acquittal under Section 210 of the CPC due to insufficient prosecution evidence."
    },
    {
      title: "Defending Commercial Director Against Fraudulent Conveyance Charges",
      context: "A real estate director was falsely implicated in a land fraud conspiracy stemming from an unauthorized third-party agent.",
      statute: "Penal Code (Cap 63) & Land Registration Act",
      action: "Substantiated documentary chain of custody, produced verified banking audit trails, and presented handwriting analysis from a certified document examiner.",
      outcome: "Director completely exonerated and charges withdrawn by the Office of the Director of Public Prosecutions (ODPP)."
    }
  ],
  'insurance-compensation': [
    {
      title: "Work Injury Benefits Act (WIBA) Industrial Accident Claim",
      context: "A factory worker in an industrial park in Ruiru sustained severe crush injuries while operating machinery, leading to partial permanent disability.",
      statute: "Work Injury Benefits Act (2007) & Occupational Safety and Health Act",
      action: "Filed formal DOSHS medical examination assessments, quantified statutory loss of earning capacity, and negotiated with the employer's liability underwriters.",
      outcome: "Recovered the statutory maximum compensation of KES 4.8 Million plus all specialized reconstructive surgical expenses."
    },
    {
      title: "Commercial Motor Vehicle Third-Party Liability Recovery",
      context: "An executive client sustained grievous spinal and vehicular damages following a head-on collision caused by a speeding commercial transport lorry.",
      statute: "Insurance (Motor Vehicle Third Party Risks) Act (Cap 405)",
      action: "Instituted a personal injury and loss-of-amenity lawsuit before the Chief Magistrate's Court, called orthopaedic expert witnesses, and proved 100% negligence.",
      outcome: "Awarded KES 7.4 Million in general and special damages, with prompt enforcement against the insurer."
    }
  ],
  'family-matrimonial': [
    {
      title: "Contested Succession & Confirmation of Grant in High Court",
      context: "A high-net-worth estate comprising agricultural farms in Kiambu, commercial plots in Ruiru, and company shares faced competing caveats from dependants and creditors.",
      statute: "Law of Succession Act (Cap 160) & Probate and Administration Rules",
      action: "Filed a comprehensive Petition for Grant of Letters of Administration Intestate, convened family consensus conferences, addressed beneficiary dependency claims, and petitioned for grant confirmation.",
      outcome: "Successfully obtained Confirmed Grant of Letters of Administration and oversaw peaceful transmission of registered titles without family liquidation."
    },
    {
      title: "Equitable Matrimonial Property Division & Spousal Maintenance",
      context: "A complex marriage dissolution involving multiple businesses, joint family residence, and disputed non-monetary indirect contributions.",
      statute: "Matrimonial Property Act (No. 49 of 2013) & Marriage Act (2014)",
      action: "Applied landmark Supreme Court precedent on equitable non-monetary contribution, established financial and maternal contributions, and negotiated an out-of-court consent settlement.",
      outcome: "Secured a fair 50/50 division of matrimonial properties, guaranteed child education trust accounts, and avoided traumatizing courtroom cross-examinations."
    }
  ]
};

async function updateData() {
  console.log('1. Updating team member slugs...');
  const teamSnap = await getDocs(collection(db, 'team'));
  for (const docSnap of teamSnap.docs) {
    const data = docSnap.data();
    let slug = data.slug;
    if (!slug) {
      if (data.name) {
        slug = data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      } else {
        slug = docSnap.id;
      }
    }
    // Specific check for William Mbugua
    if (data.name?.toLowerCase().includes('william')) {
      slug = 'william_mbugua';
    } else if (data.name?.toLowerCase().includes('michell') || data.name?.toLowerCase().includes('mitchell')) {
      slug = 'michell_wambui';
    } else if (data.name?.toLowerCase().includes('priscilla')) {
      slug = 'priscilla_wanjiru';
    } else if (data.name?.toLowerCase().includes('anthony')) {
      slug = 'anthony_ndongu_chege';
    }

    await updateDoc(docSnap.ref, {
      slug,
      updatedAt: serverTimestamp()
    });
    console.log(`Updated team member: "${data.name}" -> slug: "${slug}"`);
  }

  console.log('\n2. Updating practice area practical case scenarios...');
  const practiceSnap = await getDocs(collection(db, 'practice_areas'));
  for (const docSnap of practiceSnap.docs) {
    const area = docSnap.data();
    const scenarios = realScenariosBySlug[area.slug];
    if (scenarios) {
      const scenariosJson = JSON.stringify(scenarios);
      await updateDoc(docSnap.ref, {
        caseScenarios: scenariosJson,
        updatedAt: serverTimestamp()
      });
      console.log(`Updated real case scenarios for: "${area.title}" (${area.slug}) [${scenarios.length} scenarios]`);
    } else {
      console.log(`No scenario map for: ${area.slug}`);
    }
  }

  console.log('\nAll updates completed successfully.');
  process.exit(0);
}

updateData().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
