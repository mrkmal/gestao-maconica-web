(function() {
    // Garante que o objeto global de inicializadores exista
    if (!window.moduleInitializers) {
        window.moduleInitializers = {};
    }

    // Define a função que sabe como inicializar o módulo de Maçons
    window.moduleInitializers.macons = function() {
        console.log("Módulo de Maçons inicializado!");

        const db = firebase.firestore();
        const form = document.getElementById('form-macons');
        const tableBody = document.querySelector('#macons-table tbody');

        if (!form || !tableBody) {
            console.error("Elementos essenciais do módulo de maçons não foram encontrados.");
            return;
        }

        // Listener para adicionar novos maçons
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = form['nome-macon'].value;
            const grau = form['grau-macon'].value;
            const loja = form['loja-macon'].value;

            db.collection('macons').add({ 
                nome: nome,
                grau: grau,
                loja: loja
            })
            .then(() => {
                form.reset();
            })
            .catch(err => console.error("Erro ao adicionar maçom: ", err));
        });

        // Listener para exibir e atualizar os maçons em tempo real
        db.collection('macons').orderBy('nome').onSnapshot(snapshot => {
            tableBody.innerHTML = ''; // Limpa a tabela
            snapshot.forEach(doc => {
                const macon = doc.data();
                const id = doc.id;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${macon.nome}</td>
                    <td>${macon.grau}</td>
                    <td>${macon.loja}</td>
                    <td>
                        <button class="edit-btn" data-id="${id}">Editar</button>
                        <button class="delete-btn" data-id="${id}">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Adiciona listeners para os botões de exclusão
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Tem certeza que deseja excluir este maçom?')) {
                        db.collection('macons').doc(id).delete();
                    }
                });
            });

            // Adiciona listeners para os botões de edição
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const novoNome = prompt("Digite o novo nome:");
                    const novoGrau = prompt("Digite o novo grau:");
                    const novaLoja = prompt("Digite a nova loja:");

                    if (novoNome && novoGrau && novaLoja) {
                        db.collection('macons').doc(id).update({ 
                            nome: novoNome, 
                            grau: novoGrau, 
                            loja: novaLoja 
                        });
                    }
                });
            });
        });
    };
})();
