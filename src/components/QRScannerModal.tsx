import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";

interface QRScannerModalProps {
  onClose: () => void;
  onScan: (result: string) => void;
}

export default function QRScannerModal({ onClose, onScan }: QRScannerModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[150] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-[#0B132B] border border-[#B5925A]/30 rounded-2xl max-w-md w-full relative flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center p-5 border-b border-[#B5925A]/10 bg-[#060A18]">
          <div className="font-serif text-[#D9B673] font-medium text-xl">Scan Booking QR</div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <p className="text-white/70 text-sm text-center mb-6">
            Position your booking QR code within the frame to pair your device with your room.
          </p>
          
          <div className="w-full aspect-square rounded-xl overflow-hidden bg-black relative border-2 border-[#D9B673]/30">
            <Scanner
              onScan={(result: any) => {
                if (result && result.length > 0) {
                  onScan(result[0].rawValue);
                }
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
