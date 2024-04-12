// Get the correct activity from local storage
var selectedActivity = localStorage.getItem('selectedActivity');
console.log('Selected activity from previous page:', selectedActivity);


// Write the correct activity name on the top navbar
function getActivityName(id) {
  console.log("id:", id)
  chatActivityName.innerHTML = id;
}
getActivityName(selectedActivity);


// Dynamically populate chat page with message cards
function displayCardsDynamically() {
  let messageCardTemplate = document.getElementById("messageCardTemplate");
  let messageCardGroup = document.getElementById("messageCardGroup");

  // Check if user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // Access the "entries" sub-collection within the "chats" collection with the correct doc.id ordered by timestamp onSnapshot
      db.collection("chats")
        .doc(selectedActivity)
        .collection("entries")
        .orderBy("timestamp")
        .onSnapshot((activityMessages) => {
          // Clear existing cards before updating
          messageCardGroup.innerHTML = '';
          console.log("activityMessages.empty:", activityMessages.empty);
          // If there is no existing messages, display this text to users instead
          if (activityMessages.empty) {
            messageCardGroup.innerHTML = "<p class='text-center pt-12 px-3'>Be the first to leave a message!</p>";
          }
          // Loop through the existing messages
          activityMessages.forEach((doc) => {
            console.log("doc id: ", doc.id);
            let message = doc.data().message;
            let date = doc.data().timestamp.toDate().toLocaleString();
            let name = doc.data().userName;
            let profilePic = doc.data().userProfilePic;

            console.log("profilepic:", profilePic)

            // Clone template and populate with data
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


// Adds new message to database
function sendMessage() {
  let usersMessage = document.getElementById("message").value;

  console.log(usersMessage);

  // Verify logged in user
  var user = firebase.auth().currentUser;
  if (user) {
    let usersName = "";
    let usersProfilePic = "images/MoodMingleLogoCircle.png";
    // Access correct document within "users" collection
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        usersName = doc.data().name;
        // Get the correct user profile picture from "posts" collection
        let userPosts = doc.data().myposts;
        // Check if the user has posts
        if (userPosts && userPosts.length > 0) {
          let lastPostID = userPosts[userPosts.length - 1]; // Get the last post ID
          // Access the correct document in the "posts" collection
          db.collection("posts")
            .doc(lastPostID)
            .get()
            .then(picDoc => {
              usersProfilePic = picDoc.data().image;
              console.log("name in posts", usersName);
              console.log("pic in posts", usersProfilePic);

              // Add a new document with the following fields to the "entries" sub-collection within the "chats" collection with the correct doc.id
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