function navigateToPage(pageUrl) {  
    window.location.href = pageUrl;
}
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
      }).catch((error) => {
        // An error happened.
      });
}
