const { JSDOM } = require('jsdom');
JSDOM.fromURL("http://localhost:8081/", {
  runScripts: "dangerously",
  resources: "usable"
}).then(dom => {
  setTimeout(() => {
    const document = dom.window.document;
    console.log(document.body.innerHTML.substring(0, 500));
    process.exit(0);
  }, 2000);
});
