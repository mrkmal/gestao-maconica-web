function initializeApp() {
    const content = document.getElementById('content');

    function loadModule(modulePath) {
        fetch(modulePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar o módulo.');
                }
                return response.text();
            })
            .then(data => {
                content.innerHTML = data;
            })
            .catch(error => {
                console.error('Erro:', error);
                content.innerHTML = '<p>Erro ao carregar o conteúdo. Por favor, tente novamente mais tarde.</p>';
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
}

// Ouvinte de evento para ser chamado pelo auth.js
document.addEventListener('app:authenticated', initializeApp);
