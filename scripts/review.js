let params = new URL(window.location.href) //get the url from the search bar
let activityDocID = params.searchParams.get("docID");

function getActivityName(id) {
  console.log("id:",id)
  
  // Get the document for the current user.
  db.collection("reviews") //giving the error !!!
    .doc(id)
    .get()
    .then((thisActivity) => {
      var activityName = thisActivity.data().activityID;
      console.log("activityName: ", activityName)
      document.getElementById("activityName").innerHTML = activityName;
    });
}

getActivityName(activityDocID);


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
  let reviewTitle = document.getElementById("title").value;
  let reviewDescription = document.getElementById("description").value;

  // Get the star rating
  // Get all the elements with the class "star" and store them in the 'stars' variable
  const stars = document.querySelectorAll('.star');
  // Initialize a variable 'activityRating' to keep track of the rating count
  let activityRating = 0;
  // Iterate through each element in the 'stars' NodeList using the forEach method
  stars.forEach((star) => {
    // Check if the text content of the current 'star' element is equal to the string 'star'
    if (star.textContent === 'star') {
      // If the condition is met, increment the 'activityRating' by 1
      activityRating++;
    }
  });

  console.log(reviewTitle, reviewDescription, activityRating);

  var user = firebase.auth().currentUser;
  if (user) {
    var currentUser = db.collection("users").doc(user.uid);
    var userID = user.uid;

    // Get the document for the current user.
    db.collection("reviews").add({
      title: reviewTitle,
      description: reviewDescription,
      stars: activityRating, // Include the rating in the review
    })
  } else {
    console.log("No user is signed in");
    window.location.href = 'review.html';
  }
}

function blockActivity() { //still need to ask for confirmation and show hange once an activity is blocked
  var user = firebase.auth().currentUser;
  if (user) {
    var currentUser = db.collection("users").doc(user.uid);
    var userID = user.uid;

    // Get the document for the current user.
    db.collection("reviews").add({
      block: true,
    })
  } else {
    console.log("No user is signed in");
    window.location.href = 'review.html';
  }
}