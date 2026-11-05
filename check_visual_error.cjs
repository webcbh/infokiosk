const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  const rootHtmlAdmin = await page.evaluate(() => document.getElementById('root').innerHTML);
  if (rootHtmlAdmin.includes('Something went wrong.')) {
      console.log('ADMIN CRASHED:', rootHtmlAdmin);
  }
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const rootHtmlKiosk = await page.evaluate(() => document.getElementById('root').innerHTML);
  if (rootHtmlKiosk.includes('Something went wrong.')) {
      console.log('KIOSK CRASHED:', rootHtmlKiosk);
  }

  await browser.close();
})();
