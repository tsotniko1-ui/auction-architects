// Elements
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const uploadForm = document.getElementById('upload-form');
const registerSection = document.getElementById('register-section');
const loginSection = document.getElementById('login-section');
const uploadSection = document.getElementById('upload-section');
const workDisplaySection = document.getElementById('work-display');
const worksList = document.getElementById('works-list');

// Local Storage Keys
const USERS_KEY = 'users';
const WORKS_KEY = 'works';
const LOGGED_IN_USER_KEY = 'loggedInUser';

// Get stored users and works
let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
let works = JSON.parse(localStorage.getItem(WORKS_KEY)) || [];

// Register user
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    // Store the new user in local storage
    users.push({ username, email, role });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    alert('Registration successful! Please log in.');
    registerSection.style.display = 'none';
    loginSection.style.display = 'block';
});

// Login user
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value; // Not used in this demo

    const user = users.find((user) => user.email === email);

    if (user) {
        localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
        alert('Login successful!');
        loginSection.style.display = 'none';
        if (user.role === 'architect') {
            uploadSection.style.display = 'block';
        }
        workDisplaySection.style.display = 'block';
        renderWorks();
    } else {
        alert('Invalid login credentials');
    }
});

// Upload work
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const workTitle = document.getElementById('work-title').value;
    const workDescription = document.getElementById('work-description').value;
    const workImage = document.getElementById('work-image').files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
        const work = {
            title: workTitle,
            description: workDescription,
            imageUrl: reader.result,
            ratings: []
        };

        works.push(work);
        localStorage.setItem(WORKS_KEY, JSON.stringify(works));

        alert('Work uploaded successfully!');
        uploadForm.reset();
        renderWorks();
    };
    if (workImage) reader.readAsDataURL(workImage);
});

// Render works
function renderWorks() {
    worksList.innerHTML = '';
    works.forEach((work, index) => {
        const workCard = document.createElement('div');
        workCard.classList.add('work-card');
        workCard.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <h3>${work.title}</h3>
            <p>${work.description}</p>
            <div class="stars" data-index="${index}">
                ${[1, 2, 3, 4, 5].map((star) => `
                    <span class="star" data-star="${star}">★</span>
                `).join('')}
            </div>
        `;
        worksList.appendChild(workCard);

        // Add rating event listeners
        const starElements = workCard.querySelectorAll('.star');
        starElements.forEach((starElement) => {
            starElement.addEventListener('click', () => rateWork(index, parseInt(starElement.dataset.star)));
        });
    });
}

// Rate work
function rateWork(workIndex, rating) {
    const work = works[workIndex];
    work.ratings.push(rating);
    localStorage.setItem(WORKS_KEY, JSON.stringify(works));
    alert('Rating submitted!');
}
