const { JSDOM } = require('jsdom');
const http = require('http');

JSDOM.fromURL("http://localhost:3000/", {
  runScripts: "dangerously",
  resources: "usable"
}).then(dom => {
  setTimeout(() => {
    const doc = dom.window.document;
    const selectors = [
      "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > button:nth-of-type(1) > span:nth-of-type(1)",
      "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1)",
      "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(2)",
      "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1)",
      "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)"
    ];
    
    console.log("=== DOM QUERY RESULTS ===");
    selectors.forEach((sel, i) => {
      const el = doc.querySelector(sel);
      console.log(`Selector ${i+1}:`, el ? el.outerHTML : 'NOT FOUND');
      if (el) {
        console.log(`Parent class:`, el.parentElement.className);
      }
    });
    console.log("=========================");
    process.exit(0);
  }, 2000);
}).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
