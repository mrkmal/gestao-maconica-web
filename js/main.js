document.addEventListener("DOMContentLoaded", function() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Authentication
    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    const signInButton = document.getElementById('google-signin');
    const signOutButton = document.getElementById('google-signout');
    const userPhoto = document.getElementById('user-photo');
    const contentArea = document.getElementById('content-area');

    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            userPhoto.src = user.photoURL;
            signOutButton.style.display = 'block';
        } else {
            // No user is signed in.
            document.getElementById('login-container').style.display = 'block';
            document.getElementById('main-content').style.display = 'none';
            signOutButton.style.display = 'none';
        }
    });

    signInButton.addEventListener('click', () => {
        auth.signInWithPopup(provider);
    });

    signOutButton.addEventListener('click', () => {
        auth.signOut();
    });

    window.loadPage = function(page) {
        fetch(`modules/${page}.html`)
            .then(response => response.text())
            .then(data => {
                contentArea.innerHTML = data;
            });
    }
});