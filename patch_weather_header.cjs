const fs = require('fs');
let code = fs.readFileSync('src/components/WeatherLayout.tsx', 'utf8');

const oldHeaderStr = `        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 mb-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 uppercase tracking-tight" style={{ color: brandBlue }}>
              {module?.title || "WEATHER FORECAST"}
            </h1>
            <div className="w-16 h-1 mb-4" style={{ backgroundColor: brandGold }}></div>
            <p className="text-base md:text-lg mb-6 leading-relaxed max-w-2xl" style={{ color: brandBlue }}>
              {module?.subtitle || "Current weather and 3-day forecast for all major cities in Cyprus."}
            </p>
          </div>
        </div>`;

const newHeaderStr = `        {/* Header Section */}
        <div className="flex flex-col mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-1 mb-6" style={{ backgroundColor: brandGold }}
          />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-4" 
            style={{ color: brandBlue }}
          >
            {module?.title || "WEATHER FORECAST"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl text-neutral-600 leading-relaxed"
          >
            {module?.subtitle || "Current weather and 3-day forecast for all major cities in Cyprus."}
          </motion.p>
        </div>`;

code = code.replace(oldHeaderStr, newHeaderStr);
fs.writeFileSync('src/components/WeatherLayout.tsx', code);
console.log("Weather patched");
