(function() {
    if (!window.moduleInitializers) {
        window.moduleInitializers = {};
    }

    window.moduleInitializers.eventos = function() {
        console.log("Módulo de Eventos inicializado!");

        const db = firebase.firestore();
        const form = document.getElementById('form-eventos');
        const nomeInput = document.getElementById('nome-evento');
        const dataInput = document.getElementById('data-evento');
        const localInput = document.getElementById('local-evento');
        const tableBody = document.querySelector('#eventos-table tbody');

        if (!form || !tableBody || !nomeInput || !dataInput || !localInput) {
            console.error("Elementos essenciais do módulo de eventos não foram encontrados.");
            return;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = nomeInput.value;
            const data = dataInput.value;
            const local = localInput.value;

            if (!nome || !data || !local) {
                alert("Por favor, preencha todos os campos.");
                return;
            }
            
            console.log("Criando evento:", { nome, data, local });
            db.collection('eventos').add({
                nome: nome,
                data: data,
                local: local
            })
            .then(() => {
                console.log("Evento criado com sucesso.");
                form.reset();
            })
            .catch(err => console.error("Erro ao criar evento: ", err));
        });

        db.collection('eventos').orderBy('data', 'desc').onSnapshot(snapshot => {
            tableBody.innerHTML = '';
            snapshot.forEach(doc => {
                const evento = doc.data();
                const id = doc.id;

                const row = document.createElement('tr');
                const displayDate = new Date(evento.data + 'T00:00:00').toLocaleDateString();
                row.innerHTML = `
                    <td>${evento.nome}</td>
                    <td>${displayDate}</td>
                    <td>${evento.local}</td>
                    <td>
                        <button class="edit-btn" data-id="${id}" data-nome="${evento.nome}" data-data="${evento.data}" data-local="${evento.local}">Editar</button>
                        <button class="delete-btn" data-id="${id}">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Tem certeza que deseja cancelar este evento?')) {
                        db.collection('eventos').doc(id).delete();
                    }
                });
            });

            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const currentNome = e.target.getAttribute('data-nome');
                    const currentData = e.target.getAttribute('data-data');
                    const currentLocal = e.target.getAttribute('data-local');

                    const novoNome = prompt("Digite o novo nome do evento:", currentNome);
                    const novaData = prompt("Digite a nova data (AAAA-MM-DD):", currentData);
                    const novoLocal = prompt("Digite o novo local:", currentLocal);

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
