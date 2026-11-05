const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  const items = await page.$$('.group');
  for (const item of items) {
    const text = await page.evaluate(el => el.textContent, item);
    if (text.toLowerCase().includes('daily program') || text.toLowerCase().includes('events')) {
      await item.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log('KIOSK HTML LENGTH:', rootHtml.length);
  if (rootHtml.length < 100) {
      console.log('BLANK HTML:', rootHtml);
  }

  await browser.close();
})();
