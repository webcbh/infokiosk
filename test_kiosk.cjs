const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('KIOSK CONSOLE:', msg.text()));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Click on "Daily Program" module
  const items = await page.$$('.group');
  for (const item of items) {
    const text = await page.evaluate(el => el.textContent, item);
    if (text.toLowerCase().includes('daily program')) {
      await item.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  const dpHtml = await page.evaluate(() => {
     return document.body.innerText;
  });
  
  console.log('--- PAGE TEXT ---');
  console.log(dpHtml);
  
  await browser.close();
})();
