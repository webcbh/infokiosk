(async () => {
  const res = await fetch("http://localhost:3000/api/config");
  const data = await res.json();
  const h1 = data.hotels[0];
  const m6 = h1.content.modules.find(m => m.id === "m6");
  console.log("Module m6 Title:", m6.title, m6.templateId);
})();
