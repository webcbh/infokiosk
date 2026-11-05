(async () => {
  const res = await fetch("http://localhost:3000/api/config");
  const data = await res.json();
  data.hotels.forEach(h => {
     console.log(h.id, h.name, "Daily Program Days:", h.content.dailyProgram ? h.content.dailyProgram.length : 0);
     if (h.content.dailyProgram) {
         h.content.dailyProgram.forEach(d => console.log(" - ", d.title, d.date));
     }
  });
})();
