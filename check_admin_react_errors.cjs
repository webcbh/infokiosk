const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  
  // click on hotels tab
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Hotel Directory')) {
      await btn.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  // click on a hotel "Edit Hotel" button
  const editBtns = await page.$$('button');
  for (const btn of editBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Edit Hotel')) {
      await btn.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  // click on "Edit Module"
  const modBtns = await page.$$('button');
  for (const btn of modBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Edit Module')) {
      await btn.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
  if (rootHtml.length < 500) {
      console.log('BLANK HTML:', rootHtml);
  }

  await browser.close();
})();
