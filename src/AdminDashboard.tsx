import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import {
  Settings,
  Server as ServerIcon,
  Hotel,
  RefreshCw,
  Power,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Plus,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  Save,
  ExternalLink,
  Copy,
  Lock,
  Boxes,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { motion, AnimatePresence } from "framer-motion";
import DailyProgramEditor from "./components/DailyProgramEditor";
import LoyaltyEditor from "./components/LoyaltyEditor";
import SpaEditor from "./components/SpaEditor";
import WeddingsEditor from "./components/WeddingsEditor";
import DirectoryOfServicesEditor from "./components/DirectoryOfServicesEditor";
import GeneralInfoEditor from "./components/GeneralInfoEditor";
import TemplateSelector from "./components/TemplateSelector";
import { MobileContentManager } from "./components/MobileContentManager";
import { ModuleManagerTab } from "./components/ModuleManagerTab";
import { db as firebaseDb } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const compressImage = async (
  file: File,
  targetDimensions?: { width: number; height: number }
): Promise<File> => {
  return new Promise((resolve) => {
    // Only compress images
    if (!file.type.startsWith("image/")) return resolve(file);

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      
      let drawX = 0;
      let drawY = 0;
      let drawWidth = width;
      let drawHeight = height;

      if (targetDimensions) {
        canvas.width = targetDimensions.width;
        canvas.height = targetDimensions.height;
        
        const targetRatio = targetDimensions.width / targetDimensions.height;
        const imgRatio = width / height;
        
        if (imgRatio > targetRatio) {
          // Image is wider than target
          drawHeight = targetDimensions.height;
          drawWidth = drawHeight * imgRatio;
          drawX = (targetDimensions.width - drawWidth) / 2;
        } else {
          // Image is taller than target
          drawWidth = targetDimensions.width;
          drawHeight = drawWidth / imgRatio;
          drawY = (targetDimensions.height - drawHeight) / 2;
        }
      } else {
        // Target max dimension
        const MAX_SIZE = 1200;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        drawWidth = width;
        drawHeight = height;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);
      
      if (targetDimensions) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(
              new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: "image/jpeg",
              }),
            );
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        0.85,
      );
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
};

function DynamicIcon({ name, ...props }: { name: string; [key: string]: any }) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Settings;
  return <Icon {...props} />;
}

function ImageUpload({
  value,
  onChange,
  label = "Image URL",
  targetDimensions,
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  targetDimensions?: { width: number; height: number };
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const compressedFile = await compressImage(file, targetDimensions);
      const formData = new FormData();
      formData.append("image", compressedFile);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        if (res.status === 413) {
          throw new Error(
            "File is too large. Please upload an image smaller than 1MB.",
          );
        }
        let text = await res.text();
        try {
          const d = JSON.parse(text);
          text = d.error || text;
        } catch (e) {}
        throw new Error(text || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch (err: any) {
      console.warn("Upload failed", err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full mb-3">
                                  <label className="block text-xs uppercase text-neutral-500 mb-1">
        <ImageIcon size={14} className="inline mr-1" /> {label}
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value || ""}
          placeholder="https://..."
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent border-b border-neutral-300 focus:border-blue-500 focus:outline-none py-1 text-sm text-blue-600 font-mono"
        />
        <div className="relative">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs rounded border border-neutral-200">
            {uploading ? "Uploading..." : "Upload File"}
          </div>
        </div>
      </div>
    </div>
  );
}

function MultiImageUpload({
  onUpload,
  label,
  targetDimensions,
}: {
  onUpload: (urls: string[]) => void;
  label?: React.ReactNode;
  targetDimensions?: { width: number; height: number };
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      const files = Array.from(e.target.files) as File[];

      // Upload sequentially to avoid payload size limits and allow individual compression
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedFile = await compressImage(file, targetDimensions);

        const formData = new FormData();
        formData.append("image", compressedFile); // use single upload endpoint

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          if (res.status === 413) {
            throw new Error(
              `File ${file.name} is too large even after compression.`,
            );
          }
          let text = await res.text();
          try {
            const d = JSON.parse(text);
            text = d.error || text;
          } catch (err) {}
          throw new Error(text || `HTTP error ${res.status}`);
        }

        const data = await res.json();
        if (data.url) urls.push(data.url);
      }

      if (urls.length > 0) onUpload(urls);
    } catch (err: any) {
      console.warn("Upload failed", err);
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block mt-2">
      <input
        type="file"
        multiple
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs rounded border border-neutral-200 flex items-center gap-1 font-medium w-max">
        {label ? (
          label
        ) : (
          <>
            <Plus size={12} />{" "}
            {uploading ? "Uploading..." : "Upload Multiple Images"}
          </>
        )}
      </div>
    </div>
  );
}


