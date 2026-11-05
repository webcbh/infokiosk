import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Remove the previous effect
bad_effect_start = "  React.useEffect(() => {\n    const handlePopState = (e: PopStateEvent) => {"
bad_effect_end = "  }, [activeModule, activeSubmodule, showCheckInModal]);"

start_idx = content.find(bad_effect_start)
if start_idx != -1:
    end_idx = content.find(bad_effect_end, start_idx) + len(bad_effect_end)
    content = content[:start_idx] + content[end_idx:]

good_effect = """  React.useEffect(() => {
    if (activeModule || activeSubmodule || showCheckInModal || lightboxImage) {
      window.history.pushState({ open: true }, '');
    }
  }, [activeModule, activeSubmodule, showCheckInModal, lightboxImage]);

  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (lightboxImage) {
        setLightboxImage(null);
      } else if (activeSubmodule) {
        setActiveSubmodule(null);
      } else if (activeModule) {
        setActiveModule(null);
      } else if (showCheckInModal) {
        setShowCheckInModal(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeModule, activeSubmodule, showCheckInModal, lightboxImage]);"""

content = content.replace("  const goBack = () => {", good_effect + "\n\n  const goBack = () => {")

with open("src/App.tsx", "w") as f:
    f.write(content)
