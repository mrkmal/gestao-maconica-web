document.addEventListener('DOMContentLoaded', function() {
    console.log("[Auth] DOM Loaded. Initializing script.");
    const auth = firebase.auth();
    const mainContent = document.getElementById('main-content-wrapper');
    const loginContainer = document.getElementById('login-container');

    if (!mainContent || !loginContainer) {
        console.error("[Auth] Critical: Could not find main or login containers.");
        return;
    }

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm['email'].value;
        const password = loginForm['password'].value;
        console.log("[Auth] Attempting sign-in...");
        auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                console.error("[Auth] Login Error:", error);
                alert('E-mail ou senha incorretos.');
            });
    });

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        auth.signOut();
    });

    auth.onAuthStateChanged(user => {
        console.log("[Auth] Auth state changed.");
        if (user) {
            console.log("[Auth] User is logged in. Updating UI.");
            mainContent.style.display = 'block';
            loginContainer.style.display = 'none';
            
            if (window.initializeApp) {
                console.log("[Auth] Calling app initializer.");
                window.initializeApp();
            } else {
                console.error("[Auth] Critical: initializeApp function not found!");
            }
        } else {
            console.log("[Auth] User is logged out. Showing login screen.");
            mainContent.style.display = 'none';
            loginContainer.style.display = 'block';
        }
    });
});
