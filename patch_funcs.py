import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace openSubmodule
content = content.replace("""  const openSubmodule = (modId: string, subId: string) => {
    setActiveSubmodule({ modId, subId });
  };""", """  const openSubmodule = (arg1: any, arg2?: any) => {
    if (arg2 !== undefined) {
      setActiveSubmodule({ modId: arg1, subId: arg2 });
    } else {
      setActiveSubmodule(arg1);
    }
  };""")

# Replace handleAdminLogin
content = content.replace("""  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "admin123") {
      setShowAdminLogin(false);
      setAdminPassword("");
      setPwdError("");
      window.open("/admin", "_blank");
    } else {
      setPwdError("Invalid password");
    }
  };""", """  const handleAdminLogin = (e: React.FormEvent, type: string) => {
    e.preventDefault();
    const pin = adminPassword;
    setShowAdminLogin(false);
    setAdminPassword("");
    setPwdError("");
    if (type === "admin") {
      window.open("/admin", "_blank");
    } else if (type === "sysinfo") {
      setShowSystemInfo(true);
    } else if (type === "unlock") {
      window.location.href = "/";
    }
  };""")

# Add overlayLoading
content = content.replace("const [loading, setLoading] = React.useState(true);", "const [loading, setLoading] = React.useState(true);\n  const [overlayLoading, setOverlayLoading] = React.useState(false);")

# Add getWeatherDescription before function App
content = content.replace("export default function App() {", """function getWeatherDescription(code: number) {
  if (code === 0) return "Clear sky";
  if (code >= 1 && code <= 3) return "Partly cloudy";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Cloudy";
}

export default function App() {""")

with open("src/App.tsx", "w") as f:
    f.write(content)
