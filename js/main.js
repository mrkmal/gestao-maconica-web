window.initializeApp = function() {
    const content = document.getElementById('content');

    // Função para carregar o módulo e chamar seu inicializador
    function loadModule(modulePath) {
        // 1. Extrai o nome do módulo do caminho do arquivo (ex: 'modules/graus.html' -> 'graus')
        const moduleName = modulePath.split('/').pop().split('.')[0];

        // 2. Busca o conteúdo HTML do módulo
        fetch(modulePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Falha ao carregar o HTML do módulo: ${modulePath}`);
                }
                return response.text();
            })
            .then(html => {
                // 3. Insere o HTML puro na área de conteúdo da página
                content.innerHTML = html;

                // 4. Verifica se um inicializador para este módulo foi registrado
                if (window.moduleInitializers && typeof window.moduleInitializers[moduleName] === 'function') {
                    // 5. Executa a função de inicialização específica do módulo
                    window.moduleInitializers[moduleName]();
                } else {
                    console.warn(`Nenhum inicializador de módulo encontrado para: ${moduleName}`);
                }
            })
            .catch(error => {
                console.error('Erro crítico ao carregar módulo:', error);
                content.innerHTML = `<p style="color: red;">${error.message}</p>`;
            });
    }

    // Carrega o módulo inicial por padrão
    loadModule('modules/graus.html');

    // Configura os links de navegação para carregar outros módulos ao serem clicados
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modulePath = e.target.getAttribute('data-module');
            loadModule(modulePath);
        });
    });
};
