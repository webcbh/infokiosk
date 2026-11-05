const fs = require('fs');
let code = fs.readFileSync('src/components/DirectoryOfServicesLayout.tsx', 'utf8');

code = code.replace(
  '<DynamicIcon name={cat.icon || \'Star\'} size={48} />',
  `{cat.image ? <img src={cat.image} alt="" className="w-12 h-12 object-contain" /> : <DynamicIcon name={cat.icon || 'Star'} size={48} />}`
);

code = code.replace(
  '<DynamicIcon name={item.icon || \'Info\'} size={32} />',
  `{item.image ? <img src={item.image} alt="" className="w-8 h-8 object-contain" /> : <DynamicIcon name={item.icon || 'Info'} size={32} />}`
);

fs.writeFileSync('src/components/DirectoryOfServicesLayout.tsx', code);
