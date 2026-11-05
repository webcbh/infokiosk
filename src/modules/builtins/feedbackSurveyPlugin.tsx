import React, { useState } from "react";
import { ModulePlugin, ModuleContext } from "../types";
import { ArrowLeft, Star, Heart, CheckCircle2, MessageSquare, Award, ThumbsUp, Sparkles } from "lucide-react";

export const feedbackSurveyPlugin: ModulePlugin = {
  manifest: {
    id: "guest-survey",
    name: "Guest Experience & Feedback",
    subtitle: "Help Us Perfect Your Stay",
    description: "Instant guest satisfaction survey with service department ratings, suggestions, and loyalty point rewards.",
    version: "1.0.0",
    author: "Constantinou Bros Quality Assurance",
    icon: "MessageSquare",
    category: "guest-services",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop",
    permissions: ["inter-module", "storage"],
    defaultConfig: {
      rewardPoints: 50,
      departments: ["Dining", "Spa & Wellness", "Housekeeping", "Front Desk & Concierge"],
    },
  },

  renderDetail: (context: ModuleContext) => {
    return <GuestSurveyView context={context} />;
  },
};

function GuestSurveyView({ context }: { context: ModuleContext }) {
  const [rating, setRating] = useState<number>(5);
  const [selectedDept, setSelectedDept] = useState<string>("Dining");
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [guestRoom, setGuestRoom] = useState<string>("");

  const departments = context.config?.departments || [
    "Dining",
    "Spa & Wellness",
    "Housekeeping",
    "Front Desk & Concierge",
    "Pool & Beach",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Broadcast on bus so other modules / admin can log or react
    context.bus.emit("guest:feedback-submitted", {
      hotelId: context.hotel?.id,
      hotelName: context.hotel?.name,
      rating,
      department: selectedDept,
      comment,
      room: guestRoom,
      timestamp: Date.now(),
    });

    // Notify loyalty club
    context.bus.emit("dining:reservation-confirmed", { points: context.config?.rewardPoints || 50 });
    context.notify(`Thank you! Your feedback was recorded. ${context.config?.rewardPoints || 50} loyalty points awarded.`, "success");
  };

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
        <span className="text-xs text-[#E5A830] uppercase tracking-widest font-mono">Feedback System</span>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        {submitted ? (
          <div className="bg-gradient-to-b from-[#06152a] to-[#081a33] border border-[#E5A830] rounded-3xl p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#E5A830]/20 border border-[#E5A830] text-[#E5A830] flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">Thank You for Your Feedback!</h2>
            <p className="text-sm text-[#A8B6CA] leading-relaxed">
              Your feedback directly assists the management of {context.hotel?.name || "Constantinou Bros Hotels"} in maintaining our 5-star Mediterranean hospitality standard.
            </p>
            <div className="p-3 bg-[#040d1a] rounded-xl border border-white/10 text-xs font-mono text-[#E5A830]">
              Event broadcasted to ModuleBus: <strong>guest:feedback-submitted</strong>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setComment("");
              }}
              className="px-6 py-2.5 rounded-full bg-[#E5A830] text-[#06152a] font-bold text-xs uppercase tracking-wider hover:bg-[#F5BC45] transition-all cursor-pointer"
            >
              Submit Another Review
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-[#06152a] to-[#081a33] border border-[#E5A830]/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5A830]/10 border border-[#E5A830]/40 text-[#E5A830] text-[11px] uppercase tracking-widest font-semibold">
                <Sparkles size={13} /> Guest Voice & Reviews
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">How Is Your Experience?</h2>
              <p className="text-xs text-[#A8B6CA]">
                Rate your stay and receive 50 complimentary Guest Loyalty Club points.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Rating */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#A8B6CA] font-medium">Overall Rating</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        size={32}
                        className={star <= rating ? "fill-[#E5A830] text-[#E5A830]" : "text-white/20"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Department Picker */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A8B6CA] block mb-2 font-medium">
                  Department
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map((dept: string) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setSelectedDept(dept)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all ${
                        selectedDept === dept
                          ? "bg-[#E5A830] text-[#06152a] shadow-md"
                          : "bg-[#040d1a] border border-white/10 text-white/80 hover:border-[#E5A830]/40"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Number (Optional) */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A8B6CA] block mb-1.5 font-medium">
                  Room or Suite Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 402"
                  value={guestRoom}
                  onChange={(e) => setGuestRoom(e.target.value)}
                  className="w-full bg-[#040d1a] border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#E5A830] focus:outline-none"
                />
              </div>

              {/* Comments */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A8B6CA] block mb-1.5 font-medium">
                  Your Comments or Special Commendations
                </label>
                <textarea
                  rows={3}
                  placeholder="What did you enjoy most about your visit?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#040d1a] border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:border-[#E5A830] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#E5A830] to-[#F5BC45] text-[#06152a] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-transform cursor-pointer"
              >
                Submit Feedback & Claim Points
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
