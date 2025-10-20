(function() {
    if (!window.moduleInitializers) {
        window.moduleInitializers = {};
    }

    window.moduleInitializers.graus = function() {
        console.log("Módulo de Graus inicializado!");

        const db = firebase.firestore();
        const form = document.getElementById('form-graus');
        const nomeInput = document.getElementById('nome'); // Pega o campo de input pelo ID
        const tableBody = document.querySelector('#graus-table tbody');

        if (!form || !tableBody || !nomeInput) {
            console.error("Elementos essenciais (formulário, input ou tabela) do módulo de graus não foram encontrados.");
            return;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = nomeInput.value; // Pega o valor do campo de input

            if (!nome) {
                alert("Por favor, digite o nome do grau.");
                return;
            }
            
            console.log("Tentando adicionar grau:", nome);
            db.collection('graus').add({ nome: nome })
                .then(() => {
                    console.log("Grau adicionado com sucesso!");
                    form.reset();
                })
                .catch(err => console.error("Erro ao adicionar grau: ", err));
        });

        // Listener para exibir e atualizar os graus em tempo real (código inalterado)
        db.collection('graus').orderBy('nome').onSnapshot(snapshot => {
            tableBody.innerHTML = ''; 
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

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Tem certeza que deseja excluir este grau?')) {
                        db.collection('graus').doc(id).delete();
                    }
                });
            });
            
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
