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
  
  // hover on template selector items
  const items = await page.$$('.group');
  if (items.length > 0) {
      console.log('Hovering over item...');
      await items[0].hover();
      await new Promise(r => setTimeout(r, 1000));
  } else {
      console.log('No .group items found for hover.');
  }
  
  const rootHtml = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log('ADMIN EDIT MODULE HTML LENGTH (AFTER HOVER):', rootHtml.length);
  
  await browser.close();
})();
