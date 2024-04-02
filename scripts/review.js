let params = new URL(window.location.href) //get the url from the search bar
let activityDocID = params.searchParams.get("docID");

function getActivityName(id) {
  console.log("id:", id)
  // Get the document for the current user.
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


function populateReviewFields() {
  submitConfirmation.innerHTML = "";
  firebase.auth().onAuthStateChanged(user => { //authenticated user
    // Check if user is signed in:
    if (user) {
      //get the document for review.
      db.collection("reviews")
        .doc(activityDocID)
        .get()
        .then(currentReviews => { // .then so we wait until .get() reads everything that we want
          //get the data fields of the user
          let reviewTitle = currentReviews.data().title;
          let reviewDescription = currentReviews.data().description;
          let rating = currentReviews.data().stars;
          console.log("title:", reviewTitle)
          console.log("description:", reviewDescription)
          console.log("rating:", rating)

          //if the data fields are not empty, then write them in to the form.
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
        })
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}
populateReviewFields()


function writeReview() {
  submitConfirmation.innerHTML = "";
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
    // Get the document for the current activity review.
    db.collection("reviews")
      .doc(activityDocID)
      .update({
        title: reviewTitle,
        description: reviewDescription,
        stars: activityRating, // Include the rating in the review
      }).then(() => {
        submitConfirmation.innerHTML = "Your review has been submitted!";
      });
  } else {
    console.log("No user is signed in");
    window.location.href = 'index.html';
  }
}

function updateBlockActivity() {
  var user = firebase.auth().currentUser;
  if (user) {
    db.collection("reviews")
      .doc(activityDocID)
      .get()
      .then((thisActivity) => {
        var activityID = thisActivity.data().activityID;

        let currentUser = db.collection("users").doc(user.uid);
        // Get the document for the current user.
        currentUser.get().then((doc) => {
          let currentBlocks = doc.data().blocks;
    
          console.log("currentBlocks: ", currentBlocks);
          console.log("activityID: ", activityID);
          console.log("currentBlocks.includes(activityID): ", currentBlocks.includes(activityID))
          if (currentBlocks.includes(activityID)) {
            console.log("inside unblock");
            currentUser.update({
              blocks: firebase.firestore.FieldValue.arrayRemove(activityID)
            }).then(() => {
              blockBtn.innerText = "Unblock Activity";
              reviewForm.style.borderColor = "#540303";
            })
          }
          else {
            console.log("inside block");
            currentUser.update({
              blocks: firebase.firestore.FieldValue.arrayUnion(activityID)
            }).then(() => {
              blockBtn.innerText = "Block Activity";
              reviewForm.style.borderColor = "#F8D04F";
            })
          }
        })
      });
  } else {
    console.log("No user is signed in");
    window.location.href = 'login.html';
  }
}
