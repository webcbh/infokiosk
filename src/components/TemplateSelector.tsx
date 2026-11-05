import React, { useState, useRef, useEffect } from 'react';
import { 
  Layout, Award, Bed, Map, Heart, Sparkles, Book, Image as ImageIcon, 
  LayoutGrid, List, Calendar, CheckCircle2, ChevronDown 
} from 'lucide-react';

interface TemplateSelectorProps {
  value: string;
  onChange: (val: string) => void;
  customTemplates: any[];
}

interface TemplateOption {
  id: string;
  name: string;
  icon: any;
  desc: string;
  displayType?: string;
  isCustom?: boolean;
}

const LayoutPreview = ({ type }: { type: string }) => {
  const normalized = type === "" ? "grid" : type;
  
  switch (normalized) {
    case 'grid':
      return (
        <div className="flex flex-wrap gap-1.5 p-2 w-full h-full items-center justify-center bg-blue-50/50">
           <div className="w-[45%] h-[40%] bg-blue-400 rounded shadow-sm flex items-center justify-center"><span className="text-[8px] text-white font-bold">GRID</span></div>
           <div className="w-[45%] h-[40%] bg-blue-400 rounded shadow-sm flex items-center justify-center"><span className="text-[8px] text-white font-bold">GRID</span></div>
           <div className="w-[45%] h-[40%] bg-blue-400 rounded shadow-sm flex items-center justify-center"><span className="text-[8px] text-white font-bold">GRID</span></div>
           <div className="w-[45%] h-[40%] bg-blue-400 rounded shadow-sm flex items-center justify-center"><span className="text-[8px] text-white font-bold">GRID</span></div>
        </div>
      );
    case 'list':
    case 'directory':
      return (
        <div className="flex flex-col gap-1.5 p-2 w-full h-full justify-center bg-emerald-50/50">
           <div className="w-full h-[22%] bg-emerald-400 rounded shadow-sm flex items-center px-2"><span className="text-[8px] text-white font-bold">List Item</span></div>
           <div className="w-full h-[22%] bg-emerald-400 rounded shadow-sm flex items-center px-2"><span className="text-[8px] text-white font-bold">List Item</span></div>
           <div className="w-[85%] h-[22%] bg-emerald-400 rounded shadow-sm flex items-center px-2"><span className="text-[8px] text-white font-bold">List Item</span></div>
        </div>
      );
    case 'hero':
      return (
        <div className="flex flex-col gap-1.5 p-2 w-full h-full justify-center bg-purple-50/50">
           <div className="w-full h-[65%] bg-purple-400 rounded shadow-sm flex items-center justify-center"><span className="text-[10px] text-white font-bold">HERO IMAGE</span></div>
           <div className="w-[60%] h-[15%] bg-purple-300 rounded mx-auto flex items-center justify-center"><span className="text-[6px] text-purple-800 font-bold">Subtitle</span></div>
        </div>
      );
    case 'map':
      return (
        <div className="flex flex-col p-2 w-full h-full relative items-center justify-center">
           <div className="absolute inset-2 bg-blue-100/50 rounded-[4px] border border-blue-200/50"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-400 rounded-full border-[1.5px] border-white shadow-sm"></div>
           <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full border border-white"></div>
           <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full border border-white"></div>
        </div>
      );
    case 'daily_program':
      return (
        <div className="flex gap-2 p-2 w-full h-full items-center">
           <div className="w-[25%] h-[80%] bg-neutral-300/80 rounded-[4px] shadow-sm"></div>
           <div className="w-[75%] flex flex-col gap-1.5 h-[80%] justify-center">
             <div className="w-full h-2 bg-neutral-400/80 rounded-sm"></div>
             <div className="w-[80%] h-2 bg-neutral-300/80 rounded-sm"></div>
             <div className="w-full h-2 bg-neutral-300/80 rounded-sm"></div>
           </div>
        </div>
      );
    case 'loyalty':
      return (
        <div className="flex flex-col gap-2 p-2 w-full h-full items-center justify-center">
           <div className="w-6 h-6 rounded-full bg-yellow-200/80 border border-yellow-300/50 shadow-sm flex items-center justify-center">
             <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
           </div>
           <div className="w-[60%] h-2 bg-neutral-300/80 rounded-sm"></div>
        </div>
      );
    case 'suite':
    case 'suites':
      return (
        <div className="flex flex-col gap-1.5 w-full h-full justify-start p-2">
           <div className="w-full h-[50%] bg-neutral-300/80 rounded-[4px] shadow-sm"></div>
           <div className="flex gap-1.5 w-full h-[25%]">
             <div className="w-1/3 h-full bg-neutral-300/80 rounded-sm"></div>
             <div className="w-1/3 h-full bg-neutral-300/80 rounded-sm"></div>
             <div className="w-1/3 h-full bg-neutral-300/80 rounded-sm"></div>
           </div>
        </div>
      );
    default:
      return (
        <div className="flex flex-col gap-1.5 p-2 w-full h-full items-center justify-center">
           <div className="w-[80%] h-[60%] bg-neutral-300/80 rounded-[4px] shadow-sm"></div>
           <div className="w-[60%] h-2 bg-neutral-300/80 rounded-sm"></div>
        </div>
      );
  }
};

