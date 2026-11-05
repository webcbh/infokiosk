const fs = require('fs');
let code = fs.readFileSync('src/components/DirectoryOfServicesLayout.tsx', 'utf8');

const target = `        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-12">
          {allItems.map((item: any, idx: number) => (`;
          
const bottomBanners = `        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-12">
          {allItems.map((item: any, idx: number) => (`;
          
// Let's actually find the end of the grid to insert the bottom section
const endOfGrid = `        </div>

      </div>`;

const bottomSection = `        </div>

        {/* Bottom Banners */}
        <div className="mt-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
          {/* Need Assistance Box */}
          <div 
            className="flex items-start md:items-center justify-between gap-4 p-4 md:p-6 rounded-lg border bg-[#fffaf0]"
            style={{ borderColor: brandGold, color: brandBlue }}
          >
            <div className="flex items-start md:items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center" style={{ borderColor: brandGold, color: brandGold }}>
                <DynamicIcon name="Info" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base lg:text-lg uppercase tracking-wider mb-1">NEED ASSISTANCE?</h3>
                <p className="text-xs md:text-sm lg:text-base opacity-90 leading-relaxed">
                  Our Concierge team is at your service.<br className="hidden md:block" />
                  Please contact Reception for any information or requests.
                </p>
              </div>
            </div>
            <div className="hidden md:block opacity-20" style={{ color: brandGold }}>
               <DynamicIcon name="ConciergeBell" size={64} />
            </div>
          </div>

          {/* Contact Concierge Box */}
          <div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-lg text-white"
            style={{ backgroundColor: brandBlue }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <DynamicIcon name="Headset" size={48} className="opacity-80" />
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg lg:text-xl uppercase tracking-wider mb-1">
                  WE ARE AT YOUR SERVICE
                </h3>
                <p className="text-xs md:text-sm lg:text-base opacity-90 leading-relaxed max-w-md">
                  If you need anything during your stay, our team is always happy to help.
                </p>
              </div>
            </div>
            <button 
              className="font-bold text-sm md:text-base px-6 py-3 md:px-8 md:py-4 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: brandGold, color: brandBlue }}
            >
              CONTACT CONCIERGE
              <DynamicIcon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>

      </div>`;

code = code.replace(endOfGrid, bottomSection);

fs.writeFileSync('src/components/DirectoryOfServicesLayout.tsx', code);
