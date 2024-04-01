async function getUsersLocationCoordinates(userLocation) {
  console.log(userLocation);
  let response;
  try {
    resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${userLocation}.json?access_token=pk.eyJ1IjoibWhvY2tlcnR6IiwiYSI6ImNsdWE1Z3VvbzA0eGIyanF0MG9vc2FpNXIifQ.SQhGqkRDLSqW9Mc2QM5nQQ`);
    response = await resp.json();
    console.log(response);
    console.log(response.features[0].geometry.coordinates);
    let userLat = response.features[0].geometry.coordinates[0];
    let userLong = response.features[0].geometry.coordinates[1];
    console.log(userLat, userLong);
    let coordinate = [userLat, userLong];
    console.log("coordinate",coordinate);

    mapboxgl.accessToken = 'pk.eyJ1IjoibWhvY2tlcnR6IiwiYSI6ImNsdWE1Z3VvbzA0eGIyanF0MG9vc2FpNXIifQ.SQhGqkRDLSqW9Mc2QM5nQQ';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [userLat, userLong],
      zoom: 12
    });

    // Add the control to the map.
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );
  }
  catch (err) {
    console.log(`There was an error: ${err}`);
    return 0;
  }
}


async function displayMap(coord) {
  console.log("coord",coord);
  console.log("center", [userLat, userLong])
  mapboxgl.accessToken = 'pk.eyJ1IjoibWhvY2tlcnR6IiwiYSI6ImNsdWE1Z3VvbzA0eGIyanF0MG9vc2FpNXIifQ.SQhGqkRDLSqW9Mc2QM5nQQ';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [userLat, userLong],
    zoom: 13
  });

  // Add the control to the map.
  map.addControl(
    new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    })
  );
}


async function main() {
  // Check if user is logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          let userLocation = doc.data().location;
          getUsersLocationCoordinates(userLocation);
          // displayMap(coord)
        }, (error) => {
          console.log("Error getting user location: ", error);
          window.location.href = 'location.html';
        })
    }
  });
}

main();




// current_page = 1; // global variable to track the current page


// // Display 10 movies per page in two rows of five movies
// async function display_movies(count) {
//   result.innerHTML = "";

//   // Calculate the page number for the yts movies based on the current page
//   page_num = current_page / 2;
//   if (current_page % 2 == 1) {
//     page_num += 0.5;
//   }

//   // Retrieve the endpoint URL for the specific page number
//   let resp_json;
//   try {
//     url = `https://yts.mx/api/v2/list_movies.json?page=${page_num}`;
//     resp = await fetch(url);
//     resp_json = await resp.json();
//   }
//   catch (err) {
//     console.log(`There was an error: ${err}`);
//   }

//   // Iterate to display all ten movies per page if resp_json was successfully retrieved
//   if (resp_json) {
//     for (let i = 0; i < 10; i++) {
//       movie_num = i;

//       if (current_page % 2 == 0) {
//         movie_num = i + 10;
//       }

//       // Insert the following html code inside the div with id="result"
//       result.innerHTML += `
//       <div>
//         <div>
//           <div class="outer_div">
//             <img src="${resp_json.data.movies[movie_num].medium_cover_image}" alt="">
//             <div class="inner_div">
//               <span class="fas fa-star"></span>
//               <br>
//               ${resp_json.data.movies[movie_num].rating}/10
//             </div>
//             <div class="overlay"></div>
//           </div>
//           <div class="title"> ${resp_json.data.movies[movie_num].title} </div>
//           <div class="year"> ${resp_json.data.movies[movie_num].year} </div>
//         </div>
//       </div>
//       `;

//       // Break loop once there's no more movies to be displayed (relevant for last page which may have less than ten movies)
//       if (((current_page - 1) * 10 + movie_num) > count) {
//         break;
//       }
//     }
//   }
// }


// // Display the following pagination control buttons: First, Previous, Next, Last, and the current page number and following nine page number
// function display_pagination_controls(count) {
//   buttons.innerHTML = "";

//   // Create and append a button element for the First page
//   x = document.createElement("button");
//   x.innerText = "First";
//   x.id = "first";
//   buttons.appendChild(x);

//   // Create and append a button element for the Previous page as long as there is a previous page (i.e. not when current_page is 1)
//   if (current_page > 1) {
//     x = document.createElement("button");
//     x.innerText = "Previous";
//     x.id = "previous";
//     buttons.appendChild(x);
//   }

//   // Create and append a button element for the current page and each of the following nine page numbers as long as they exist (i.e. no buttons beyond the last page button number)
//   for (let i = current_page; i <= current_page + 10 && i <= Math.floor(count / 10); i++) {
//     x = document.createElement("button");
//     x.innerText = i;
//     x.id = `btn${i}`;
//     x.classList.add("btns");
//     if (i == current_page) {
//       x.classList.add("currentBtn");
//     }
//     buttons.appendChild(x);
//   }

//   // Create and append a button element for the Next page as long as there is a next page (i.e. not when the current page is the last page)
//   if (current_page < Math.floor(count / 10)) {
//     x = document.createElement("button");
//     x.innerText = "Next";
//     x.id = "next";
//     buttons.appendChild(x);
//   }

//   // Create and append a button element for the Last button
//   x = document.createElement("button");
//   x.innerText = "Last";
//   x.id = "last";
//   buttons.appendChild(x);


//   // Add a click event listener to the First button that calls display_movies(count) and display_pagination_controls(count) again and sets current_page to 1, if current_page is not already 1
//   if (current_page > 1) {
//     document.querySelector("#first").addEventListener("click", function () {
//       current_page = 1;
//       display_movies(count);
//       display_pagination_controls(count);
//     })
//   }

//   // Add a click event listener to the Previous button that calls display_movies(count) and display_pagination_controls(count) again and decrements current_page by 1, if current_page is not already 1
//   if (current_page > 1) {
//     document.querySelector("#previous").addEventListener("click", function () {
//       current_page -= 1;
//       display_movies(count);
//       display_pagination_controls(count);
//     })
//   }

//   // Add a click event listener to the Next button that calls display_movies(count) and display_pagination_controls(count) again and increments current_page by 1, if current_page is not already last page
//   if (current_page < Math.floor(count / 10)) {
//     document.querySelector("#next").addEventListener("click", function () {
//       current_page += 1;
//       display_movies(count);
//       display_pagination_controls(count);
//     })
//   }

//   // Add a click event listener to the Last button that calls display_movies(count) and display_pagination_controls(count) again and sets current_page to be the last page, if current_page is not already last page
//   if (current_page < Math.floor(count / 10)) {
//     document.querySelector("#last").addEventListener("click", function () {
//       current_page = Math.floor(count / 10);
//       display_movies(count);
//       display_pagination_controls(count);
//     })
//   }

//   btns = document.querySelectorAll(".btns");

//   // Add a click event listener to each number button that calls display_movies(count) and display_pagination_controls(count) again and sets current_page to be the number
//   for (let i = 1; i <= 10; i++) {
//     btns[i].addEventListener("click", function () {
//       current_page = Number(btns[i].id.substring(3));
//       display_movies(count);
//       display_pagination_controls(count);
//     })
//   }
// }


// // Retrieve and return the number of movies
// async function get_movies_count() {
//   let resp_json;
//   try {
//     resp = await fetch("https://yts.mx/api/v2/list_movies.json");
//     resp_json = await resp.json();
//     return resp_json.data.movie_count;
//   }
//   catch (err) {
//     console.log(`There was an error: ${err}`);
//     return 0;
//   }
// }



// // Call get_movies_count(), display_pagination_controls(count), and display_movies(count)
// async function main() {
//   count = await get_movies_count();
//   display_pagination_controls(count);
//   display_movies(count);
// }

// main();