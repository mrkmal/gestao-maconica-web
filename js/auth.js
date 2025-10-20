document.addEventListener('DOMContentLoaded', function() {
    const auth = firebase.auth();
    const mainContent = document.getElementById('main-content-wrapper');
    const loginContainer = document.getElementById('login-container');

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm['email'].value;
        const password = loginForm['password'].value;

        auth.signInWithEmailAndPassword(email, password)
            .catch(error => {
                console.error('Erro de login:', error);
                alert('E-mail ou senha incorretos.');
            });
    });

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        auth.signOut();
    });

    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuário está logado
            mainContent.style.display = 'block';
            loginContainer.style.display = 'none';
            // Dispara o evento para o main.js iniciar
            document.dispatchEvent(new CustomEvent('app:authenticated'));
        } else {
            // Usuário está deslogado
            mainContent.style.display = 'none';
            loginContainer.style.display = 'block';
        }
    });
});
