var currentUser;               //points to the document of the user who is logged in

function insertLocationFromFirestore() {
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

insertLocationFromFirestore();

function weather(userLocation) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${userLocation}&appid=b660f3402c54cb9a9c48f89c35249e5c&units=metric`)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
      // Clear previous weather data
      result.innerHTML = '';
      result_city.innerHTML = '';

      // Display city name
      result_city.innerHTML += `<h1>${data.city.name}</h1>`;

      // Display weather items
      data.list.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert UNIX timestamp to milliseconds
        const dayOfWeek = getDayOfWeek(dateTime.getDay());
        const time = dateTime.toLocaleTimeString(); // Convert to local time string

        // Create a div for each weather item and apply styles
        const weatherItem = document.createElement('div');
        weatherItem.classList.add('weather-item');

        // Populate the weather item with data and append to the result container
        weatherItem.innerHTML = `
          <div>${dayOfWeek}</div>
          <div>${time}</div>
          <div>${item.main.temp} °C</div>
          <div>${item.weather[0].description}</div>
          <div><img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"></div>
        `;
        result.appendChild(weatherItem);
      });
    })
    .catch((err) => console.log(err));
}

function getDayOfWeek(dayIndex) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysOfWeek[dayIndex];
}

