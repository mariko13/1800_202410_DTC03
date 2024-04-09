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
        .onSnapshot((activityMessages) => {
          console.log("inside db in displayCardsDynamically")
          messageCardGroup.innerHTML = '';
          console.log("activityMessages.empty:", activityMessages.empty);
          if (activityMessages.empty) {
            messageCardGroup.innerHTML = "<p class='text-center pt-12 px-3'>Be the first to leave a message!</p>";
          }
          activityMessages.forEach((doc) => {
            console.log("doc id: ", doc.id);
            let message = doc.data().message;
            let date = doc.data().timestamp.toDate().toLocaleString();
            let name = doc.data().userName;
            let profilePic = doc.data().userProfilePic;

            console.log("profilepic:", profilePic)

            let newcard = messageCardTemplate.content.cloneNode(true);

            newcard.querySelector(".card-date").textContent = date
            newcard.querySelector(".card-text").textContent = message;
            newcard.querySelector(".card-title").textContent = name;
            newcard.querySelector(".profilePic").src = profilePic;
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



function sendMessage() {
  console.log("inside send message");
  let usersMessage = document.getElementById("message").value;

  console.log(usersMessage);

  var user = firebase.auth().currentUser;
  if (user) {
    let usersName = "";
    let usersProfilePic = "images/MoodMingleLogoCircle.png";
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        usersName = doc.data().name;

        let userPosts = doc.data().myposts;
        if (userPosts && userPosts.length > 0) {
          let lastPostID = userPosts[userPosts.length - 1]; // Get the last post ID
          db.collection("posts")
            .doc(lastPostID)
            .get()
            .then(picDoc => {
              usersProfilePic = picDoc.data().image;
              console.log("name in posts", usersName);
              console.log("pic in posts", usersProfilePic);

              db.collection("chats")
                .doc(selectedActivity)
                .collection("entries")
                .add({
                  userID: user.uid,
                  message: usersMessage,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  userName: usersName,
                  userProfilePic: usersProfilePic
                }).then(() => {
                  message.value = "";
                });

            }).catch(error => {
              console.error("Error getting last post:", error);
            });
        }
      });
  } else {
    console.log("No user is signed in");
    window.location.href = 'index.html';
  }
}