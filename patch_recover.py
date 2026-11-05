import re

with open("src/App.tsx", "r") as f:
    content = f.read()

replacement = """            {/* Forecast Grid */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5">
                    {/* Placeholder for forecast items */}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [config, setConfig] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedHotelId, setSelectedHotelId] = React.useState<string | null>(null);
  const [activeModule, setActiveModule] = React.useState<any>(null);
  const [showHotelDropdown, setShowHotelDropdown] = React.useState(false);
  const [weather, setWeather] = React.useState<{ temp: number; icon: any } | null>(null);
  const [showCheckInModal, setShowCheckInModal] = React.useState(false);
  const [currentBanner, setCurrentBanner] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const [adminPassword, setAdminPassword] = React.useState("");
  const [pwdError, setPwdError] = React.useState("");
  const [secretClicks, setSecretClicks] = React.useState(0);
  const [showSystemInfo, setShowSystemInfo] = React.useState(false);
  const [pairedMessage, setPairedMessage] = React.useState("");
  const [activeGalleryImage, setActiveGalleryImage] = React.useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = React.useState(false);

  React.useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/admin/data");
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
          if (data.hotels && data.hotels.length > 0) {
            const activeHotels = data.hotels.filter((h: any) => h.active);
            if (activeHotels.length > 0) {
              const savedId = localStorage.getItem("kiosk_hotel_id");
              if (savedId && activeHotels.find((h: any) => h.id === savedId)) {
                setSelectedHotelId(savedId);
              } else {
                setSelectedHotelId(activeHotels[0].id);
              }
            }
          }
        }
      } catch (err) {
        console.warn("Failed to fetch config", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
    const interval = setInterval(fetchConfig, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentHotel = config?.hotels?.find((h: any) => h.id === selectedHotelId);
  const banners = currentHotel?.content?.banners?.length > 0 
    ? currentHotel.content.banners 
    : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop"];

  React.useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleBottomLeftClick = () => {
    setSecretClicks(prev => {
      if (prev >= 4) {
        setShowAdminLogin(true);
        return 0;
      }
      return prev + 1;
    });
    window.setTimeout(() => setSecretClicks(0), 3000);
  };

  const goHome = () => {
    setActiveModule(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMobile = config?.isMobileDevice && config?.settings?.enableMobileApp;

  return (
    <>
      {isMobile ? (
        <MobileAppView config={config} currentHotel={currentHotel} setActiveModule={setActiveModule} weather={weather} setWeather={setWeather} setShowCheckInModal={setShowCheckInModal} />
      ) : (
        <div 
          onClick={() => setShowHotelDropdown(false)}
          className="min-h-screen bg-[#F0F2F5] text-[#0A1024] selection:bg-[#D9B673] selection:text-[#F8F9FA] pb-32 font-sans relative overflow-x-hidden select-none"
        >
          {/* Invisible bottom-left click area to exit fullscreen */}
          <div 
            className="fixed bottom-0 left-0 w-24 h-24 z-[9999] cursor-default"
            onClick={(e) => {
              e.stopPropagation();
              handleBottomLeftClick();
            }}
          />

          <div className="relative w-full max-w-[1428px] mx-auto mb-6 px-4 sm:px-8 pt-4 sm:pt-8">
            <div className="relative w-full flex flex-col lg:flex-row bg-[#08183A] rounded-[1.5rem] overflow-hidden min-h-[500px] lg:min-h-[608px] shadow-xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15 },
                  },
                }}
                className="w-full lg:w-[45%] shrink-0 relative z-20 p-8 lg:p-14 flex flex-col justify-center"
              >"""

pattern = re.compile(r'            \{\/\* Forecast Grid \*\/\}[\s\S]*?className="w-full lg:w-\[45%\] shrink-0 relative z-20 p-8 lg:p-14 flex flex-col justify-center"\n\s*>', re.MULTILINE)
content = pattern.sub(replacement, content, count=1)

with open("src/App.tsx", "w") as f:
    f.write(content)
