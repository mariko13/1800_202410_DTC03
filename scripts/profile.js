var currentUser;               //points to the document of the user who is logged in

function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                let userName = userDoc.data().name;
                let userAge = userDoc.data().age;
                let userGender = userDoc.data().gender;
                let userLocation = userDoc.data().location;
                console.log(userName);
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("name-goes-here").innerText = userName;
                document.getElementById("age-goes-here").innerText = userAge;
                document.getElementById("gender-goes-here").innerText = userGender;
                document.getElementById("location-goes-here").innerText = userLocation;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}

insertNameFromFirestore();

function insertPictureFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the last picture associated with the user's posts
                let userPosts = userDoc.data().myposts;
                if (userPosts && userPosts.length > 0) {
                    let lastPostID = userPosts[userPosts.length - 1]; // Get the last post ID
                    db.collection("posts").doc(lastPostID).get().then(picDoc => {
                        let picURL = picDoc.data().image;
                        console.log(picURL);
                        const imageElement = document.getElementById("mypic-goes-here");
                        imageElement.src = picURL;
                    }).catch(error => {
                        console.error("Error getting last post:", error);
                    });
                } else {
                    console.log("User has no posts.");
                }
            }).catch(error => {
                console.error("Error getting user document:", error);
            });
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    });
}

insertPictureFromFirestore();

