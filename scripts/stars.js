// REQUIRES TO BE EDITTED FOR USE WITH review.html

let totalStars = 0;
let totalReviews = 0;
let activityRatingRounded;
let useActivityRatingRounded = () => activityRatingRounded;

var selectedActivity = localStorage.getItem('selectedActivity');
console.log('Selected activity from previous page:', selectedActivity);

function calculateRatingAverage() {
    db.collection('reviews')
        .where('activityID', '==', selectedActivity)
        .get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                totalStars += Number(doc.data().stars);
                totalReviews += 1;
            })
            let activityRating = totalStars / totalReviews;
            activityRatingRounded = roundToNearestHalf(activityRating);
            useActivityRatingRounded();
        })
        .catch(error => {
            console.log('Error getting documents: ', error);
        });
}

calculateRatingAverage();

function roundToNearestHalf(number) {
    return Math.round(number * 2) / 2;
}