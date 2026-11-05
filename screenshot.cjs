const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'kiosk.png' });
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'admin.png' });
  
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
  
  await page.screenshot({ path: 'admin_edit_module.png', fullPage: true });

  await browser.close();
  console.log('Screenshots saved.');
})();
