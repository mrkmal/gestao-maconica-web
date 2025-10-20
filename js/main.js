window.initializeApp = function() {
    const content = document.getElementById('content');

    function loadModule(modulePath) {
        fetch(modulePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao carregar o módulo: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                // Limpa o conteúdo antigo e remove scripts antigos para evitar duplicatas
                content.innerHTML = '';

                // Cria um container temporário para manipular o HTML recebido
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                // Encontra todos os scripts no HTML carregado
                const scripts = tempDiv.querySelectorAll('script');

                // Adiciona o HTML (sem os scripts) ao DOM
                // Move todos os filhos do tempDiv para o elemento de conteúdo
                while (tempDiv.firstChild) {
                    content.appendChild(tempDiv.firstChild);
                }

                // Para cada script encontrado, cria um novo elemento de script e o anexa
                // Isso força o navegador a carregar e executar o script
                scripts.forEach(oldScript => {
                    const newScript = document.createElement('script');
                    // Copia o atributo 'src' se ele existir
                    if (oldScript.src) {
                        newScript.src = oldScript.src;
                        // Adiciona ao final do body para garantir que o DOM esteja pronto
                        document.body.appendChild(newScript).onload = () => {
                            // Opcional: remover o script após a execução
                            document.body.removeChild(newScript);
                        };
                    } else {
                        // Copia o conteúdo para scripts inline
                        newScript.textContent = oldScript.textContent;
                        content.appendChild(newScript);
                    }
                });
            })
            .catch(error => {
                console.error('[Main] Erro crítico ao carregar módulo:', error);
                content.innerHTML = '<p>Erro ao carregar o conteúdo. Verifique o console para mais detalhes.</p>';
            });
    }

    // Carregar o primeiro módulo por padrão
    loadModule('modules/graus.html');

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const modulePath = this.getAttribute('data-module');
            loadModule(modulePath);
        });
    });
};
