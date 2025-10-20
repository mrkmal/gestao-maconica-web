(function() {
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const loginContainer = document.getElementById('login-container');
    const mainContentWrapper = document.getElementById('main-content-wrapper');

    if (!loginButton) {
        console.error('FATAL: Botão de login com id="login-button" não encontrado!');
        return;
    }

    // Nova abordagem: Listener de CLIQUE diretamente no botão
    loginButton.addEventListener('click', (e) => {
        e.preventDefault(); // Impede o comportamento padrão do botão (que é submeter o form)
        console.log("Evento de CLIQUE no botão de login disparado.");

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
                console.log("Login bem-sucedido para o usuário:", userCredential.user.email);
                // O onAuthStateChanged vai cuidar de mostrar/esconder os containers
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

    // Observador do estado de autenticação do Firebase (sem alterações aqui)
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('onAuthStateChanged: Usuário autenticado, exibindo conteúdo principal.');
            loginContainer.style.display = 'none';
            mainContentWrapper.style.display = 'block';
            if (window.initializeApp) {
                window.initializeApp();
            }
        } else {
            console.log('onAuthStateChanged: Nenhum usuário autenticado, exibindo tela de login.');
            loginContainer.style.display = 'block';
            mainContentWrapper.style.display = 'none';
        }
    });

})();
