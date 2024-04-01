// let params = new URL(window.location.href) //get the url from the search bar
// let activityDocID = params.searchParams.get("docID");

var selectedActivity = localStorage.getItem('selectedActivity');
console.log('Selected activity from previous page:', selectedActivity);

function getActivityName(id) {
  console.log("id:", id)
  activityName.innerHTML = id + "!";
  // // Get the document for the current user.
  // db.collection("reviews")
  //   .doc(id)
  //   .get()
  //   .then((thisActivity) => {
  //     var activityName = thisActivity.data().activityID;
  //     console.log("activityName: ", activityName)
  //     document.getElementById("activityName").innerHTML = activityName;
  //   });
}
getActivityName(selectedActivity);


function displayCardsDynamically() {
  let messageCardTemplate = document.getElementById("messageCardTemplate");
  let messageCardGroup = document.getElementById("messageCardGroup");

  // Check if user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("chats")
        .doc(selectedActivity)
        .collection(entries)
        .doc()
        //.where("userID", "==", user.uid) // Filter reviews by user ID
        .onSnapshot((activityMessages) => {
          // Clear existing cards before updating
          messageCardGroup.innerHTML = '';
          activityMessages.forEach((doc) => {
            let activityName = doc.data().activityID;
            let activityDate = doc.data().date.toDate();
            let docID = doc.id;
            localStorage.setItem('reviewsDocID', docID);

            // Clone template and populate with data
            let newcard = messageCardTemplate.content.cloneNode(true);
            newcard.querySelector(".card-title").textContent = activityName;
            newcard.querySelector(".card-text").textContent = activityDate.toLocaleString(); // to display the date
            newcard.querySelector("a").href = "review.html?docID=" + docID;
            messageCardGroup.appendChild(newcard);
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