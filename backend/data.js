const fetch = require("node-fetch");
var data = require("./data.json");
const fs = require("fs");

for (let i = 600; i < data.length; i++) {
  console.log(data[i]["Name"]);
  const url1 = `https://www.omdbapi.com/?apikey=7f05b7e9&s=${data[i]["Name"]}`;
  const option = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };
  fetch(url1, option)
    .then((res) => res.json())
    .then((json) => {
      var id = json.Search[0].imdbID;
      const fetch = require("node-fetch");
      const url1 = `https://omdbapi.com/?apikey=7f05b7e9&i=${id}`;
      const option = {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      };
      fetch(url1, option)
        .then((res) => res.json())
        .then((json) => {
          filePath = "./abhash.json";
          const rawData = fs.readFileSync(filePath);
          var jsonData = JSON.parse(rawData);
          jsonData = Object.assign({}, jsonData[i], { Genre: json.Genre });
          fs.appendFileSync(
            "./data.json",
            JSON.stringify(jsonData, null, 2) + ","
          );
          console.log(jsonData);
        });
    })
    .catch((err) => {});
}
