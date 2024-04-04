// ==== Go Back Function to Manipulate Visible/Hidden Sections ====
function goBack() {
    var sections = ['moodSection', 'timeSection', 'doorsSection', 'groupSection'];
    for (var i = 0; i < sections.length; i++) {
        var section = document.getElementById(sections[i]);
        if (!section.classList.contains('d-none')) {
            section.classList.add('d-none');
            if (i > 0) {
                var prevSection = document.getElementById(sections[i - 1]);
                prevSection.classList.remove('d-none');
                updateNavbarBrand(prevSection.id);
            } else if (i === 0) {
                navigateToPage('home.html');
            }
            break;
        }
    }
}


// ==== Function to Update Navbar Based on Current Section ====
function updateNavbarBrand(sectionId) {
    var navbarBrand = document.querySelector('.navbar-brand');
    switch (sectionId) {
        case 'moodSection':
            navbarBrand.textContent = "How are you feeling?";
            break;
        case 'timeSection':
            navbarBrand.textContent = "How much time?";
            break;
        case 'doorsSection':
            navbarBrand.textContent = "Prefer indoors/outdoors?";
            break;
        case 'groupSection':
            navbarBrand.textContent = "Prefer group/alone?";
            break;
        default:
            navbarBrand.textContent = "How are you feeling?";
            break;
    }
}


// ==== Functions for Setting Local Storage Based on User Input ====
function selectMood(mood) {
    selectedMood = mood;
    localStorage.setItem('selectedMood', selectedMood);
    console.log('Selected mood:', selectedMood);
    updateNavbarBrand('timeSection');
}

function selectTime(time) {
    selectedTime = time;
    localStorage.setItem('selectedTime', selectedTime);
    console.log('Selected time:', selectedTime);
    updateNavbarBrand('doorsSection');
}

function selectDoors(doors) {
    selectedDoors = doors;
    localStorage.setItem('selectedDoors', selectedDoors);
    console.log('Selected doors:', selectedDoors);
    updateNavbarBrand('groupSection');
}

function selectGroup(group) {
    selectedGroup = group;
    localStorage.setItem('selectedGroup', selectedGroup);
    console.log('Selected group:', selectedGroup);
}


// ==== Functions for Setting Sections Visibility ====
function showMoodSection() {
    document.getElementById('timeSection').classList.add('d-none');
    document.getElementById('moodSection').classList.remove('d-none');
}


function showTimeSection() {
    document.getElementById('moodSection').classList.add('d-none');
    document.getElementById('timeSection').classList.remove('d-none');
}

function showDoorsSection() {
    document.getElementById('timeSection').classList.add('d-none');
    document.getElementById('doorsSection').classList.remove('d-none');
}

function showGroupSection() {
    document.getElementById('doorsSection').classList.add('d-none');
    document.getElementById('groupSection').classList.remove('d-none');
}
