// ==== Check if User is Logged In ====
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log(`user ID: ${user.uid}`);
    } else {
        console.log("No user is logged in.")
    }
})


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

// Retrieve selected time from local storage: either 'short', 'medium', 'long'
var selectedTime = localStorage.getItem('selectedTime');
console.log('Selected mood from previous page:', selectedTime);

// Retrieve selected doors from local storage: either 'indoors', 'outdoors'
var selectedDoors = localStorage.getItem('selectedDoors');
console.log('Selected mood from previous page:', selectedDoors);

// Retrieve selected group from local storage: either 'alone', 'group'
var selectedGroup = localStorage.getItem('selectedGroup');
console.log('Selected mood from previous page:', selectedGroup);

// Retrieve selected activity from local storage: activityID
var selectedActivity = localStorage.getItem('selectedActivity');
console.log('Selected activity from previous page:', selectedActivity);


// Empty out activitiesContainer
var activitiesContainer = document.getElementById('activitiesContainer');
activitiesContainer.innerHTML = '';

// Empty out reviewsContainer
var reviewsContainer = document.getElementById('reviewsContainer');
reviewsContainer.innerHTML = '';

// Initialize Variables for Rating
let totalStars = 0;
let totalReviews = 0;
let activityRatingRounded;


// ==== Function for Average Rating of Selected Activity ====
function findStarsAverage() {
    db.collection('reviews')
        .where('activityID', '==', selectedActivity)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                let stars = Number(doc.data().stars);
                if (!isNaN(stars)) {
                    totalStars += stars;
                    totalReviews += 1;
                }
            });
            if (totalReviews > 0) {
                let activityRating = totalStars / totalReviews;
                activityRatingRounded = roundToNearestHalf(activityRating);
                useActivityRatingRounded();
            } else {
                console.log("No valid ratings found for this activity.");
            }
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });
}
let useActivityRatingRounded = () => activityRatingRounded;


// ==== Function to Fill #reviewsContainer HTML Element ====
function fillReviews() {
    db.collection('reviews')
        .where('activityID', '==', selectedActivity)
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                reviewsContainer.innerHTML = '<p>No reviews yet, be the first!</p>';
            } else {
                let colorIndex = 0;
                snapshot.forEach((doc) => {
                    let stars = doc.data().stars;
                    if (!isNaN(stars)) {
                        let title = doc.data().title || "No Title";
                        let rating = stars;
                        let starsHTML = generateSmallStarsHTML(rating);
                        let description = doc.data().description || "No Description";
                        let bgColor = colorIndex % 2 === 0 ? "#174B62" : "#3D3264";
                        let reviewDetails = `
                                <section class="flex flex-col mt-2 mb-2 p-2 rounded-lg bg-[${bgColor}]">  
                                    <div class="flex flex-row justify-between my-1"> 
                                        <h3 class="font-bold tracking-wider text-[#E22866] text-sm sm:text-base">${title}</h3>
                                        <div class="text-sm sm:text-base">${starsHTML}</div>
                                    </div>
                                    <div class="border-[#F4C015] border-b my-1"></div>
                                    <p class="text-sm sm:text-base my-1">${description}</p>
                                </section>
                            `;
                        reviewsContainer.innerHTML += reviewDetails;
                        colorIndex++;
                    }
                });
            }
        })
        .catch(error => {
            console.log("Error getting documents: ", error);
        });
}


// ==== Function to Fill #activitiesContainer HTML Element ====
function fillActivityContainer() {
    db.collection('activities').doc(selectedActivity)
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                activitiesContainer.innerHTML = '<p>Selected activity not found in db.</p>';
            }
            else {
                let data = snapshot.data();
                let image = snapshot.data().image;
                let activityID = snapshot.data().activityID;
                let description = snapshot.data().description;
                let ratingAverage = useActivityRatingRounded();
                console.log("Rating Average", ratingAverage);
                let stars = generateLargeStarsHTML(ratingAverage)
                let activityDetails = `
                <section class="bg-[#003952] rounded-lg p-4 flex flex-col place-items-center">
                    <img src='./images/${image}' class='activity-image bg-[#F8D04F] rounded-lg'>
                    <h1 class="font-bold mb-2 tracking-wider my-4" id="activity-detail-title">${activityID}</h1>
                    <div>${stars}</div>
                    <p class="text-sm sm:text-base my-1">${description}</p>
                </section>
                `;
                activitiesContainer.innerHTML += activityDetails;
            }
        })
        .catch(error => {
            console.log("Error getting documents: ", error);
        });
}


// ==== Function that Creates Firestore Document Under "reviews" Collection ====
function createReviewDoc(callback) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(`user ID: ${user.uid}`);
            db.collection("reviews")
                .where("userID", "==", user.uid)
                .where("activityID", "==", selectedActivity)
                .get()
                .then((snapshot) => {
                    if (!snapshot.empty) {
                        console.log("User already has a review document for this activity");
                        if (callback) {
                            callback();
                        }
                        return;
                    }
                    db.collection("reviews").doc(user.uid + '_' + selectedActivity).set({
                        activityID: selectedActivity,
                        userID: user.uid,
                        date: new Date()
                    })
                        .then(() => {
                            console.log("Review doc created successfully.");
                            if (callback) {
                                callback();
                            }
                        })
                        .catch((error) => {
                            console.log("Error creating review doc:", error)
                        })
                })
        }
        else {
            console.log("No user is logged in.")
        }
    })
}

// ==== Function to Navigate to chat.html ====
function navigateToChat() {
    window.location.href = 'chat.html';
}

// Add Event Listener to #startMinglueButton
document.getElementById('startMingleButton').addEventListener('click', function() {
    createReviewDoc(navigateToChat);
});


// ==== Function to Generate Icons for Total Average Rating of All Reviews for an Activity ====
function generateLargeStarsHTML(rating) {
    const numFullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const numEmptyStars = 5 - numFullStars - (hasHalfStar ? 1 : 0);
    let starsHTML = '';
    if (isNaN(rating)) {
        for (let i = 0; i < 3; i++) {
            starsHTML += '<i class="material-icons star">star</i>';
        }
    }
    else {
        for (let i = 0; i < numFullStars; i++) {
            starsHTML += '<i class="material-icons star">star</i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="material-icons star">star_half</i>';
        }
        for (let i = 0; i < numEmptyStars; i++) {
            starsHTML += '<i class="material-icons star">star_border</i>';
        }
    }
    return starsHTML;
}


// ==== Function to Generate Icons for Individual Rating of a Review for an Activity ====
function generateSmallStarsHTML(rating) {
    const numFullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const numEmptyStars = 5 - numFullStars - (hasHalfStar ? 1 : 0);
    let starsHTML = '';
    if (isNaN(rating)) {
        for (let i = 0; i < 3; i++) {
            starsHTML += '<i class="material-icons star text-sm">star</i>';
        }
    }
    else {
        for (let i = 0; i < numFullStars; i++) {
            starsHTML += '<i class="material-icons star text-sm">star</i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="material-icons star text-sm">star_half</i>';
        }
        for (let i = 0; i < numEmptyStars; i++) {
            starsHTML += '<i class="material-icons star text-sm">star_border</i>';
        }
    }
    return starsHTML;
}


// ==== Function to Round to Nearest Half ====
function roundToNearestHalf(number) {
    return Math.round(number * 2) / 2;
}

findStarsAverage();
fillReviews();
fillActivityContainer();