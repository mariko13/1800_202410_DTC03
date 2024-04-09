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
                  let userGender = userDoc.data().gender;
                  //if the data fields are not empty, then write them in to the form.
                  if (userGender != null) {
                      document.getElementById("genderselect").value = userGender;
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
  userGender = document.getElementById('genderselect').value;
  //b) update user's document in Firestore
  currentUser.update({
      gender: userGender,
  })
      .then(() => {
          console.log("Document successfully updated!");
          alert('Your gender information has been updated');
          navigateToPage('preferences.html')
      })
}