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


function populateReviewFields() {
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
        confirm("confirm!!");
        // console.log("in modal");
        // const modalElement = document.getElementById('confirmReviewChangeModal');
        // const confirmReviewChangeModal = new bootstrap.Modal(modalElement);

        // // Access modal elements and set their content
        // const modalTitle = modalElement.querySelector('.modal-title');
        // const modalBody = modalElement.querySelector('.modal-body');

        // // Set modal title and body content
        // modalTitle.textContent = "Changes Confirmed";
        // modalBody.textContent = "Your review has been successfully updated!";

        // // Show the modal
        // confirmReviewChangeModal.show();
      });
  } else {
    console.log("No user is signed in");
    window.location.href = 'index.html';
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