export default function TemplateSelector({ value, onChange, customTemplates }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hardcodedTemplates: TemplateOption[] = [
    { id: "", name: "Default Grid", icon: LayoutGrid, desc: "Standard grid layout", displayType: "grid" },
    { id: "awards", name: "Awards", icon: Award, desc: "Showcase hotel awards", displayType: "awards" },
    { id: "suites", name: "Rooms & Suites", icon: Bed, desc: "Detailed room viewer", displayType: "suites" },
    { id: "golf", name: "Golf Holidays", icon: Layout, desc: "Golf packages layout", displayType: "golf" },
    { id: "map", name: "Interactive Map", icon: Map, desc: "Point-of-interest map", displayType: "map" },
    { id: "loyalty", name: "Loyalty Club", icon: Heart, desc: "Member benefits view", displayType: "loyalty" },
    { id: "spa", name: "Spa Layout", icon: Sparkles, desc: "Wellness services", displayType: "spa" },
    { id: "weddings", name: "Weddings", icon: Heart, desc: "Wedding packages", displayType: "weddings" },
    { id: "directory", name: "Directory", icon: Book, desc: "A-Z services list", displayType: "directory" },
    { id: "daily_program", name: "Daily Program", icon: Calendar, desc: "Schedule and events", displayType: "daily_program" }
  ];

  const getIconForDisplayType = (type: string) => {
    switch (type) {
      case 'grid': return LayoutGrid;
      case 'list': return List;
      case 'hero': return ImageIcon;
      case 'suite': return Bed;
      case 'map': return Map;
      case 'directory': return Book;
      case 'daily_program': return Calendar;
      default: return Layout;
    }
  };

  const dynamicTemplates: TemplateOption[] = (customTemplates || []).map(t => ({
    id: t.id,
    name: t.name,
    icon: getIconForDisplayType(t.displayType),
    desc: `Custom ${t.displayType || 'grid'} layout`,
    displayType: t.displayType,
    isCustom: true
  }));

  const allTemplates = [...hardcodedTemplates, ...dynamicTemplates];
  const selectedTemplate = allTemplates.find(t => t.id === value) || hardcodedTemplates[0];
  const SelectedIcon = selectedTemplate.icon;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border border-neutral-300 rounded-lg px-3 py-2.5 bg-white hover:bg-neutral-50 focus:outline-none focus:border-blue-500 transition-colors text-sm"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-neutral-100 rounded text-neutral-600">
            <SelectedIcon size={16} />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-medium text-neutral-900 leading-tight">
              {selectedTemplate.name}
              {selectedTemplate.isCustom && (
                <span className="ml-2 text-[9px] uppercase font-bold tracking-wider bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded-sm">
                  Custom
                </span>
              )}
            </span>
            <span className="text-xs text-neutral-500 leading-tight">{selectedTemplate.desc}</span>
          </div>
        </div>
        <ChevronDown size={18} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
          <div className="p-1 flex flex-col gap-0.5">
            {allTemplates.map(tmpl => {
              const Icon = tmpl.icon;
              const isSelected = value === tmpl.id;
              
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    onChange(tmpl.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full text-left px-2 py-2 rounded-md transition-colors
                    ${isSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-neutral-100 text-neutral-700'}`}
                >
                  <div className={`p-1.5 rounded ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {tmpl.name}
                      {tmpl.isCustom && (
                        <span className="ml-2 text-[9px] uppercase font-bold tracking-wider bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded-sm">
                          Custom
                        </span>
                      )}
                    </span>
                    <span className="text-xs opacity-75">{tmpl.desc}</span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 size={16} className="ml-auto text-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
