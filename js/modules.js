window.ModuleHandler = {
    // Inicializa a lógica para o módulo de Graus
    initGraus: function() {
        console.log("ModuleHandler: Initializing Graus module...");
        const db = firebase.firestore();
        const form = document.getElementById('form-graus');
        const tableBody = document.querySelector('#graus-table tbody');

        if (!form || !tableBody) {
            console.error("Erro: Elementos do módulo de graus (formulário ou tabela) não encontrados.");
            return;
        }

        // Função para carregar e exibir os graus do Firestore
        const loadGraus = () => {
            db.collection("graus").orderBy("nome").onSnapshot((querySnapshot) => {
                tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados
                querySnapshot.forEach((doc) => {
                    const grau = doc.data();
                    const row = tableBody.insertRow();
                    row.setAttribute('data-id', doc.id);

                    row.innerHTML = `
                        <td>${grau.nome}</td>
                        <td><button class="edit-btn">Editar</button></td>
                        <td><button class="delete-btn">Excluir</button></td>
                    `;
                });
            });
        };

        // Adicionar um novo grau
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nomeInput = document.getElementById('nome');
            if (nomeInput.value.trim() === '') return;

            db.collection("graus").add({ nome: nomeInput.value.trim() })
                .then(() => {
                    form.reset();
                })
                .catch(error => console.error("Erro ao adicionar grau: ", error));
        });

        // Lidar com cliques para Editar e Excluir usando delegação de eventos
        tableBody.addEventListener('click', (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;
            
            const id = row.getAttribute('data-id');

            // Botão de Editar
            if (target.classList.contains('edit-btn')) {
                const currentName = row.cells[0].textContent;
                const newName = prompt("Novo nome para o grau:", currentName);
                if (newName && newName.trim() !== '' && newName !== currentName) {
                    db.collection("graus").doc(id).update({ nome: newName.trim() });
                }
            }

            // Botão de Excluir
            if (target.classList.contains('delete-btn')) {
                if (confirm("Tem certeza que deseja excluir este grau?")) {
                    db.collection("graus").doc(id).delete();
                }
            }
        });

        // Carregamento inicial dos dados
        loadGraus();
    },

    // As funções initMacons, initReunioes, etc., virão aqui
    initMacons: function() { console.log("initMacons called"); },
    initReunioes: function() { console.log("initReunioes called"); },
    initEventos: function() { console.log("initEventos called"); },
};