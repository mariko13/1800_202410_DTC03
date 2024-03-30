function navigateToPage(pageUrl) {
  window.location.href = pageUrl;
}
function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("logging out user");
    navigateToPage('index.html');
  }).catch((error) => {
    // An error happened.
  });
}

window.addEventListener('scroll', function () {
  var navbar = document.querySelector('.navbar');
  if (window.scrollY > 0) {
    navbar.classList.add('shadow-md');
  } else {
    navbar.classList.remove('shadow-md');
  }
});