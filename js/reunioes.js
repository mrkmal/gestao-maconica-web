(function() {
    if (!window.moduleInitializers) {
        window.moduleInitializers = {};
    }

    window.moduleInitializers.reunioes = function() {
        console.log("Módulo de Reuniões inicializado!");

        const db = firebase.firestore();
        const form = document.getElementById('form-reunioes');
        const tableBody = document.querySelector('#reunioes-table tbody');

        if (!form || !tableBody) {
            console.error("Elementos essenciais do módulo de reuniões não foram encontrados.");
            return;
        }

        // Adicionar nova reunião
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            db.collection('reunioes').add({
                data: form['data-reuniao'].value,
                pauta: form['pauta-reuniao'].value,
                local: form['local-reuniao'].value
            })
            .then(() => form.reset())
            .catch(err => console.error("Erro ao agendar reunião: ", err));
        });

        // Carregar e ouvir por reuniões
        db.collection('reunioes').orderBy('data', 'desc').onSnapshot(snapshot => {
            tableBody.innerHTML = '';
            snapshot.forEach(doc => {
                const reuniao = doc.data();
                const id = doc.id;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(reuniao.data + 'T00:00:00').toLocaleDateString()}</td>
                    <td>${reuniao.pauta}</td>
                    <td>${reuniao.local}</td>
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
                    if (confirm('Tem certeza que deseja cancelar esta reunião?')) {
                        db.collection('reunioes').doc(id).delete();
                    }
                });
            });

            // Listeners para edição
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const novaData = prompt("Digite a nova data (AAAA-MM-DD):");
                    const novaPauta = prompt("Digite a nova pauta:");
                    const novoLocal = prompt("Digite o novo local:");

                    if (novaData && novaPauta && novoLocal) {
                        db.collection('reunioes').doc(id).update({ 
                            data: novaData, 
                            pauta: novaPauta, 
                            local: novoLocal 
                        });
                    }
                });
            });
        });
    };
})();
