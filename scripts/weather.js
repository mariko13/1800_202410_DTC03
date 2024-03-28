var currentUser;               //points to the document of the user who is logged in

function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                let userLocation = userDoc.data().location;
                console.log(userLocation);
                //$("#name-goes-here").text(userName); // jQuery
                // document.getElementById("location-goes-here").innerText = userLocation;
                weather(userLocation);
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}

insertNameFromFirestore(); 

// myForm = document.querySelector("form");
//       myForm.addEventListener("submit", (e) => {
//         e.preventDefault();
function weather(userLocation) {
fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&appid=b660f3402c54cb9a9c48f89c35249e5c&units=metric`)
  .then((resp) => resp.json())
  .then((data) => {
    console.log(data);
    result.innerHTML += ` <h1> ${data.name} </h1> `;
    result.innerHTML += `<div> ${data.main.temp} </div>`;
    result.innerHTML += `<div> ${data.weather[0].description} </div>`;
    result.innerHTML += `<div> <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" </div>`;
  })
  .catch((err) => console.log(err));
}
// });
