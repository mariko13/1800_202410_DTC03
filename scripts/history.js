function displayCardsDynamically() {
  let activityCardTemplate = document.getElementById("activityCardTemplate");
  let activityCardGroup = document.getElementById("activityCardGroup");

  // Check if user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("reviews")
        .where("userID", "==", user.uid) // Filter reviews by user ID
        .onSnapshot((usersPastActivities) => {
          // Clear existing cards before updating
          activityCardGroup.innerHTML = '';
          usersPastActivities.forEach((doc) => {
            let activityName = doc.data().activityID;
            let activityDate = doc.data().date.toDate();
            let docID = doc.id;
            localStorage.setItem('reviewsDocID', docID);

            // Clone template and populate with data
            let newcard = activityCardTemplate.content.cloneNode(true);
            newcard.querySelector(".card-title").textContent = activityName;
            newcard.querySelector(".card-text").textContent = activityDate.toLocaleString(); // to display the date
            newcard.querySelector("a").href = "review.html?docID=" + docID;

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