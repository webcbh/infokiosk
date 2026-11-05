const fs = require('fs');
let code = fs.readFileSync('src/components/AwardsLayout.tsx', 'utf8');

const targetGallery = `  const gallery = module.gallery && module.gallery.length > 0 ? module.gallery : [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop'
  ];`;

const replacementGallery = `  let gallery = [];
  if (module.awardsBanners && module.awardsBanners.length > 0) {
    gallery = module.awardsBanners;
  } else if (module.awardsBanner) {
    gallery = [module.awardsBanner];
  } else if (module.gallery && module.gallery.length > 0) {
    gallery = module.gallery;
  } else {
    gallery = ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop'];
  }`;

code = code.replace(targetGallery, replacementGallery);

fs.writeFileSync('src/components/AwardsLayout.tsx', code);
