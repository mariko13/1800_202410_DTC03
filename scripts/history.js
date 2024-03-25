function displayCardsDynamically() {
  let activityCardTemplate = document.getElementById("activityCardTemplate");
  let activityCardGroup = document.getElementById("activityCardGroup");

  // Check if user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // Query Firestore for reviews related to the logged-in user
      db.collection("reviews")
        .where("userID", "==", user.uid) // Filter reviews by user ID
        .get()
        .then((usersPastActivities) => {
          usersPastActivities.forEach((doc) => {
            let activityName = doc.data().activityID;
            let activityDate = doc.data().date.toDate();
            let docID = doc.id;

            // Clone template and populate with data
            let newcard = activityCardTemplate.content.cloneNode(true);
            newcard.querySelector(".card-title").textContent = activityName;
            newcard.querySelector(".card-text").textContent = activityDate.toLocaleString(); // to display the date
            newcard.querySelector("a").href = "review.html?docID=" + docID;
            activityCardGroup.appendChild(newcard);
          });
        })
        .catch((error) => {
          console.log("Error getting past activities: ", error);
        });
    } else {
      console.log("No user logged in.");
    }
  });
}

displayCardsDynamically();