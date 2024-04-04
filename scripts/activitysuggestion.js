// ==== Go Back Function for Page Navigation ====
function goBack() {
    if (document.referrer) {
        window.location.href = document.referrer;
    } else {
        navigateToPage('home.html');
    }
}


// Retrieve selected mood from local storage: either 'content', 'neutral', 'sad'
var selectedMood = localStorage.getItem('selectedMood');
console.log('Selected mood from previous page:', selectedMood);

// Retrieve selected time from local storage: either 'short', 'mediunm', 'long'
var selectedTime = localStorage.getItem('selectedTime');
console.log('Selected mood from previous page:', selectedTime);

// Retrieve selected doors from local storage: either 'indoors', 'outdoors'
var selectedDoors = localStorage.getItem('selectedDoors');
console.log('Selected mood from previous page:', selectedDoors);

// Retrieve selected group from local storage: either 'alone', 'group'
var selectedGroup = localStorage.getItem('selectedGroup');
console.log('Selected mood from previous page:', selectedGroup);


// ==== Function to Display Activities Based on User Input Stored in Local Storage ====
function displayActivities() {
    var activitiesContainer = document.getElementById('activitiesContainer');

    activitiesContainer.innerHTML = '';

    var timeFilter = null;
    if (selectedTime === 'long') {
        timeFilter = ['short', 'medium', 'long'];
    } else if (selectedTime === 'medium') {
        timeFilter = ['short', 'medium'];
    } else if (selectedTime === 'short') {
        timeFilter = ['short'];
    }

    db.collection('activities')
        .where('mood', 'array-contains', selectedMood)
        .where('time', 'in', timeFilter)
        .where('doors', '==', selectedDoors)
        .where('group', '==', selectedGroup)
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                activitiesContainer.innerHTML = '<p>No activities found.</p>';
            } else {
                snapshot.forEach(doc => {
                    var activityID = doc.data().activityID;
                    var description = doc.data().description;
                    var image = doc.data().image;
                    var activitiesItem = `
                    <article class="card_article swiper-slide">
                        <div class="card_image flex justify-center items-center">
                            <img src='./images/${image}' class='activity-image size-60'>
                            <div class="card_shadow"></div>
                        </div>
                        <div class="card_data">
                            <h3 class="card_name font-bold text-2xl tracking-wide" id="name_${activityID}">${activityID}</h3>
                            <p class="card_description id="description_${activityID}">${description}</p>
                            <a href="#" class="card_button" onclick="navigateToPage('activitydetails.html'); viewMore('${activityID}')">View More</a>
                        </div>
                    </article>
                `;
                    activitiesContainer.innerHTML += activitiesItem;
                });
            }
        })
        .catch(error => {
            console.log("Error getting documents: ", error);
        });
}


// ==== Function to be Invoked for View More Button ====
function viewMore(activity) {
    selectedActivity = activity;
    localStorage.setItem('selectedActivity', activity);
    console.log('Selected activity:', selectedActivity);
}


displayActivities();


// Swiper initiation
let swiperCards = new Swiper(".card_content", {
    loop: false,
    spaceBetween: 32,
    grabCursor: true,

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: false,
    },
    
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    breakpoints: {
        600: {
            slidesPerView: 1,
        },
        968: {
            slidesPerView: 2,
        },
    },
});