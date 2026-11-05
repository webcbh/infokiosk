import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  Printer, 
  Globe, 
  Info, 
  Headphones, 
  ArrowRight, 
  RefreshCw, 
  Search, 
  PlaneTakeoff, 
  PlaneLanding, 
  Clock 
} from 'lucide-react';

interface Flight {
  id: string;
  flightNo: string;
  destination?: string;
  origin?: string;
  airline: string;
  time: string;
  status: string;
  gate?: string;
  info?: string;
  type: 'departure' | 'arrival';
}

const initialFlightsData: Record<string, { departures: Flight[], arrivals: Flight[] }> = {
  pafos: {
    departures: [
      { id: 'pfo-d1', flightNo: 'FR 3154', destination: 'Rome (FCO)', airline: 'Ryanair', time: '15:05', status: 'On Time', gate: '09', type: 'departure' },
      { id: 'pfo-d2', flightNo: 'U2 2246', destination: 'London (LTN)', airline: 'EasyJet', time: '14:20', status: 'Boarding', gate: '04', type: 'departure' },
      { id: 'pfo-d3', flightNo: 'BA 2663', destination: 'London (LGW)', airline: 'British Airways', time: '16:15', status: 'Scheduled', gate: '02', type: 'departure' },
      { id: 'pfo-d4', flightNo: 'FR 812', destination: 'Tel Aviv (TLV)', airline: 'Ryanair', time: '17:30', status: 'Delayed', gate: '11', type: 'departure' },
      { id: 'pfo-d5', flightNo: 'U2 1976', destination: 'Manchester (MAN)', airline: 'EasyJet', time: '18:45', status: 'Scheduled', gate: '06', type: 'departure' }
    ],
    arrivals: [
      { id: 'pfo-a1', flightNo: 'FR 3153', origin: 'Rome (FCO)', airline: 'Ryanair', time: '13:45', status: 'Landed', info: 'Landed 13:38', type: 'arrival' },
      { id: 'pfo-a2', flightNo: 'U2 1975', origin: 'Manchester (MAN)', airline: 'EasyJet', time: '14:10', status: 'Landed', info: 'Landed 14:12', type: 'arrival' },
      { id: 'pfo-a3', flightNo: 'BA 2662', origin: 'London (LGW)', airline: 'British Airways', time: '15:30', status: 'On Time', info: 'On Time', type: 'arrival' },
      { id: 'pfo-a4', flightNo: 'FR 811', origin: 'Athens (ATH)', airline: 'Ryanair', time: '16:45', status: 'Scheduled', info: 'Expected 16:45', type: 'arrival' },
      { id: 'pfo-a5', flightNo: 'W4 5112', origin: 'Vienna (VIE)', airline: 'Wizz Air', time: '19:20', status: 'Scheduled', info: 'Expected 19:20', type: 'arrival' }
    ]
  },
  larnaca: {
    departures: [
      { id: 'lca-d1', flightNo: 'CY 312', destination: 'Athens (ATH)', airline: 'Cyprus Airways', time: '15:10', status: 'Boarding', gate: '15', type: 'departure' },
      { id: 'lca-d2', flightNo: 'SU 384', destination: 'Moscow (SVO)', airline: 'Aeroflot', time: '14:50', status: 'On Time', gate: '22', type: 'departure' },
      { id: 'lca-d3', flightNo: 'ME 262', destination: 'Beirut (BEY)', airline: 'Middle East Airlines', time: '16:00', status: 'Scheduled', gate: '18', type: 'departure' },
      { id: 'lca-d4', flightNo: 'W6 4411', destination: 'Budapest (BUD)', airline: 'Wizz Air', time: '17:15', status: 'Delayed', gate: '24', type: 'departure' },
      { id: 'lca-d5', flightNo: 'OS 342', destination: 'Vienna (VIE)', airline: 'Austrian Airlines', time: '18:30', status: 'Scheduled', gate: '12', type: 'departure' }
    ],
    arrivals: [
      { id: 'lca-a1', flightNo: 'A3 906', origin: 'Athens (ATH)', airline: 'Aegean Airlines', time: '13:15', status: 'Landed', info: 'Landed 13:10', type: 'arrival' },
      { id: 'lca-a2', flightNo: 'QR 341', origin: 'Doha (DOH)', airline: 'Qatar Airways', time: '14:05', status: 'Landed', info: 'Landed 14:15', type: 'arrival' },
      { id: 'lca-a3', flightNo: 'CY 311', origin: 'Heraklion (HER)', airline: 'Cyprus Airways', time: '14:40', status: 'On Time', info: 'On Time', type: 'arrival' },
      { id: 'lca-a4', flightNo: 'OS 341', origin: 'Vienna (VIE)', airline: 'Austrian Airlines', time: '15:55', status: 'Scheduled', info: 'Expected 15:55', type: 'arrival' },
      { id: 'lca-a5', flightNo: 'LH 1768', origin: 'Munich (MUC)', airline: 'Lufthansa', time: '17:40', status: 'Scheduled', info: 'Expected 17:40', type: 'arrival' }
    ]
  }
};

