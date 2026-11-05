const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Click on a module
  const items = await page.$$('.group');
  for (const item of items) {
    const text = await page.evaluate(el => el.textContent, item);
    if (text.toLowerCase().includes('daily program') || text.toLowerCase().includes('events')) {
      await item.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'kiosk_module.png' });
  const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log('KIOSK HTML LENGTH AFTER CLICK:', rootHtml.length);
  await browser.close();
})();
