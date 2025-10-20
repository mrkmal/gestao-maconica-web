(function() {
    // Garante que o objeto global de inicializadores exista
    if (!window.moduleInitializers) {
        window.moduleInitializers = {};
    }

    // Define a função que sabe como inicializar o módulo de Graus
    window.moduleInitializers.graus = function() {
        console.log("Módulo de Graus inicializado!");

        const db = firebase.firestore();
        const form = document.getElementById('form-graus');
        const tableBody = document.querySelector('#graus-table tbody');

        if (!form || !tableBody) {
            console.error("Elementos essenciais do módulo de graus não foram encontrados.");
            return;
        }

        // Listener para adicionar novos graus
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = form['nome'].value;
            db.collection('graus').add({ nome: nome })
                .then(() => {
                    form.reset();
                })
                .catch(err => console.error("Erro ao adicionar grau: ", err));
        });

        // Listener para exibir e atualizar os graus em tempo real
        db.collection('graus').orderBy('nome').onSnapshot(snapshot => {
            tableBody.innerHTML = ''; // Limpa a tabela antes de redesenhar
            snapshot.forEach(doc => {
                const grau = doc.data();
                const id = doc.id;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${grau.nome}</td>
                    <td><button class="edit-btn" data-id="${id}">Editar</button></td>
                    <td><button class="delete-btn" data-id="${id}">Excluir</button></td>
                `;
                tableBody.appendChild(row);
            });

            // Adiciona os listeners para os botões de excluir
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Tem certeza que deseja excluir este grau?')) {
                        db.collection('graus').doc(id).delete();
                    }
                });
            });
            
            // Adiciona os listeners para os botões de editar
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const novoNome = prompt("Digite o novo nome para o grau:");
                    if (novoNome) {
                        db.collection('graus').doc(id).update({ nome: novoNome });
                    }
                });
            });

        });
    };
})();
