const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import
code = code.replace(
  'import DirectoryOfServicesLayout from "./components/DirectoryOfServicesLayout";',
  'import DirectoryOfServicesLayout from "./components/DirectoryOfServicesLayout";\nimport WeatherLayout from "./components/WeatherLayout";'
);

// 2. Remove CYPRUS_CITIES and getWeatherIcon and CyprusWeather
// Finding boundaries
const cyprusIdx = code.indexOf('const CYPRUS_CITIES = [');
const descIdx = code.indexOf('function getWeatherDescription(code: number) {');

if (cyprusIdx !== -1 && descIdx !== -1) {
  code = code.substring(0, cyprusIdx) + code.substring(descIdx);
} else {
  console.log("Could not find boundaries for removal");
}

// 3. Add to top level modules
const moduleDirectoryStr = `          ) : activeModule.templateId === "directory" || (activeModule.templateId && config?.templates?.find((t: any) => t.id === activeModule.templateId)?.displayType === "directory") || activeModule.title?.toLowerCase().includes("directory") ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              key="directory"
              className="fixed inset-0 z-50 overflow-y-auto w-full h-full bg-[#FAFAFA]"
            >
              <DirectoryOfServicesLayout module={activeModule} onClose={goBack} />
            </motion.div>`;

const moduleWeatherStr = `          ) : activeModule.title?.toLowerCase().includes("weather") ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              key="weather"
              className="fixed inset-0 z-50 overflow-y-auto w-full h-full bg-[#FAFAFA]"
            >
              <WeatherLayout module={activeModule} onClose={goBack} />
            </motion.div>`;

code = code.replace(moduleDirectoryStr, moduleDirectoryStr + "\n" + moduleWeatherStr);

// 4. Remove inline CyprusWeather from activeModule default view
const oldWeather1 = `                  if (activeModule.title?.toLowerCase().includes("weather")) {
                    return <CyprusWeather />;
                  }`;

code = code.replace(oldWeather1, '');

// 5. Add to activeSubmodule
const subDirectoryStr = `            ) : activeSubmodule.layout === "directory" || activeSubmodule.title?.toLowerCase().includes("directory") ? (
              <DirectoryOfServicesLayout module={activeSubmodule} onClose={goBack} />`;

const subWeatherStr = `            ) : activeSubmodule.title?.toLowerCase().includes("weather") ? (
              <WeatherLayout module={activeSubmodule} onClose={goBack} />`;

code = code.replace(subDirectoryStr, subDirectoryStr + "\n" + subWeatherStr);

// 6. Remove inline CyprusWeather from activeSubmodule default view
const oldWeather2 = `                  {activeSubmodule.title.toLowerCase().includes("weather") && (
                    <div className="mb-12">
                      <CyprusWeather />
                    </div>
                  )}`;

code = code.replace(oldWeather2, '');

fs.writeFileSync('src/App.tsx', code);
console.log("Patched successfully");
