// Get the url from the search bar
let params = new URL(window.location.href) 
// Get correct docID from search bar
let activityDocID = params.searchParams.get("docID");
var currentUser;


// Write the correct activity name on the top navbar
function getActivityName(id) {
  console.log("id:", id)
  // Access the correct document in the "reviews" collection
  db.collection("reviews")
    .doc(id)
    .get()
    .then((thisActivity) => {
      var activityName = thisActivity.data().activityID;
      console.log("activityName: ", activityName)
      document.getElementById("reviewActivityName").innerHTML = activityName;
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


// If a review for the specific user and activity already exists, populate the message fields with the data
function populateReviewFields() {
  firebase.auth().onAuthStateChanged(user => { //authenticated user
    // Check if user is signed in
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      // Access the correct document in the "reviews" collection
      db.collection("reviews")
        .doc(activityDocID)
        .get()
        .then(currentReviews => { 
          // Get the data fields of the user
          let reviewTitle = currentReviews.data().title;
          let reviewDescription = currentReviews.data().description;
          let rating = currentReviews.data().stars;
          console.log("title:", reviewTitle)
          console.log("description:", reviewDescription)
          console.log("rating:", rating)

          // If the data fields are not empty, then write them in to the form.
          if (reviewTitle != null) {
            document.getElementById("title").value = reviewTitle;
          }
          if (reviewDescription != null) {
            document.getElementById("description").value = reviewDescription;
          }
          if (rating != null) {
            stars.forEach(() => {
              // Fill in clicked star and stars before it
              for (let i = 0; i < rating; i++) {
                // Change the text content of stars to 'star' (filled)
                document.getElementById(`star${i + 1}`).textContent = 'star';
              }
            });
          }
        });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}
populateReviewFields()


// Write review to database
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

  // Verify logged in user
  var user = firebase.auth().currentUser;
  if (user) {
    // Update the fields in the correct document in the "reviews" collection
    db.collection("reviews")
      .doc(activityDocID)
      .update({
        title: reviewTitle,
        description: reviewDescription,
        stars: activityRating, // Include the rating in the review
      }).then(() => {
        // Store the Page activitydetails.html was Accessed From for Navigation
        localStorage.setItem('originOfActivityDetails', window.location.href);
        // Access the correct document in the "reviews" collection
        db.collection("reviews")
          .doc(activityDocID)
          .get()
          .then((doc) => {
            let activity = doc.data().activityID
            localStorage.setItem('selectedActivity', activity);
            // Redirect to the activities detail page after submit button is clicked
            window.location.href = 'activitydetails.html';
          })
      });
  } else {
    console.log("No user is signed in");
    window.location.href = 'index.html';
  }
}
