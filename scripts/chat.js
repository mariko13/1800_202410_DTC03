var selectedActivity = localStorage.getItem('selectedActivity');
console.log('Selected activity from previous page:', selectedActivity);

function getActivityName(id) {
  console.log("id:", id)
  chatActivityName.innerHTML = id;
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
        .collection("entries")
        .orderBy("timestamp")
        .limit(50)
        .onSnapshot((activityMessages) => {
          console.log("inside db in displayCardsDynamically")
          // Clear existing cards before updating
          messageCardGroup.innerHTML = '';
          activityMessages.forEach((doc) => {
            console.log("doc id: ", doc.id);
            let message = doc.data().message;

            let timestamp = doc.data().timestamp.toDate();
            console.log("timestamp: ", timestamp);
            let date = (timestamp.getMonth() + 1) + "/" + timestamp.getDate() + "/" + timestamp.getFullYear();
            let time = timestamp.getHours() + ":" + timestamp.getMinutes()
            date += " " + time;

            let newcard = messageCardTemplate.content.cloneNode(true);

            newcard.querySelector(".card-date").textContent = date
            newcard.querySelector(".card-text").textContent = message;

            let senderUserID = doc.data().userID;

            db.collection("users")
              .doc(senderUserID)
              .get()
              .then((sender) => {
                let senderName = sender.data().name;

                // let newcard = messageCardTemplate.content.cloneNode(true);
                
                newcard.querySelector(".card-title").textContent = senderName;
                // newcard.querySelector(".card-date").textContent = date
                // newcard.querySelector(".card-text").textContent = message;

                messageCardGroup.appendChild(newcard);
              });
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


function sendMessage() {
  console.log("inside send message");
  let usersMessage = document.getElementById("message").value;

  console.log(usersMessage);

  var user = firebase.auth().currentUser;
  if (user) {
    db.collection("chats")
      .doc(selectedActivity)
      .collection("entries")
      .add({
        userID: user.uid,
        message: usersMessage,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        message.value = "";
      })
  } else {
    console.log("No user is signed in");
    window.location.href = 'index.html';
  }
}