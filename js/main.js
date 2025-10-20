window.initializeApp = function() {
    const content = document.getElementById('content');

    function loadModule(modulePath) {
        // Remove o script do módulo anterior para evitar execuções duplicadas
        const oldModuleScript = document.getElementById('module-script');
        if (oldModuleScript) {
            oldModuleScript.remove();
        }

        fetch(modulePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`O arquivo do módulo não foi encontrado: ${modulePath}`);
                }
                return response.text();
            })
            .then(html => {
                // Cria um container temporário na memória para analisar o HTML recebido
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                // Encontra a tag de script dentro do HTML carregado
                const scriptTag = tempDiv.querySelector('script');
                
                // Se encontrou uma tag de script, remove ela do container temporário
                // para que não seja inserida na página de forma inativa.
                if (scriptTag) {
                    scriptTag.remove();
                }

                // Limpa o conteúdo principal e insere o novo HTML (já sem o script)
                content.innerHTML = tempDiv.innerHTML;

                // Se um script foi encontrado, cria um novo elemento de script
                // e o adiciona ao final do <body>. Isso força o navegador a executá-lo.
                if (scriptTag) {
                    const newScript = document.createElement('script');
                    newScript.id = 'module-script'; // ID para fácil remoção posterior

                    if (scriptTag.src) {
                        // Se o script original tinha um caminho (src), copia o caminho
                        newScript.src = scriptTag.src;
                    } else {
                        // Se era um script inline, copia o conteúdo
                        newScript.textContent = scriptTag.textContent;
                    }
                    
                    document.body.appendChild(newScript);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar módulo:', error);
                content.innerHTML = `<p style="color: red; text-align: center;">${error.message}</p>`;
            });
    }

    // Carrega o módulo inicial de "Graus" por padrão
    loadModule('modules/graus.html');

    // Adiciona os listeners para os links de navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadModule(e.target.getAttribute('data-module'));
        });
    });
};
