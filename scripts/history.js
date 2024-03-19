// const triggerAllTab = document.querySelectorAll('#pills-all-tab')
// triggerAllTab.forEach(triggerEl => {
//   const tabTrigger = new bootstrap.Tab(triggerEl)

//   triggerEl.addEventListener('click', event => {
//     event.preventDefault()
//     tabTrigger.show()
//   })
// })

// const triggerBlockedTab = document.querySelectorAll('#pills-blocked-tab')
// triggerBlockedTab.forEach(triggerEl => {
//   const tabTrigger = new bootstrap.Tab(triggerEl)

//   triggerEl.addEventListener('click', event => {
//     event.preventDefault()
//     tabTrigger.show()
//   })
// })

// const triggerFavouritedTab = document.querySelectorAll('#pills-favourited-tab')
// triggerFavouritedTab.forEach(triggerEl => {
//   const tabTrigger = new bootstrap.Tab(triggerEl)

//   triggerEl.addEventListener('click', event => {
//     event.preventDefault()
//     tabTrigger.show()
//   })
// })


// function displayCardsDynamically(collection, sub_collection) {
//   let cardTemplate = document.getElementById("pastActivityTemplate"); // Retrieve the HTML element with the ID "pastActivityTemplate" and store it in the cardTemplate variable.
//   console.log("inside displayCardsDynamically");
//   db.collection(collection).get()   //the collection called "users"
//     .then(pastActivities => {
//       console.log("inside displayCardsDynamically --> db....get().then()");
//       pastActivities.forEach(doc => { //iterate thru each doc
//         var pastActivitiesData = doc.data()[sub_collection];
//         if (pastActivitiesData && pastActivitiesData.activityID) {    // check if
//           var title = pastActivitiesData.activityID;     // get value of the "activityID" key
//           var date = pastActivitiesData.date;  // get value of the "date" key
//           var docID = doc.id;
//           let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.
//           //update title and date
//           newcard.querySelector('.card-title').innerHTML = title;
//           newcard.querySelector('.card-date').innerHTML = date;
//           newcard.querySelector('a').href = "pastactivity.html?docID=" + docID;

//           var isBlocked = pastActivitiesData.block;
//           var isFavourite = pastActivitiesData.favourite;

//           //attach to gallery
//           document.getElementById("pills-all").appendChild(newcard);
//           if (isBlocked) {
//             document.getElementById("blocked-all").appendChild(newcard);
//           }
//           else if (isFavourite) {
//             document.getElementById("favourited-all").appendChild(newcard);
//           }

//         } else {
//           console.error("Missing activityID in past_activities data:", doc.id);
//         }
//       })
//     })
//     .catch(error => {
//       console.error("Error getting documents: ", error);
//     });
// }

// displayCardsDynamically("users", "past_activities");  //input param is the name of the collection



function displayActivityInfo() {
  let params = new URL(window.location.href); //get URL of search bar
  let ID = params.searchParams.get("docID"); //get value for key "id"
  console.log(ID);

  // doublecheck: is your collection called "Reviews" or "reviews"?
  db.collection("reviews")
    .doc(ID)
    .get()
    .then(doc => {
      thisActivity = doc.data();
      //hikeCode = thisHike.code;
      ActivityName = doc.data().activityID;

      // only populate title, and image
      document.getElementById("activityName").innerHTML = activityName;
      // let imgEvent = document.querySelector(".hike-img");
      // imgEvent.src = "./images/" + hikeCode + ".jpg";
    });
}
displayActivityInfo();

function saveActivityDocumentIDAndRedirect() {
  let params = new URL(window.location.href) //get the url from the search bar
  let ID = params.searchParams.get("docID");
  localStorage.setItem('activityDocID', ID);
  window.location.href = 'review.html';
}


function populatePastActivities() {
  let activityCardTemplate = document.getElementById("activityCardTemplate");
  let activityCardGroup = document.getElementById("activityCardGroup");

  let params = new URL(window.location.href); // Get the URL from the search bar
  let activityID = params.searchParams.get("docID");

  // Double-check: is your collection called "Reviews" or "reviews"?
  db.collection("reviews")
    .where("activityDocID", "==", activityID)
    .get()
    .then((allPastActivities) => {
      let activities = allPastActivities.docs;
      console.log(activities);
      activities.forEach((doc) => {
        // var title = doc.data().title;
        // var level = doc.data().level;
        // var season = doc.data().season;
        // var description = doc.data().description;
        // var flooded = doc.data().flooded;
        // var scrambled = doc.data().scrambled;
        // var time = doc.data().timestamp.toDate();
        // var rating = doc.data().rating; // Get the rating value
        var name = doc.data().activityID;
        var time = doc.data().timestamp.toDate();
        console.log(name)

        console.log(time);

        let pastActivityCard = activityCardTemplate.content.cloneNode(true);
        pastActivityCard.querySelector("#activityName").innerHTML = name;
        pastActivityCard.querySelector("#time").innerHTML = new Date(
          time
        ).toLocaleString();
        // pastActivityCard.querySelector(".level").innerHTML = `Level: ${level}`;
        // pastActivityCard.querySelector(".season").innerHTML = `Season: ${season}`;
        // pastActivityCard.querySelector(".scrambled").innerHTML = `Scrambled: ${scrambled}`;
        // pastActivityCard.querySelector(".flooded").innerHTML = `Flooded: ${flooded}`;
        // pastActivityCard.querySelector(".description").innerHTML = `Description: ${description}`;

        // Populate the star rating based on the rating value

        // Initialize an empty string to store the star rating HTML
        let starRating = "";
        // This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
        for (let i = 0; i < rating; i++) {
          starRating += '<span class="material-icons">star</span>';
        }
        // After the first loop, this second loop runs from i=rating to i<5.
        for (let i = rating; i < 5; i++) {
          starRating += '<span class="material-icons">star_outline</span>';
        }
        pastActivityCard.querySelector(".star-rating").innerHTML = starRating;

        activityCardGroup.appendChild(pastActivityCard);
      });
    });
}

populatePastActivities();