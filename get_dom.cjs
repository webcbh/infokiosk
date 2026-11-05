const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
const fs = require('fs');

(async function() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });
  
  const protocol = await CDP({ port: chrome.port });
  const { Page, Runtime, DOM } = protocol;
  
  await Promise.all([Page.enable(), Runtime.enable(), DOM.enable()]);
  
  await Page.navigate({ url: 'http://localhost:8081/' });
  
  await new Promise(r => setTimeout(r, 4000));
  
  const result = await Runtime.evaluate({
    expression: `
      (function() {
        function getPath(element) {
          const path = [];
          let current = element;
          while (current && current !== document.body && current !== document.documentElement) {
            let tag = current.tagName.toLowerCase();
            if (current.id) tag += '#' + current.id;
            let nth = 1;
            let sibling = current.previousElementSibling;
            while (sibling) {
              if (sibling.tagName === current.tagName) nth++;
              sibling = sibling.previousElementSibling;
            }
            path.unshift(tag + ':nth-of-type(' + nth + ')');
            current = current.parentElement;
          }
          return path.join(' > ');
        }
        
        const selectors = [
          "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > button:nth-of-type(1) > span:nth-of-type(1)",
          "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1)",
          "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2)",
          "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1)",
          "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)"
        ];
        
        let out = [];
        selectors.forEach((sel, i) => {
           const el = document.querySelector(sel);
           out.push('Selector ' + (i+1) + ': ' + (el ? el.outerHTML : 'NOT FOUND'));
           if (el) {
              out.push('  Parent classes: ' + el.parentElement.className);
           }
        });
        return out.join('\\n');
      })()
    `
  });
  
  console.log(result.result.value);
  
  await protocol.close();
  await chrome.kill();
})();
