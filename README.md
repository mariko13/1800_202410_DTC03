# Project Title

## 1. Project Description
Our team DTC03 is developing Mood Mingle to help people with dilemmas find suitable activities by recommending a list of activities best suited for their current feelings, preferences, and time availability.


## 2. Names of Contributors
List team members and/or short bio's here... 
* My name is Homayoun, I am excited to be in this project and help people with the product.
* Hi, my name is Hweedong(Jon)! I am excited to be here and create great many things! 
* Hi, my name is Mariko! I am exited to work on this project!

	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* Tailwind 3.4
* Openweather api
* Mapbox api
* Swiper library 11.1.1
* 

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* Click login
* Enter email address name and password then click login
* Fill out the personal information and upload a profile picture then click confirm
* Click Mingle! button,
* Choose how you are feeling
* Choose how much time you have
* Choose if you want to go indoors or outdoors
* Choose if you want to spend time alone or with a group
* Browse through the suggested activity and click view more on the one you like
* Read the details and checkout the reviews. when ready click "Start Mingling"
* You can send messages in the forum to other users who are interested in the same activity
* Click home button to navigte to home where you can check the following: Activity Ranking
Map
Weather forecast
* click any of the above functions to navigate to the respecting page
* Click history button to leave a review for an activity tht you have completed
* Click Profile to view/edit your personal informtion


## 5. Known Bugs and Limitations
Here are some known bugs:
* loss of activity pictures after hosting
* limitation when adding modals to buttons
* adding more activities and events
* limitation with deleting messages from forum
* lack of specificity of mood selection due to budget constraints

## 6. Features for Future
What we'd like to build in the future:
* navigation in the map function
* more activities
* smoother popup alerts
	
## 7. Contents of Folder
Content of the project folder:


Top level of project folder: 
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
└── README.md                # Readme file
├── .firebase                # hosting..cache
├── images                   # folder of images used in the app
├── scripts                  # folder containing all the JS files
├── styles                   # folder containing style.css
├── .firebaserc              # firebase
├── 404.html                 # Page not found
├── activitydetails.html     # this is where users see the details of activities
├── activitysuggestion.html  # the page that suggested activities are shown
├── addactivities.html       # used to add activities to firebase
├── addreviews.html          # the page to add a review to the firebase
├── age.html                 # the page to edit the age of user
├── chat.html                # the page for the forum
├── currentstate.html        # the page for the selection of preferences
├── gender.html              # the page to edit user's gender
├── history.html             # the page to view completed activities
├── home.html                # home page
├── location.html            # the page to edit user's location
├── login.html               # login page
├── map.html                 # map function
├── personalinfo.html        # personal information form
├── preferences.html         # the page with all the personal information
├── profile.html             # profile page
├── profilePicture.html      # the page to edit the profile picture
├── review.html              # the page where the user can leave a review
├── toptenactivities.html    # the ranking page
├── weather.html             # weather forecast page
├── storage.rules            # firebase storage rules
├── firestore.rules          # firebase firestore rules
├── firestore.indexes.json   # firebase
├── firebase.json            # firebase

scripts has the following files:
├── activitydetails.js       # retrieving activity detils from firebase
├── activitysuggestion.js    # suggest activities based on user selection
├── age.js                   # edit user's age
├── authentication.js        # firebase authentication
├── chat.js                  # Forum
├── currentstate.js          # selection of user preference
├── firebaseAPI_DTC03.js     # firebase API
├── gender.js                # edit user's gender
├── history.js               # retrieve user's completed activities
├── location.js              # edit user's location
├── map.js                   # host the mapbox API
├── personalinfo.js          # write the personal info form to firestore
├── profile.js               # read user info and profile picture from firestore
├── review.js                # write user review to firestore for selected activity
├── script.js                # logout and scroll function
├── stars.js                 # Write/read/populate the stars in review page
├── toptenactivities.js      # retrieve top ten activities from firebase
├── weather.js               # host open weather API



```


