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
                console.log(userName);
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("name-goes-here").innerText = userName;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}

insertNameFromFirestore();

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userImage = userDoc.data().image;
                    let userAge = userDoc.data().age;
                    let userGender = userDoc.data().gender;
                    let userLocation = userDoc.data().location;

                    //if the data fields are not empty, then write them in to the form.
                    if (userAge != null) {
                        document.getElementById("age").value = userAge;
                    }
                    if (userGender != null) {
                        document.getElementById("genderselect").value = userGender;
                    }
                    if (userLocation != null) {
                        document.getElementById("location").value = userLocation;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
populateUserInfo();

var docID;
var ImageFile;
function listenFileSelect() {
  // listen for file selection
  var fileInput = document.getElementById("mypic-input"); // pointer #1

  // When a change happens to the File Chooser Input
  fileInput.addEventListener('change', function (e) {
    ImageFile = e.target.files[0];   //Global variable
    var blob = URL.createObjectURL(ImageFile);
  })
}
listenFileSelect();

function savePost() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // Do something for the user here. 
      // var desc = document.getElementById("description").value;
      db.collection("posts").add({
        owner: user.uid,
        // description: desc,
        last_updated: firebase.firestore.FieldValue
          .serverTimestamp() //current system time
      }).then(doc => {
        console.log("1. Post document added!");
        console.log(doc.id);
        docID = doc.id;
        uploadPic(doc.id);
      })
    } else {
      // No user is signed in.
      console.log("Error, no user signed in");
    }
  });
}

//------------------------------------------------
// So, a new post document has just been added
// and it contains a bunch of fields.
// We want to store the image associated with this post,
// such that the image name is the postid (guaranteed unique).
// 
// This function is called AFTER the post has been created, 
// and we know the post's document id.
//------------------------------------------------
function uploadPic(postDocID) {
  console.log("inside uploadPic " + postDocID);
  var storageRef = storage.ref("images/" + postDocID + ".jpg");
  console.log(ImageFile);
  storageRef.put(ImageFile)   //global variable ImageFile

    // AFTER .put() is done
    .then(function () {
      console.log('2. Uploaded to Cloud Storage.');
      storageRef.getDownloadURL()

        // AFTER .getDownloadURL is done
        .then(function (url) { // Get URL of the uploaded file
          console.log("3. Got the download URL.");
          // Now that the image is on Storage, we can go back to the
          // post document, and update it with an "image" field
          // that contains the url of where the picture is stored.
          db.collection("posts").doc(postDocID).update({
            "image": url // Save the URL into users collection
          })
            // AFTER .update is done
            .then(function () {
              console.log('4. Added pic URL to Firestore.');
              // One last thing to do:
              // save this postID into an array for the OWNER
              // so we can show "my posts" in the future
              savePostIDforUser(postDocID);
              // displayImageFromStorage(postDocID);
            })
        })
    })
    .catch((error) => {
      console.log("error uploading to cloud storage");
    })
}

//--------------------------------------------
//saves the post ID for the user, in an array
//--------------------------------------------
function savePostIDforUser(postDocID) {
  firebase.auth().onAuthStateChanged(user => {
    console.log("user id is: " + user.uid);
    console.log("postdoc id is: " + postDocID);
    db.collection("users").doc(user.uid).update({
      myposts: firebase.firestore.FieldValue.arrayUnion(postDocID)
    })
      .then(() => {
        console.log("5. Saved to user's document!");
        saveUserInfo();
        //window.location.href = "showposts.html";
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  })
}



function saveUserInfo() {

    //a) get user entered values
    userAge = document.getElementById('age').value;
    userGender = document.getElementById('genderselect').value;
    userLocation = document.getElementById('location').value;
    //b) update user's document in Firestore
    currentUser.update({
        age: userAge,
        gender: userGender,
        location: userLocation
    })
        .then(() => {
        console.log("Document successfully updated!");
        alert('Your information has been saved');
        navigateToPage('home.html')
    })
    //c) disable edit 
}
