window.initializeApp = function() {
    const content = document.getElementById('content');

    // Objeto que mapeia caminhos de módulo para suas funções de inicialização
    const moduleInitializers = {
        'modules/graus.html': () => window.ModuleHandler.initGraus(),
        'modules/macons.html': () => window.ModuleHandler.initMacons(),
        'modules/reunioes.html': () => window.ModuleHandler.initReunioes(),
        'modules/eventos.html': () => window.ModuleHandler.initEventos(),
    };

    function loadModule(modulePath) {
        // Busca apenas o HTML puro
        fetch(modulePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Falha ao carregar o conteúdo do módulo: ${modulePath}`);
                }
                return response.text();
            })
            .then(html => {
                // Insere o HTML na página. Simples assim.
                content.innerHTML = html;
                
                // Chama a função de inicialização correspondente que já está na memória
                const initializer = moduleInitializers[modulePath];
                if (initializer) {
                    initializer();
                } else {
                    console.warn(`Nenhuma função de inicialização encontrada para ${modulePath}`);
                }
            })
            .catch(error => {
                console.error('Erro crítico ao carregar módulo:', error);
                content.innerHTML = `<p style="color: red;">${error.message}</p>`;
            });
    }

    // Carregar o primeiro módulo por padrão
    loadModule('modules/graus.html');

    // Configura os links de navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modulePath = e.target.getAttribute('data-module');
            loadModule(modulePath);
        });
    });
};
