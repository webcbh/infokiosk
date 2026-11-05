fetch("http://localhost:3000/api/config")
  .then(res => res.json())
  .then(data => {
    const d = data.hotels[0].content.modules.find(m => m.title.includes('Directory'));
    console.log("Template ID:", d.templateId, "Layout:", d.layout);
  })
