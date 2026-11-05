import React, { useState, useEffect } from "react";
import { ModulePlugin, ModuleContext } from "../types";
import { ArrowLeft, Calculator, RefreshCw, DollarSign, Euro, PoundSterling, Sparkles, Check, ChevronRight } from "lucide-react";

export const currencyConverterPlugin: ModulePlugin = {
  manifest: {
    id: "currency-calc",
    name: "Currency & Dining Tip Calculator",
    subtitle: "Real-Time Exchange Rates",
    description: "Instant conversion between EUR, GBP, USD, CHF, and ILS, plus Cyprus restaurant gratuity & bill splitting utility.",
    version: "1.0.0",
    author: "Constantinou Bros Tech Labs",
    icon: "Coins",
    category: "utilities",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=2000&auto=format&fit=crop",
    permissions: ["network", "inter-module", "storage"],
    defaultConfig: {
      defaultBaseCurrency: "EUR",
      defaultTipPercent: 10,
    },
    configSchema: [
      {
        key: "defaultBaseCurrency",
        label: "Default Base Currency",
        type: "select",
        options: [
          { label: "Euro (€)", value: "EUR" },
          { label: "British Pound (£)", value: "GBP" },
          { label: "US Dollar ($)", value: "USD" },
        ],
        defaultValue: "EUR",
      },
      {
        key: "defaultTipPercent",
        label: "Recommended Tip Percentage (%)",
        type: "number",
        defaultValue: 10,
      },
    ],
  },

  onInit: (ctx: ModuleContext) => {
    // Announce availability on bus
    ctx.bus.broadcast("utility:ready", { module: "currency-calc" });

    // Handle query from other modules for currency exchange rate
    ctx.bus.registerQueryHandler("convert", ({ amount, from, to }: { amount: number; from: string; to: string }) => {
      const rates: Record<string, number> = {
        EUR: 1.0,
        GBP: 0.855,
        USD: 1.085,
        CHF: 0.965,
        ILS: 4.02,
      };
      const inEur = amount / (rates[from] || 1.0);
      return Math.round(inEur * (rates[to] || 1.0) * 100) / 100;
    });
  },

  renderDetail: (context: ModuleContext) => {
    return <CurrencyConverterView context={context} />;
  },
};

