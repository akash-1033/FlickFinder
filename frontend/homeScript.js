// Add an event listener to the form with the ID "genresForm" to handle the submit event
document.getElementById("genresForm").addEventListener("submit", (e) => {
  // Initialize an empty array to store the selected genres
  let a = [];

  // Prevent the default form submission behavior (which would reload the page)
  e.preventDefault();

  // Select all checked checkboxes with the name "genre"
  const checkedBoxes = document.querySelectorAll('input[name="genre"]:checked');

  // Loop through each checked checkbox and push its value (the genre) into the array `a`
  for (let ch of checkedBoxes) {
    a.push(ch.value);
  }

  // Encode the array `a` into a URI-safe string so it can be safely sent as a URL parameter
  const encodedArray = encodeURIComponent(JSON.stringify(a));

  // Construct the URL with the encoded array as a query parameter
  const url = `/result/?data=${encodedArray}`;

  // Redirect the browser to the constructed URL, which will trigger the GET request to "/result"
  window.location.href = url;
});