export default function AirportInfoLayout({ module, onClose }: { module: any; onClose: () => void }) {
  // Navigation & Filter states
  const [selectedAirport, setSelectedAirport] = useState<'pafos' | 'larnaca'>('pafos');
  const [flightTab, setFlightTab] = useState<'departures' | 'arrivals'>('departures');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time state from server-side proxy
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRealTime, setIsRealTime] = useState(false);
  const [provider, setProvider] = useState<string>('Simulation');

  const fetchFlights = async (airport: 'pafos' | 'larnaca', tab: 'departures' | 'arrivals') => {
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/flights?airport=${airport}&type=${tab}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.flights)) {
          setFlights(data.flights);
          setIsRealTime(data.isRealTime);
          setProvider(data.provider);
          
          const now = new Date();
          setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      }
    } catch (e) {
      console.error("Failed to fetch flight data", e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchFlights(selectedAirport, flightTab);
  }, [selectedAirport, flightTab]);

  const handleRefresh = () => {
    fetchFlights(selectedAirport, flightTab);
  };

  const styleConfig = {
    primaryColor: '#0f3866',
    secondaryColor: '#d9b673',
    backgroundColor: '#FAFAFA',
    textColor: '#102442',
  };

  const airports = [
    {
      id: "pafos",
      name: "PAFOS INTERNATIONAL AIRPORT",
      address: "P.O. Box 62320 P.C. 8063, Pafos, Cyprus",
      website: "https://www.hermesairports.com",
      localPhone: "77778833 (local calls only)",
      intPhone: "+357 25123022 (int. calls only)",
      fax: "+357 26 007100",
      infoText: "PAFOS AIRPORT INFORMATION",
    },
    {
      id: "larnaca",
      name: "LARNACA INTERNATIONAL AIRPORT",
      address: "P.O. Box 43027 P.C. 6650, Larnaka, Cyprus",
      website: "https://www.hermesairports.com",
      localPhone: "77778833 (local calls only)",
      intPhone: "+357 25 123022 (int. calls only)",
      fax: "+357 24 008117",
      infoText: "LARNACA AIRPORT INFORMATION",
    }
  ];

  // Filtered flights selector
  const filteredFlights = (flights || []).filter(f => {
    const term = searchQuery.toLowerCase();
    const destinationOrOrigin = flightTab === 'departures' ? (f.destination || '') : (f.origin || '');
    return (
      f.flightNo.toLowerCase().includes(term) ||
      destinationOrOrigin.toLowerCase().includes(term) ||
      f.airline.toLowerCase().includes(term)
    );
  });

  // Helper to color statuses elegantly
  const getStatusStyle = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes('landed') || normalized === 'on time') {
      return 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20';
    }
    if (normalized.includes('board') || normalized.includes('gate')) {
      return 'bg-amber-500/10 text-amber-700 border border-amber-500/20 animate-pulse';
    }
    if (normalized.includes('delay')) {
      return 'bg-rose-500/10 text-rose-700 border border-rose-500/25';
    }
    return 'bg-blue-500/10 text-blue-700 border border-blue-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="absolute inset-0 z-50 overflow-y-auto bg-[#FAFAFA] relative"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Background ambient gradient blurs to make glass-morphism pop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[15%] left-[-15%] w-[60%] h-[40%] rounded-full bg-[#102442]/8 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-15%] w-[60%] h-[45%] rounded-full bg-[#d9b673]/12 blur-[140px]" />
        <div className="absolute top-[50%] left-[30%] w-[40%] h-[35%] rounded-full bg-[#102442]/5 blur-[100px]" />
      </div>

      {/* Top Header Navigation */}
      <div className="w-full bg-[#102442]/95 backdrop-blur-md text-white px-4 py-4 flex items-center sticky top-0 z-50 shadow-sm justify-between border-b border-white/5">
        <button onClick={onClose} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <ChevronLeft size={24} className="text-[#d9b673]" />
          <span className="text-sm font-semibold tracking-widest uppercase">GENERAL INFORMATION</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8 relative z-10">
        
        {/* Main Header Row */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-2">
          <div className="w-24 h-24 shrink-0 rounded-full flex items-center justify-center bg-[#102442] border-[3px] border-[#d9b673] shadow-lg">
            {/* Plane Icon as customized in the image */}
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#d9b673]" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left pt-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#102442] uppercase font-serif">
              AIRPORT INFORMATION
            </h1>
            <div className="h-0.5 w-12 bg-[#d9b673] mx-auto md:mx-0 my-3"></div>
            <p className="text-[#4A5568] leading-relaxed text-sm md:text-base max-w-2xl">
              All the information you need for a smooth and easy journey. Contact details and useful resources for your travel.
            </p>
          </div>
        </div>

        {/* -------------------- LIVE FLIGHT TRACKER WIDGET -------------------- */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/80 shadow-md flex flex-col gap-6">
          
          {/* Header row with LIVE indicator and simulated refresh */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#102442]/10 flex items-center justify-center text-[#102442]">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#102442] tracking-wide flex items-center gap-2">
                  Live Flight Tracker
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {isRealTime ? `Real-Time active (${provider})` : 'Sandbox Mode (Simulated schedules)'} • Last sync: <span className="font-mono text-neutral-700 font-semibold">{lastUpdated}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isSyncing}
              className="self-start sm:self-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#102442] hover:bg-[#152e54] text-white font-medium text-xs rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-55 group"
            >
              <RefreshCw size={14} className={`text-[#d9b673] ${isSyncing ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Live Status'}</span>
            </button>
          </div>

          {/* Interactive Controls Segmented Controller */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Segment 1: Airport Select */}
            <div className="flex rounded-xl bg-neutral-100/80 p-1 border border-neutral-200/40">
              <button
                onClick={() => setSelectedAirport('pafos')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedAirport === 'pafos'
                    ? 'bg-white text-[#102442] shadow-sm'
                    : 'text-neutral-500 hover:text-[#102442]'
                }`}
              >
                Pafos Airport (PFO)
              </button>
              <button
                onClick={() => setSelectedAirport('larnaca')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedAirport === 'larnaca'
                    ? 'bg-white text-[#102442] shadow-sm'
                    : 'text-neutral-500 hover:text-[#102442]'
                }`}
              >
                Larnaca Airport (LCA)
              </button>
            </div>

            {/* Segment 2: Departures vs Arrivals */}
            <div className="flex rounded-xl bg-neutral-100/80 p-1 border border-neutral-200/40">
              <button
                onClick={() => setFlightTab('departures')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  flightTab === 'departures'
                    ? 'bg-[#102442] text-white shadow-sm'
                    : 'text-neutral-500 hover:text-[#102442]'
                }`}
              >
                <PlaneTakeoff size={14} className="text-[#d9b673]" />
                Departures
              </button>
              <button
                onClick={() => setFlightTab('arrivals')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  flightTab === 'arrivals'
                    ? 'bg-[#102442] text-white shadow-sm'
                    : 'text-neutral-500 hover:text-[#102442]'
                }`}
              >
                <PlaneLanding size={14} className="text-[#d9b673]" />
                Arrivals
              </button>
            </div>

          </div>

          {!isRealTime && (
            <div className="bg-amber-50/55 border border-amber-200/50 rounded-xl p-3.5 text-xs text-amber-800 flex gap-2.5 items-start">
              <span className="text-sm leading-none mt-0.5">💡</span>
              <div className="flex-1">
                <p className="font-semibold text-amber-900">How to load real flights?</p>
                <p className="mt-0.5 text-neutral-600 leading-relaxed">
                  Currently running in sandbox mode with high-fidelity simulated schedules. To show actual real-time flights for Larnaca (LCA) and Pafos (PFO), simply obtain a free API key from <a href="https://aviationstack.com/" target="_blank" rel="noreferrer" className="underline font-medium text-amber-950 hover:text-amber-900">Aviationstack</a> or <a href="https://airlabs.co/" target="_blank" rel="noreferrer" className="underline font-medium text-amber-950 hover:text-amber-900">AirLabs</a>, and save it as <code className="bg-amber-100/80 px-1 py-0.5 rounded text-red-700">AVIATIONSTACK_API_KEY</code> or <code className="bg-amber-100/80 px-1 py-0.5 rounded text-red-700">AIRLABS_API_KEY</code> in the application's environment configuration.
                </p>
              </div>
            </div>
          )}

          {/* Search bar inside Widget */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder={`Search by Flight No, ${flightTab === 'departures' ? 'Destination' : 'Origin'}, or Airline...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm text-[#102442] focus:outline-none focus:ring-2 focus:ring-[#102442]/15 focus:border-[#102442] transition-all"
            />
          </div>

          {/* Live flight table list */}
          <div className="overflow-hidden rounded-xl border border-neutral-200/55 bg-white/40">
            <AnimatePresence mode="wait">
              {isSyncing ? (
                /* Sleek Loading Skeleton */
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 flex flex-col gap-4"
                >
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between gap-4 py-2 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-200" />
                        <div className="flex flex-col gap-2">
                          <div className="h-4 w-20 bg-neutral-200 rounded" />
                          <div className="h-3 w-28 bg-neutral-200 rounded" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="h-4 w-12 bg-neutral-200 rounded" />
                        <div className="h-5 w-16 bg-neutral-200 rounded" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : filteredFlights.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center flex flex-col items-center justify-center gap-2"
                >
                  <p className="text-sm font-semibold text-neutral-400">No active flights found matching "{searchQuery}"</p>
                  <p className="text-xs text-neutral-400">Try modifying your query or checking the alternative terminal tab.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="flights-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="divide-y divide-neutral-100"
                >
                  {/* Desktop Table Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-neutral-50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    <div className="col-span-2">Flight</div>
                    <div className="col-span-3">Airline</div>
                    <div className="col-span-3">{flightTab === 'departures' ? 'Destination' : 'Origin'}</div>
                    <div className="col-span-2">Sched. Time</div>
                    <div className="col-span-2 text-right">Status</div>
                  </div>

                  {/* Flight Rows */}
                  {filteredFlights.map((flight) => (
                    <div 
                      key={flight.id}
                      className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 px-5 py-4 hover:bg-white/50 transition-colors"
                    >
                      {/* Flight Number (Mono-spaced, Bold) */}
                      <div className="col-span-1 md:col-span-2 flex items-center justify-between md:block">
                        <span className="font-mono font-bold text-sm tracking-wide text-[#102442]">
                          {flight.flightNo}
                        </span>
                        <span className="md:hidden text-xs text-neutral-400 font-medium">
                          {flight.airline}
                        </span>
                      </div>

                      {/* Airline */}
                      <div className="hidden md:col-span-3 md:flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#102442]/5 border border-[#102442]/10 flex items-center justify-center font-bold text-[10px] text-[#102442]">
                          {flight.airline[0]}
                        </div>
                        <span className="text-xs font-semibold text-neutral-600">
                          {flight.airline}
                        </span>
                      </div>

                      {/* Destination / Origin */}
                      <div className="col-span-1 md:col-span-3 flex items-center justify-between md:block">
                        <div className="text-xs font-bold text-[#102442]">
                          {flightTab === 'departures' ? flight.destination : flight.origin}
                        </div>
                        <div className="md:hidden font-mono text-xs font-semibold text-neutral-700">
                          {flight.time}
                        </div>
                      </div>

                      {/* Sched Time & Gate */}
                      <div className="hidden md:col-span-2 md:flex flex-col">
                        <span className="font-mono font-semibold text-sm text-[#102442] flex items-center gap-1.5">
                          {flight.time}
                        </span>
                        {flight.gate && (
                          <span className="text-[10px] font-bold text-neutral-400">
                            GATE {flight.gate}
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-2">
                        <div className="md:hidden text-[10px] font-bold text-neutral-400">
                          {flight.gate ? `GATE ${flight.gate}` : (flight.info || '')}
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-center shrink-0 ${getStatusStyle(flight.status)}`}>
                          {flight.status}
                        </span>
                      </div>

                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Airport Cards */}
        <div className="flex flex-col gap-8">
          {airports.map((airport) => (
            <div 
              key={airport.id}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/60 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col gap-6"
            >
              {/* Card Title & Icon */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 shrink-0 rounded-full flex items-center justify-center bg-[#102442] border-2 border-[#d9b673] shadow-sm">
                  {/* Custom Control Tower / Airport representation */}
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#d9b673]" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21V9m0 0a3 3 0 013-3h3m-3 3a3 3 0 00-3-3H9m1.5-2h3m-3 13h3M9 15h6M9 12h6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg md:text-xl font-bold text-[#102442] tracking-wide">
                    {airport.name}
                  </h2>
                  <div className="flex items-center gap-2 text-[#C58940] text-sm mt-1">
                    <MapPin size={16} className="shrink-0" />
                    <span>{airport.address}</span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-neutral-200/50 w-full" />

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Contact list (8 cols on md+) */}
                <div className="md:col-span-7 flex flex-col gap-4">
                  
                  {/* Local Phone */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/40 border border-white/80 text-[#d9b673] shadow-sm backdrop-blur-sm">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[#102442] font-semibold text-sm md:text-base">
                        Tel. {airport.localPhone.split(' (')[0]}
                      </p>
                      <p className="text-xs text-neutral-500 font-medium">
                        (local calls only)
                      </p>
                    </div>
                  </div>

                  {/* Int Phone */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/40 border border-white/80 text-[#d9b673] shadow-sm backdrop-blur-sm">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[#102442] font-semibold text-sm md:text-base">
                        {airport.intPhone.split(' (')[0]}
                      </p>
                      <p className="text-xs text-neutral-500 font-medium">
                        (int. calls only)
                      </p>
                    </div>
                  </div>

                  {/* Fax */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/40 border border-white/80 text-[#d9b673] shadow-sm backdrop-blur-sm">
                      <Printer size={20} />
                    </div>
                    <div>
                      <p className="text-[#102442] font-semibold text-sm md:text-base">
                        Fax. {airport.fax}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Right Interactive Card (5 cols on md+) */}
                <div className="md:col-span-5 h-full">
                  <a
                    href={airport.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group block h-full min-h-[140px] bg-[#102442]/90 hover:bg-[#102442] backdrop-blur-md transition-all duration-300 rounded-2xl p-6 text-center flex flex-col items-center justify-between shadow-md cursor-pointer border border-[#d9b673]/30 hover:border-[#d9b673]/60"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#d9b673] group-hover:scale-110 transition-transform shadow-inner">
                      <Globe size={32} />
                    </div>
                    <div className="my-2">
                      <p className="text-xs font-bold tracking-widest text-white uppercase leading-relaxed">
                        {airport.infoText}
                      </p>
                    </div>
                    <div className="text-[#d9b673] font-bold text-lg flex items-center gap-1">
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Please Note Block with Warm Gold Glass Effect */}
        <div className="bg-[#FAF8F5]/80 backdrop-blur-xl border border-[#d9b673]/30 rounded-2xl p-5 md:p-6 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#FAF1E6]/90 flex items-center justify-center text-[#C58940] shrink-0 border border-white/50">
            <Info size={22} />
          </div>
          <div>
            <h4 className="text-[#102442] font-bold text-sm tracking-wide uppercase mb-1">
              PLEASE NOTE
            </h4>
            <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
              Information is subject to change. Please check the official airport websites for the latest updates before your travel.
            </p>
          </div>
        </div>

        {/* Assistance Row with Glassy Blue Effect */}
        <div 
          onClick={() => {
            alert("Concierge desk can be contacted directly from your in-room telephone or by visiting the reception lobby.");
          }}
          className="bg-[#102442]/90 hover:bg-[#102442] backdrop-blur-md transition-all duration-300 rounded-2xl p-5 md:p-6 flex items-center justify-between text-white cursor-pointer shadow-lg group border border-[#d9b673]/30 hover:border-[#d9b673]/50"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1c3861]/60 flex items-center justify-center text-[#d9b673] shrink-0 border border-white/10">
              <Headphones size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#d9b673]">
                NEED ASSISTANCE?
              </h3>
              <p className="text-xs md:text-sm text-white/80 mt-0.5">
                Our concierge team is here to help you with your travel plans.
              </p>
            </div>
          </div>
          <ArrowRight size={24} className="text-[#d9b673] group-hover:translate-x-1 transition-transform mr-2" />
        </div>

      </div>
    </motion.div>
  );
}