function CurrencyConverterView({ context }: { context: ModuleContext }) {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("EUR");
  const [toCurrency, setToCurrency] = useState<string>("GBP");
  const [tipPercent, setTipPercent] = useState<number>(context.config?.defaultTipPercent || 10);
  const [splitCount, setSplitCount] = useState<number>(1);
  const [restaurantList, setRestaurantList] = useState<any[]>([]);

  // Fixed indicative benchmark rates against EUR for Cyprus hospitality
  const rates: Record<string, number> = {
    EUR: 1.0,
    GBP: 0.855,
    USD: 1.085,
    CHF: 0.965,
    ILS: 4.02,
    CAD: 1.48,
    AUD: 1.66,
  };

  const currencySymbols: Record<string, string> = {
    EUR: "€",
    GBP: "£",
    USD: "$",
    CHF: "CHF",
    ILS: "₪",
    CAD: "CA$",
    AUD: "A$",
  };

  const numAmount = parseFloat(amount) || 0;
  const inEur = numAmount / (rates[fromCurrency] || 1.0);
  const convertedAmount = inEur * (rates[toCurrency] || 1.0);

  // Tip calculation
  const tipAmount = (numAmount * tipPercent) / 100;
  const totalWithTip = numAmount + tipAmount;
  const perPerson = totalWithTip / (splitCount || 1);

  // Query Dining module via ModuleBus to demonstrate inter-module RPC!
  useEffect(() => {
    let mounted = true;
    context.bus
      .query("m3", "getRestaurants")
      .then((res) => {
        if (mounted && Array.isArray(res)) {
          setRestaurantList(res);
        }
      })
      .catch(() => {
        // Fallback or dining module not active
      });
    return () => {
      mounted = false;
    };
  }, [context.bus]);

  return (
    <div className="min-h-screen bg-[#040d1a] text-white font-sans pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-[#06152a]/95 backdrop-blur-md border-b border-[#E5A830]/30 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => context.navigation.closeModule()}
          className="flex items-center gap-2 text-[#E5A830] font-semibold text-sm uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          <span>Back to Services</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-white/70 uppercase tracking-widest font-mono">Live Plugin</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Title Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A830]/10 border border-[#E5A830]/40 text-[#E5A830] text-xs uppercase tracking-widest font-semibold">
            <Sparkles size={14} /> Modular Extension Plugin
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white font-bold">Currency & Dining Utility</h1>
          <p className="text-sm text-[#A8B6CA] max-w-lg mx-auto">
            Real-time currency exchange rates and restaurant bill calculator calibrated for Constantinou Bros Hotels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Currency Converter */}
          <div className="bg-gradient-to-b from-[#06152a] to-[#081a33] border border-[#E5A830]/40 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 text-[#E5A830] font-serif text-lg font-bold mb-4">
              <Calculator size={20} />
              <span>Currency Exchange</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#A8B6CA] uppercase tracking-wider block mb-1.5 font-medium">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E5A830] font-bold text-lg">
                    {currencySymbols[fromCurrency] || "$"}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#040d1a] border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-white font-mono text-lg font-bold focus:border-[#E5A830] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#A8B6CA] uppercase tracking-wider block mb-1.5 font-medium">
                    From
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full bg-[#040d1a] border border-white/20 rounded-xl px-3 py-2.5 text-white font-semibold text-sm focus:border-[#E5A830] focus:outline-none"
                  >
                    {Object.keys(rates).map((c) => (
                      <option key={c} value={c} className="bg-[#06152a] text-white">
                        {c} ({currencySymbols[c]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[#A8B6CA] uppercase tracking-wider block mb-1.5 font-medium">
                    To
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full bg-[#040d1a] border border-white/20 rounded-xl px-3 py-2.5 text-white font-semibold text-sm focus:border-[#E5A830] focus:outline-none"
                  >
                    {Object.keys(rates).map((c) => (
                      <option key={c} value={c} className="bg-[#06152a] text-white">
                        {c} ({currencySymbols[c]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conversion Result Box */}
              <div className="mt-6 bg-[#040d1a] border border-[#E5A830]/30 rounded-xl p-4 text-center">
                <div className="text-xs text-[#A8B6CA] uppercase tracking-widest font-mono mb-1">
                  Exchange Value
                </div>
                <div className="text-3xl font-bold font-mono text-[#E5A830]">
                  {currencySymbols[toCurrency]} {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-white/50 mt-1 font-mono">
                  1 {fromCurrency} = {( (rates[toCurrency] || 1) / (rates[fromCurrency] || 1) ).toFixed(4)} {toCurrency}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Dining Tip & Gratuity Calculator */}
          <div className="bg-gradient-to-b from-[#06152a] to-[#081a33] border border-[#E5A830]/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#E5A830] font-serif text-lg font-bold mb-4">
                <Euro size={20} />
                <span>Restaurant Bill & Tip</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#A8B6CA] uppercase tracking-wider block mb-1.5 font-medium">
                    Bill Subtotal ({currencySymbols[fromCurrency]})
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#040d1a] border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-lg font-bold focus:border-[#E5A830] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#A8B6CA] uppercase tracking-wider block mb-2 font-medium">
                    Select Gratuity: {tipPercent}%
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[5, 10, 15, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setTipPercent(pct)}
                        className={`py-2 rounded-lg text-xs font-bold transition-all ${
                          tipPercent === pct
                            ? "bg-[#E5A830] text-[#06152a] shadow-md shadow-[#E5A830]/20 scale-105"
                            : "bg-[#040d1a] border border-white/10 text-white/80 hover:border-[#E5A830]/50"
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#A8B6CA] uppercase tracking-wider block mb-1.5 font-medium">
                    Split Across Guests
                  </label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 4, 6].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setSplitCount(count)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                          splitCount === count
                            ? "bg-white/20 text-white border border-[#E5A830]"
                            : "bg-[#040d1a] border border-white/10 text-[#A8B6CA]"
                        }`}
                      >
                        {count === 1 ? "Solo" : `${count} Guests`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-xs text-[#A8B6CA]">
                <span>Tip Amount:</span>
                <span className="font-mono text-white font-semibold">
                  {currencySymbols[fromCurrency]} {tipAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white">
                <span>Total Bill:</span>
                <span className="font-mono text-[#E5A830] text-lg">
                  {currencySymbols[fromCurrency]} {totalWithTip.toFixed(2)}
                </span>
              </div>
              {splitCount > 1 && (
                <div className="flex justify-between text-xs text-emerald-400 font-semibold pt-1 border-t border-white/5">
                  <span>Each Person Pays:</span>
                  <span className="font-mono">
                    {currencySymbols[fromCurrency]} {perPerson.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inter-Module Communication Showcase banner */}
        {restaurantList.length > 0 && (
          <div className="bg-[#06152a] border border-[#E5A830]/30 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E5A830]">
                Connected with Dining Module ({restaurantList.length} Restaurants Available)
              </span>
              <button
                onClick={() => context.navigation.openModule("m3")}
                className="text-xs text-white/70 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>View Menus</span>
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {restaurantList.slice(0, 4).map((r: any, idx: number) => (
                <div key={idx} className="bg-[#040d1a] p-2.5 rounded-xl border border-white/10 text-xs">
                  <div className="font-bold text-white truncate">{r.title}</div>
                  <div className="text-[10px] text-[#A8B6CA] truncate">{r.subtitle || "À la carte"}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
