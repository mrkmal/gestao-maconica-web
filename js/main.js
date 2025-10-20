(function() {
    // O objeto global que segura as funções de inicialização dos módulos
    if (!window.moduleInitializers) {
        window.moduleInitializers = {};
    }

    const contentContainer = document.getElementById('content');

    // Função para carregar o conteúdo de um módulo e inicializá-lo
    function loadModule(modulePath) {
        if (!modulePath || typeof modulePath !== 'string') {
            console.error('Caminho do módulo inválido:', modulePath);
            contentContainer.innerHTML = '<p>Erro ao carregar o módulo. Caminho não especificado.</p>';
            return;
        }

        fetch(modulePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                contentContainer.innerHTML = html;
                
                // Extrai o nome do módulo do caminho (ex: 'modules/graus.html' -> 'graus')
                const moduleName = modulePath.split('/').pop().replace('.html', '');

                // Verifica se existe uma função de inicialização para este módulo
                if (window.moduleInitializers[moduleName]) {
                    // Chama a função de inicialização específica do módulo
                    window.moduleInitializers[moduleName]();
                } else {
                    console.warn(`Nenhuma função de inicialização encontrada para o módulo: ${moduleName}`);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar módulo:', error);
                contentContainer.innerHTML = `<p>Ocorreu um erro ao carregar o conteúdo. Por favor, tente novamente. Detalhe: ${error}</p>`;
            });
    }

    // Função global de inicialização da aplicação, chamada pelo auth.js após o login
    window.initializeApp = function() {
        console.log("Inicializando a aplicação principal...");

        // Adiciona os listeners aos links de navegação
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const modulePath = this.getAttribute('data-module');
                loadModule(modulePath);
            });
        });

        // Carrega o primeiro módulo por padrão para evitar tela branca
        const defaultModulePath = navLinks.length > 0 ? navLinks[0].getAttribute('data-module') : null;
        if (defaultModulePath) {
            loadModule(defaultModulePath);
        } else {
            contentContainer.innerHTML = "<p>Bem-vindo! Nenhum módulo de navegação foi configurado.</p>";
        }
    };

})();
