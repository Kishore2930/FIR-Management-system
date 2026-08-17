export interface LegalSection {
    id: string;
    section: string;     // e.g. "BNS 303" or "IPC 379"
    title: string;       // brief name
    act: string;         // full act name
    punishment: string;  // punishment description
    category: string;    // crime category
}

export const CRIME_CATEGORIES = [
    "Theft & Robbery",
    "Murder & Homicide",
    "Assault & Hurt",
    "Sexual Offences",
    "Domestic Violence",
    "Cyber Crime",
    "Fraud & Cheating",
    "Kidnapping & Abduction",
    "Road Accidents",
    "Drug Offences",
    "Property Disputes",
    "Public Order",
    "Corruption",
    "Other",
] as const;

export const LEGAL_SECTIONS: LegalSection[] = [
    // ── Theft & Robbery ─────────────────────────────────────────────
    {
        id: "bns-303-2",
        section: "BNS §303(2)",
        title: "Theft",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 3 years and/or fine",
        category: "Theft & Robbery",
    },
    {
        id: "bns-304",
        section: "BNS §304",
        title: "Theft in a building, tent, or vessel",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 7 years and fine",
        category: "Theft & Robbery",
    },
    {
        id: "bns-308-4",
        section: "BNS §308(4)",
        title: "Robbery",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Rigorous imprisonment up to 10 years and fine",
        category: "Theft & Robbery",
    },
    {
        id: "bns-309",
        section: "BNS §309",
        title: "Dacoity (Gang Robbery)",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Rigorous imprisonment up to 10 years / life imprisonment, and fine",
        category: "Theft & Robbery",
    },
    {
        id: "bns-310",
        section: "BNS §310",
        title: "Robbery or Dacoity with attempt to cause death",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Rigorous imprisonment up to 10 years and fine, or death",
        category: "Theft & Robbery",
    },
    {
        id: "bns-305",
        section: "BNS §305",
        title: "Theft by clerk or servant",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 7 years and fine",
        category: "Theft & Robbery",
    },
    {
        id: "bns-306",
        section: "BNS §306",
        title: "Theft after preparation for causing hurt",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Rigorous imprisonment up to 14 years",
        category: "Theft & Robbery",
    },

    // ── Murder & Homicide ─────────────────────────────────────────────
    {
        id: "bns-101-1",
        section: "BNS §101(1)",
        title: "Murder",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Death or imprisonment for life and fine",
        category: "Murder & Homicide",
    },
    {
        id: "bns-103-1",
        section: "BNS §103(1)",
        title: "Punishment for murder",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Death penalty or imprisonment for life",
        category: "Murder & Homicide",
    },
    {
        id: "bns-105",
        section: "BNS §105",
        title: "Culpable Homicide not amounting to Murder",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 10 years and fine, or life imprisonment",
        category: "Murder & Homicide",
    },
    {
        id: "bns-106",
        section: "BNS §106",
        title: "Causing death by negligence",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 5 years and fine",
        category: "Murder & Homicide",
    },
    {
        id: "bns-108",
        section: "BNS §108",
        title: "Abetment of suicide",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 10 years and fine",
        category: "Murder & Homicide",
    },

    // ── Assault & Hurt ─────────────────────────────────────────────
    {
        id: "bns-115-2",
        section: "BNS §115(2)",
        title: "Voluntarily causing Hurt",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 1 year and/or fine up to ₹10,000",
        category: "Assault & Hurt",
    },
    {
        id: "bns-117-2",
        section: "BNS §117(2)",
        title: "Voluntarily causing Grievous Hurt",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 7 years and fine",
        category: "Assault & Hurt",
    },
    {
        id: "bns-118",
        section: "BNS §118(1)",
        title: "Voluntarily causing Hurt by dangerous weapons",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 3 years and/or fine up to ₹20,000",
        category: "Assault & Hurt",
    },
    {
        id: "bns-124",
        section: "BNS §124",
        title: "Assault or criminal force",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 3 months and/or fine up to ₹1,000",
        category: "Assault & Hurt",
    },
    {
        id: "bns-125",
        section: "BNS §125",
        title: "Assault to outrage modesty",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 2 years and/or fine",
        category: "Assault & Hurt",
    },
    {
        id: "bns-131",
        section: "BNS §131",
        title: "Culpable Homicide by causing hurt",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 7 years and fine",
        category: "Assault & Hurt",
    },

    // ── Sexual Offences ─────────────────────────────────────────────
    {
        id: "bns-63",
        section: "BNS §63",
        title: "Rape",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Rigorous imprisonment not less than 10 years, up to life; fine",
        category: "Sexual Offences",
    },
    {
        id: "bns-64",
        section: "BNS §64",
        title: "Punishment for Rape",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Rigorous imprisonment not less than 10 years and up to life, and fine",
        category: "Sexual Offences",
    },
    {
        id: "bns-66",
        section: "BNS §66",
        title: "Rape causing death or persistent vegetative state",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Rigorous imprisonment not less than 20 years, up to life or death",
        category: "Sexual Offences",
    },
    {
        id: "bns-70",
        section: "BNS §70",
        title: "Gang Rape",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Rigorous imprisonment up to 20 years or life, and fine",
        category: "Sexual Offences",
    },
    {
        id: "bns-75",
        section: "BNS §75",
        title: "Sexual Harassment",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 3 years and/or fine",
        category: "Sexual Offences",
    },
    {
        id: "bns-77",
        section: "BNS §77",
        title: "Voyeurism",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment 1–3 years and fine",
        category: "Sexual Offences",
    },
    {
        id: "pocso-4",
        section: "POCSO §4",
        title: "Penetrative sexual assault on child",
        act: "Protection of Children from Sexual Offences Act, 2012",
        punishment: "Rigorous imprisonment not less than 10 years up to life, and fine",
        category: "Sexual Offences",
    },
    {
        id: "pocso-6",
        section: "POCSO §6",
        title: "Aggravated penetrative sexual assault on child",
        act: "Protection of Children from Sexual Offences Act, 2012",
        punishment: "Rigorous imprisonment not less than 20 years or life, and fine or death",
        category: "Sexual Offences",
    },
    {
        id: "pocso-8",
        section: "POCSO §8",
        title: "Sexual Assault on child",
        act: "Protection of Children from Sexual Offences Act, 2012",
        punishment: "Imprisonment not less than 3 years up to 5 years, and fine",
        category: "Sexual Offences",
    },

    // ── Domestic Violence ─────────────────────────────────────────────
    {
        id: "bns-85",
        section: "BNS §85",
        title: "Cruelty by husband or relatives",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 3 years and fine",
        category: "Domestic Violence",
    },
    {
        id: "bns-86",
        section: "BNS §86",
        title: "Dowry Death",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment not less than 7 years up to life",
        category: "Domestic Violence",
    },
    {
        id: "dv-act-31",
        section: "DV Act §31",
        title: "Breach of protection order",
        act: "Protection of Women from Domestic Violence Act, 2005",
        punishment: "Imprisonment up to 1 year and/or fine up to ₹20,000",
        category: "Domestic Violence",
    },
    {
        id: "dv-act-12",
        section: "DV Act §12",
        title: "Application for Protection Order",
        act: "Protection of Women from Domestic Violence Act, 2005",
        punishment: "Relief from Magistrate – protection, residence, monetary orders",
        category: "Domestic Violence",
    },
    {
        id: "bns-80",
        section: "BNS §80",
        title: "Marital rape (separated women)",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 2 years and fine",
        category: "Domestic Violence",
    },

    // ── Cyber Crime ─────────────────────────────────────────────────
    {
        id: "it-43",
        section: "IT Act §43",
        title: "Unauthorized access to computer / damage",
        act: "Information Technology Act, 2000",
        punishment: "Compensation up to ₹1 crore",
        category: "Cyber Crime",
    },
    {
        id: "it-66",
        section: "IT Act §66",
        title: "Computer-related offences (hacking)",
        act: "Information Technology Act, 2000",
        punishment: "Imprisonment up to 3 years and/or fine up to ₹5 lakhs",
        category: "Cyber Crime",
    },
    {
        id: "it-66c",
        section: "IT Act §66C",
        title: "Identity Theft",
        act: "Information Technology Act, 2000",
        punishment: "Imprisonment up to 3 years and fine up to ₹1 lakh",
        category: "Cyber Crime",
    },
    {
        id: "it-66d",
        section: "IT Act §66D",
        title: "Online Cheating by Personation (Phishing/UPI fraud)",
        act: "Information Technology Act, 2000",
        punishment: "Imprisonment up to 3 years and fine up to ₹1 lakh",
        category: "Cyber Crime",
    },
    {
        id: "it-67",
        section: "IT Act §67",
        title: "Publishing obscene material online",
        act: "Information Technology Act, 2000",
        punishment: "Imprisonment up to 3 years and/or fine up to ₹5 lakhs (1st); 5 years on repeat",
        category: "Cyber Crime",
    },
    {
        id: "it-67a",
        section: "IT Act §67A",
        title: "Publishing sexually explicit material online",
        act: "Information Technology Act, 2000",
        punishment: "Imprisonment up to 5 years and fine up to ₹10 lakhs",
        category: "Cyber Crime",
    },
    {
        id: "it-66e",
        section: "IT Act §66E",
        title: "Violation of privacy (capturing images)",
        act: "Information Technology Act, 2000",
        punishment: "Imprisonment up to 3 years and/or fine up to ₹2 lakhs",
        category: "Cyber Crime",
    },
    {
        id: "bns-318-4",
        section: "BNS §318(4)",
        title: "Cheating by personation (Online impersonation)",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 5 years and fine",
        category: "Cyber Crime",
    },

    // ── Fraud & Cheating ─────────────────────────────────────────────
    {
        id: "bns-316-2",
        section: "BNS §316(2)",
        title: "Cheating",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 3 years and/or fine",
        category: "Fraud & Cheating",
    },
    {
        id: "bns-316-5",
        section: "BNS §316(5)",
        title: "Cheating with knowledge that wrongful loss may ensue",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 5 years and fine",
        category: "Fraud & Cheating",
    },
    {
        id: "bns-318-4b",
        section: "BNS §318(4)",
        title: "Cheating and dishonestly inducing delivery of property",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 7 years and fine",
        category: "Fraud & Cheating",
    },
    {
        id: "bns-336-2",
        section: "BNS §336(2)",
        title: "Forgery",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 2 years and/or fine",
        category: "Fraud & Cheating",
    },
    {
        id: "bns-338",
        section: "BNS §338",
        title: "Forgery for purpose of cheating",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 7 years and fine",
        category: "Fraud & Cheating",
    },
    {
        id: "bns-340",
        section: "BNS §340",
        title: "Using a forged document",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 7 years and fine",
        category: "Fraud & Cheating",
    },

    // ── Kidnapping & Abduction ─────────────────────────────────────
    {
        id: "bns-137-2",
        section: "BNS §137(2)",
        title: "Kidnapping from India",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 7 years and fine",
        category: "Kidnapping & Abduction",
    },
    {
        id: "bns-140",
        section: "BNS §140",
        title: "Kidnapping for ransom or extortion",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Death or imprisonment for life and fine",
        category: "Kidnapping & Abduction",
    },
    {
        id: "bns-141",
        section: "BNS §141",
        title: "Kidnapping to subject to grievous hurt, slavery, etc.",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 10 years and fine",
        category: "Kidnapping & Abduction",
    },
    {
        id: "bns-142",
        section: "BNS §142",
        title: "Abducting to compel marriage",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 10 years and fine",
        category: "Kidnapping & Abduction",
    },
    {
        id: "bns-143",
        section: "BNS §143",
        title: "Procuration of minor girl",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 10 years and fine",
        category: "Kidnapping & Abduction",
    },

    // ── Road Accidents ─────────────────────────────────────────────
    {
        id: "bns-106-1",
        section: "BNS §106(1)",
        title: "Causing death by negligent driving",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 5 years and fine",
        category: "Road Accidents",
    },
    {
        id: "bns-106-2",
        section: "BNS §106(2)",
        title: "Hit-and-run causing death (fleeing without reporting)",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 10 years and fine",
        category: "Road Accidents",
    },
    {
        id: "mva-184",
        section: "MVA §184",
        title: "Dangerous driving",
        act: "Motor Vehicles Act, 1988",
        punishment: "Imprisonment up to 1 year and/or fine ₹1,000–5,000",
        category: "Road Accidents",
    },
    {
        id: "mva-185",
        section: "MVA §185",
        title: "Driving under influence of alcohol/drugs",
        act: "Motor Vehicles Act, 1988",
        punishment: "Imprisonment up to 6 months and/or fine up to ₹10,000",
        category: "Road Accidents",
    },
    {
        id: "mva-187",
        section: "MVA §187",
        title: "Failure to report accident",
        act: "Motor Vehicles Act, 1988",
        punishment: "Imprisonment up to 3 months and/or fine up to ₹500",
        category: "Road Accidents",
    },

    // ── Drug Offences ─────────────────────────────────────────────
    {
        id: "ndps-20",
        section: "NDPS §20",
        title: "Offences related to cannabis",
        act: "Narcotic Drugs and Psychotropic Substances Act, 1985",
        punishment: "Rigorous imprisonment 6 months–10 years and fine (quantity-dependent)",
        category: "Drug Offences",
    },
    {
        id: "ndps-21",
        section: "NDPS §21",
        title: "Offences related to manufactured drugs / heroin",
        act: "Narcotic Drugs and Psychotropic Substances Act, 1985",
        punishment: "Rigorous imprisonment up to 1 year or 10 years or 20 years; fine",
        category: "Drug Offences",
    },
    {
        id: "ndps-22",
        section: "NDPS §22",
        title: "Offences related to psychotropic substances",
        act: "Narcotic Drugs and Psychotropic Substances Act, 1985",
        punishment: "Rigorous imprisonment up to 1 year or 10 years or 20 years; fine",
        category: "Drug Offences",
    },
    {
        id: "ndps-27",
        section: "NDPS §27",
        title: "Punishment for illegal drug consumption",
        act: "Narcotic Drugs and Psychotropic Substances Act, 1985",
        punishment: "Imprisonment up to 6 months and/or fine up to ₹10,000",
        category: "Drug Offences",
    },
    {
        id: "ndps-29",
        section: "NDPS §29",
        title: "Abetment and criminal conspiracy in drug offences",
        act: "Narcotic Drugs and Psychotropic Substances Act, 1985",
        punishment: "Same as for the substantive offence",
        category: "Drug Offences",
    },

    // ── Property Disputes ─────────────────────────────────────────
    {
        id: "bns-324",
        section: "BNS §324(1)",
        title: "Dishonest misappropriation of property",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 2 years and/or fine",
        category: "Property Disputes",
    },
    {
        id: "bns-325",
        section: "BNS §325",
        title: "Criminal breach of trust",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 3 years and/or fine",
        category: "Property Disputes",
    },
    {
        id: "bns-329-3",
        section: "BNS §329(3)",
        title: "Criminal trespass",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 3 months and/or fine up to ₹2,500",
        category: "Property Disputes",
    },
    {
        id: "bns-330",
        section: "BNS §330",
        title: "House trespass",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 1 year and/or fine up to ₹5,000",
        category: "Property Disputes",
    },
    {
        id: "bns-351",
        section: "BNS §351",
        title: "Criminal intimidation",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 2 years and/or fine",
        category: "Property Disputes",
    },

    // ── Public Order ─────────────────────────────────────────────
    {
        id: "bns-191-2",
        section: "BNS §191(2)",
        title: "Unlawful assembly",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 6 months and/or fine",
        category: "Public Order",
    },
    {
        id: "bns-192",
        section: "BNS §192",
        title: "Being member of unlawful assembly",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 6 months and/or fine",
        category: "Public Order",
    },
    {
        id: "bns-193",
        section: "BNS §193",
        title: "Rioting",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 2 years and/or fine",
        category: "Public Order",
    },
    {
        id: "bns-196",
        section: "BNS §196",
        title: "Promoting enmity between groups",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 3 years and/or fine",
        category: "Public Order",
    },
    {
        id: "bns-223",
        section: "BNS §223",
        title: "Disobedience to order of public servant",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 6 months and/or fine up to ₹1,000",
        category: "Public Order",
    },

    // ── Corruption ─────────────────────────────────────────────────
    {
        id: "pca-7",
        section: "PCA §7",
        title: "Bribery – public servant taking gratification",
        act: "Prevention of Corruption Act, 1988",
        punishment: "Imprisonment 3–7 years and fine",
        category: "Corruption",
    },
    {
        id: "pca-8",
        section: "PCA §8",
        title: "Bribery – taking gratification to influence public servant",
        act: "Prevention of Corruption Act, 1988",
        punishment: "Imprisonment up to 3 years and/or fine",
        category: "Corruption",
    },
    {
        id: "pca-13",
        section: "PCA §13",
        title: "Criminal misconduct by public servant",
        act: "Prevention of Corruption Act, 1988",
        punishment: "Imprisonment 4–10 years and fine",
        category: "Corruption",
    },

    // ── Other ─────────────────────────────────────────────────────
    {
        id: "bns-3-5",
        section: "BNS §3(5)",
        title: "Criminal conspiracy",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 6 months and/or fine, or same as abetted offence",
        category: "Other",
    },
    {
        id: "bns-45",
        section: "BNS §45",
        title: "Abetment of offence",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Same punishment as the abetted offence",
        category: "Other",
    },
    {
        id: "bns-238",
        section: "BNS §238",
        title: "Counterfeiting coin",
        act: "Bharatiya Nyaya Sanhita, 2023",
        punishment: "Imprisonment up to 7 years and fine",
        category: "Other",
    },
    {
        id: "arms-25",
        section: "Arms Act §25",
        title: "Possession/use of unlicensed arms",
        act: "Arms Act, 1959",
        punishment: "Imprisonment 3–7 years and fine",
        category: "Other",
    },
    {
        id: "arms-27",
        section: "Arms Act §27",
        title: "Use of arms to cause injury / death",
        act: "Arms Act, 1959",
        punishment: "Imprisonment not less than 6 months and fine",
        category: "Other",
    },
];

/** Search sections by query string (section number or title) */
export function searchSections(query: string): LegalSection[] {
    const q = query.toLowerCase().trim();
    if (!q) return LEGAL_SECTIONS;
    return LEGAL_SECTIONS.filter(
        (s) =>
            s.section.toLowerCase().includes(q) ||
            s.title.toLowerCase().includes(q) ||
            s.act.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q)
    );
}

/** Get sections for a specific category */
export function getSectionsByCategory(category: string): LegalSection[] {
    return LEGAL_SECTIONS.filter((s) => s.category === category);
}

/** Parse stored JSON string to section ID array */
export function parseSections(raw: string): string[] {
    if (!raw) return [];
    try {
        return JSON.parse(raw) as string[];
    } catch {
        return [];
    }
}

/** Encode section ID array to JSON string for storage */
export function encodeSections(ids: string[]): string {
    return JSON.stringify(ids);
}

/** Resolve section IDs to full LegalSection objects */
export function resolveSections(ids: string[]): LegalSection[] {
    return ids
        .map((id) => LEGAL_SECTIONS.find((s) => s.id === id))
        .filter(Boolean) as LegalSection[];
}
