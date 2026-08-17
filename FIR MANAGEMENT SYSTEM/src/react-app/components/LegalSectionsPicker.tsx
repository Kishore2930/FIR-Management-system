import { useState, useMemo } from "react";
import { Search, X, Scale, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/react-app/components/ui/input";
import {
    CRIME_CATEGORIES,
    LEGAL_SECTIONS,
    type LegalSection,
    searchSections,
    getSectionsByCategory,
} from "@/react-app/lib/legalSections";

interface LegalSectionsPickerProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    readOnly?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
    "Theft & Robbery": "bg-amber-50 border-amber-200 text-amber-800",
    "Murder & Homicide": "bg-red-50 border-red-200 text-red-800",
    "Assault & Hurt": "bg-orange-50 border-orange-200 text-orange-800",
    "Sexual Offences": "bg-rose-50 border-rose-200 text-rose-800",
    "Domestic Violence": "bg-pink-50 border-pink-200 text-pink-800",
    "Cyber Crime": "bg-blue-50 border-blue-200 text-blue-800",
    "Fraud & Cheating": "bg-purple-50 border-purple-200 text-purple-800",
    "Kidnapping & Abduction": "bg-indigo-50 border-indigo-200 text-indigo-800",
    "Road Accidents": "bg-yellow-50 border-yellow-200 text-yellow-800",
    "Drug Offences": "bg-teal-50 border-teal-200 text-teal-800",
    "Property Disputes": "bg-slate-50 border-slate-200 text-slate-800",
    "Public Order": "bg-cyan-50 border-cyan-200 text-cyan-800",
    "Corruption": "bg-emerald-50 border-emerald-200 text-emerald-800",
    "Other": "bg-gray-50 border-gray-200 text-gray-800",
};

const CATEGORY_DOT: Record<string, string> = {
    "Theft & Robbery": "bg-amber-400",
    "Murder & Homicide": "bg-red-500",
    "Assault & Hurt": "bg-orange-400",
    "Sexual Offences": "bg-rose-500",
    "Domestic Violence": "bg-pink-400",
    "Cyber Crime": "bg-blue-500",
    "Fraud & Cheating": "bg-purple-500",
    "Kidnapping & Abduction": "bg-indigo-500",
    "Road Accidents": "bg-yellow-500",
    "Drug Offences": "bg-teal-500",
    "Property Disputes": "bg-slate-500",
    "Public Order": "bg-cyan-500",
    "Corruption": "bg-emerald-500",
    "Other": "bg-gray-400",
};

function SectionCard({
    section,
    isSelected,
    onToggle,
    readOnly,
}: {
    section: LegalSection;
    isSelected: boolean;
    onToggle: () => void;
    readOnly?: boolean;
}) {
    const colors = CATEGORY_COLORS[section.category] || CATEGORY_COLORS["Other"];
    return (
        <div
            onClick={readOnly ? undefined : onToggle}
            className={`relative rounded-lg border p-3 transition-all duration-150 ${readOnly ? "" : "cursor-pointer hover:shadow-md"
                } ${isSelected
                    ? "border-blue-400 bg-blue-50 shadow-sm ring-1 ring-blue-300"
                    : "border-slate-200 bg-white hover:border-blue-200"
                }`}
        >
            {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
            <div className="flex items-start gap-2 pr-4">
                <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border ${colors} shrink-0 mt-0.5`}>
                    {section.section}
                </span>
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 leading-snug">{section.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{section.act}</p>
                    <p className="text-[10px] text-slate-600 mt-1 leading-snug">
                        <span className="font-medium text-slate-700">⚖️ </span>
                        {section.punishment}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LegalSectionsPicker({ selectedIds, onChange, readOnly }: LegalSectionsPickerProps) {
    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);

    const toggle = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((x) => x !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    const displaySections: LegalSection[] = useMemo(() => {
        if (query.trim()) return searchSections(query);
        if (activeCategory) return getSectionsByCategory(activeCategory);
        return LEGAL_SECTIONS;
    }, [query, activeCategory]);

    const selectedSections = useMemo(
        () => selectedIds.map((id) => LEGAL_SECTIONS.find((s) => s.id === id)).filter(Boolean) as LegalSection[],
        [selectedIds]
    );

    if (readOnly) {
        if (selectedSections.length === 0) {
            return (
                <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground italic">
                    <Scale className="w-4 h-4" />
                    No sections recorded for this case.
                </div>
            );
        }
        return (
            <div className="space-y-2">
                {selectedSections.map((s) => {
                    const colors = CATEGORY_COLORS[s.category] || CATEGORY_COLORS["Other"];
                    return (
                        <div key={s.id} className={`flex items-start gap-3 rounded-lg border p-3 ${colors}`}>
                            <span className="text-xs font-bold shrink-0 mt-0.5">{s.section}</span>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold leading-snug">{s.title}</p>
                                <p className="text-[10px] opacity-70 mt-0.5">{s.act}</p>
                                <p className="text-[10px] mt-1 leading-snug">⚖️ {s.punishment}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Selected tags */}
            {selectedSections.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedSections.map((s) => {
                        const dot = CATEGORY_DOT[s.category] || "bg-gray-400";
                        return (
                            <span
                                key={s.id}
                                className="group inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium"
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                                {s.section} – {s.title}
                                <button
                                    onClick={() => toggle(s.id)}
                                    className="ml-0.5 text-blue-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}

            {/* Toggle picker button */}
            <button
                type="button"
                onClick={() => setShowPicker(!showPicker)}
                className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700 underline-offset-2 hover:underline"
            >
                <Scale className="w-4 h-4" />
                {showPicker ? "Hide section picker" : `Browse & add sections${selectedIds.length > 0 ? ` (${selectedIds.length} selected)` : ""}`}
                {showPicker ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showPicker && (
                <div className="border rounded-xl bg-slate-50 overflow-hidden">
                    {/* Search + category tabs */}
                    <div className="p-3 bg-white border-b space-y-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Search section number or offence name…"
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setActiveCategory(null); }}
                                className="pl-8 h-8 text-sm"
                            />
                        </div>
                        {!query && (
                            <div className="flex flex-wrap gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setActiveCategory(null)}
                                    className={`text-[11px] px-2.5 py-1 rounded-full font-medium border transition-colors ${!activeCategory ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    All
                                </button>
                                {CRIME_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setActiveCategory(cat)}
                                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium border transition-colors ${activeCategory === cat
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section grid */}
                    <div className="p-3 max-h-80 overflow-y-auto">
                        {displaySections.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">No sections match your search.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {displaySections.map((s) => (
                                    <SectionCard
                                        key={s.id}
                                        section={s}
                                        isSelected={selectedIds.includes(s.id)}
                                        onToggle={() => toggle(s.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="px-3 py-2 bg-white border-t flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            {displaySections.length} section{displaySections.length !== 1 ? "s" : ""} shown · {selectedIds.length} selected
                        </p>
                        {selectedIds.length > 0 && (
                            <button
                                type="button"
                                onClick={() => onChange([])}
                                className="text-xs text-red-500 hover:text-red-700 font-medium"
                            >
                                Clear all selections
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
