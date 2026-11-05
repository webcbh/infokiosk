const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log(rootHtml.slice(0, 500));
  await browser.close();
})();
