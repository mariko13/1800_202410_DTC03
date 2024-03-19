var hikeDocID = localStorage.getItem("hikeDocID");    //visible to all functions on this page

function getHikeName(id) {
  db.collection("hikes")
    .doc(id)
    .get()
    .then((thisHike) => {
      var hikeName = thisHike.data().name;
      document.getElementById("hikeName").innerHTML = hikeName;
    });
}

getHikeName(hikeDocID);


// Add this JavaScript code to make stars clickable

// Select all elements with the class name "star" and store them in the "stars" variable
const stars = document.querySelectorAll('.star');

// Iterate through each star element
stars.forEach((star, index) => {
  // Add a click event listener to the current star
  star.addEventListener('click', () => {
    // Fill in clicked star and stars before it
    for (let i = 0; i <= index; i++) {
      // Change the text content of stars to 'star' (filled)
      document.getElementById(`star${i + 1}`).textContent = 'star';
    }
  });
});


function writeReview() {
  console.log("inside write review");
  let hikeTitle = document.getElementById("title").value;
  let hikeLevel = document.getElementById("level").value;
  let hikeSeason = document.getElementById("season").value;
  let hikeDescription = document.getElementById("description").value;
  let hikeFlooded = document.querySelector('input[name="flooded"]:checked').value;
  let hikeScrambled = document.querySelector('input[name="scrambled"]:checked').value;

  // Get the star rating
  // Get all the elements with the class "star" and store them in the 'stars' variable
  const stars = document.querySelectorAll('.star');
  // Initialize a variable 'hikeRating' to keep track of the rating count
  let hikeRating = 0;
  // Iterate through each element in the 'stars' NodeList using the forEach method
  stars.forEach((star) => {
    // Check if the text content of the current 'star' element is equal to the string 'star'
    if (star.textContent === 'star') {
      // If the condition is met, increment the 'hikeRating' by 1
      hikeRating++;
    }
  });

  console.log(hikeTitle, hikeLevel, hikeSeason, hikeDescription, hikeFlooded, hikeScrambled, hikeRating);

  var user = firebase.auth().currentUser;
  if (user) {
    var currentUser = db.collection("users").doc(user.uid);
    var userID = user.uid;

    // Get the document for the current user.
    db.collection("reviews").add({
      hikeDocID: hikeDocID,
      userID: userID,
      title: hikeTitle,
      level: hikeLevel,
      season: hikeSeason,
      description: hikeDescription,
      flooded: hikeFlooded,
      scrambled: hikeScrambled,
      rating: hikeRating, // Include the rating in the review
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      window.location.href = "thanks.html"; // Redirect to the thanks page
    });
  } else {
    console.log("No user is signed in");
    window.location.href = 'review.html';
  }
}