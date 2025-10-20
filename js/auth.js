(function() {
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const loginContainer = document.getElementById('login-container');
    const mainContentWrapper = document.getElementById('main-content-wrapper');

    if (!loginForm) {
        console.error('FATAL: Formulário de login com id="login-form" não encontrado!');
        return;
    }

    // Listener para o formulário de login (versão robusta)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Evento de submit do formulário de login disparado.");

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (!emailInput || !passwordInput) {
            console.error("Erro Crítico: Campos de input de email ou senha não encontrados!");
            alert("Erro interno: Campos de formulário não encontrados. Contate o suporte.");
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;

        console.log("Tentando login com email:", email);

        if (!email || !password) {
            console.warn("Email ou senha estão vazios.");
            alert("Por favor, preencha o email e a senha.");
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                // O sucesso aqui irá disparar o onAuthStateChanged, que cuidará da UI.
                console.log("Login bem-sucedido para o usuário:", userCredential.user.email);
            })
            .catch(error => {
                console.error("Erro do Firebase ao tentar logar:", error);
                alert('Falha no login. Verifique seu email e senha. Detalhe: ' + error.message);
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
            console.log('onAuthStateChanged: Usuário autenticado, exibindo conteúdo principal.');
            loginContainer.style.display = 'none';
            mainContentWrapper.style.display = 'block';
            if (window.initializeApp) {
                window.initializeApp();
            }
        } else {
            // Usuário está deslogado.
            console.log('onAuthStateChanged: Nenhum usuário autenticado, exibindo tela de login.');
            loginContainer.style.display = 'block';
            mainContentWrapper.style.display = 'none';
        }
    });

})();
