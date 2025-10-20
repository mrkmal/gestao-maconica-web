(function() {
    if (!window.moduleInitializers) {
        window.moduleInitializers = {};
    }

    window.moduleInitializers.reunioes = function() {
        console.log("Módulo de Reuniões inicializado!");

        const db = firebase.firestore();
        const form = document.getElementById('form-reunioes');
        const dataInput = document.getElementById('data-reuniao');
        const pautaInput = document.getElementById('pauta-reuniao');
        const localInput = document.getElementById('local-reuniao');
        const tableBody = document.querySelector('#reunioes-table tbody');

        if (!form || !tableBody || !dataInput || !pautaInput || !localInput) {
            console.error("Elementos essenciais do módulo de reuniões não foram encontrados.");
            return;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = dataInput.value;
            const pauta = pautaInput.value;
            const local = localInput.value;

            if (!data || !pauta || !local) {
                alert("Por favor, preencha todos os campos.");
                return;
            }
            
            console.log("Agendando reunião:", { data, pauta, local });
            db.collection('reunioes').add({
                data: data,
                pauta: pauta,
                local: local
            })
            .then(() => {
                console.log("Reunião agendada com sucesso.");
                form.reset();
            })
            .catch(err => console.error("Erro ao agendar reunião: ", err));
        });

        db.collection('reunioes').orderBy('data', 'desc').onSnapshot(snapshot => {
            tableBody.innerHTML = '';
            snapshot.forEach(doc => {
                const reuniao = doc.data();
                const id = doc.id;

                const row = document.createElement('tr');
                // Adiciona T00:00:00 para evitar problemas de fuso horário ao converter
                const displayDate = new Date(reuniao.data + 'T00:00:00').toLocaleDateString();
                row.innerHTML = `
                    <td>${displayDate}</td>
                    <td>${reuniao.pauta}</td>
                    <td>${reuniao.local}</td>
                    <td>
                        <button class="edit-btn" data-id="${id}" data-data="${reuniao.data}" data-pauta="${reuniao.pauta}" data-local="${reuniao.local}">Editar</button>
                        <button class="delete-btn" data-id="${id}">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    if (confirm('Tem certeza que deseja cancelar esta reunião?')) {
                        db.collection('reunioes').doc(id).delete();
                    }
                });
            });

            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const currentData = e.target.getAttribute('data-data');
                    const currentPauta = e.target.getAttribute('data-pauta');
                    const currentLocal = e.target.getAttribute('data-local');

                    const novaData = prompt("Digite a nova data (AAAA-MM-DD):", currentData);
                    const novaPauta = prompt("Digite a nova pauta:", currentPauta);
                    const novoLocal = prompt("Digite o novo local:", currentLocal);

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
