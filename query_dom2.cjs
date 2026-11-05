const { JSDOM } = require('jsdom');

JSDOM.fromURL("http://localhost:3000/", {
  runScripts: "dangerously",
  resources: "usable"
}).then(dom => {
  setTimeout(() => {
    const doc = dom.window.document;
    console.log("Root content:", doc.getElementById('root').innerHTML.substring(0, 500));
    process.exit(0);
  }, 3000);
});
