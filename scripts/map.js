async function setUpMapFeatures(userLocation) {
  console.log(userLocation);
  let response;
  try {
    resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${userLocation}.json?access_token=pk.eyJ1IjoibWhvY2tlcnR6IiwiYSI6ImNsdWE1Z3VvbzA0eGIyanF0MG9vc2FpNXIifQ.SQhGqkRDLSqW9Mc2QM5nQQ`);
    response = await resp.json();
  }
  catch (err) {
    console.log(`There was an error: ${err}`);
    return 0;
  }
  console.log(response);
  console.log(response.features[0].geometry.coordinates);
  let userLat = response.features[0].geometry.coordinates[0];
  let userLong = response.features[0].geometry.coordinates[1];
  console.log(userLat, userLong);
  let coordinate = [userLat, userLong];
  console.log("coordinate", coordinate);

  mapboxgl.accessToken = 'pk.eyJ1IjoibWhvY2tlcnR6IiwiYSI6ImNsdWE1Z3VvbzA0eGIyanF0MG9vc2FpNXIifQ.SQhGqkRDLSqW9Mc2QM5nQQ';
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [userLat, userLong],
    zoom: 12
  });


  // Add the control to the map - get location from search bar input
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
  });
  map.addControl(geocoder, 'top-left');


  // Add control to the map - give user direction from Point A to Point B
  // map.addControl(
  //   new MapboxDirections({
  //     accessToken: mapboxgl.accessToken
  //   }),
  //   'top-left'
  // );


  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());

  // Add geolocate control to the map - get user's current location
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
    })
  );


    // Display events
  map.on('load', () => {
    console.log("trying to add events here")
    db.collection("events")
      .get()
      .then((querySnapshot) => {
        const features = [];
        querySnapshot.forEach((doc) => {
          const event = doc.data();
          // Construct GeoJSON feature for each event
          const feature = {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [event.location.longitude, event.location.latitude] 
            },
            'properties': {
              'title': event.name, 
              'description': event.description 
            }
          };
          features.push(feature);
        });
        console.log("features: ", features);

        // Add a GeoJSON source with events data
        map.addSource('events', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': features
          }
        });

        // Load custom location pin image
        map.loadImage(
          './images/special_location.png',
          (error, image) => {
            if (error) throw error;
            map.addImage('custom-marker', image);

            map.addLayer({
              'id': 'events',
              'type': 'symbol',
              'source': 'events',
              'layout': {
                'icon-image': 'custom-marker',
                'icon-size': 0.175,
                'icon-anchor': 'bottom',
                'icon-allow-overlap': true
              }
            });
          }
        );
      })
      .catch((error) => {
        console.error("Error fetching events: ", error);
      });
  });

  // click event 
  map.on('click', 'events', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;
    const title = e.features[0].properties.title;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup({ offset: 50 })
      .setLngLat(coordinates)
      .setHTML(`<strong>${title}</strong><p>${description}</p>`)
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the events layer.
  map.on('mouseenter', 'events', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'events', () => {
    map.getCanvas().style.cursor = '';
  });



}


// async function displayEvents() {

// }


async function main() {
      // Check if user is logged in
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          db.collection("users")
            .doc(user.uid)
            .get()
            .then((doc) => {
              let userLocation = doc.data().location;
              setUpMapFeatures(userLocation);
            }, (error) => {
              console.log("Error getting user location: ", error);
              window.location.href = 'location.html';
            }).then(() => {
              // displayEvents()
            })
        }
      });
    }

main();
