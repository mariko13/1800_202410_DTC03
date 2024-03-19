var currentUser;               //points to the document of the user who is logged in
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
                    console.log ("No user is signed in");
                }
            });
        }

//call the function to run it 
populateUserInfo();

function saveUserInfo() {
    //enter code here

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
    })
    //c) disable edit 
}