window.ModuleHandler = {
    // ... (initGraus e initMacons permanecem os mesmos)
    initGraus: function() {
        console.log("ModuleHandler: Initializing Graus module...");
        const db = firebase.firestore();
        const form = document.getElementById('form-graus');
        const tableBody = document.querySelector('#graus-table tbody');

        if (!form || !tableBody) {
            console.error("Erro: Elementos do módulo de graus (formulário ou tabela) não encontrados.");
            return;
        }

        const loadGraus = () => {
            db.collection("graus").orderBy("nome").onSnapshot((querySnapshot) => {
                tableBody.innerHTML = '';
                querySnapshot.forEach((doc) => {
                    const grau = doc.data();
                    const row = tableBody.insertRow();
                    row.setAttribute('data-id', doc.id);
                    row.innerHTML = `
                        <td>${grau.nome}</td>
                        <td><button class=\"edit-btn\">Editar</button></td>
                        <td><button class=\"delete-btn\">Excluir</button></td>
                    `;
                });
            });
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nomeInput = document.getElementById('nome');
            if (nomeInput.value.trim() === '') return;
            db.collection("graus").add({ nome: nomeInput.value.trim() })
                .then(() => form.reset())
                .catch(error => console.error("Erro ao adicionar grau: ", error));
        });

        tableBody.addEventListener('click', (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;
            const id = row.getAttribute('data-id');
            if (target.classList.contains('edit-btn')) {
                const currentName = row.cells[0].textContent;
                const newName = prompt("Novo nome para o grau:", currentName);
                if (newName && newName.trim() !== '' && newName !== currentName) {
                    db.collection("graus").doc(id).update({ nome: newName.trim() });
                }
            }
            if (target.classList.contains('delete-btn')) {
                if (confirm("Tem certeza que deseja excluir este grau?")) {
                    db.collection("graus").doc(id).delete();
                }
            }
        });

        loadGraus();
    },

    initMacons: function() {
        console.log("ModuleHandler: Initializing Maçons module...");
        const db = firebase.firestore();
        const form = document.getElementById('form-macons');
        const tableBody = document.querySelector('#macons-table tbody');
        const grauSelect = document.getElementById('grau');

        if (!form || !tableBody || !grauSelect) {
            console.error("Erro: Elementos do módulo de maçons não encontrados.");
            return;
        }

        const loadGrausDropdown = () => {
            db.collection("graus").orderBy("nome").onSnapshot(querySnapshot => {
                const selectedValue = grauSelect.value;
                grauSelect.innerHTML = '<option value=\"\">Selecione um Grau</option>';
                querySnapshot.forEach(doc => {
                    const option = document.createElement('option');
                    option.value = doc.id;
                    option.textContent = doc.data().nome;
                    grauSelect.appendChild(option);
                });
                grauSelect.value = selectedValue;
            });
        };

        const loadMacons = () => {
            db.collection("macons").orderBy("nome").onSnapshot(async (querySnapshot) => {
                const maconsData = [];
                for (const doc of querySnapshot.docs) {
                    const macon = doc.data();
                    macon.id = doc.id;
                    let grauNome = 'Grau não encontrado';
                    if (macon.grau) {
                        try {
                            const grauDoc = await db.collection("graus").doc(macon.grau).get();
                            if (grauDoc.exists) {
                                grauNome = grauDoc.data().nome;
                            }
                        } catch (error) {
                            console.error("Erro ao buscar grau do maçom:", error);
                        }
                    }
                    maconsData.push({ ...macon, grauNome });
                }
                tableBody.innerHTML = '';
                maconsData.forEach(macon => {
                    const row = tableBody.insertRow();
                    row.setAttribute('data-id', macon.id);
                    row.innerHTML = `
                        <td>${macon.nome}</td>
                        <td>${macon.grauNome}</td>
                        <td><button class=\"edit-btn\">Editar</button></td>
                        <td><button class=\"delete-btn\">Excluir</button></td>
                    `;
                });
            });
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const grauId = grauSelect.value;
            if (nome === '' || grauId === '') return;
            db.collection("macons").add({ nome: nome, grau: grauId })
                .then(() => form.reset())
                .catch(error => console.error("Erro ao adicionar maçom:", error));
        });

        tableBody.addEventListener('click', async (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;
            const id = row.getAttribute('data-id');
            const maconRef = db.collection("macons").doc(id);
            if (target.classList.contains('edit-btn')) {
                const maconDoc = await maconRef.get();
                const maconData = maconDoc.data();
                const newName = prompt("Novo nome para o maçom:", maconData.nome);
                if (newName && newName.trim() !== '') {
                    maconRef.update({ nome: newName.trim() });
                }
            }
            if (target.classList.contains('delete-btn')) {
                if (confirm("Tem certeza que deseja excluir este maçom?")) {
                    maconRef.delete();
                }
            }
        });

        loadGrausDropdown();
        loadMacons();
    },

    initReunioes: function() {
        console.log("ModuleHandler: Initializing Reunioes module...");
        const db = firebase.firestore();
        const form = document.getElementById('form-reunioes');
        const tableBody = document.querySelector('#reunioes-table tbody');

        if (!form || !tableBody) {
            console.error("Erro: Elementos do módulo de reuniões não encontrados.");
            return;
        }

        const loadReunioes = () => {
            db.collection("reunioes").orderBy("data", "desc").onSnapshot(snapshot => {
                tableBody.innerHTML = '';
                snapshot.forEach(doc => {
                    const reuniao = doc.data();
                    const row = tableBody.insertRow();
                    row.setAttribute('data-id', doc.id);
                    // Formata a data para exibição
                    const dataFormatada = new Date(reuniao.data + 'T00:00:00').toLocaleDateString();
                    row.innerHTML = `
                        <td>${dataFormatada}</td>
                        <td>${reuniao.pauta}</td>
                        <td><button class=\"edit-btn\">Editar</button></td>
                        <td><button class=\"delete-btn\">Excluir</button></td>
                    `;
                });
            });
        };

        form.addEventListener('submit', e => {
            e.preventDefault();
            const data = document.getElementById('data').value;
            const pauta = document.getElementById('pauta').value.trim();
            if (data === '' || pauta === '') return;

            db.collection("reunioes").add({ data, pauta })
                .then(() => form.reset())
                .catch(error => console.error("Erro ao agendar reunião: ", error));
        });

        tableBody.addEventListener('click', e => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;

            const id = row.getAttribute('data-id');
            const reuniaoRef = db.collection("reunioes").doc(id);

            if (target.classList.contains('edit-btn')) {
                const currentData = row.cells[0].textContent;
                const currentPauta = row.cells[1].textContent;
                
                // O input de data espera o formato AAAA-MM-DD
                const dataISO = new Date(currentData.split('/').reverse().join('-')).toISOString().split('T')[0];

                const newData = prompt("Nova data para a reunião:", dataISO);
                const newPauta = prompt("Nova pauta para a reunião:", currentPauta);

                if (newData && newPauta && newPauta.trim() !== '') {
                    reuniaoRef.update({ data: newData, pauta: newPauta.trim() });
                }
            }

            if (target.classList.contains('delete-btn')) {
                if (confirm("Tem certeza que deseja excluir esta reunião?")) {
                    reuniaoRef.delete();
                }
            }
        });

        loadReunioes();
    },

    initEventos: function() { console.log("initEventos called"); },
};