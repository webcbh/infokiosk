import React, { useState, useRef } from "react";
import { Plus, Trash2, Calendar, ChevronDown, ChevronUp, Image as ImageIcon, Upload, Download, FileSpreadsheet, Save } from "lucide-react";
import * as XLSX from 'xlsx';

export default function DailyProgramEditor({
  editingHotel,
  saveHotelContent,
  ImageUpload
}: {
  editingHotel: any;
  saveHotelContent: (id: string, content: any) => void;
  ImageUpload?: any;
}) {
  const [dailyProgram, setDailyProgram] = useState<any[]>(editingHotel.content.dailyProgram || []);
  const [categories, setCategories] = useState<any[]>(editingHotel.content.dailyProgramCategories || []);
  const [expandedDayIdx, setExpandedDayIdx] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"program" | "categories">("program");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveToBackend = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/hotels/${editingHotel.id}/daily-program`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyProgram, dailyProgramCategories: categories })
      });
      if (res.ok) {
        saveHotelContent(editingHotel.id, { ...editingHotel.content, dailyProgram, dailyProgramCategories: categories });
        alert("Daily Program saved successfully!");
      } else {
        alert("Failed to save Daily Program.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving daily program.");
    } finally {
      setIsSaving(false);
    }
  };

  const addDay = () => {
    const newDay = {
      id: `dp_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: "New Day",
      description: "",
      events: []
    };
    const newProgram = [...dailyProgram, newDay];
    setDailyProgram(newProgram);
    setExpandedDayIdx(newProgram.length - 1);
  };

  const removeDay = (dIdx: number) => {
    const newProgram = [...dailyProgram];
    newProgram.splice(dIdx, 1);
    setDailyProgram(newProgram);
    if (expandedDayIdx === dIdx) setExpandedDayIdx(null);
  };

  const updateDay = (dayIdx: number, updates: any) => {
    const newProgram = [...dailyProgram];
    newProgram[dayIdx] = { ...newProgram[dayIdx], ...updates };
    setDailyProgram(newProgram);
  };

  const addEvent = (dayIdx: number) => {
    const newProgram = [...dailyProgram];
    newProgram[dayIdx].events = newProgram[dayIdx].events || [];
    newProgram[dayIdx].events.push({
      id: `ev_${Date.now()}`,
      startTime: "12:00 PM",
      endTime: "1:00 PM",
      title: "New Event",
      location: "",
      category: "Entertainment",
      description: "",
      icon: "Circle",
      image: ""
    });
    setDailyProgram(newProgram);
  };

  const updateEvent = (dIdx: number, eIdx: number, updates: any) => {
    const newProgram = [...dailyProgram];
    newProgram[dIdx].events[eIdx] = { ...newProgram[dIdx].events[eIdx], ...updates };
    setDailyProgram(newProgram);
  };

  const removeEvent = (dIdx: number, eIdx: number) => {
    const newProgram = [...dailyProgram];
    newProgram[dIdx].events.splice(eIdx, 1);
    setDailyProgram(newProgram);
  };

  const addCategory = () => {
    setCategories([...categories, { id: `cat_${Date.now()}`, name: "New Category", icon: "", color: "text-blue-500 border-blue-500" }]);
  };

  const updateCategory = (cIdx: number, updates: any) => {
    const newCategories = [...categories];
    newCategories[cIdx] = { ...newCategories[cIdx], ...updates };
    setCategories(newCategories);
  };

  const removeCategory = (cIdx: number) => {
    const newCategories = [...categories];
    newCategories.splice(cIdx, 1);
    setCategories(newCategories);
  };

  const handleExportExcel = () => {
    const rows: any[] = [];
    dailyProgram.forEach((day: any) => {
      if (day.events && day.events.length > 0) {
        day.events.forEach((ev: any) => {
          rows.push({
            Date: day.date,
            DayTitle: day.title,
            StartTime: ev.startTime,
            EndTime: ev.endTime,
            Category: ev.category,
            Location: ev.location,
            EventTitle: ev.title,
            Description: ev.description,
            ImageURL: ev.image
          });
        });
      } else {
        rows.push({
          Date: day.date,
          DayTitle: day.title,
          StartTime: "",
          EndTime: "",
          Category: "",
          Location: "",
          EventTitle: "",
          Description: "",
          ImageURL: ""
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DailyProgram");
    XLSX.writeFile(workbook, "daily_program.xlsx");
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const newProgramMap = new Map<string, any>();
        
        data.forEach((row: any) => {
          const date = row.Date || "";
          if (!date) return;
          
          if (!newProgramMap.has(date)) {
            newProgramMap.set(date, {
              id: `dp_${Date.now()}_${Math.random()}`,
              date: date,
              title: row.DayTitle || "",
              description: "",
              events: []
            });
          }
          
          if (row.EventTitle) {
            newProgramMap.get(date).events.push({
              id: `ev_${Date.now()}_${Math.random()}`,
              startTime: row.StartTime || "",
              endTime: row.EndTime || "",
              category: row.Category || "",
              location: row.Location || "",
              title: row.EventTitle || "",
              description: row.Description || "",
              image: row.ImageURL || "",
              icon: "Circle"
            });
          }
        });
        
        setDailyProgram(Array.from(newProgramMap.values()));
        alert("Imported successfully. Please review and save.");
      } catch (error) {
        console.error(error);
        alert("Failed to parse Excel file.");
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="pt-8 border-t border-neutral-100 pb-12">
      <div className="flex gap-4 mb-6 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("program")}
          className={`pb-2 px-1 text-sm font-bold uppercase tracking-wider ${activeTab === "program" ? "text-blue-600 border-b-2 border-blue-600" : "text-neutral-400"}`}
        >
          Program Schedule
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-2 px-1 text-sm font-bold uppercase tracking-wider ${activeTab === "categories" ? "text-blue-600 border-b-2 border-blue-600" : "text-neutral-400"}`}
        >
          Categories
        </button>
      </div>

      {activeTab === "program" && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase text-left mb-1">
            Daily Program Builder
          </label>
          <p className="text-xs text-neutral-500">Create days and activities.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImportExcel}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-300 text-neutral-700 rounded font-medium hover:bg-neutral-50"
            title="Import from Excel"
          >
            <Upload size={16} /> Import
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-300 text-neutral-700 rounded font-medium hover:bg-neutral-50"
            title="Export to Excel"
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={addDay}
            className="flex items-center gap-2 px-4 py-1.5 bg-[#0F203C] text-white rounded font-medium hover:bg-blue-900 ml-2"
          >
            <Plus size={16} /> Add Day
          </button>
          <button 
            onClick={handleSaveToBackend}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save size={16} /> {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {dailyProgram.length === 0 && (
          <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200">
            <p className="text-neutral-500 text-sm">No days in the program yet. Click "Add Day" or "Import" to start.</p>
          </div>
        )}
        
        {dailyProgram.map((day: any, dIdx: number) => {
          const isExpanded = expandedDayIdx === dIdx;
          return (
            <div key={day.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
              <div 
                className="bg-[#FAFAFA] p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors"
                onClick={() => setExpandedDayIdx(isExpanded ? null : dIdx)}
              >
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-neutral-400" />
                  <span className="font-bold text-neutral-700">{day.date} - {day.title || "Untitled Day"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeDay(dIdx); }}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                  {isExpanded ? <ChevronUp size={20} className="text-neutral-400" /> : <ChevronDown size={20} className="text-neutral-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 border-t border-neutral-200 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Date (YYYY-MM-DD)</label>
                      <input 
                        type="date"
                        value={day.date || ""}
                        onChange={(e) => updateDay(dIdx, { date: e.target.value })}
                        className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Title (e.g. Monday)</label>
                      <input 
                        type="text"
                        value={day.title || ""}
                        onChange={(e) => updateDay(dIdx, { title: e.target.value })}
                        className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="e.g. Monday"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-bold text-neutral-700">Events ({day.events?.length || 0})</h5>
                      <button 
                        onClick={() => addEvent(dIdx)}
                        className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-800"
                      >
                        <Plus size={16} /> Add Event
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(!day.events || day.events.length === 0) && (
                        <p className="text-xs text-neutral-400">No events for this day.</p>
                      )}
                      
                      {(day.events || []).map((ev: any, eIdx: number) => (
                        <div key={ev.id} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 relative group">
                          <button 
                            onClick={() => removeEvent(dIdx, eIdx)}
                            className="absolute -top-3 -right-3 p-1.5 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 shadow-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Start Time</label>
                              <input 
                                type="text"
                                value={ev.startTime || ""}
                                onChange={(e) => updateEvent(dIdx, eIdx, { startTime: e.target.value })}
                                className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. 10:00 AM"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">End Time</label>
                              <input 
                                type="text"
                                value={ev.endTime || ""}
                                onChange={(e) => updateEvent(dIdx, eIdx, { endTime: e.target.value })}
                                className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. 11:30 AM"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Category</label>
                              <input 
                                type="text"
                                list={`category-options-${dIdx}-${eIdx}`}
                                value={ev.category || ""}
                                onChange={(e) => updateEvent(dIdx, eIdx, { category: e.target.value })}
                                className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. Fitness & Wellness"
                              />
                              <datalist id={`category-options-${dIdx}-${eIdx}`}>
                                {categories.map(c => <option key={c.id} value={c.name} />)}
                              </datalist>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Location</label>
                              <input 
                                type="text"
                                value={ev.location || ""}
                                onChange={(e) => updateEvent(dIdx, eIdx, { location: e.target.value })}
                                className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. Main Pool"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Event Title</label>
                              <input 
                                type="text"
                                value={ev.title || ""}
                                onChange={(e) => updateEvent(dIdx, eIdx, { title: e.target.value })}
                                className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm font-bold focus:border-blue-500 focus:outline-none"
                                placeholder="e.g. Morning Aqua Aerobics"
                              />
                            </div>
                            <div>
                              {ImageUpload ? (
                                <ImageUpload
                                  value={ev.image || ""}
                                  label="Event Image"
                                  onChange={(url: string) => updateEvent(dIdx, eIdx, { image: url })}
                                />
                              ) : (
                                <>
                                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Image URL</label>
                                  <input 
                                    type="text"
                                    value={ev.image || ""}
                                    onChange={(e) => updateEvent(dIdx, eIdx, { image: e.target.value })}
                                    className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none font-mono text-blue-600"
                                    placeholder="Optional image path or URL"
                                  />
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Description</label>
                            <textarea 
                              value={ev.description || ""}
                              onChange={(e) => updateEvent(dIdx, eIdx, { description: e.target.value })}
                              className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none h-16"
                              placeholder="Brief description of the activity..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </>
      )}

      {activeTab === "categories" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase text-left mb-1">
                Category Builder
              </label>
              <p className="text-xs text-neutral-500">Manage categories, their icons, and colors.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={addCategory}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#0F203C] text-white rounded font-medium hover:bg-blue-900"
              >
                <Plus size={16} /> Add Category
              </button>
              <button 
                onClick={handleSaveToBackend}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 disabled:opacity-50"
              >
                <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((cat, cIdx) => (
              <div key={cat.id || cIdx} className="border border-neutral-200 rounded-lg bg-white p-4 relative group shadow-sm">
                <button
                  onClick={() => removeCategory(cIdx)}
                  className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                  title="Remove Category"
                >
                  <Trash2 size={14} />
                </button>
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Category Name</label>
                  <input
                    type="text"
                    value={cat.name || ""}
                    onChange={(e) => updateCategory(cIdx, { name: e.target.value })}
                    className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Fitness & Wellness"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Tailwind Colors</label>
                  <input
                    type="text"
                    value={cat.color || ""}
                    onChange={(e) => updateCategory(cIdx, { color: e.target.value })}
                    className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="text-blue-500 border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">Icon Upload</label>
                  {cat.icon ? (
                    <div className="relative w-16 h-16 rounded overflow-hidden border border-neutral-200 mb-2">
                      <img src={cat.icon} alt="Category Icon" className="w-full h-full object-cover" />
                      <button
                        onClick={() => updateCategory(cIdx, { icon: "" })}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="mb-2">
                      {ImageUpload && (
                        <ImageUpload 
                          onUploadComplete={(url: string) => updateCategory(cIdx, { icon: url })}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
