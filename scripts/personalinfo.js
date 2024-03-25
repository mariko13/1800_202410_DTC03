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
        alert('Your information has been saved');
        navigateToPage('home.html')
    })
    //c) disable edit 
}
// function clicked() {
//     alert('Your information has been saved');
// }
