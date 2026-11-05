import re

with open("src/App.tsx", "r") as f:
    content = f.read()

bad_start = "  React.useEffect(() => {\n    if (activeModule || activeSubmodule"
bad_end = "  }, [activeModule, activeSubmodule, showCheckInModal, lightboxImage]);\n"

s1 = content.find(bad_start)
if s1 != -1:
    e1 = content.find(bad_end, s1) + len(bad_end)
    content = content[:s1] + content[e1:]

bad_start2 = "  React.useEffect(() => {\n    const handlePopState"
bad_end2 = "  }, [activeModule, activeSubmodule, showCheckInModal, lightboxImage]);\n"

s2 = content.find(bad_start2)
if s2 != -1:
    e2 = content.find(bad_end2, s2) + len(bad_end2)
    content = content[:s2] + content[e2:]

new_history_logic = """  // Manage browser history to allow physical back button to work naturally
  React.useEffect(() => {
    const currentState = window.history.state;
    // Calculate a unique identifier for the current view state
    const viewState = lightboxImage ? 'lightbox' : activeSubmodule ? 'submodule' : activeModule ? 'module' : showCheckInModal ? 'checkin' : 'home';
    
    if (currentState?.view !== viewState) {
       if (viewState === 'home') {
           // We are home, if we came here from a back button, we do nothing.
           // If we came here from a UI button (like X or Home), we could replace state.
       } else {
           window.history.pushState({ view: viewState }, '');
       }
    }
  }, [activeModule, activeSubmodule, showCheckInModal, lightboxImage]);

  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // When back button is pressed, we figure out what to close based on what is currently open.
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

content = content.replace("  const goBack = () => {", new_history_logic + "\n\n  const goBack = () => {")

with open("src/App.tsx", "w") as f:
    f.write(content)
