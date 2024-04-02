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
  alert("SAVE POST is triggered");
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
        alert("Post is complete!");
        //window.location.href = "showposts.html";
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  })
}
