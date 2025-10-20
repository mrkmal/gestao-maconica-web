(function() {
    if (!window.moduleInitializers) {
        window.moduleInitializers = {};
    }

    window.moduleInitializers.eventos = function() {
        console.log("Módulo de Eventos inicializado!");

        const db = firebase.firestore();
        const form = document.getElementById('form-eventos');
        const tableBody = document.querySelector('#eventos-table tbody');

        if (!form || !tableBody) {
            console.error("Elementos essenciais do módulo de eventos não foram encontrados.");
            return;
        }

        // Adicionar novo evento
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            db.collection('eventos').add({
                nome: form['nome-evento'].value,
                data: form['data-evento'].value,
                local: form['local-evento'].value
            })
            .then(() => form.reset())
            .catch(err => console.error("Erro ao criar evento: ", err));
        });

        // Carregar e ouvir por eventos
        db.collection('eventos').orderBy('data', 'desc').onSnapshot(snapshot => {
            tableBody.innerHTML = '';
            snapshot.forEach(doc => {
                const evento = doc.data();
                const id = doc.id;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${evento.nome}</td>
                    <td>${new Date(evento.data + 'T00:00:00').toLocaleDateString()}</td>
                    <td>${evento.local}</td>
                    <td>
                        <button class="edit-btn" data-id="${id}">Editar</button>
                        <button class="delete-btn" data-id="${id}">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Listeners para exclusão
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Tem certeza que deseja cancelar este evento?')) {
                        db.collection('eventos').doc(id).delete();
                    }
                });
            });

            // Listeners para edição
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const novoNome = prompt("Digite o novo nome do evento:");
                    const novaData = prompt("Digite a nova data (AAAA-MM-DD):");
                    const novoLocal = prompt("Digite o novo local:");

                    if (novoNome && novaData && novoLocal) {
                        db.collection('eventos').doc(id).update({ 
                            nome: novoNome, 
                            data: novaData, 
                            local: novoLocal 
                        });
                    }
                });
            });
        });
    };
})();
