(async () => {
  const res = await fetch("http://localhost:3000/api/config");
  const data = await res.json();
  const h1 = data.hotels[0];
  h1.content.modules.forEach(m => {
     console.log(m.id, m.title, m.templateId);
  });
})();
