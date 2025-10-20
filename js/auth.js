(function() {
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const loginContainer = document.getElementById('login-container');
    const mainContentWrapper = document.getElementById('main-content-wrapper');

    if (!loginForm) {
        console.error('Formulário de login não encontrado!');
        return;
    }

    // Listener para o formulário de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm['email'].value;
        const password = loginForm['password'].value;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(error => {
                console.error("Erro no login:", error);
                alert('Falha no login: ' + error.message);
            });
    });

    // Listener para o botão de logout
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            firebase.auth().signOut();
        });
    }

    // Observador do estado de autenticação do Firebase
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Usuário está logado.
            console.log('Usuário autenticado, exibindo conteúdo principal.');
            loginContainer.style.display = 'none';
            mainContentWrapper.style.display = 'block';
            // Inicializa o conteúdo principal (módulos)
            if (window.initializeApp) {
                window.initializeApp();
            }
        } else {
            // Usuário está deslogado.
            console.log('Nenhum usuário autenticado, exibindo tela de login.');
            loginContainer.style.display = 'block';
            mainContentWrapper.style.display = 'none';
        }
    });

})();
