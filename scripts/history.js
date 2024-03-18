const triggerAllTab = document.querySelectorAll('#pills-all-tab')
triggerAllTab.forEach(triggerEl => {
  const tabTrigger = new bootstrap.Tab(triggerEl)

  triggerEl.addEventListener('click', event => {
    event.preventDefault()
    tabTrigger.show()
  })
})

const triggerBlockedTab = document.querySelectorAll('#pills-blocked-tab')
triggerBlockedTab.forEach(triggerEl => {
  const tabTrigger = new bootstrap.Tab(triggerEl)

  triggerEl.addEventListener('click', event => {
    event.preventDefault()
    tabTrigger.show()
  })
})

const triggerFavouritedTab = document.querySelectorAll('#pills-favourited-tab')
triggerFavouritedTab.forEach(triggerEl => {
  const tabTrigger = new bootstrap.Tab(triggerEl)

  triggerEl.addEventListener('click', event => {
    event.preventDefault()
    tabTrigger.show()
  })
})


function displayCardsDynamically(collection, sub_collection) {
  let cardTemplate = document.getElementById("pastActivityTemplate"); // Retrieve the HTML element with the ID "pastActivityTemplate" and store it in the cardTemplate variable.
  console.log("inside displayCardsDynamically");
  db.collection(collection).get()   //the collection called "users"
    .then(pastActivities => {
      console.log("inside displayCardsDynamically --> db....get().then()");
      pastActivities.forEach(doc => { //iterate thru each doc
        var pastActivitiesData = doc.data()[sub_collection];
        if (pastActivitiesData && pastActivitiesData.activityID) {    // check if
          var title = pastActivitiesData.activityID;     // get value of the "activityID" key
          var date = pastActivitiesData.date;  // get value of the "date" key
          var docID = doc.id;
          let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.
          //update title and date
          newcard.querySelector('.card-title').innerHTML = title;
          newcard.querySelector('.card-date').innerHTML = date;
          newcard.querySelector('a').href = "pastactivity.html?docID=" + docID;
  
          var isBlocked = pastActivitiesData.block;
          var isFavourite = pastActivitiesData.favourite;
  
          //attach to gallery
          document.getElementById("pills-all").appendChild(newcard);
          if (isBlocked) {
            document.getElementById("blocked-all").appendChild(newcard);
          }
          else if (isFavourite) {
            document.getElementById("favourited-all").appendChild(newcard);
          }
  
        } else {
          console.error("Missing activityID in past_activities data:", doc.id);
        }
      })
    })
    .catch(error => {
      console.error("Error getting documents: ", error);
    });
}

displayCardsDynamically("users", "past_activities");  //input param is the name of the collection