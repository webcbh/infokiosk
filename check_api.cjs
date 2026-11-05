(async () => {
  const res = await fetch("http://localhost:3000/api/config");
  const data = await res.json();
  console.log("H1 Daily Program:", JSON.stringify(data.hotels[0].content.dailyProgram, null, 2));
})();
