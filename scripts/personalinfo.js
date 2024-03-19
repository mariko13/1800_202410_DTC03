// Purpose: This script is used to add the user's personal information to the firestore database.
let age_amount = prompt("Please enter your age");
let gender_type = prompt("Please enter your gender");
let location_place = prompt("Please enter your location");
console.log(age_amount);

// get the user object from the Firebase authentication database
 var user = authResult.user;
db.collection("users").doc(user.uid).set({         //write to firestore. We are using the UID for the ID in users collection
  name: user.displayName,                    //"users" collection
  email: user.email,
  age: age_amount,
  gender: gender_type,
  location: location_place,                //with authenticated user's ID (user.uid)
  country: "Canada",                      //optional default profile info      
  school: "BCIT"                          //optional default profile info
}).then(function () {
  console.log("New user added to firestore");
  window.location.assign("home.html");       //re-direct to personalinfo.html after signup
}).catch(function (error) {
  console.log("Error adding new user: " + error);
});


