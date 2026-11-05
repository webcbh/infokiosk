import re

with open("src/App.tsx", "r") as f:
    content = f.read()

replacement = """  const goBack = () => {
    if (activeSubmodule) {
      setActiveSubmodule(null);
    } else {
      setActiveModule(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };"""

content = content.replace("  const goBack = () => {\n    setActiveSubmodule(null);\n  };", replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)
