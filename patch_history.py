import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Let's just create a reliable history management useEffect.
# Every time activeModule or activeSubmodule changes, we sync the URL? No, that causes loops.
# Better to just intercept popstate. 
# In a kiosk, maybe we don't need full URL routing, just making the back button close the active module.

effect = """  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // If we are showing a lightbox, close it
      if (document.querySelector('.cursor-zoom-out')) {
        setLightboxImage(null);
        window.history.pushState(null, ''); // prevent actual back
        return;
      }
      
      if (activeSubmodule) {
        setActiveSubmodule(null);
        window.history.pushState(null, '');
      } else if (activeModule) {
        setActiveModule(null);
        window.history.pushState(null, '');
      } else if (showCheckInModal) {
        setShowCheckInModal(false);
        window.history.pushState(null, '');
      }
    };
    
    // Always keep a state forward so back button triggers popstate without leaving
    window.history.pushState(null, '');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeModule, activeSubmodule, showCheckInModal]);"""

# Replace the first `React.useEffect` with this new one + the original.
# Wait, let's just insert it before `const goBack`.

content = content.replace("  const goBack = () => {", effect + "\n\n  const goBack = () => {")

with open("src/App.tsx", "w") as f:
    f.write(content)
