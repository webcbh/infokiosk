import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function BusRoutesEditor({ config, updateConfig }: any) {
  const [expandedRoute, setExpandedRoute] = useState<number | null>(null);

  const defaultConfig = {
    header: {
      title: "BUS ROUTES",
      subtitle: "Easy connections to key destinations.\nPlan your journey with our convenient bus services.",
      icon: "Bus"
    },
    routes: [
      {
        id: "route-1",
        number: "611",
        title: "BUS ROUTE 611",
        subtitle: "Harbour - Geroskipou Beach (Waterpark)",
        stops: "Geroskipou Beach (Waterpark), Poseidonos Av., Danaes Av., Poseidonos, Artemidos, Ledas, Harbour (Main Station)",
        sections: [
          {
            title: "FROM HARBOUR",
            icon: "Ship",
            schedules: [
              {
                title: "MONDAY - FRIDAY",
                subtitle: "(Valid From September to May)",
                times: "6:25, 6:50, 7:20, 7:50, 8:05 - 10:35\n(every 10 minutes), 10:50, 11:05, 11:20, 11:35,\n11:50, 12:15, 12:25, 12:35, 12:45, 13:00,\n13:20, 13:35, 13:50, 14:05 - 16:55\n(every 10 minutes), 17:10, 17:25, 17:40, 17:55."
              },
              {
                title: "MONDAY - FRIDAY",
                subtitle: "(Valid From June to August)\n+ SATURDAYS + SUNDAYS + SCHOOL HOLIDAYS",
                times: "6:25, 6:50, 7:20, 7:50, 8:05 - 10:45\n(every 10 minutes), 11:00 - 14:20\n(every 10-15 minutes), 14:35 - 16:45\n(every 10 minutes), 17:00, 17:15,\n17:30, 17:50."
              }
            ]
          },
          {
            title: "FROM GEROSKIPOU BEACH (WATERPARK)",
            icon: "Umbrella",
            schedules: [
              {
                title: "MONDAY - FRIDAY",
                subtitle: "(Valid From September to May)",
                times: "6:40, 7:05, 7:35, 8:05, 8:20 - 11:35\n(every 10-15 minutes), 11:55, 12:15, 12:30,\n12:45, 12:55, 13:05 - 14:05 (every 15 minutes),\n13:20 - 17:10 (every 10 minutes),\n17:25 - 18:10 (every 15 minutes)."
              },
              {
                title: "MONDAY - FRIDAY",
                subtitle: "(Valid From June to August)\n+ SATURDAYS + SUNDAYS + SCHOOL HOLIDAYS",
                times: "6:40, 7:05, 7:35, 8:00, 8:20 - 12:55\n(every 10-15 minutes), 13:15, 13:30, 13:45,\n13:55, 14:10, 14:25, 14:35, 14:50,\n15:05 - 16:05 (every 10 minutes),\n16:10 - 16:50 (every 10 minutes),\n17:05, 17:20, 17:30, 17:45, 18:05."
              }
            ]
          },
          {
            title: "NIGHT ROUTES FROM APRIL - NOVEMBER",
            icon: "Moon",
            schedules: [
              {
                title: "FROM HARBOUR",
                subtitle: "MONDAY - SUNDAY",
                times: "18:05 - 21:20 (every 15 minutes),\n21:50, 22:20, 22:50 - 01:05\n(every 15 minutes)"
              },
              {
                title: "FROM GEROSKIPOU MUNICIPAL BEACH",
                subtitle: "MONDAY - SUNDAY",
                times: "18:20 - 21:35 (every 15 minutes),\n22:05, 22:35, 23:05 - 01:20\n(every 15 minutes)"
              }
            ]
          },
          {
            title: "NIGHT ROUTES FROM DECEMBER - MARCH",
            icon: "Moon",
            schedules: [
              {
                title: "FROM HARBOUR",
                subtitle: "MONDAY - SUNDAY",
                times: "18:05 - 20:35 (every 30 minutes),\n21:50 - 00:20 (every 30 minutes)"
              },
              {
                title: "FROM GEROSKIPOU MUNICIPAL BEACH",
                subtitle: "MONDAY - SUNDAY",
                times: "18:20 - 20:50 (every 30 minutes),\n22:05 - 00:35 (every 30 minutes)"
              }
            ]
          }
        ]
      }
    ],
    note: {
      title: "PLEASE NOTE",
      description: "Schedules may be subject to change on public holidays and special occasions.\nPlease check at the main station or with our concierge for the latest updates."
    },
    footer: {
      title: "NEED HELP PLANNING YOUR JOURNEY?",
      subtitle: "Our team is here to assist you.",
      icon: "Bus"
    }
  };

  const routesConfig = config.busRoutesConfig || defaultConfig;

  const updateRoutesConfig = (key: string, value: any) => {
    updateConfig("busRoutesConfig", {
      ...routesConfig,
      [key]: value
    });
  };

  const updateRoute = (idx: number, key: string, value: any) => {
    const newRoutes = [...routesConfig.routes];
    newRoutes[idx] = { ...newRoutes[idx], [key]: value };
    updateRoutesConfig("routes", newRoutes);
  };

  const addRoute = () => {
    const newRoutes = [...routesConfig.routes];
    newRoutes.push({
      id: `route-${Date.now()}`,
      number: "",
      title: "NEW ROUTE",
      subtitle: "",
      stops: "",
      sections: []
    });
    updateRoutesConfig("routes", newRoutes);
    setExpandedRoute(newRoutes.length - 1);
  };

  const removeRoute = (idx: number) => {
    const newRoutes = [...routesConfig.routes];
    newRoutes.splice(idx, 1);
    updateRoutesConfig("routes", newRoutes);
  };

  const addSection = (routeIdx: number) => {
    const newRoutes = [...routesConfig.routes];
    const newSections = [...(newRoutes[routeIdx].sections || [])];
    newSections.push({
      title: "NEW SECTION",
      icon: "MapPin",
      schedules: []
    });
    newRoutes[routeIdx].sections = newSections;
    updateRoutesConfig("routes", newRoutes);
  };

  const updateSection = (routeIdx: number, sectionIdx: number, key: string, value: any) => {
    const newRoutes = [...routesConfig.routes];
    const newSections = [...(newRoutes[routeIdx].sections || [])];
    newSections[sectionIdx] = { ...newSections[sectionIdx], [key]: value };
    newRoutes[routeIdx].sections = newSections;
    updateRoutesConfig("routes", newRoutes);
  };

  const removeSection = (routeIdx: number, sectionIdx: number) => {
    const newRoutes = [...routesConfig.routes];
    const newSections = [...(newRoutes[routeIdx].sections || [])];
    newSections.splice(sectionIdx, 1);
    newRoutes[routeIdx].sections = newSections;
    updateRoutesConfig("routes", newRoutes);
  };

  const addSchedule = (routeIdx: number, sectionIdx: number) => {
    const newRoutes = [...routesConfig.routes];
    const newSections = [...(newRoutes[routeIdx].sections || [])];
    const newSchedules = [...(newSections[sectionIdx].schedules || [])];
    newSchedules.push({
      title: "NEW SCHEDULE",
      subtitle: "",
      times: ""
    });
    newSections[sectionIdx].schedules = newSchedules;
    newRoutes[routeIdx].sections = newSections;
    updateRoutesConfig("routes", newRoutes);
  };

  const updateSchedule = (routeIdx: number, sectionIdx: number, scheduleIdx: number, key: string, value: any) => {
    const newRoutes = [...routesConfig.routes];
    const newSections = [...(newRoutes[routeIdx].sections || [])];
    const newSchedules = [...(newSections[sectionIdx].schedules || [])];
    newSchedules[scheduleIdx] = { ...newSchedules[scheduleIdx], [key]: value };
    newSections[sectionIdx].schedules = newSchedules;
    newRoutes[routeIdx].sections = newSections;
    updateRoutesConfig("routes", newRoutes);
  };

  const removeSchedule = (routeIdx: number, sectionIdx: number, scheduleIdx: number) => {
    const newRoutes = [...routesConfig.routes];
    const newSections = [...(newRoutes[routeIdx].sections || [])];
    const newSchedules = [...(newSections[sectionIdx].schedules || [])];
    newSchedules.splice(scheduleIdx, 1);
    newSections[sectionIdx].schedules = newSchedules;
    newRoutes[routeIdx].sections = newSections;
    updateRoutesConfig("routes", newRoutes);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 mt-6">
      <h3 className="font-semibold text-lg text-gray-800">Bus Routes Data Editor</h3>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-sm text-gray-700">Routes</h4>
          <button onClick={addRoute} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm">
            <Plus size={16} /> Add Route
          </button>
        </div>

        <div className="space-y-4">
          {(routesConfig.routes || []).map((route: any, routeIdx: number) => (
            <div key={route.id || routeIdx} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div 
                className="flex items-center justify-between bg-gray-50 p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedRoute(expandedRoute === routeIdx ? null : routeIdx)}
              >
                <div className="font-medium text-sm text-gray-800">
                  {route.number ? `${route.number} - ` : ""}{route.title || `Route ${routeIdx + 1}`}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); removeRoute(routeIdx); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                  {expandedRoute === routeIdx ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                </div>
              </div>

              {expandedRoute === routeIdx && (
                <div className="p-4 space-y-4 bg-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Route Number</label>
                      <input type="text" value={route.number || ""} onChange={(e) => updateRoute(routeIdx, 'number', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="e.g. 611" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Route Title</label>
                      <input type="text" value={route.title || ""} onChange={(e) => updateRoute(routeIdx, 'title', e.target.value)} className="w-full p-2 border rounded text-sm font-medium" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Route Subtitle</label>
                      <input type="text" value={route.subtitle || ""} onChange={(e) => updateRoute(routeIdx, 'subtitle', e.target.value)} className="w-full p-2 border rounded text-sm" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Stops Description</label>
                      <textarea value={route.stops || ""} onChange={(e) => updateRoute(routeIdx, 'stops', e.target.value)} className="w-full p-2 border rounded text-sm" rows={2} />
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-sm text-gray-700">Sections (e.g. From Harbour, Night Routes)</h5>
                      <button onClick={() => addSection(routeIdx)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-xs">
                        <Plus size={14} /> Add Section
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(route.sections || []).map((section: any, sectionIdx: number) => (
                        <div key={sectionIdx} className="border border-gray-100 rounded bg-gray-50 p-3">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 grid grid-cols-2 gap-3 mr-4">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Section Title</label>
                                <input type="text" value={section.title || ""} onChange={(e) => updateSection(routeIdx, sectionIdx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-xs font-semibold uppercase" />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Icon (Lucide name)</label>
                                <input type="text" value={section.icon || ""} onChange={(e) => updateSection(routeIdx, sectionIdx, 'icon', e.target.value)} className="w-full p-1.5 border rounded text-xs" />
                              </div>
                            </div>
                            <button onClick={() => removeSection(routeIdx, sectionIdx)} className="p-1 text-red-500 hover:bg-red-50 rounded mt-5">
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="pl-4 border-l-2 border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-medium text-gray-600">Schedules & Times</span>
                              <button onClick={() => addSchedule(routeIdx, sectionIdx)} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                + Add Schedule
                              </button>
                            </div>
                            <div className="space-y-3">
                              {(section.schedules || []).map((schedule: any, scheduleIdx: number) => (
                                <div key={scheduleIdx} className="bg-white p-2 rounded border border-gray-100 relative">
                                  <button onClick={() => removeSchedule(routeIdx, sectionIdx, scheduleIdx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                                    <Trash2 size={12} />
                                  </button>
                                  <div className="grid grid-cols-2 gap-2 mb-2 pr-6">
                                    <input type="text" value={schedule.title || ""} onChange={(e) => updateSchedule(routeIdx, sectionIdx, scheduleIdx, 'title', e.target.value)} className="w-full p-1.5 border rounded text-xs font-semibold uppercase bg-gray-50" placeholder="MONDAY - FRIDAY" />
                                    <input type="text" value={schedule.subtitle || ""} onChange={(e) => updateSchedule(routeIdx, sectionIdx, scheduleIdx, 'subtitle', e.target.value)} className="w-full p-1.5 border rounded text-xs text-orange-600 bg-gray-50" placeholder="Valid From..." />
                                  </div>
                                  <textarea value={schedule.times || ""} onChange={(e) => updateSchedule(routeIdx, sectionIdx, scheduleIdx, 'times', e.target.value)} className="w-full p-1.5 border rounded text-xs font-mono bg-gray-50" rows={3} placeholder="Times..." />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {routesConfig.routes?.length === 0 && (
            <div className="text-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
              No routes added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
