import re

with open("src/App.tsx", "r") as f:
    content = f.read()

missing_state = """  const [activeGalleryImage, setActiveGalleryImage] = React.useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = React.useState(false);
  
  // ADDED MISSING STATE
  const [activeSubmodule, setActiveSubmodule] = React.useState<any>(null);
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null);
  const [appStartTime] = React.useState<string>(new Date().toISOString());
  const [lastSyncTime, setLastSyncTime] = React.useState<string>(new Date().toISOString());

  const openSubmodule = (modId: string, subId: string) => {
    setActiveSubmodule({ modId, subId });
  };

  const goBack = () => {
    setActiveSubmodule(null);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      setShowAdminLogin(false);
      setAdminPassword("");
      setPwdError("");
      window.open("/admin", "_blank");
    } else {
      setPwdError("Invalid password");
    }
  };
"""

content = content.replace("  const [activeGalleryImage, setActiveGalleryImage] = React.useState<string | null>(null);\n  const [showQRScanner, setShowQRScanner] = React.useState(false);", missing_state)

with open("src/App.tsx", "w") as f:
    f.write(content)
