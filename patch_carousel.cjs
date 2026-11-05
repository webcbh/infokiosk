const fs = require('fs');
let code = fs.readFileSync('src/components/AwardsLayout.tsx', 'utf8');

const targetCarousel = `        {/* Carousel */}
        <div className="relative mb-12">
           <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-neutral-100 group">
             <AnimatePresence mode="wait">
                <motion.img 
                  key={currentSlide}
                  src={gallery[currentSlide]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
             </AnimatePresence>`;

const replacementCarousel = `        {/* Carousel */}
        <div className="relative mb-12 flex justify-center">
           <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-neutral-100 group flex items-center justify-center">
             <AnimatePresence mode="wait">
                <motion.img 
                  key={currentSlide}
                  src={gallery[currentSlide]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
             </AnimatePresence>`;

code = code.replace(targetCarousel, replacementCarousel);
fs.writeFileSync('src/components/AwardsLayout.tsx', code);
