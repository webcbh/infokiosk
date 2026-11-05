const { JSDOM } = require('jsdom');
const fs = require('fs');

JSDOM.fromFile("dist/index.html", {
  runScripts: "dangerously",
  resources: "usable",
  url: "file://" + process.cwd() + "/dist/index.html"
}).then(dom => {
  setTimeout(() => {
    const document = dom.window.document;
    function getPath(element) {
      const path = [];
      let current = element;
      while (current && current !== document.body) {
        let tag = current.tagName.toLowerCase();
        if (current.id) tag += `#${current.id}`;
        let nth = 1;
        let sibling = current.previousElementSibling;
        while (sibling) {
          if (sibling.tagName === current.tagName) nth++;
          sibling = sibling.previousElementSibling;
        }
        path.unshift(`${tag}:nth-of-type(${nth})`);
        current = current.parentElement;
      }
      return path.join(" > ");
    }
    const spans = document.querySelectorAll("button > span");
    console.log("FOUND BUTTON > SPAN:", spans.length);
    spans.forEach(span => console.log(getPath(span)));
    process.exit(0);
  }, 2000);
});
