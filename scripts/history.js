// Dynamically populate history page with past activity cards
function displayCardsDynamically() {
  let activityCardTemplate = document.getElementById("activityCardTemplate");
  let activityCardGroup = document.getElementById("activityCardGroup");

  // Check if user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // Access "reviews" collection where the userID field matches user.uid onSnapshot
      db.collection("reviews")
        .where("userID", "==", user.uid) // Filter reviews by user ID
        .onSnapshot((usersPastActivities) => {
          // Clear existing cards before updating
          activityCardGroup.innerHTML = '';
          console.log("usersPastActivities.empty:", usersPastActivities.empty);
          // If there is no past activities, display this text to users instead
          if (usersPastActivities.empty) {
            activityCardGroup.innerHTML = "<p class='text-center pt-12 px-3'>Your past activities will appear here.<br>Go to the home page and click the <i>Mingle!</i> button to start!</p>";
          }
          // Loop through the past activities
          usersPastActivities.forEach((doc) => {
            let activityName = doc.data().activityID;
            let activityDate = doc.data().date.toDate();
            let docID = doc.id;
            localStorage.setItem('reviewsDocID', docID);

            // Clone template and populate with data
            let newcard = activityCardTemplate.content.cloneNode(true);
            newcard.querySelector(".card-title").textContent = activityName;
            newcard.querySelector(".card-text").textContent = activityDate.toLocaleString();
            newcard.querySelector("a").href = "review.html?docID=" + docID;

            // Access the document within the "activities" collection with the doc.id activityName
            db.collection("activities")
              .doc(activityName)
              .get()
              .then((activityDoc) => {
                let activityImage = activityDoc.data().image;
                newcard.querySelector(".activity-image").src = `./images/${activityImage}`;
                activityCardGroup.appendChild(newcard);
              })

          });
        }, (error) => {
          console.log("Error getting past activities: ", error);
        });
    } else {
      console.log("No user logged in.");
    }
  });
}

displayCardsDynamically();