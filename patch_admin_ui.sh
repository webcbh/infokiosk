sed -i '/<h3 className="text-lg font-medium mb-4">Security & Access<\/h3>/i\
              <div className="flex items-center justify-between py-3 border-b border-neutral-100 mb-8">\
                <div>\
                  <h4 className="font-medium text-neutral-800">\
                    Enable Mobile App Version\
                  </h4>\
                  <p className="text-sm text-neutral-500">\
                    Show a mobile-optimized version for smartphones and tablets\
                  </p>\
                </div>\
                <label className="relative inline-flex items-center cursor-pointer">\
                  <input\
                    type="checkbox"\
                    className="sr-only peer"\
                    checked={data.settings.generalConfig?.enableMobileApp ?? false}\
                    onChange={(e) => handleToggleMobileApp(e.target.checked)}\
                  />\
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['\''\'\''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>\
                </label>\
              </div>\
              <div className="flex items-center justify-between py-3 border-b border-neutral-100 mb-8">\
                <div>\
                  <h4 className="font-medium text-neutral-800">\
                    Bypass IP Filtering for Mobile App\
                  </h4>\
                  <p className="text-sm text-neutral-500">\
                    Allow mobile devices to connect even if IP filtering is active\
                  </p>\
                </div>\
                <label className="relative inline-flex items-center cursor-pointer">\
                  <input\
                    type="checkbox"\
                    className="sr-only peer"\
                    checked={data.settings.generalConfig?.disableMobileIpFiltering ?? false}\
                    onChange={(e) => handleToggleMobileIpBypass(e.target.checked)}\
                  />\
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['\''\'\''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>\
                </label>\
              </div>' src/AdminDashboard.tsx
