const fs = require('fs');
let code = fs.readFileSync('src/components/DirectoryOfServicesLayout.tsx', 'utf8');

const target1 = `import { motion } from 'framer-motion';`;
const replacement1 = `import { motion, AnimatePresence } from 'framer-motion';`;

const target2 = `  const [localConfig, setLocalConfig] = React.useState(module.directoryConfig);
  const [isRefreshing, setIsRefreshing] = React.useState(false);`;
const replacement2 = `  const [localConfig, setLocalConfig] = React.useState(module.directoryConfig);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);`;

const target3 = `        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-12">
          {allItems.map((item: any, idx: number) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.15)] transition-shadow cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div style={{ color: brandGold }}>
                  <DynamicIcon name={item.icon || 'Check'} size={24} strokeWidth={1.5} />
                </div>
                <span className="font-medium text-sm md:text-base group-hover:opacity-80 transition-opacity" style={{ color: brandBlue }}>
                  {item.name}
                </span>
              </div>
              <div style={{ color: brandBlue }} className="opacity-50 group-hover:opacity-100 transition-opacity">
                <DynamicIcon name="ChevronRight" size={20} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.div>
  );
}`;
const replacement3 = `        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-12">
          {allItems.map((item: any, idx: number) => (
            <div 
              key={idx} 
              onClick={() => {
                if (item.content) {
                  setSelectedItem(item);
                }
              }}
              className={\`flex items-center justify-between p-4 rounded-lg bg-white border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] transition-shadow \${item.content ? 'cursor-pointer hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.15)] group' : ''}\`}
            >
              <div className="flex items-center gap-4">
                <div style={{ color: brandGold }}>
                  <DynamicIcon name={item.icon || 'Check'} size={24} strokeWidth={1.5} />
                </div>
                <span className={\`font-medium text-sm md:text-base \${item.content ? 'group-hover:opacity-80 transition-opacity' : ''}\`} style={{ color: brandBlue }}>
                  {item.name}
                </span>
              </div>
              {item.content && (
                <div style={{ color: brandBlue }} className="opacity-50 group-hover:opacity-100 transition-opacity">
                  <DynamicIcon name="ChevronRight" size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
              style={{ borderTop: \`4px solid \${brandGold}\` }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div style={{ color: brandGold }}>
                    <DynamicIcon name={selectedItem.icon || 'Check'} size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wider" style={{ color: brandBlue }}>
                    {selectedItem.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                >
                  <DynamicIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 py-6 prose prose-sm sm:prose-base max-w-none" style={{ color: brandBlue }}>
                <SafeHTML html={selectedItem.content || ''} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}`;

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);
code = code.replace(target3, replacement3);
fs.writeFileSync('src/components/DirectoryOfServicesLayout.tsx', code);
