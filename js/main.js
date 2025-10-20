window.initializeApp = function() {
    const content = document.getElementById('content');

    function loadModule(modulePath) {
        fetch(modulePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Módulo não encontrado em: ${modulePath}`);
                }
                return response.text();
            })
            .then(html => {
                // Usa um elemento temporário para parsear o HTML recebido
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Extrai o script do HTML do módulo
                const oldScript = doc.querySelector('script');
                
                // Insere apenas o corpo do HTML no conteúdo principal
                content.innerHTML = doc.body.innerHTML;

                // Se um script foi encontrado, cria um novo para forçar a execução
                if (oldScript) {
                    const newScript = document.createElement('script');
                    
                    // Copia o conteúdo (para scripts inline) ou o src
                    if (oldScript.src) {
                        // Se o script tiver um src, é crucial que o caminho esteja correto
                        // e que o servidor possa encontrá-lo.
                        newScript.src = oldScript.src;
                    } else {
                        newScript.textContent = oldScript.textContent;
                    }
                    
                    // Remove o script antigo (se existir) para evitar duplicação de lógica
                    const existingScript = document.getElementById('module-script');
                    if (existingScript) {
                        existingScript.remove();
                    }
                    newScript.id = 'module-script';

                    // Adiciona o novo script ao final do body para executá-lo
                    document.body.appendChild(newScript);
                }
            })
            .catch(error => {
                console.error('Falha crítica ao carregar módulo:', error);
                content.innerHTML = `<p style="color: red;"><b>Erro:</b> ${error.message}. O conteúdo não pôde ser carregado.</p>`;
            });
    }

    // Carregar o primeiro módulo por padrão
    loadModule('modules/graus.html');

    // Configura os links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const modulePath = this.getAttribute('data-module');
            loadModule(modulePath);
        });
    });
};
