// Import the necessary modules
const express = require("express");
const app = express();
const port = 3000;
const MongoClient = require("mongodb").MongoClient;
const path = require("path");

// Set the view engine to EJS for rendering views
app.set("view engine", "ejs");
// Set the views directory path
app.set("views", "../frontend/views");
// Serve static files (CSS, JS, images) from the "public" directory
app.use(
  express.static("../frontend/public");
);
// Middleware to parse JSON bodies in POST requests
app.use(express.json()); 

// Connect to the MongoDB database
MongoClient.connect("mongodb+srv://FlickFinder:flickfinder@movielist.zqckg.mongodb.net/", {
  useNewUrlParser: true, // Use the new URL parser (a safer and more flexible way of parsing MongoDB connection strings)
  useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
})
  .then((client) => {
    console.log("Connected to Database");
    // Assign the connected database to a global variable `db`
    db = client.db("MRS");
  })
  .catch((error) => console.error(error));

// Serve the home page when a GET request is made to the root URL "/"
app.get("/", (req, res) => {
  res.render("index");
});

// Handle the POST request to the root URL "/"
app.post("/", async (req, res) => {
  // Get the "Movies" collection from the database
  const collection = db.collection("Movies");
  // Initialize an array to store query results
  const results = [];
  // Extract the genres/requirements from the request body
  const requirment = req.body.query;

  // Loop through each genre in the requirement array
  for (let i = 0; i < requirment.length; i++) {
    // Fetch movies that match the genre (using regex) and store them in the results array
    results.push(
      await collection.find({ Genre: { $regex: `${requirment[i]}` } }).toArray()
    );
  }

  // Initialize a Map to count the occurrence of each movie
  for (const arr of results) {
    var map = new Map();
    // Loop through each movie in the current results array
    for (const element of arr) {
      let x = 0;
      // Count how many times the movie's genre matches the requirements
      for (const key of requirment) {
        if (element.Genre.includes(`${key}`)) {
          x++;
        }
      }
      // Store the movie in the Map with the count of matches
      map.set(element, x);
    }
  }

  // Sort the entries in the map by the count (descending order)
  const sortedEntries = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
  // Get the top 20 movies and add them to the final array
  const final = await getFinal(sortedEntries);

  // Sort the final array by Count (primary) and Rating (secondary)
  final.sort((a, b) => {
    if (a.Count !== b.Count) {
      return b.Count - a.Count;
    } else {
      return b.Rating - a.Rating;
    }
  });

  // Send the final sorted movie data back to the client
  res.send(final);
});

// Handle the GET request to "/result"
app.get("/result", async (req, res) => {
  // Retrieve the data parameter from the query string
  const data = req.query.data;
  if (data) {
    const decodedData = decodeURIComponent(data); // Decode the URI component
    const arr = JSON.parse(decodedData); // Parse the JSON string into an array
    var final = await sendData(arr); // Send the data to the backend and get the result

    // Render the "result" view with the final data
    res.render("result", { data: final });
  } else {
    console.error("No data parameter found in the URL");
    res.status(400).send("No data parameter found"); // Return an error if no data parameter is provided
  }
});

// Function to get the top 20 sorted movie entries
function getFinal(sortedEntries) {
  let final1 = []; // Initialize an array to hold the final result
  let q = 0;
  sortedEntries.forEach((value, key) => {
    q++;
    if (q > 20) {
      return; // Stop adding to the final array after 20 entries
    }
    key["Count"] = value; // Add the count value to the movie object
    final1.push(key); // Add the movie object to the final array
  });
  return final1;
}

// Function to send a POST request with the query data and return the response data
async function sendData(a) {
  try {
    const response = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Set the content type to JSON
      body: JSON.stringify({ query: a }), // Send the query data as JSON in the body
    });
    if (!response.ok) {
      throw new Error("Network response was not ok"); // Throw an error if the response status is not ok
    }
    const data = await response.json(); // Parse the response JSON
    return data; // Return the parsed data
  } catch (error) {
    console.error("Error:", error); // Log any errors that occur
  }
}

// Start the Express server and listen on port 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
