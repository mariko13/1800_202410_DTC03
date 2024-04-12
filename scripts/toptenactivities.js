// ==== Go Back Function for Page Navigation ====
function goBack() {
    navigateToPage('home.html');
}

// ==== Function for Page Navigation ====
function navigateToPage(pageUrl) {
    window.location.href = pageUrl;
}

// Store the Page activitydetails.html was Accessed From for Navigation
localStorage.setItem('originOfActivityDetails', window.location.href);


// ==== Function to Fill for Rank of Activities ====
async function fillTopTenContainer() {
    try {
        const snapshot = await db.collection('reviews').get();
        const activityMap = {};
        
        snapshot.forEach(doc => {
            const activityID = doc.data().activityID;
            const stars = parseFloat(doc.data().stars);
            if (isNaN(stars)) {
                return;
            }
            if (!activityMap[activityID]) {
                activityMap[activityID] = {
                    totalStars: 0,
                    numberOfReviews: 0
                };
            }
            activityMap[activityID].totalStars += stars;
            activityMap[activityID].numberOfReviews++;
        });
        
        const activityRankings = [];
        
        for (const activityID in activityMap) {
            const averageStars = activityMap[activityID].totalStars / activityMap[activityID].numberOfReviews;
            const roundedAverageStars = parseFloat(averageStars.toFixed(2));
            activityRankings.push({ activityID, averageStars: roundedAverageStars });
        }
        
        activityRankings.sort((a, b) => b.averageStars - a.averageStars);
        
        activityRankings.forEach(async (activity, index) => {
            try {
                const activitySnapshot = await db.collection('activities').doc(activity.activityID).get();
                const image = activitySnapshot.data().image;

                let topTenActivities = '';

                if (index === 0) {
                    topTenActivities += `
                    <a id="rankedActivity-${index}" class="rankedActivity flex flex-col place-items-center my-2 text-2xl font-bold bg-[#E22866] border-b-4 border-[#7E1135] rounded-lg py-2" onclick="localStorage.setItem('selectedActivity', '${activity.activityID}'); window.location.href='activitydetails.html';">
                        <div class="pb-2 text-6xl"><i class="fa-solid fa-crown text-[#F4C015]"></i></div>
                        <div class="bg-[#F8D04F] py-2 w-full"><img src='./images/${image}' class='activity-image w-80 mx-auto'></div>
                        <div class="">${activity.activityID}</div>
                        <div class=""><i class="fa-solid fa-star text-[#F4C015]"></i>   ${activity.averageStars}</div>
                    </a>
                    `;
                } else if (index === 1) {
                    topTenActivities += `
                    <a id="rankedActivity-${index}" class="rankedActivity flex flex-col place-items-center my-2 text-2xl font-bold bg-[#AE296E] border-b-4 border-[#741B49] rounded-lg py-2" onclick="localStorage.setItem('selectedActivity', '${activity.activityID}'); window.location.href='activitydetails.html';">
                        <div class="pb-2 text-[#F4C015] text-4xl">${index + 1}nd</div>
                        <div class="bg-[#F8D04F] py-2 w-full"><img src='./images/${image}' class='activity-image w-64 mx-auto'></div>
                        <div class="">${activity.activityID}</div>
                        <div class=""><i class="fa-solid fa-star text-[#F4C015]"></i>   ${activity.averageStars}</div>
                    </a>
                    `;
                } else if (index === 2) {
                    topTenActivities += `
                    <a id="rankedActivity-${index}" class="rankedActivity flex flex-col place-items-center my-2 text-xl font-bold bg-[#3D3264] border-b-4 border-[#211B36] rounded-lg py-2" onclick="localStorage.setItem('selectedActivity', '${activity.activityID}'); window.location.href='activitydetails.html';">
                        <div class="pb-2 text-[#F4C015] text-2xl">${index + 1}rd</div>
                        <div class="bg-[#F8D04F] py-2 w-full"><img src='./images/${image}' class='activity-image w-56 mx-auto'></div>
                        <div class="">${activity.activityID}</div>
                        <div class=""><i class="fa-solid fa-star text-[#F4C015]"></i>   ${activity.averageStars}</div>
                    </a>
                    `;
                } else {
                    topTenActivities += `
                    <a id="rankedActivity-${index}" class="rankedActivity flex flex-col place-items-center my-2 text-xl font-bold bg-[#003952] border-b-4 border-[#001D29] rounded-lg py-2" onclick="localStorage.setItem('selectedActivity', '${activity.activityID}'); window.location.href='activitydetails.html';">
                        <div class="pb-2 text-[#F8D04F] text-2xl">${index + 1}</div>
                        <div class="bg-[#F8D04F] py-2 w-full"><img src='./images/${image}' class='activity-image w-44 mx-auto'></div>
                        <div class="">${activity.activityID}</div>
                        <div class=""><i class="fa-solid fa-star text-[#F4C015]"></i>   ${activity.averageStars}</div>
                    </a>
                    `;
                };

                topTenContainer.innerHTML += topTenActivities;
            } catch (error) {
                console.log("Error getting activity document: ", error);
            }
        });
    } catch (error) {
        console.log('Error getting documents: ', error);
    }
}

fillTopTenContainer();


