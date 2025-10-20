(function() {
    if (!window.moduleInitializers) {
        window.moduleInitializers = {};
    }

    window.moduleInitializers.macons = function() {
        console.log("Módulo de Maçons inicializado!");

        const db = firebase.firestore();
        const form = document.getElementById('form-macons');
        const nomeInput = document.getElementById('nome-macon');
        const grauInput = document.getElementById('grau-macon');
        const lojaInput = document.getElementById('loja-macon');
        const tableBody = document.querySelector('#macons-table tbody');

        if (!form || !tableBody || !nomeInput || !grauInput || !lojaInput) {
            console.error("Elementos essenciais do módulo de maçons não foram encontrados.");
            return;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = nomeInput.value;
            const grau = grauInput.value;
            const loja = lojaInput.value;

            if (!nome || !grau || !loja) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            console.log("Adicionando maçom:", { nome, grau, loja });
            db.collection('macons').add({ 
                nome: nome,
                grau: grau,
                loja: loja
            })
            .then(() => {
                console.log("Maçom adicionado com sucesso.");
                form.reset();
            })
            .catch(err => console.error("Erro ao adicionar maçom: ", err));
        });

        db.collection('macons').orderBy('nome').onSnapshot(snapshot => {
            tableBody.innerHTML = '';
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

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Tem certeza que deseja excluir este maçom?')) {
                        db.collection('macons').doc(id).delete();
                    }
                });
            });

            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const maconDoc = db.collection('macons').doc(id);

                    maconDoc.get().then(doc => {
                        if (doc.exists) {
                            const macon = doc.data();
                            const novoNome = prompt("Digite o novo nome:", macon.nome);
                            const novoGrau = prompt("Digite o novo grau:", macon.grau);
                            const novaLoja = prompt("Digite a nova loja:", macon.loja);

                            if (novoNome !== null && novoGrau !== null && novaLoja !== null) {
                                maconDoc.update({ 
                                    nome: novoNome,
                                    grau: novoGrau,
                                    loja: novaLoja
                                });
                            }
                        }
                    });
                });
            });
        });
    };
})();
