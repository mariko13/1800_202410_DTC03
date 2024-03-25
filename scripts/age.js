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
                  let userAge = userDoc.data().age;
                  //if the data fields are not empty, then write them in to the form.
                  if (userAge != null) {
                      document.getElementById("age").value = userAge;
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

function saveUserInfo() {
  //enter code here

  //a) get user entered values
  userAge = document.getElementById('age').value;
  //b) update user's document in Firestore
  currentUser.update({
      age: userAge,
  })
      .then(() => {
          console.log("Document successfully updated!");
          alert('Your age has been updated');
          navigateToPage('preferences.html')
      })
  //c) disable edit 
}