const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Hotel Directory')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  const editBtns = await page.$$('button');
  for (const btn of editBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Edit Hotel')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log(rootHtml);
  await browser.close();
})();