function HeroTextEditor({
  label,
  textKey,
  defaultText,
  heroTexts,
  onChange,
}: {
  label: string;
  textKey: string;
  defaultText: string;
  heroTexts: any;
  onChange: (val: any) => void;
}) {
  const texts = heroTexts || {};
  const isEnabled = texts[`${textKey}Enabled`] !== false;

  return (
    <div className="border border-neutral-200 rounded p-4 bg-[#FAFAFA] shadow-sm mb-3">
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-medium text-sm text-neutral-800">{label}</h5>
        <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
          <input 
            type="checkbox" 
            checked={isEnabled} 
            onChange={(e) => onChange({ ...texts, [`${textKey}Enabled`]: e.target.checked })}
            className="accent-blue-600"
          />
          Enabled
        </label>
      </div>
      {isEnabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-neutral-500 mb-1">Text Content</label>
            <input 
              type="text" 
              value={texts[textKey] ?? defaultText} 
              onChange={(e) => onChange({ ...texts, [textKey]: e.target.value })}
              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-1">Color (Hex/RGBA)</label>
            <input 
              type="text" 
              value={texts[`${textKey}Color`] ?? ""} 
              onChange={(e) => onChange({ ...texts, [`${textKey}Color`]: e.target.value })}
              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Default"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-neutral-500 mb-1">Font Size (Tailwind class or px)</label>
            <input 
              type="text" 
              value={texts[`${textKey}Size`] ?? ""} 
              onChange={(e) => onChange({ ...texts, [`${textKey}Size`]: e.target.value })}
              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Default"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-neutral-500 mb-1">Font Family (Tailwind class or CSS)</label>
            <input 
              type="text" 
              value={texts[`${textKey}FontFamily`] ?? ""} 
              onChange={(e) => onChange({ ...texts, [`${textKey}FontFamily`]: e.target.value })}
              className="w-full bg-white border border-neutral-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Default"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("settings");
  const [loading, setLoading] = useState(true);
  const [whitelistIpInput, setWhitelistIpInput] = useState("");
  const [editingHotel, setEditingHotel] = useState<any>(null);
  const [editingSubmodule, setEditingSubmodule] = useState<{
    modIdx: number;
    subIdx: number;
    sub: any;
  } | null>(null);
  const [editingMainModuleIdx, setEditingMainModuleIdx] = useState<
    number | null
  >(null);
  const [verificationMsg, setVerificationMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setVerificationMsg(msg);
    setTimeout(() => setVerificationMsg(null), 3000);
  };

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const json = await res.json();
          setData(json);
          if (editingHotel) {
            const upToDateHotel = json.hotels.find(
              (h: any) => h.id === editingHotel.id,
            );
            if (upToDateHotel) setEditingHotel(upToDateHotel);
          }
        } else {
          throw new Error("API returned non-JSON response");
        }
      } else {
        throw new Error(`API failed with status ${res.status}`);
      }
    } catch (e) {
      console.warn("Failed to fetch admin data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleHotelSelector = async (enabled: boolean) => {
    await fetch("/api/admin/settings/general", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enableHotelSelector: enabled }),
    });
    fetchAdminData();
  };

  const handleToggleMobileApp = async (enabled: boolean) => {
    await fetch("/api/admin/settings/general", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enableMobileApp: enabled }),
    });
    fetchAdminData();
  };

  const handleToggleMobileIpBypass = async (enabled: boolean) => {
    await fetch("/api/admin/settings/general", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disableMobileIpFiltering: enabled }),
    });
    fetchAdminData();
  };

  const handleToggleHotelSelectorOld = async (enabled: boolean) => {
    await fetch("/api/admin/settings/general", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enableHotelSelector: enabled }),
    });
    fetchAdminData();
  };

  const handleToggleWhitelist = async (enabled: boolean) => {
    await fetch("/api/admin/settings/whitelist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled, ips: data.settings.whitelistedIps }),
    });
    fetchAdminData();
  };

  const handleAddIp = async () => {
    if (!whitelistIpInput.trim()) return;
    const newIps = [...data.settings.whitelistedIps, whitelistIpInput.trim()];
    await fetch("/api/admin/settings/whitelist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabled: data.settings.ipWhitelistEnabled,
        ips: newIps,
      }),
    });
    setWhitelistIpInput("");
    fetchAdminData();
  };

  const handleRemoveIp = async (ip: string) => {
    const newIps = data.settings.whitelistedIps.filter((i: string) => i !== ip);
    await fetch("/api/admin/settings/whitelist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabled: data.settings.ipWhitelistEnabled,
        ips: newIps,
      }),
    });
    fetchAdminData();
  };

  const renameDevice = async (id: string, newName: string) => {
    await fetch("/api/admin/device/rename", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: newName }),
    });
    fetchAdminData();
  };

  const pushUpdates = async () => {
    await fetch("/api/admin/push", { method: "POST" });
    showToast("Updates pushed to all hotel devices.");
    fetchAdminData();
  };

  const clearCacheAndReload = async (id?: string) => {
    await fetch("/api/admin/clear-cache", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: id }),
    });
    showToast(id ? "Sent clear cache to device." : "Sent clear cache & refresh to all kiosks.");
    fetchAdminData();
  };

  const saveToFirebase = async () => {
    try {
      await setDoc(doc(firebaseDb, "system", "details"), data);
      showToast("System details saved to Firebase successfully!");
    } catch (err) {
      console.warn(err);
      showToast("Failed to save to Firebase!");
    }
  };

  const assignHotelToDevice = async (id: string, hotelId: string) => {
    await fetch("/api/admin/device/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, hotelId }),
    });
    fetchAdminData();
    showToast("Hotel assigned to device.");
  };

  const saveHotelContent = (hotelId: string, newContent: any) => {
    // Only update local state based on user input to avoid UI stuttering.
    setEditingHotel((prev: any) => {
      if (!prev || prev.id !== hotelId) return prev;
      return { ...prev, content: newContent };
    });
  };

  const persistEditingHotel = async () => {
    if (!editingHotel) return;
    const newHotels = data.hotels.map((h: any) =>
      h.id === editingHotel.id ? editingHotel : h,
    );
    await fetch("/api/admin/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hotels: newHotels }),
    });
    fetchAdminData();
    showToast("Changes saved successfully!");
  };

  const rebootDevice = async (id?: string) => {
    await fetch("/api/admin/reboot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: id }),
    });
    fetchAdminData();
  };

  const lockDevice = async (id?: string) => {
    await fetch("/api/admin/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: id }),
    });
    showToast(id ? "Lock command sent to device." : "Lock command sent to all kiosks.");
    fetchAdminData();
  };

  if (loading) return <div className="p-8 text-neutral-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-neutral-200 p-4 shrink-0">
        <h1 className="text-xl font-bold mb-8 text-neutral-800">
          Admin Dashboard
        </h1>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("settings")}
            className={
              "w-full text-left px-4 py-2 rounded flex items-center gap-2 " +
              (activeTab === "settings"
                ? "bg-blue-50 text-blue-600"
                : "text-neutral-600 hover:bg-neutral-50")
            }
          >
            <Settings size={18} /> Settings
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={
              "w-full text-left px-4 py-2 rounded flex items-center gap-2 " +
              (activeTab === "templates"
                ? "bg-blue-50 text-blue-600"
                : "text-neutral-600 hover:bg-neutral-50")
            }
          >
            <ImageIcon size={18} /> Templates
          </button>
          <button
            onClick={() => setActiveTab("hotels")}
            className={
              "w-full text-left px-4 py-2 rounded flex items-center gap-2 " +
              (activeTab === "hotels"
                ? "bg-blue-50 text-blue-600"
                : "text-neutral-600 hover:bg-neutral-50")
            }
          >
            <Hotel size={18} /> Hotel Directory
          </button>
          <button
            onClick={() => setActiveTab("modules")}
            className={
              "w-full text-left px-4 py-2 rounded flex items-center gap-2 " +
              (activeTab === "modules"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-neutral-600 hover:bg-neutral-50")
            }
          >
            <Boxes size={18} /> Module Manager
          </button>
          <button
            onClick={() => setActiveTab("mobile_content")}
            className={
              "w-full text-left px-4 py-2 rounded flex items-center gap-2 " +
              (activeTab === "mobile_content"
                ? "bg-blue-50 text-blue-600"
                : "text-neutral-600 hover:bg-neutral-50")
            }
          >
            <Smartphone size={18} /> Mobile Content
          </button>
          <button
            onClick={() => setActiveTab("devices")}
            className={
              "w-full text-left px-4 py-2 rounded flex items-center gap-2 " +
              (activeTab === "devices"
                ? "bg-blue-50 text-blue-600"
                : "text-neutral-600 hover:bg-neutral-50")
            }
          >
            <Smartphone size={18} /> Connected Devices
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={
              "w-full text-left px-4 py-2 rounded flex items-center gap-2 " +
              (activeTab === "logs"
                ? "bg-blue-50 text-blue-600"
                : "text-neutral-600 hover:bg-neutral-50")
            }
          >
            <ServerIcon size={18} /> System Logs
          </button>

          <div className="pt-4 mt-4 border-t border-neutral-200">
            <a
              href="/"
              className="w-full text-left px-4 py-2 rounded flex items-center gap-2 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            >
              <ExternalLink size={18} /> Exit to Frontend
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 relative flex flex-col ${activeTab === "frontend" ? "p-0 h-screen overflow-hidden" : "p-8"}`}
      >
        <AnimatePresence>
          {verificationMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-50 font-medium"
            >
              <CheckCircle size={20} />
              {verificationMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-4xl max-w-full">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-800 capitalize">
              {activeTab}
            </h2>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={saveToFirebase}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-2 text-sm font-medium"
              >
                <Save size={16} /> Save to Firebase
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={pushUpdates}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm font-medium"
              >
                <RefreshCw size={16} /> Push Edits to All Hotels
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => clearCacheAndReload()}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center gap-2 text-sm font-medium"
              >
                <Trash2 size={16} /> Refresh & Clear Cache
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => lockDevice()}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium"
              >
                <Lock size={16} /> Lock All Kiosks
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => rebootDevice()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2 text-sm font-medium"
              >
                <Power size={16} /> Reboot All
              </motion.button>
            </div>
          </div>

          {/* Content Areas */}
          {activeTab === "frontend" && (
            <div className="w-full h-full bg-white rounded flex-1 flex flex-col">
              <iframe
                src="/"
                className="w-full flex-1 border-0 rounded"
                title="Frontend Preview"
              ></iframe>
            </div>
          )}

          {activeTab === "modules" && data && (
            <ModuleManagerTab hotels={data.hotels || []} onShowToast={showToast} />
          )}

          {activeTab === "settings" && data && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-medium mb-4">Frontend Preferences</h3>
              
              <div className="flex items-center justify-between py-3 border-b border-neutral-100 mb-8">
                <div>
                  <h4 className="font-medium text-neutral-800">
                    Enable Hotel Selector
                  </h4>
                  <p className="text-sm text-neutral-500">
                    Allow users to switch between different hotels from the frontend dropdown
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={data.settings.generalConfig?.enableHotelSelector ?? false}
                    onChange={(e) => handleToggleHotelSelector(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-neutral-100 mb-8">
                <div>
                  <h4 className="font-medium text-neutral-800">
                    Enable Mobile App Version
                  </h4>
                  <p className="text-sm text-neutral-500">
                    Show a mobile-optimized version for smartphones and tablets. When enabled, non-whitelisted devices will fallback to the mobile app view.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={data.settings.generalConfig?.enableMobileApp ?? false}
                    onChange={(e) => handleToggleMobileApp(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <h3 className="text-lg font-medium mb-4">Security & Access</h3>

              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <h4 className="font-medium text-neutral-800">
                    IP Whitelist Status
                  </h4>
                  <p className="text-sm text-neutral-500">
                    Block unauthorized frontend access
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={data.settings.ipWhitelistEnabled}
                    onChange={(e) => handleToggleWhitelist(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="mt-8">
                <h4 className="font-medium text-neutral-800 mb-2">
                  Whitelisted IPs
                </h4>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={whitelistIpInput}
                    onChange={(e) => setWhitelistIpInput(e.target.value)}
                    placeholder="e.g. 192.168.1.100"
                    className="flex-1 border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-blue-500"
                  />
                  <button
                    onClick={handleAddIp}
                    className="px-4 py-2 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800"
                  >
                    Add IP
                  </button>
                </div>
                <ul className="space-y-2">
                  {data.settings.whitelistedIps.map((ip: string) => (
                    <li
                      key={ip}
                      className="flex items-center justify-between bg-neutral-50 px-3 py-2 rounded text-sm font-mono text-neutral-700"
                    >
                      {ip}
                      <button
                        onClick={() => handleRemoveIp(ip)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                  {data.settings.whitelistedIps.length === 0 && (
                    <p className="text-sm text-neutral-500">
                      No IPs added yet.
                    </p>
                  )}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "templates" && data && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium">Design Templates</h3>
                  <p className="text-sm text-neutral-500">
                    Configure layout styles for modules.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newTemplates = [
                      ...(data?.templates || []),
                      {
                        id: `tmpl_${Date.now()}`,
                        name: "New Template",
                        displayType: "grid",
                      },
                    ];
                    fetch("/api/admin/templates", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ templates: newTemplates }),
                    }).then(fetchAdminData);
                  }}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded text-sm hover:bg-neutral-800 flex items-center gap-2"
                >
                  <Plus size={14} /> Add Template
                </button>
              </div>
              <div className="space-y-4">
                {(data?.templates || []).map((tmpl: any, idx: number) => (
                  <div
                    key={tmpl.id}
                    className="flex flex-col gap-2 p-4 border border-neutral-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                                                    <label className="block text-xs uppercase text-neutral-500 mb-1">
                          Template Name
                        </label>
                        <input
                          type="text"
                          value={tmpl.name}
                          onChange={(e) => {
                            const newTemplates = [...data.templates];
                            newTemplates[idx].name = e.target.value;
                            setData({ ...data, templates: newTemplates });
                          }}
                          className="w-full border-b border-neutral-300 focus:border-blue-500 focus:outline-none py-1 text-sm font-medium"
                        />
                      </div>
                      <div className="flex-1">
                                                    <label className="block text-xs uppercase text-neutral-500 mb-1">
                          Layout Type
                        </label>
                        <select
                          value={tmpl.displayType}
                          onChange={(e) => {
                            const newTemplates = [...data.templates];
                            newTemplates[idx].displayType = e.target.value;
                            setData({ ...data, templates: newTemplates });
                          }}
                          className="w-full border-b border-neutral-300 focus:border-blue-500 focus:outline-none py-1.5 text-sm bg-transparent"
                        >
                          <option value="grid">Grid Layout</option>
                          <option value="list">Detailed List</option>
                          <option value="hero">Hero Showcase</option>
                          <option value="suite">Single Suite Design</option>
                          <option value="map">Interactive Map</option>
                          <option value="directory">Directory of Services</option>
                          <option value="daily_program">Daily Program Layout</option>
                        </select>
                      </div>
                      <button
                        onClick={() => {
                          fetch("/api/admin/templates", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ templates: data.templates }),
                          }).then(() => {
                            fetchAdminData();
                            showToast("Template saved successfully!");
                          });
                        }}
                        className="mt-4 px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          const newTemplates = [...data.templates];
                          newTemplates.splice(idx, 1);
                          setData({ ...data, templates: newTemplates });
                          fetch("/api/admin/templates", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ templates: newTemplates }),
                          }).then(() => {
                            fetchAdminData();
                            showToast("Template deleted successfully!");
                          });
                        }}
                        className="mt-4 p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono">
                      Template ID: {tmpl.id}
                    </div>
                  </div>
                ))}
                {!(data.templates?.length > 0) && (
                  <p className="text-sm text-neutral-500 italic">
                    No templates defined.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "hotels" && data && !editingHotel && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-medium mb-4">
                Hotel Directory Management
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                Manage associated hotels. These changes will be sent to all
                active devices when "Push Edits" is clicked.
              </p>
              <ul className="space-y-3">
                {data.hotels.map((h: any) => (
                  <li
                    key={h.id}
                    className="flex items-center justify-between border border-neutral-100 p-3 rounded hover:bg-neutral-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{h.name}</div>
                      <div className="text-xs text-neutral-400">ID: {h.id}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-emerald-600 flex items-center gap-1 text-sm bg-emerald-50 px-2 py-1 rounded">
                        <CheckCircle size={14} /> Active
                      </div>
                      <button
                        onClick={() => setEditingHotel(h)}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium"
                      >
                        Manage Content
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "hotels" &&
            editingHotel &&
            !editingSubmodule &&
            editingMainModuleIdx === null && (
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium">
                      Editing: {editingHotel.name}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Modify frontend modules and quick actions.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={persistEditingHotel}
                      className="px-4 py-2 flex items-center gap-2 bg-[#0F172A] text-white rounded text-sm hover:bg-[#1e293b] font-medium"
                    >
                      <Save size={14} /> Save Changes
                    </button>
                    <button
                      onClick={() => {
                        fetchAdminData();
                        setActiveTab("hotels");
                        setEditingSubmodule(null);
                        setEditingMainModuleIdx(null);
                        setEditingHotel(null);
                      }}
                      className="px-4 py-2 border border-neutral-300 rounded text-sm hover:bg-neutral-50 font-medium"
                    >
                      Back to admin landing page
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="font-medium text-neutral-800 mb-4">
                      Location Settings (Weather)
                    </h4>
                    <div className="flex gap-4">
                      <div className="flex-1">
                                                    <label className="block text-xs uppercase text-neutral-500 mb-1">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={editingHotel.content?.location?.lat || 34.7667}
                          onChange={(e) => {
                            const loc = {
                              ...(editingHotel.content?.location || {}),
                              lat: parseFloat(e.target.value),
                            };
                            saveHotelContent(editingHotel.id, {
                              ...editingHotel.content,
                              location: loc,
                            });
                          }}
                          className="w-full border-b border-neutral-300 focus:border-blue-500 focus:outline-none mb-3 py-1 text-sm font-mono"
                        />
                      </div>
                      <div className="flex-1">
                                                    <label className="block text-xs uppercase text-neutral-500 mb-1">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={editingHotel.content?.location?.lng || 32.4167}
                          onChange={(e) => {
                            const loc = {
                              ...(editingHotel.content?.location || {}),
                              lng: parseFloat(e.target.value),
                            };
                            saveHotelContent(editingHotel.id, {
                              ...editingHotel.content,
                              location: loc,
                            });
                          }}
                          className="w-full border-b border-neutral-300 focus:border-blue-500 focus:outline-none mb-3 py-1 text-sm font-mono"
                        />
                      </div>
                    </div>
                  </div>

                                    <div>
                    <h4 className="font-medium text-neutral-800 mb-4">
                      Hero Texts (Front Page)
                    </h4>
                    <div className="space-y-4">
                      <HeroTextEditor
                        label="Title Top"
                        textKey="titleTop"
                        defaultText="Awarded"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Title Middle"
                        textKey="titleMiddle"
                        defaultText="WORLD CLASS"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Title Bottom"
                        textKey="titleBottom"
                        defaultText="HOSPITALITY"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Subtitle"
                        textKey="subtitle"
                        defaultText="Travel Weekly Globe Travel Awards 2025"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Award Category"
                        textKey="awardCategory"
                        defaultText="Best Hotel Chain"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Award Winner"
                        textKey="awardWinner"
                        defaultText="Constantinou Bros"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Award Div Box"
                        textKey="awardDiv"
                        defaultText=""
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-neutral-800">
                        Hero Banners
                      </h4>
                      <MultiImageUpload
                        targetDimensions={{ width: 1080, height: 608 }}
                        onUpload={(urls) => {
                          const newBanners = [
                            ...(editingHotel.content?.banners || []),
                            ...urls,
                          ].filter(Boolean);
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            banners: newBanners,
                          });
                        }}
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-xs uppercase text-neutral-500 mb-1">
                        Hero Image Fit Mode
                      </label>
                      <select
                        value={editingHotel.content?.bannerObjectFit || "cover"}
                        onChange={(e) => {
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            bannerObjectFit: e.target.value,
                          });
                        }}
                        className="w-full bg-[#FAFAFA] border border-neutral-200 rounded px-3 py-2 text-sm text-neutral-700 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                      >
                        <option value="cover">Cover (Fill & Crop)</option>
                        <option value="contain">Contain (Fit entirely without cropping)</option>
                        <option value="fill">Fill (Stretch to fit exact dimensions)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      {(editingHotel.content?.banners || []).map(
                        (banner: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="flex-1">
                              <ImageUpload
                                targetDimensions={{ width: 1080, height: 608 }}
                                value={banner}
                                label={`Banner ${idx + 1}`}
                                onChange={(url) => {
                                  const newBanners = [
                                    ...(editingHotel.content?.banners || []),
                                  ];
                                  newBanners[idx] = url;
                                  saveHotelContent(editingHotel.id, {
                                    ...editingHotel.content,
                                    banners: newBanners,
                                  });
                                }}
                              />
                            </div>
                            <button
                              onClick={() => {
                                const newBanners = [
                                  ...(editingHotel.content?.banners || []),
                                ];
                                newBanners.splice(idx, 1);
                                saveHotelContent(editingHotel.id, {
                                  ...editingHotel.content,
                                  banners: newBanners,
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1 mb-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ),
                      )}
                      {!(editingHotel.content?.banners?.length > 0) && (
                        <p className="text-sm text-neutral-500 italic">
                          No custom banners added. Default hero image will be
                          used.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-neutral-800 mb-4">
                      Quick Actions (Top Bar)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {editingHotel.content?.actions?.map(
                        (action: any, idx: number) => (
                          <div
                            key={action.id}
                            className="border border-neutral-200 rounded p-4"
                          >
                            <div className="flex gap-6 mb-3">
                              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={action.showOnMobile !== false} onChange={(e) => { const newActions = [...editingHotel.content.actions]; newActions[idx] = { ...newActions[idx], showOnMobile: e.target.checked }; saveHotelContent(editingHotel.id, { ...editingHotel.content, actions: newActions }); }} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs uppercase text-neutral-500 font-bold tracking-widest">Show on Mobile App</span></label>
                              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={action.showOnInfokiosk !== false} onChange={(e) => { const newActions = [...editingHotel.content.actions]; newActions[idx] = { ...newActions[idx], showOnInfokiosk: e.target.checked }; saveHotelContent(editingHotel.id, { ...editingHotel.content, actions: newActions }); }} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-xs uppercase text-neutral-500 font-bold tracking-widest">Show on Infokiosk</span></label>
                            </div>
                                                        <label className="block text-xs uppercase text-neutral-500 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={action.title}
                              onChange={(e) => {
                                const newActions = [
                                  ...editingHotel.content.actions,
                                ];
                                newActions[idx].title = e.target.value;
                                saveHotelContent(editingHotel.id, {
                                  ...editingHotel.content,
                                  actions: newActions,
                                });
                              }}
                              className="w-full border-b border-neutral-300 focus:border-blue-500 focus:outline-none mb-3 py-1 text-sm"
                            />
                                                        <label className="block text-xs uppercase text-neutral-500 mb-1">
                              Subtitle
                            </label>
                            <input
                              type="text"
                              value={action.subtitle}
                              onChange={(e) => {
                                const newActions = [
                                  ...editingHotel.content.actions,
                                ];
                                newActions[idx].subtitle = e.target.value;
                                saveHotelContent(editingHotel.id, {
                                  ...editingHotel.content,
                                  actions: newActions,
                                });
                              }}
                              className="w-full border-b border-neutral-300 focus:border-blue-500 focus:outline-none mb-3 py-1 text-sm"
                            />
                            
                            <label className="block text-xs uppercase text-neutral-500 mb-1">
                              URL Link (Optional)
                            </label>
                            <input
                              type="text"
                              value={action.url || ""}
                              placeholder="https://..."
                              onChange={(e) => {
                                const newActions = [
                                  ...editingHotel.content.actions,
                                ];
                                newActions[idx].url = e.target.value;
                                saveHotelContent(editingHotel.id, {
                                  ...editingHotel.content,
                                  actions: newActions,
                                });
                              }}
                              className="w-full border-b border-neutral-300 focus:border-blue-500 focus:outline-none py-1 text-sm"
                            />
                            
                            <label className="block text-xs uppercase text-neutral-500 mt-3 mb-1">
                              Link to Internal Module (Optional)
                            </label>
                            <select
                              value={action.moduleId || ""}
                              onChange={(e) => {
                                const newActions = [...editingHotel.content.actions];
                                newActions[idx].moduleId = e.target.value;
                                saveHotelContent(editingHotel.id, {
                                  ...editingHotel.content,
                                  actions: newActions,
                                });
                              }}
                              className="w-full border-b border-neutral-300 focus:border-blue-500 focus:outline-none py-1 text-sm bg-transparent"
                            >
                              <option value="">None (Use URL or default behavior)</option>
                              {editingHotel.content?.modules?.map((m: any) => (
                                <option key={m.id} value={m.id}>
                                  {m.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <h4 className="text-2xl font-bold text-[#1F2937] mb-1">
                          Core Services Overview
                        </h4>
                        <p className="text-sm text-neutral-500">
                          Select an item below to edit its properties and
                          content.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const newMod = {
                            id: `mod_${Date.now()}`,
                            title: "New Service",
                            subtitle: "System Module",
                            image: "",
                            icon: "Briefcase",
                            submodules: [],
                          };
                          const newModules = [
                            ...(editingHotel.content?.modules || []),
                            newMod,
                          ];
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                          setEditingMainModuleIdx(newModules.length - 1);
                        }}
                        className="px-5 py-2 hover:bg-[#A38148] transition-colors rounded text-sm text-white font-medium flex items-center gap-2 shadow-sm"
                        style={{ backgroundColor: "#B5925A" }}
                      >
                        <Plus size={16} /> CUSTOM SERVICE
                      </button>
                    </div>

                    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-200 bg-white">
                            <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 tracking-widest uppercase w-24">
                              Icon
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                              Service Name
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 tracking-widest uppercase w-32">
                              Status
                            </th>
                            <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 tracking-widest uppercase w-32 text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {editingHotel.content?.modules?.map(
                            (mod: any, idx: number) => (
                              <React.Fragment key={mod.id}>
                                <tr
                                  className="hover:bg-neutral-50 transition-colors group cursor-pointer"
                                  onClick={() =>
                                    setEditingMainModuleIdx(
                                      editingMainModuleIdx === idx ? null : idx,
                                    )
                                  }
                                >
                                  <td className="px-6 py-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                                      <DynamicIcon
                                        name={mod.icon || "Settings"}
                                        size={20}
                                        className="text-blue-800"
                                        strokeWidth={1.5}
                                      />
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="font-bold text-neutral-800 text-base">
                                      {mod.title}
                                    </div>
                                    <div className="text-sm text-neutral-400">
                                      {mod.subtitle || "System Module"}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-widest">
                                      Active
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-50 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newModules = [
                                          ...editingHotel.content.modules,
                                        ];
                                        newModules.splice(idx, 1);
                                        saveHotelContent(editingHotel.id, {
                                          ...editingHotel.content,
                                          modules: newModules,
                                        });
                                      }}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              </React.Fragment>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {activeTab === "hotels" &&
            editingHotel &&
            !editingSubmodule &&
            editingMainModuleIdx !== null && (
              <div className="bg-[#F8FAFC] flex flex-col h-full min-h-[600px] p-8 -m-6 rounded-b">
                <div className="max-w-4xl w-full mx-auto">
                  <div className="mb-6 border-b border-neutral-200 pb-4">
                    <h2 className="text-3xl font-bold text-[#1e293b] mb-2 tracking-tight">
                      Editing Service
                    </h2>
                    <p className="text-neutral-500 text-sm">
                      Make changes to your content below.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                    {(() => {
                      const mod =
                        editingHotel.content?.modules?.[editingMainModuleIdx];
                      if (!mod)
                        return (
                          <div className="p-12 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                        );
                      return (
                        <div className="p-8 flex flex-col gap-10">
                          {/* Module Header (Name & Image) */}
                          <div className="grid grid-cols-1 md:grid-cols-[1fr,300px] gap-8">
                            <div className="flex flex-col justify-center">
                              <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-3 text-left">
                                Module Title
                              </label>
                              <input
                                type="text"
                                value={mod.title}
                                onChange={(e) => {
                                  const newModules = [
                                    ...editingHotel.content.modules,
                                  ];
                                  newModules[editingMainModuleIdx].title =
                                    e.target.value;
                                  saveHotelContent(editingHotel.id, {
                                    ...editingHotel.content,
                                    modules: newModules,
                                  });
                                }}
                                className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-lg px-4 py-3 text-2xl font-bold text-[#1e293b] focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                              />

                              <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mt-6 mb-3 text-left">
                                Module Subtitle / Description
                              </label>
                              <input
                                type="text"
                                value={mod.subtitle || ""}
                                onChange={(e) => {
                                  const newModules = [
                                    ...editingHotel.content.modules,
                                  ];
                                  newModules[editingMainModuleIdx].subtitle =
                                    e.target.value;
                                  saveHotelContent(editingHotel.id, {
                                    ...editingHotel.content,
                                    modules: newModules,
                                  });
                                }}
                                className="w-full bg-[#FAFAFA] border border-neutral-200 rounded-lg px-4 py-3 text-sm text-[#1e293b] focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                              />

                              <div className="flex gap-6 mt-6 mb-3">
                                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={mod.showOnMobile !== false} onChange={(e) => { const newModules = [...editingHotel.content.modules]; newModules[editingMainModuleIdx] = { ...newModules[editingMainModuleIdx], showOnMobile: e.target.checked }; saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules }); }} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">Show on Mobile App</span></label>
                                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={mod.showOnInfokiosk !== false} onChange={(e) => { const newModules = [...editingHotel.content.modules]; newModules[editingMainModuleIdx] = { ...newModules[editingMainModuleIdx], showOnInfokiosk: e.target.checked }; saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules }); }} className="rounded text-blue-600 focus:ring-blue-500" /><span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">Show on Infokiosk</span></label>
                              </div>
                              <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mt-6 mb-3 text-left">
                                Layout Template
                              </label>
                              <TemplateSelector
                                value={mod.templateId || ""}
                                onChange={(newVal) => {
                                  const newModules = [
                                    ...editingHotel.content.modules,
                                  ];
                                  newModules[editingMainModuleIdx].templateId = newVal;
                                  saveHotelContent(editingHotel.id, {
                                    ...editingHotel.content,
                                    modules: newModules,
                                  });
                                }}
                                customTemplates={data?.templates || []}
                              />
                            </div>
                            <div className="bg-[#FAFAFA] border border-neutral-200 rounded-xl p-4 flex flex-col items-center justify-center">
                              <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-3 w-full text-center">
                                Module Cover Image
                              </label>
                              <div className="w-full aspect-[4/3] relative rounded-lg overflow-hidden border border-neutral-200 bg-white mb-3">
                                {mod.image ? (
                                  <img
                                    src={mod.image}
                                    className="w-full h-full object-cover"
                                    alt="Module Cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                    <ImageIcon size={32} />
                                  </div>
                                )}
                              </div>
                              <ImageUpload
                                value={mod.image || ""}
                                label="Upload Cover"
                                onChange={(url) => {
                                  const newModules = [
                                    ...editingHotel.content.modules,
                                  ];
                                  newModules[editingMainModuleIdx].image = url;
                                  saveHotelContent(editingHotel.id, {
                                    ...editingHotel.content,
                                    modules: newModules,
                                  });
                                }}
                              />
                            </div>
                          </div>

                          {/* Content Body */}
                          <div>
                            <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-3 text-left">
                              Content Body
                            </label>
                            <div className="bg-[#FAFAFA] border border-neutral-200 rounded-lg overflow-hidden min-h-[250px] flex flex-col focus-within:bg-white focus-within:border-blue-500 transition-colors">
                              <ReactQuill
                                theme="snow"
                                placeholder="Tap to edit body text..."
                                value={mod.content || ""}
                                onChange={(val) => {
                                  const newModules = [
                                    ...editingHotel.content.modules,
                                  ];
                                  newModules[editingMainModuleIdx].content =
                                    val;
                                  saveHotelContent(editingHotel.id, {
                                    ...editingHotel.content,
                                    modules: newModules,
                                  });
                                }}
                                className="flex-1 ql-no-border"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            {(mod.templateId === "awards" ||
                              mod.id === "m11") && (
                              <div>
                                <div className="flex items-center justify-between mb-3 border-t border-neutral-100 pt-6">
                                  <div>
                                    <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-1">
                                      Awards Portrait Banner (Only used in
                                      Awards Layout)
                                    </label>
                                    <p className="text-[10px] text-neutral-500">
                                      Most suitable dimensions: Portrait
                                      orientations around 800x1200px (4:5 or 2:3
                                      ratios work best).
                                    </p>
                                  </div>
                                  <div className="w-1/2">
                                    <div className="flex flex-col gap-1 w-full mb-3">
                                                                  <label className="block text-xs uppercase text-neutral-500 mb-1">
                                        <ImageIcon
                                          size={14}
                                          className="inline mr-1"
                                        />{" "}
                                        Upload Banner(s)
                                      </label>
                                      <div className="flex gap-2 items-center">
                                        <div className="text-xs text-neutral-500 italic flex-1">
                                          Select one or multiple images
                                        </div>
                                        <div className="relative">
                                          <MultiImageUpload
                                            label={<span>Upload File(s)</span>}
                                            onUpload={(urls) => {
                                              const newModules = [
                                                ...editingHotel.content.modules,
                                              ];
                                              const currentBanners =
                                                newModules[editingMainModuleIdx]
                                                  .awardsBanners || [];
                                              if (
                                                newModules[editingMainModuleIdx]
                                                  .awardsBanner &&
                                                currentBanners.length === 0
                                              ) {
                                                currentBanners.push(
                                                  newModules[
                                                    editingMainModuleIdx
                                                  ].awardsBanner,
                                                );
                                              }
                                              newModules[
                                                editingMainModuleIdx
                                              ].awardsBanners = [
                                                ...currentBanners,
                                                ...urls,
                                              ];
                                              newModules[
                                                editingMainModuleIdx
                                              ].awardsBanner = ""; // migrate to array
                                              saveHotelContent(
                                                editingHotel.id,
                                                {
                                                  ...editingHotel.content,
                                                  modules: newModules,
                                                },
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-2">
                                      {(mod.awardsBanners || []).length > 0
                                        ? mod.awardsBanners.map(
                                            (b: string, idx: number) => (
                                              <div
                                                key={idx}
                                                className="flex items-center gap-2"
                                              >
                                                <input
                                                  type="text"
                                                  value={b}
                                                  onChange={(e) => {
                                                    const newModules = [
                                                      ...editingHotel.content
                                                        .modules,
                                                    ];
                                                    const newBanners = [
                                                      ...newModules[
                                                        editingMainModuleIdx
                                                      ].awardsBanners,
                                                    ];
                                                    newBanners[idx] =
                                                      e.target.value;
                                                    newModules[
                                                      editingMainModuleIdx
                                                    ].awardsBanners =
                                                      newBanners;
                                                    saveHotelContent(
                                                      editingHotel.id,
                                                      {
                                                        ...editingHotel.content,
                                                        modules: newModules,
                                                      },
                                                    );
                                                  }}
                                                  className="flex-1 bg-transparent border-b border-neutral-300 focus:border-blue-500 focus:outline-none py-1 text-xs text-blue-600 font-mono"
                                                />
                                                <button
                                                  onClick={() => {
                                                    const newModules = [
                                                      ...editingHotel.content
                                                        .modules,
                                                    ];
                                                    const newBanners = [
                                                      ...newModules[
                                                        editingMainModuleIdx
                                                      ].awardsBanners,
                                                    ];
                                                    newBanners.splice(idx, 1);
                                                    newModules[
                                                      editingMainModuleIdx
                                                    ].awardsBanners =
                                                      newBanners;
                                                    saveHotelContent(
                                                      editingHotel.id,
                                                      {
                                                        ...editingHotel.content,
                                                        modules: newModules,
                                                      },
                                                    );
                                                  }}
                                                  className="p-1 text-red-500 hover:bg-neutral-100 rounded"
                                                  title="Remove URL"
                                                >
                                                  <Trash2 size={14} />
                                                </button>
                                              </div>
                                            ),
                                          )
                                        : mod.awardsBanner && (
                                            <div className="flex items-center gap-2">
                                              <input
                                                type="text"
                                                value={mod.awardsBanner}
                                                onChange={(e) => {
                                                  const newModules = [
                                                    ...editingHotel.content
                                                      .modules,
                                                  ];
                                                  newModules[
                                                    editingMainModuleIdx
                                                  ].awardsBanner =
                                                    e.target.value;
                                                  saveHotelContent(
                                                    editingHotel.id,
                                                    {
                                                      ...editingHotel.content,
                                                      modules: newModules,
                                                    },
                                                  );
                                                }}
                                                className="flex-1 bg-transparent border-b border-neutral-300 focus:border-blue-500 focus:outline-none py-1 text-xs text-blue-600 font-mono"
                                              />
                                              <button
                                                onClick={() => {
                                                  const newModules = [
                                                    ...editingHotel.content
                                                      .modules,
                                                  ];
                                                  newModules[
                                                    editingMainModuleIdx
                                                  ].awardsBanner = "";
                                                  saveHotelContent(
                                                    editingHotel.id,
                                                    {
                                                      ...editingHotel.content,
                                                      modules: newModules,
                                                    },
                                                  );
                                                }}
                                                className="p-1 text-red-500 hover:bg-neutral-100 rounded"
                                                title="Remove URL"
                                              >
                                                <Trash2 size={14} />
                                              </button>
                                            </div>
                                          )}
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-[#FAFAFA] border border-neutral-200 rounded-xl p-6 min-h-[160px] flex flex-col items-center justify-center">
                                  {!(mod.awardsBanners?.length > 0) &&
                                  !mod.awardsBanner ? (
                                    <p className="text-sm text-neutral-400 italic">
                                      No award banner added.
                                    </p>
                                  ) : (
                                    <div className="flex gap-4 flex-wrap justify-center">
                                      {mod.awardsBanners?.length > 0 ? (
                                        mod.awardsBanners.map(
                                          (banner: string, idx: number) => (
                                            <div
                                              key={idx}
                                              className="relative group rounded-lg overflow-hidden border border-neutral-200 w-[120px] h-[180px] bg-white flex items-center justify-center"
                                            >
                                              <img
                                                src={banner}
                                                className="w-full h-full object-cover"
                                                alt={`Award Banner ${idx + 1}`}
                                              />
                                              <button
                                                onClick={() => {
                                                  const newModules = [
                                                    ...editingHotel.content
                                                      .modules,
                                                  ];
                                                  const newBanners = [
                                                    ...newModules[
                                                      editingMainModuleIdx
                                                    ].awardsBanners,
                                                  ];
                                                  newBanners.splice(idx, 1);
                                                  newModules[
                                                    editingMainModuleIdx
                                                  ].awardsBanners = newBanners;
                                                  saveHotelContent(
                                                    editingHotel.id,
                                                    {
                                                      ...editingHotel.content,
                                                      modules: newModules,
                                                    },
                                                  );
                                                }}
                                                className="absolute top-1 right-1 p-1 text-white bg-red-500 rounded hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                              >
                                                <Trash2 size={12} />
                                              </button>
                                            </div>
                                          ),
                                        )
                                      ) : (
                                        <div className="relative group rounded-lg overflow-hidden border border-neutral-200 w-[120px] h-[180px] bg-white flex items-center justify-center">
                                          <img
                                            src={mod.awardsBanner}
                                            className="w-full h-full object-cover"
                                            alt="Award Banner"
                                          />
                                          <button
                                            onClick={() => {
                                              const newModules = [
                                                ...editingHotel.content.modules,
                                              ];
                                              newModules[
                                                editingMainModuleIdx
                                              ].awardsBanner = "";
                                              saveHotelContent(
                                                editingHotel.id,
                                                {
                                                  ...editingHotel.content,
                                                  modules: newModules,
                                                },
                                              );
                                            }}
                                            className="absolute top-1 right-1 p-1 text-white bg-red-500 rounded hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-4 mt-6">
                                  <div className="flex-1">
                                                                <label className="block text-xs uppercase text-neutral-500 mb-1">
                                      Top Gallery Timer (sec)
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={mod.awardsGalleryTimer || "5"}
                                      onChange={(e) => {
                                        const newModules = [
                                          ...editingHotel.content.modules,
                                        ];
                                        newModules[
                                          editingMainModuleIdx
                                        ].awardsGalleryTimer = e.target.value;
                                        saveHotelContent(editingHotel.id, {
                                          ...editingHotel.content,
                                          modules: newModules,
                                        });
                                      }}
                                      className="w-full bg-white border border-neutral-200 text-sm rounded px-3 py-2 text-neutral-800 focus:outline-none focus:border-blue-500"
                                    />
                                    <p className="text-[10px] text-neutral-400 mt-1">
                                      Default 5 seconds
                                    </p>
                                  </div>
                                  <div className="flex-1">
                                                                <label className="block text-xs uppercase text-neutral-500 mb-1">
                                      Banner Slideshow Timer (sec)
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={mod.awardsBannersTimer || "4"}
                                      onChange={(e) => {
                                        const newModules = [
                                          ...editingHotel.content.modules,
                                        ];
                                        newModules[
                                          editingMainModuleIdx
                                        ].awardsBannersTimer = e.target.value;
                                        saveHotelContent(editingHotel.id, {
                                          ...editingHotel.content,
                                          modules: newModules,
                                        });
                                      }}
                                      className="w-full bg-white border border-neutral-200 text-sm rounded px-3 py-2 text-neutral-800 focus:outline-none focus:border-blue-500"
                                    />
                                    <p className="text-[10px] text-neutral-400 mt-1">
                                      Default 4 seconds
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-0">
                                  Action Buttons
                                </label>
                                <button
                                  onClick={() => {
                                    const newModules = [
                                      ...editingHotel.content.modules,
                                    ];
                                    newModules[editingMainModuleIdx].button = {
                                      label: "New Button",
                                      url: "",
                                    };
                                    saveHotelContent(editingHotel.id, {
                                      ...editingHotel.content,
                                      modules: newModules,
                                    });
                                  }}
                                  className="flex items-center gap-1.5 text-[#0F172A] text-xs font-bold bg-[#F1F5F9] px-3 py-1.5 rounded-full hover:bg-[#E2E8F0] transition-colors"
                                >
                                  <Plus size={14} /> Add Button
                                </button>
                              </div>
                              <div className="bg-[#FAFAFA] border border-neutral-200 rounded-xl p-6 min-h-[160px] flex flex-col items-center justify-center">
                                {!mod.button?.label ? (
                                  <p className="text-sm text-neutral-400 italic">
                                    No buttons added.
                                  </p>
                                ) : (
                                  <div className="w-full flex-1 flex flex-col gap-3">
                                    <div>
                                      <label className="block text-xs text-neutral-500 mb-1">
                                        Button Label
                                      </label>
                                      <input
                                        type="text"
                                        value={mod.button.label}
                                        onChange={(e) => {
                                          const newModules = [
                                            ...editingHotel.content.modules,
                                          ];
                                          newModules[
                                            editingMainModuleIdx
                                          ].button.label = e.target.value;
                                          saveHotelContent(editingHotel.id, {
                                            ...editingHotel.content,
                                            modules: newModules,
                                          });
                                        }}
                                        className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-neutral-500 mb-1">
                                        URL
                                      </label>
                                      <input
                                        type="text"
                                        value={mod.button.url}
                                        onChange={(e) => {
                                          const newModules = [
                                            ...editingHotel.content.modules,
                                          ];
                                          newModules[
                                            editingMainModuleIdx
                                          ].button.url = e.target.value;
                                          saveHotelContent(editingHotel.id, {
                                            ...editingHotel.content,
                                            modules: newModules,
                                          });
                                        }}
                                        className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none font-mono text-blue-600 bg-white"
                                      />
                                    </div>
                                    <div className="flex justify-end mt-2">
                                      <button
                                        onClick={() => {
                                          const newModules = [
                                            ...editingHotel.content.modules,
                                          ];
                                          newModules[
                                            editingMainModuleIdx
                                          ].button = null;
                                          saveHotelContent(editingHotel.id, {
                                            ...editingHotel.content,
                                            modules: newModules,
                                          });
                                        }}
                                        className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-medium"
                                      >
                                        <Trash2 size={12} /> Remove Button
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Submodules List */}
                          {(mod.templateId === "loyalty" || mod.id === "m9" || mod.title?.toLowerCase().includes("loyalty")) && (
                            <LoyaltyEditor 
                              module={mod} 
                              editingHotel={editingHotel} 
                              editingMainModuleIdx={editingMainModuleIdx} 
                              saveHotelContent={saveHotelContent} 
                            />
                          )}

                          {(mod.templateId === "spa" || mod.title?.toLowerCase().includes("spa")) && (
                            <SpaEditor 
                              module={mod} 
                              editingHotel={editingHotel} 
                              editingMainModuleIdx={editingMainModuleIdx} 
                              saveHotelContent={saveHotelContent} 
                              ImageUpload={ImageUpload}
                            />
                          )}

                          {(mod.templateId === "weddings" || mod.title?.toLowerCase().includes("wedding")) && (
                            <WeddingsEditor 
                              module={mod} 
                              editingHotel={editingHotel} 
                              editingMainModuleIdx={editingMainModuleIdx} 
                              saveHotelContent={saveHotelContent} 
                              ImageUpload={ImageUpload}
                            />
                          )}

                          {(mod.templateId === "general_info" || mod.title?.toLowerCase().includes("general info") || mod.id === "m14") && (
                            <GeneralInfoEditor 
                              module={mod} 
                              editingHotel={editingHotel} 
                              editingMainModuleIdx={editingMainModuleIdx} 
                              saveHotelContent={saveHotelContent} 
                              ImageUpload={ImageUpload} 
                            />
                          )}

                          {(mod.templateId === "directory" || (mod.templateId && data.templates?.find((t: any) => t.id === mod.templateId)?.displayType === "directory") || mod.title?.toLowerCase().includes("directory")) && (
                            <DirectoryOfServicesEditor 
                              module={mod} 
                              editingHotel={editingHotel} 
                              editingMainModuleIdx={editingMainModuleIdx} 
                              saveHotelContent={saveHotelContent} 
                              ImageUpload={ImageUpload} 
                            />
                          )}

                          {(mod.templateId === "daily_program" || (mod.templateId && data.templates?.find((t: any) => t.id === mod.templateId)?.displayType === "daily_program") || mod.title?.toLowerCase().includes("daily program")) ? (
                            <DailyProgramEditor
                              editingHotel={editingHotel}
                              saveHotelContent={saveHotelContent}
                              ImageUpload={ImageUpload}
                            />
                          ) : (mod.templateId === "map" || mod.title?.toLowerCase().includes("map")) ? (
                            <div className="pt-8 border-t border-neutral-100">
                              <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-4 text-left">
                                Interactive Map Builder
                              </label>
                              <div className="mb-6">
                                <ImageUpload
                                  label="Custom Map Image (Overrides Cover Image)"
                                  value={mod.mapImage}
                                  onChange={(val) => {
                                    const newModules = [...editingHotel.content.modules];
                                    newModules[editingMainModuleIdx].mapImage = val;
                                    saveHotelContent(editingHotel.id, {
                                      ...editingHotel.content,
                                      modules: newModules
                                    });
                                  }}
                                />
                              </div>
                              {(mod.mapImage || mod.image) ? (
                                <div className="relative w-full aspect-[16/9] bg-neutral-200 rounded-lg overflow-hidden border border-neutral-300 cursor-crosshair shadow-sm mb-6"
                                     onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                        
                                        const newSub = {
                                          id: `loc_${Date.now()}`,
                                          title: "New Location",
                                          mapX: parseFloat(x.toFixed(2)),
                                          mapY: parseFloat(y.toFixed(2)),
                                          content: "",
                                          gallery: []
                                        };
                                        
                                        const newModules = [...editingHotel.content.modules];
                                        newModules[editingMainModuleIdx].submodules = newModules[editingMainModuleIdx].submodules || [];
                                        newModules[editingMainModuleIdx] = { ...newModules[editingMainModuleIdx], submodules: [...(newModules[editingMainModuleIdx].submodules || []), newSub] };
                                        saveHotelContent(editingHotel.id, {
                                          ...editingHotel.content,
                                          modules: newModules
                                        });
                                     }}>
                                   <img src={mod.mapImage || mod.image} className="w-full h-full object-cover pointer-events-none" alt="Map Reference" />
                                   {(mod.submodules || []).map((sub: any, idx: number) => (
                                      <div key={sub.id} className="absolute w-6 h-6 -ml-3 -mt-3 bg-[#102442] text-white flex items-center justify-center rounded-full border-2 border-[#C39B57] shadow-lg pointer-events-none font-bold text-[10px]" style={{ left: `${sub.mapX || 0}%`, top: `${sub.mapY || 0}%` }}>
                                         {idx + 1}
                                      </div>
                                   ))}
                                   <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur pointer-events-none shadow-lg">Click on map to add location</div>
                                </div>
                              ) : (
                                <div className="bg-[#FAFAFA] border border-neutral-200 rounded-xl p-6 text-center mb-6">
                                  <p className="text-sm text-neutral-500 italic">Please upload a Custom Map Image (or a Module Cover Image) above to use the Interactive Map Builder.</p>
                                </div>
                              )}
                              
                              <div className="bg-[#FAFAFA] border border-neutral-200 rounded-xl overflow-hidden p-6">
                                 {!mod.submodules || mod.submodules.length === 0 ? (
                                   <div className="text-center py-4">
                                     <p className="text-sm text-neutral-400 italic">No locations added yet. Click on the map to add one.</p>
                                   </div>
                                 ) : (
                                   <div className="flex flex-col gap-2">
                                      {mod.submodules.map((sub: any, subIdx: number) => (
                                        <div key={sub.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
                                           <div className="w-8 h-8 rounded-full bg-[#102442] text-white flex items-center justify-center border-2 border-[#C39B57] shrink-0 text-xs font-bold">
                                              {subIdx + 1}
                                           </div>
                                           <input 
                                             type="text"
                                             value={sub.title || ""}
                                             onChange={(e) => {
                                                const newModules = [...editingHotel.content.modules];
                                                newModules[editingMainModuleIdx].submodules[subIdx].title = e.target.value;
                                                saveHotelContent(editingHotel.id, {
                                                  ...editingHotel.content,
                                                  modules: newModules
                                                });
                                             }}
                                             className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 focus:outline-none placeholder-neutral-400 px-2 min-w-0"
                                             placeholder="Location Name"
                                           />
                                           <div className="w-[1px] h-4 bg-neutral-200 shrink-0"></div>
                                           <input 
                                             type="text"
                                             value={sub.category || ""}
                                             onChange={(e) => {
                                                const newModules = [...editingHotel.content.modules];
                                                newModules[editingMainModuleIdx].submodules[subIdx].category = e.target.value;
                                                saveHotelContent(editingHotel.id, {
                                                  ...editingHotel.content,
                                                  modules: newModules
                                                });
                                             }}
                                             className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 focus:outline-none placeholder-neutral-400 px-2 min-w-0 text-neutral-500"
                                             placeholder="Category (e.g. Restaurants)"
                                           />
                                           <button
                                              onClick={() => setEditingSubmodule({ modIdx: editingMainModuleIdx, subIdx, sub })}
                                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                              title="Configure Details"
                                           >
                                              <Settings size={16} />
                                           </button>
                                           <button
                                              onClick={() => {
                                                  const newModules = [...editingHotel.content.modules];
                                                  newModules[editingMainModuleIdx].submodules.splice(subIdx, 1);
                                                  saveHotelContent(editingHotel.id, {
                                                    ...editingHotel.content,
                                                    modules: newModules,
                                                  });
                                              }}
                                              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                              title="Remove Location"
                                           >
                                              <Trash2 size={16} />
                                           </button>
                                        </div>
                                      ))}
                                   </div>
                                 )}
                              </div>
                            </div>
                          ) : (
                          <div className="pt-8 border-t border-neutral-100">
                            <div className="flex items-center justify-between mb-4">
                              <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-0">
                                Attached Submodules / Items
                              </label>
                              <button
                                onClick={() => {
                                  const newSub = {
                                    id: `sub_${Date.now()}`,
                                    title: "New Item",
                                    subtitle: "",
                                    image: "",
                                    content: "",
                                    gallery: [],
                                    button: { label: "", url: "" },
                                  };
                                  const newModules = [
                                    ...editingHotel.content.modules,
                                  ];
                                  newModules[editingMainModuleIdx].submodules =
                                    newModules[editingMainModuleIdx]
                                      .submodules || [];
                                  newModules[
                                    editingMainModuleIdx
                                  ] = { ...newModules[editingMainModuleIdx], submodules: [...(newModules[editingMainModuleIdx].submodules || []), newSub] };
                                  saveHotelContent(editingHotel.id, {
                                    ...editingHotel.content,
                                    modules: newModules,
                                  });
                                  setEditingSubmodule({
                                    modIdx: editingMainModuleIdx,
                                    subIdx:
                                      newModules[editingMainModuleIdx]
                                        .submodules.length - 1,
                                    sub: newSub,
                                  });
                                }}
                                className="flex items-center gap-1.5 text-[#0F172A] text-xs font-bold bg-[#F1F5F9] px-3 py-1.5 rounded-full hover:bg-[#E2E8F0] transition-colors"
                              >
                                <Plus size={14} /> Add Submodule
                              </button>
                            </div>
                            <div className="bg-[#FAFAFA] border border-neutral-200 rounded-xl overflow-hidden p-6">
                              {!mod.submodules ||
                              mod.submodules.length === 0 ? (
                                <div className="text-center py-8">
                                  <p className="text-sm text-neutral-400 italic">
                                    No submodules attached.
                                  </p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                  {mod.submodules.map(
                                    (sub: any, subIdx: number) => (
                                      <div
                                        key={sub.id}
                                        className="group relative bg-white border border-neutral-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors shadow-sm cursor-pointer"
                                        onClick={() =>
                                          setEditingSubmodule({
                                            modIdx: editingMainModuleIdx,
                                            subIdx,
                                            sub,
                                          })
                                        }
                                      >
                                        <div className="aspect-[4/3] bg-neutral-100 relative">
                                          {sub.image ? (
                                            <img
                                              src={sub.image}
                                              className="w-full h-full object-cover"
                                              alt=""
                                            />
                                          ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-300">
                                              <ImageIcon size={24} />
                                            </div>
                                          )}
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                              className="p-2 bg-white rounded-full text-blue-600 hover:scale-110 transition-transform"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingSubmodule({
                                                  modIdx: editingMainModuleIdx,
                                                  subIdx,
                                                  sub,
                                                });
                                              }}
                                            >
                                              <Settings size={16} />
                                            </button>
                                            <button
                                              className="p-2 bg-white rounded-full text-green-600 hover:scale-110 transition-transform"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const duplicatedSub = {
                                                  ...sub,
                                                  id: `sub_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                                                  title: `${sub.title || "Untitled"} (Copy)`,
                                                };
                                                const newModules = [
                                                  ...editingHotel.content
                                                    .modules,
                                                ];
                                                newModules[
                                                  editingMainModuleIdx
                                                ].submodules.splice(
                                                  subIdx + 1,
                                                  0,
                                                  duplicatedSub,
                                                );
                                                saveHotelContent(
                                                  editingHotel.id,
                                                  {
                                                    ...editingHotel.content,
                                                    modules: newModules,
                                                  },
                                                );
                                              }}
                                            >
                                              <Copy size={16} />
                                            </button>
                                            <button
                                              className="p-2 bg-white rounded-full text-red-600 hover:scale-110 transition-transform"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const newModules = [
                                                  ...editingHotel.content
                                                    .modules,
                                                ];
                                                newModules[
                                                  editingMainModuleIdx
                                                ].submodules.splice(subIdx, 1);
                                                saveHotelContent(
                                                  editingHotel.id,
                                                  {
                                                    ...editingHotel.content,
                                                    modules: newModules,
                                                  },
                                                );
                                              }}
                                            >
                                              <Trash2 size={16} />
                                            </button>
                                          </div>
                                        </div>
                                        <div className="p-4 border-t border-neutral-100">
                                          <h5 className="font-bold text-sm text-[#1e293b] truncate mb-0.5">
                                            {sub.title || "Untitled Item"}
                                          </h5>
                                          <p className="text-xs text-neutral-500 truncate">
                                            {sub.subtitle || "No subtitle"}
                                          </p>
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          )}

                          {/* Footer Actions */}
                          <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-neutral-100">
                            <button
                              onClick={() => {
                                fetchAdminData();
                                setEditingMainModuleIdx(null);
                              }}
                              className="px-6 py-2.5 bg-[#F1F5F9] text-[#0F172A] font-bold text-sm rounded-lg hover:bg-[#E2E8F0] transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                setEditingMainModuleIdx(null);
                                persistEditingHotel();
                              }}
                              className="px-6 py-2.5 bg-[#0F172A] text-white font-bold text-sm rounded-lg hover:bg-[#1e293b] transition-colors shadow-sm"
                            >
                              Save Module
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

          {activeTab === "hotels" && editingHotel && editingSubmodule && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 flex flex-col h-full min-h-[600px]">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setEditingSubmodule(null)}
                    className="p-2 border border-neutral-200 rounded text-neutral-600 hover:bg-neutral-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div>
                    <h3 className="text-lg font-medium">
                      Edit Item: {editingSubmodule.sub.title || "Untitled"}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Add detailed rich content and images.
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setEditingSubmodule(null);
                      persistEditingHotel();
                    }}
                    className="px-4 py-2 bg-[#0F172A] text-white rounded font-medium text-sm hover:bg-[#1e293b] shadow-sm flex items-center gap-2"
                  >
                    <Save size={14} /> Save Item
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-6 max-h-[800px] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-neutral-500 mb-1 font-semibold">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingSubmodule.sub.title}
                      onChange={(e) => {
                        const sub = {
                          ...editingSubmodule.sub,
                          title: e.target.value,
                        };
                        setEditingSubmodule({ ...editingSubmodule, sub });
                        const newModules = [...editingHotel.content.modules];
                        newModules[editingSubmodule.modIdx].submodules[
                          editingSubmodule.subIdx
                        ] = sub;
                        saveHotelContent(editingHotel.id, {
                          ...editingHotel.content,
                          modules: newModules,
                        });
                      }}
                      className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-neutral-500 mb-1 font-semibold">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingSubmodule.sub.category || ""}
                      onChange={(e) => {
                        const sub = {
                          ...editingSubmodule.sub,
                          category: e.target.value,
                        };
                        setEditingSubmodule({ ...editingSubmodule, sub });
                        const newModules = [...editingHotel.content.modules];
                        newModules[editingSubmodule.modIdx].submodules[
                          editingSubmodule.subIdx
                        ] = sub;
                        saveHotelContent(editingHotel.id, {
                          ...editingHotel.content,
                          modules: newModules,
                        });
                      }}
                      className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm"
                      placeholder="e.g. Restaurants"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-neutral-500 mb-1 font-semibold">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={editingSubmodule.sub.subtitle || ""}
                      onChange={(e) => {
                        const sub = {
                          ...editingSubmodule.sub,
                          subtitle: e.target.value,
                        };
                        setEditingSubmodule({ ...editingSubmodule, sub });
                        const newModules = [...editingHotel.content.modules];
                        newModules[editingSubmodule.modIdx].submodules[
                          editingSubmodule.subIdx
                        ] = sub;
                        saveHotelContent(editingHotel.id, {
                          ...editingHotel.content,
                          modules: newModules,
                        });
                      }}
                      className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-neutral-500 mb-1 font-semibold">
                      Layout Template
                    </label>
                    <select
                      value={editingSubmodule.sub.layout || ""}
                      onChange={(e) => {
                        const newLayout = e.target.value;
                        let sub = {
                          ...editingSubmodule.sub,
                          layout: newLayout,
                        };
                        if (newLayout === "restaurant" && !sub.menus) {
                          sub = {
                            ...sub,
                            hours: sub.hours || "6:30 PM - 11:00 PM",
                            dressCode: sub.dressCode || "Smart Casual",
                            reservations:
                              sub.reservations || "Required for dinner.",
                            information:
                              sub.information ||
                              "Kindly be informed that for reservations of 5 people or more, please see the hotel's maître d'hôtel to assist you.",
                            menus: sub.menus || [
                              {
                                title: "À LA CARTE MENU",
                                icon: "UtensilsCrossed",
                                image:
                                  "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
                              },
                              {
                                title: "DESSERTS & DRINKS MENU",
                                icon: "Cake",
                                image:
                                  "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop",
                              },
                              {
                                title: "WINE LIST",
                                icon: "Wine",
                                image:
                                  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop",
                              },
                            ],
                          };
                        }
                        setEditingSubmodule({ ...editingSubmodule, sub });
                        const newModules = [...editingHotel.content.modules];
                        newModules[editingSubmodule.modIdx].submodules[
                          editingSubmodule.subIdx
                        ] = sub;
                        saveHotelContent(editingHotel.id, {
                          ...editingHotel.content,
                          modules: newModules,
                        });
                      }}
                      className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm bg-white"
                    >
                      <option value="">Default (Inherit from parent)</option>
                      <option value="suite">Suite Design</option>
                      <option value="restaurant">Single Restaurant</option>
                      <option value="golfDetails">Golf Details Template</option>
                    </select>
                  </div>
                </div>

                
                {/* Golf Details Settings */}
                {editingSubmodule.sub.layout === 'golfDetails' && (
                  <div className="border border-neutral-200 rounded-xl p-4 bg-green-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-xs uppercase text-green-800 font-bold mb-0">
                        Golf Course Statistics
                      </label>
                      <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded font-medium">
                        Used for Golf Details layout
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">Holes</label>
                        <input
                          type="text"
                          placeholder="e.g. 18"
                          value={editingSubmodule.sub.holes || ""}
                          onChange={(e) => {
                            const sub = { ...editingSubmodule.sub, holes: e.target.value };
                            setEditingSubmodule({ ...editingSubmodule, sub });
                            const newModules = [...editingHotel.content.modules];
                            newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                            saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                          }}
                          className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">Par</label>
                        <input
                          type="text"
                          placeholder="e.g. 72"
                          value={editingSubmodule.sub.par || ""}
                          onChange={(e) => {
                            const sub = { ...editingSubmodule.sub, par: e.target.value };
                            setEditingSubmodule({ ...editingSubmodule, sub });
                            const newModules = [...editingHotel.content.modules];
                            newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                            saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                          }}
                          className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">Length</label>
                        <input
                          type="text"
                          placeholder="e.g. 5902 m"
                          value={editingSubmodule.sub.length || ""}
                          onChange={(e) => {
                            const sub = { ...editingSubmodule.sub, length: e.target.value };
                            setEditingSubmodule({ ...editingSubmodule, sub });
                            const newModules = [...editingHotel.content.modules];
                            newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                            saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                          }}
                          className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">Distance From Hotel</label>
                        <input
                          type="text"
                          placeholder="e.g. Approx. 18 km"
                          value={editingSubmodule.sub.distance || ""}
                          onChange={(e) => {
                            const sub = { ...editingSubmodule.sub, distance: e.target.value };
                            setEditingSubmodule({ ...editingSubmodule, sub });
                            const newModules = [...editingHotel.content.modules];
                            newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                            saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                          }}
                          className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">Men Handicap</label>
                        <input
                          type="text"
                          placeholder="e.g. 36"
                          value={editingSubmodule.sub.menHandicap || ""}
                          onChange={(e) => {
                            const sub = { ...editingSubmodule.sub, menHandicap: e.target.value };
                            setEditingSubmodule({ ...editingSubmodule, sub });
                            const newModules = [...editingHotel.content.modules];
                            newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                            saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                          }}
                          className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">Women Handicap</label>
                        <input
                          type="text"
                          placeholder="e.g. 36"
                          value={editingSubmodule.sub.womenHandicap || ""}
                          onChange={(e) => {
                            const sub = { ...editingSubmodule.sub, womenHandicap: e.target.value };
                            setEditingSubmodule({ ...editingSubmodule, sub });
                            const newModules = [...editingHotel.content.modules];
                            newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                            saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                          }}
                          className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">Good to Know (one item per line)</label>
                      <textarea
                        rows={3}
                        placeholder="Tee times can be arranged upon request.
Transportation available."
                        value={editingSubmodule.sub.goodToKnow || ""}
                        onChange={(e) => {
                          const sub = { ...editingSubmodule.sub, goodToKnow: e.target.value };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                          saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                        }}
                        className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Suites Grid Setup */}
                {editingSubmodule.sub.layout !== 'restaurant' && editingSubmodule.sub.layout !== 'golfDetails' && (
                <div className="border border-neutral-200 rounded-xl p-4 bg-orange-50/50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs uppercase text-orange-800 font-bold mb-0">
                      Rooms & Suites Grid Settings
                    </label>
                    <span className="text-[10px] text-orange-600 bg-orange-100 px-2 py-0.5 rounded font-medium">
                      Used for Rooms & Suites layout
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Room Class
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Elite Class"
                        value={editingSubmodule.sub.roomClass || ""}
                        onChange={(e) => {
                          const sub = {
                            ...editingSubmodule.sub,
                            roomClass: e.target.value,
                          };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[
                            editingSubmodule.subIdx
                          ] = sub;
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Categories (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Elite Class, Family"
                        value={(editingSubmodule.sub.categories || []).join(
                          ", ",
                        )}
                        onChange={(e) => {
                          const sub = {
                            ...editingSubmodule.sub,
                            categories: e.target.value
                              .split(",")
                              .map((c) => c.trim())
                              .filter(Boolean),
                          };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[
                            editingSubmodule.subIdx
                          ] = sub;
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Guests
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2 Guests"
                        value={editingSubmodule.sub.guests || ""}
                        onChange={(e) => {
                          const sub = {
                            ...editingSubmodule.sub,
                            guests: e.target.value,
                          };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[
                            editingSubmodule.subIdx
                          ] = sub;
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Size
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 32 m²"
                        value={editingSubmodule.sub.size || ""}
                        onChange={(e) => {
                          const sub = {
                            ...editingSubmodule.sub,
                            size: e.target.value,
                          };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[
                            editingSubmodule.subIdx
                          ] = sub;
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        View
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sea View"
                        value={editingSubmodule.sub.view || ""}
                        onChange={(e) => {
                          const sub = {
                            ...editingSubmodule.sub,
                            view: e.target.value,
                          };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[
                            editingSubmodule.subIdx
                          ] = sub;
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
                )}

                {/* Restaurant Settings */}
                {editingSubmodule.sub.layout === 'restaurant' && (
                <div className="border border-neutral-200 rounded-xl p-4 bg-blue-50/50 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs uppercase text-blue-800 font-bold mb-0">
                      Restaurant Settings
                    </label>
                    <span className="text-[10px] text-blue-600 bg-blue-100 px-2 py-0.5 rounded font-medium">
                      Used for Restaurant layout
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Category
                      </label>
                      <select
                        value={(editingSubmodule.sub.categories && editingSubmodule.sub.categories[0]) || "Restaurants"}
                        onChange={(e) => {
                          const sub = {
                            ...editingSubmodule.sub,
                            categories: [e.target.value],
                          };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[
                            editingSubmodule.subIdx
                          ] = sub;
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm bg-white"
                      >
                        <option value="Restaurants">Restaurants</option>
                        <option value="Bars">Bars</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Hours
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 6:30 PM - 11:00 PM"
                        value={editingSubmodule.sub.hours || ""}
                        onChange={(e) => {
                          const sub = {
                            ...editingSubmodule.sub,
                            hours: e.target.value,
                          };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[
                            editingSubmodule.subIdx
                          ] = sub;
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Dress Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Smart Casual"
                        value={editingSubmodule.sub.dressCode || ""}
                        onChange={(e) => {
                          const sub = {
                            ...editingSubmodule.sub,
                            dressCode: e.target.value,
                          };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[
                            editingSubmodule.subIdx
                          ] = sub;
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Reservations Info
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Required for dinner"
                        value={editingSubmodule.sub.reservations || ""}
                        onChange={(e) => {
                          const sub = {
                            ...editingSubmodule.sub,
                            reservations: e.target.value,
                          };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[
                            editingSubmodule.subIdx
                          ] = sub;
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">
                        Important Information
                      </label>
                      <textarea
                        placeholder="e.g. Kindly be informed that..."
                        value={editingSubmodule.sub.information || ""}
                        onChange={(e) => {
                          const sub = {
                            ...editingSubmodule.sub,
                            information: e.target.value,
                          };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[
                            editingSubmodule.subIdx
                          ] = sub;
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                        }}
                        className="w-full border border-neutral-300 rounded p-2 focus:border-blue-500 focus:outline-none text-sm min-h-[60px]"
                      />
                    </div>
                  </div>

                  {/* Menus Settings */}
                  <div className="mt-6 border-t border-blue-200 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-[10px] uppercase text-blue-800 font-bold">
                        Menus
                      </label>
                      <button
                        onClick={() => {
                          const menus = [
                            ...(editingSubmodule.sub.menus || []),
                            { title: "New Menu", icon: "Utensils", image: "" },
                          ];
                          const sub = { ...editingSubmodule.sub, menus };
                          setEditingSubmodule({ ...editingSubmodule, sub });
                          const newModules = [...editingHotel.content.modules];
                          newModules[editingSubmodule.modIdx].submodules[
                            editingSubmodule.subIdx
                          ] = sub;
                          saveHotelContent(editingHotel.id, {
                            ...editingHotel.content,
                            modules: newModules,
                          });
                        }}
                        className="text-[10px] bg-white text-blue-600 px-2 py-1 rounded hover:bg-blue-50 font-bold border border-blue-200"
                      >
                        + Add Menu
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {(editingSubmodule.sub.menus || []).map((menu: any, menuIdx: number) => (
                        <div key={menuIdx} className="border border-blue-100 rounded-lg p-3 bg-white">
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={menu.title}
                              placeholder="Menu Title"
                              onChange={(e) => {
                                const menus = [...editingSubmodule.sub.menus];
                                menus[menuIdx].title = e.target.value;
                                const sub = { ...editingSubmodule.sub, menus };
                                setEditingSubmodule({ ...editingSubmodule, sub });
                                const newModules = [...editingHotel.content.modules];
                                newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                                saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                              }}
                              className="flex-1 border border-neutral-300 rounded p-1.5 text-xs focus:border-blue-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={menu.icon || 'FileText'}
                              placeholder="Icon"
                              onChange={(e) => {
                                const menus = [...editingSubmodule.sub.menus];
                                menus[menuIdx].icon = e.target.value;
                                const sub = { ...editingSubmodule.sub, menus };
                                setEditingSubmodule({ ...editingSubmodule, sub });
                                const newModules = [...editingHotel.content.modules];
                                newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                                saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                              }}
                              className="w-24 border border-neutral-300 rounded p-1.5 text-xs focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                const menus = [...editingSubmodule.sub.menus];
                                menus.splice(menuIdx, 1);
                                const sub = { ...editingSubmodule.sub, menus };
                                setEditingSubmodule({ ...editingSubmodule, sub });
                                const newModules = [...editingHotel.content.modules];
                                newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                                saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                              }}
                              className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded font-bold"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                          <div className="space-y-2 mt-2">
                            {(() => {
                              const imgs = menu.images || (menu.image ? [menu.image] : []);
                              return (
                                <>
                                  {imgs.map((mImg: string, mImgIdx: number) => (
                                    <div key={mImgIdx} className="flex items-center gap-2">
                                      <div className="flex-1">
                                        <ImageUpload
                                          value={mImg}
                                          label={`Menu Image ${mImgIdx + 1}`}
                                          onChange={(url) => {
                                            const menus = [...editingSubmodule.sub.menus];
                                            const newImages = [...imgs];
                                            newImages[mImgIdx] = url;
                                            menus[menuIdx] = { ...menus[menuIdx], images: newImages };
                                            const sub = { ...editingSubmodule.sub, menus };
                                            setEditingSubmodule({ ...editingSubmodule, sub });
                                            const newModules = [...editingHotel.content.modules];
                                            newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                                            saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                                          }}
                                        />
                                      </div>
                                      <button
                                        onClick={() => {
                                          const menus = [...editingSubmodule.sub.menus];
                                          const newImages = [...imgs];
                                          newImages.splice(mImgIdx, 1);
                                          menus[menuIdx] = { ...menus[menuIdx], images: newImages };
                                          const sub = { ...editingSubmodule.sub, menus };
                                          setEditingSubmodule({ ...editingSubmodule, sub });
                                          const newModules = [...editingHotel.content.modules];
                                          newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                                          saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                                        }}
                                        className="text-red-500 hover:text-red-600 p-2"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  ))}
                                  <MultiImageUpload
                                    onUpload={(urls) => {
                                      const menus = [...editingSubmodule.sub.menus];
                                      const newImages = [...imgs, ...urls].filter(Boolean);
                                      menus[menuIdx] = { ...menus[menuIdx], images: newImages };
                                      const sub = { ...editingSubmodule.sub, menus };
                                      setEditingSubmodule({ ...editingSubmodule, sub });
                                      const newModules = [...editingHotel.content.modules];
                                      newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                                      saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                                    }}
                                  />
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                      {!(editingSubmodule.sub.menus?.length > 0) && (
                        <div className="text-center py-4 text-xs text-blue-400 italic bg-white border border-blue-100 border-dashed rounded">
                          No menus configured.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                )}

                <div>
                  <ImageUpload
                    value={editingSubmodule.sub.image || ""}
                    label="Cover Image URL"
                    onChange={(url) => {
                      const sub = { ...editingSubmodule.sub, image: url };
                      setEditingSubmodule({ ...editingSubmodule, sub });
                      const newModules = [...editingHotel.content.modules];
                      newModules[editingSubmodule.modIdx].submodules[
                        editingSubmodule.subIdx
                      ] = sub;
                      saveHotelContent(editingHotel.id, {
                        ...editingHotel.content,
                        modules: newModules,
                      });
                    }}
                  />
                </div>

                {(editingHotel.content.modules[editingSubmodule.modIdx]?.templateId === "map" || (editingHotel.content.modules[editingSubmodule.modIdx]?.templateId && data.templates?.find((t: any) => t.id === editingHotel.content.modules[editingSubmodule.modIdx].templateId)?.displayType === "map") || editingHotel.content.modules[editingSubmodule.modIdx]?.title?.toLowerCase().includes("map")) && (
                  <div className="flex flex-col gap-4 bg-neutral-50 p-4 border border-neutral-200 rounded-lg">
                    <label className="block text-xs uppercase text-neutral-500 font-semibold">Map Marker Position</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">Map X Position (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editingSubmodule.sub.mapX || ""}
                          onChange={(e) => {
                            const sub = { ...editingSubmodule.sub, mapX: parseFloat(e.target.value) };
                            setEditingSubmodule({ ...editingSubmodule, sub });
                            const newModules = [...editingHotel.content.modules];
                            newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                            saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                          }}
                          className="w-full border border-neutral-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-neutral-500 mb-1 font-semibold">Map Y Position (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editingSubmodule.sub.mapY || ""}
                          onChange={(e) => {
                            const sub = { ...editingSubmodule.sub, mapY: parseFloat(e.target.value) };
                            setEditingSubmodule({ ...editingSubmodule, sub });
                            const newModules = [...editingHotel.content.modules];
                            newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                            saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                          }}
                          className="w-full border border-neutral-200 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    {editingHotel.content.modules[editingSubmodule.modIdx].image && (
                      <div className="relative w-full aspect-[16/9] bg-neutral-200 rounded-lg overflow-hidden border border-neutral-300 cursor-crosshair mt-2"
                           onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = ((e.clientX - rect.left) / rect.width) * 100;
                              const y = ((e.clientY - rect.top) / rect.height) * 100;
                              const sub = { ...editingSubmodule.sub, mapX: parseFloat(x.toFixed(2)), mapY: parseFloat(y.toFixed(2)) };
                              setEditingSubmodule({ ...editingSubmodule, sub });
                              const newModules = [...editingHotel.content.modules];
                              newModules[editingSubmodule.modIdx].submodules[editingSubmodule.subIdx] = sub;
                              saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
                           }}>
                         <img src={editingHotel.content.modules[editingSubmodule.modIdx].image} className="w-full h-full object-cover pointer-events-none" alt="Map Reference" />
                         {editingSubmodule.sub.mapX != null && editingSubmodule.sub.mapY != null && (
                            <div className="absolute w-6 h-6 -ml-3 -mt-3 bg-red-500 rounded-full border-2 border-white shadow-lg pointer-events-none" style={{ left: `${editingSubmodule.sub.mapX}%`, top: `${editingSubmodule.sub.mapY}%` }}></div>
                         )}
                         <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur pointer-events-none">Click to position marker</div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex-1 min-h-[300px] flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs uppercase text-neutral-500 font-semibold">
                      {editingSubmodule.sub.layout === 'golfDetails' ? 'Course Overview' : 'Rich Content'}
                    </label>
                    {editingSubmodule.sub.layout !== 'golfDetails' && (
                    <button
                      onClick={() => {
                        const suiteFeatures = [
                          { icon: "Bed", label: "1 King Bed" },
                          { icon: "Users", label: "2 Guests" },
                          { icon: "Square", label: "32 m²" },
                          { icon: "Wifi", label: "Free Wi-Fi" },
                          { icon: "Snowflake", label: "Air Conditioning" },
                        ];
                        const suiteContent =
                          "<p>Unwind in our spacious Deluxe King Room, featuring a plush king-size bed, modern amenities, and stunning city views. Perfect for both business and leisure travelers.</p>";
                        const sub = {
                          ...editingSubmodule.sub,
                          features: suiteFeatures,
                          content: editingSubmodule.sub.content || suiteContent,
                          title:
                            editingSubmodule.sub.title || "Deluxe King Room",
                          subtitle:
                            editingSubmodule.sub.subtitle ||
                            "Comfort. Style. Relaxation.",
                          button: editingSubmodule.sub.button || {
                            label: "Book Now",
                            url: "#",
                          },
                        };
                        setEditingSubmodule({ ...editingSubmodule, sub });
                        const newModules = [...editingHotel.content.modules];
                        newModules[editingSubmodule.modIdx].submodules[
                          editingSubmodule.subIdx
                        ] = sub;
                        saveHotelContent(editingHotel.id, {
                          ...editingHotel.content,
                          modules: newModules,
                        });
                      }}
                      className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-100 transition-colors uppercase tracking-widest"
                    >
                      Autopopulate Suite Design
                    </button>
                    )}
                  </div>
                  <div className="flex-1 bg-white border border-neutral-300 rounded overflow-hidden flex flex-col">
                    <ReactQuill
                      theme="snow"
                      value={editingSubmodule.sub.content || ""}
                      onChange={(val) => {
                        const sub = { ...editingSubmodule.sub, content: val };
                        setEditingSubmodule({ ...editingSubmodule, sub });
                        const newModules = [...editingHotel.content.modules];
                        newModules[editingSubmodule.modIdx].submodules[
                          editingSubmodule.subIdx
                        ] = sub;
                        saveHotelContent(editingHotel.id, {
                          ...editingHotel.content,
                          modules: newModules,
                        });
                      }}
                      className="h-full flex-1"
                    />
                  </div>
                </div>

                {/* Features Editor */}
                {editingSubmodule.sub.layout !== 'restaurant' && editingSubmodule.sub.layout !== 'golfDetails' && (
                <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs uppercase text-neutral-500 font-semibold mb-0">
                      Amenities & Features
                    </label>
                    <button
                      onClick={() => {
                        const features = [
                          ...(editingSubmodule.sub.features || []),
                          { icon: "Check", label: "New Feature" },
                        ];
                        const sub = { ...editingSubmodule.sub, features };
                        setEditingSubmodule({ ...editingSubmodule, sub });
                        const newModules = [...editingHotel.content.modules];
                        newModules[editingSubmodule.modIdx].submodules[
                          editingSubmodule.subIdx
                        ] = sub;
                        saveHotelContent(editingHotel.id, {
                          ...editingHotel.content,
                          modules: newModules,
                        });
                      }}
                      className="text-xs bg-white border border-neutral-200 px-2 py-1 rounded hover:bg-neutral-100"
                    >
                      + Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(editingSubmodule.sub.features || []).map(
                      (f: any, fIdx: number) => (
                        <div key={fIdx} className="flex gap-2">
                          <input
                            type="text"
                            value={f.icon}
                            placeholder="Icon Name (e.g. Bed)"
                            onChange={(e) => {
                              const features = [
                                ...editingSubmodule.sub.features,
                              ];
                              features[fIdx].icon = e.target.value;
                              const sub = { ...editingSubmodule.sub, features };
                              setEditingSubmodule({ ...editingSubmodule, sub });
                              const newModules = [
                                ...editingHotel.content.modules,
                              ];
                              newModules[editingSubmodule.modIdx].submodules[
                                editingSubmodule.subIdx
                              ] = sub;
                              saveHotelContent(editingHotel.id, {
                                ...editingHotel.content,
                                modules: newModules,
                              });
                            }}
                            className="w-1/3 border border-neutral-300 rounded p-2 text-sm focus:border-blue-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={f.label}
                            placeholder="Feature Label"
                            onChange={(e) => {
                              const features = [
                                ...editingSubmodule.sub.features,
                              ];
                              features[fIdx].label = e.target.value;
                              const sub = { ...editingSubmodule.sub, features };
                              setEditingSubmodule({ ...editingSubmodule, sub });
                              const newModules = [
                                ...editingHotel.content.modules,
                              ];
                              newModules[editingSubmodule.modIdx].submodules[
                                editingSubmodule.subIdx
                              ] = sub;
                              saveHotelContent(editingHotel.id, {
                                ...editingHotel.content,
                                modules: newModules,
                              });
                            }}
                            className="flex-1 border border-neutral-300 rounded p-2 text-sm focus:border-blue-500 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              const features = [
                                ...editingSubmodule.sub.features,
                              ];
                              features.splice(fIdx, 1);
                              const sub = { ...editingSubmodule.sub, features };
                              setEditingSubmodule({ ...editingSubmodule, sub });
                              const newModules = [
                                ...editingHotel.content.modules,
                              ];
                              newModules[editingSubmodule.modIdx].submodules[
                                editingSubmodule.subIdx
                              ] = sub;
                              saveHotelContent(editingHotel.id, {
                                ...editingHotel.content,
                                modules: newModules,
                              });
                            }}
                            className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded font-bold"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ),
                    )}
                    {!(editingSubmodule.sub.features?.length > 0) && (
                      <div className="text-center py-4 text-xs text-neutral-400 italic bg-white border border-neutral-200 border-dashed rounded">
                        No amenities configured.
                      </div>
                    )}
                  </div>
                </div>
                )}

                <div className="border-t border-neutral-200 pt-6">
                  <h4 className="font-semibold text-neutral-800 mb-3">
                    Gallery & Action Button
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 mb-2">
                        Gallery Images
                      </p>
                      <div className="space-y-2">
                        {editingSubmodule.sub.gallery?.map(
                          (gImg: string, gIdx: number) => (
                            <div key={gIdx} className="flex items-center gap-2">
                              <div className="flex-1">
                                <ImageUpload
                                  value={gImg}
                                  label={`Image ${gIdx + 1}`}
                                  onChange={(url) => {
                                    const newGallery = [
                                      ...(editingSubmodule.sub.gallery || []),
                                    ];
                                    newGallery[gIdx] = url;
                                    const sub = {
                                      ...editingSubmodule.sub,
                                      gallery: newGallery,
                                    };
                                    setEditingSubmodule({
                                      ...editingSubmodule,
                                      sub,
                                    });
                                    const newModules = [
                                      ...editingHotel.content.modules,
                                    ];
                                    newModules[
                                      editingSubmodule.modIdx
                                    ].submodules[editingSubmodule.subIdx] = sub;
                                    saveHotelContent(editingHotel.id, {
                                      ...editingHotel.content,
                                      modules: newModules,
                                    });
                                  }}
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const newGallery = [
                                    ...(editingSubmodule.sub.gallery || []),
                                  ];
                                  newGallery.splice(gIdx, 1);
                                  const sub = {
                                    ...editingSubmodule.sub,
                                    gallery: newGallery,
                                  };
                                  setEditingSubmodule({
                                    ...editingSubmodule,
                                    sub,
                                  });
                                  const newModules = [
                                    ...editingHotel.content.modules,
                                  ];
                                  newModules[
                                    editingSubmodule.modIdx
                                  ].submodules[editingSubmodule.subIdx] = sub;
                                  saveHotelContent(editingHotel.id, {
                                    ...editingHotel.content,
                                    modules: newModules,
                                  });
                                }}
                                className="text-red-500 hover:text-red-700 p-1 mb-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ),
                        )}
                        <MultiImageUpload
                          onUpload={(urls) => {
                            const newGallery = [
                              ...(editingSubmodule.sub.gallery || []),
                              ...urls,
                            ].filter(Boolean);
                            const sub = {
                              ...editingSubmodule.sub,
                              gallery: newGallery,
                            };
                            setEditingSubmodule({ ...editingSubmodule, sub });
                            const newModules = [
                              ...editingHotel.content.modules,
                            ];
                            newModules[editingSubmodule.modIdx].submodules[
                              editingSubmodule.subIdx
                            ] = sub;
                            saveHotelContent(editingHotel.id, {
                              ...editingHotel.content,
                              modules: newModules,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700 mb-2">
                        Call to Action Button
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">
                            Button Label (e.g. "Reserve Suite")
                          </label>
                          <input
                            type="text"
                            value={editingSubmodule.sub.button?.label || ""}
                            onChange={(e) => {
                              const sub = {
                                ...editingSubmodule.sub,
                                button: {
                                  ...editingSubmodule.sub.button,
                                  label: e.target.value,
                                },
                              };
                              setEditingSubmodule({ ...editingSubmodule, sub });
                              const newModules = [
                                ...editingHotel.content.modules,
                              ];
                              newModules[editingSubmodule.modIdx].submodules[
                                editingSubmodule.subIdx
                              ] = sub;
                              saveHotelContent(editingHotel.id, {
                                ...editingHotel.content,
                                modules: newModules,
                              });
                            }}
                            className="w-full border border-neutral-300 rounded px-2 py-1.5 focus:border-blue-500 focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">
                            Button URL
                          </label>
                          <input
                            type="text"
                            value={editingSubmodule.sub.button?.url || ""}
                            onChange={(e) => {
                              const sub = {
                                ...editingSubmodule.sub,
                                button: {
                                  ...editingSubmodule.sub.button,
                                  url: e.target.value,
                                },
                              };
                              setEditingSubmodule({ ...editingSubmodule, sub });
                              const newModules = [
                                ...editingHotel.content.modules,
                              ];
                              newModules[editingSubmodule.modIdx].submodules[
                                editingSubmodule.subIdx
                              ] = sub;
                              saveHotelContent(editingHotel.id, {
                                ...editingHotel.content,
                                modules: newModules,
                              });
                            }}
                            className="w-full border border-neutral-300 rounded px-2 py-1.5 focus:border-blue-500 focus:outline-none text-sm font-mono text-blue-600" />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 mb-1">
                            Link to Internal Module (Optional)
                          </label>
                          <select
                            value={editingSubmodule.sub.button?.moduleId || ""}
                            onChange={(e) => {
                              const sub = {
                                ...editingSubmodule.sub,
                                button: {
                                  ...editingSubmodule.sub.button,
                                  moduleId: e.target.value,
                                },
                              };
                              setEditingSubmodule({ ...editingSubmodule, sub });
                              const newModules = [
                                ...editingHotel.content.modules,
                              ];
                              newModules[editingSubmodule.modIdx].submodules[
                                editingSubmodule.subIdx
                              ] = sub;
                              saveHotelContent(editingHotel.id, {
                                ...editingHotel.content,
                                modules: newModules,
                              });
                            }}
                            className="w-full border border-neutral-300 rounded px-2 py-1.5 focus:border-blue-500 focus:outline-none text-sm"
                          >
                            <option value="">None (Use URL or default behavior)</option>
                            {editingHotel.content?.modules?.map((m: any) => (
                              <option key={m.id} value={m.id}>
                                {m.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mobile_content" && data && (
            <div className="max-w-5xl mx-auto w-full">
              <MobileContentManager data={data} fetchAdminData={fetchAdminData} />
            </div>
          )}

          {activeTab === "devices" && data && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-sm text-neutral-500">
                    <th className="pb-3 font-medium">Device Name</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Assigned Hotel</th>
                    <th className="pb-3 font-medium">IP Address</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data.devices.map((d: any) => {
                    const isMobileDev = d.isMobile || (d.name || "").toLowerCase().includes("mobile") || (d.name || "").toLowerCase().includes("phone");
                    return (
                      <tr
                        key={d.id}
                        className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
                      >
                        <td className="py-3">
                          <input
                            type="text"
                            defaultValue={d.name}
                            onBlur={(e) => renameDevice(d.id, e.target.value)}
                            className="bg-transparent border-b border-dashed border-neutral-300 focus:border-blue-500 focus:outline-none w-full font-medium text-neutral-800"
                          />
                        </td>
                        <td className="py-3">
                          {isMobileDev ? (
                            <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              <Smartphone size={12} /> Mobile Device
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              <ServerIcon size={12} /> Kiosk Screen
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <select
                            value={d.assignedHotelId || ""}
                            onChange={(e) =>
                              assignHotelToDevice(d.id, e.target.value)
                            }
                            className="bg-transparent border border-neutral-300 rounded px-2 py-1 text-xs focus:outline-blue-500 font-medium"
                          >
                            <option value="">Global Default</option>
                            {data.hotels.map((h: any) => (
                              <option key={h.id} value={h.id}>
                                {h.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 font-mono text-neutral-600 text-xs">
                          {d.ip}
                        </td>
                        <td className="py-3">
                          {d.status === "online" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>{" "}
                              Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full text-xs font-medium">
                              <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>{" "}
                              Offline
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-2">
                            {isMobileDev ? (
                              <a
                                href={d.assignedHotelId ? `/?mobile=true&hotelId=${d.assignedHotelId}` : `/?mobile=true`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded hover:bg-amber-100 flex items-center gap-1 font-semibold"
                              >
                                <ExternalLink size={12} /> View Mobile
                              </a>
                            ) : null}
                            <button
                              onClick={() => clearCacheAndReload(d.id)}
                              className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded hover:bg-orange-100 flex items-center gap-1"
                            >
                              <Trash2 size={12} /> Clear Cache
                            </button>
                            <button
                              onClick={() => lockDevice(d.id)}
                              className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 flex items-center gap-1"
                            >
                              <Lock size={12} /> Lock
                            </button>
                            <button
                              onClick={() => rebootDevice(d.id)}
                              className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 flex items-center gap-1"
                            >
                              <Power size={12} /> Reboot
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {data.devices.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-neutral-500"
                      >
                        No devices connected.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "logs" && data && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 overflow-hidden">
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {data.logs.map((log: any, i: number) => (
                  <div
                    key={i}
                    className={
                      "p-3 rounded border text-sm flex gap-3 " +
                      (log.type === "error"
                        ? "bg-red-50 border-red-100 text-red-800"
                        : log.type === "warn"
                          ? "bg-orange-50 border-orange-100 text-orange-800"
                          : "bg-neutral-50 border-neutral-100 text-neutral-800")
                    }
                  >
                    <div className="mt-0.5 opacity-70">
                      {log.type === "error" ? (
                        <AlertTriangle size={16} />
                      ) : log.type === "warn" ? (
                        <AlertTriangle size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-xs opacity-50 mb-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                      <div>{log.message}</div>
                    </div>
                  </div>
                ))}
                {data.logs.length === 0 && (
                  <p className="text-sm text-neutral-500">No logs recorded.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
