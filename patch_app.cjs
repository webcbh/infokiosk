const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert event listener inside App.tsx
// find where we have useEffect
if (!code.includes("window.addEventListener('openModule'")) {
    code = code.replace(
        /useEffect\(\(\) => \{\n\s*fetchData\(\);\n\s*let interval/,
        `useEffect(() => {
    const handleOpenModule = (e) => {
      const moduleId = e.detail;
      const mod = data?.hotels?.[0]?.content?.modules?.find(m => m.id === moduleId);
      if (mod) {
        setActiveSubmodule(null);
        setActiveModule(mod);
      }
    };
    window.addEventListener('openModule', handleOpenModule);
    return () => window.removeEventListener('openModule', handleOpenModule);
  }, [data]);

  useEffect(() => {
    fetchData();
    let interval`
    );
    fs.writeFileSync('src/App.tsx', code);
}
