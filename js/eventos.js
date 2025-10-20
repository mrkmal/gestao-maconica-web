document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore();

    const form = document.getElementById('form-eventos');
    const table = document.getElementById('eventos-table').getElementsByTagName('tbody')[0];

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const data = document.getElementById('data').value;

        db.collection("eventos").add({
            nome: nome,
            data: data,
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            form.reset();
            loadEventos();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    });

    function loadEventos() {
        db.collection("eventos").onSnapshot((querySnapshot) => {
            table.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const evento = doc.data();
                const row = table.insertRow();
                row.innerHTML = `<td>${evento.nome}</td>
                                 <td>${evento.data}</td>
                                 <td><button onclick="editEvento('${doc.id}')">Editar</button></td>
                                 <td><button onclick="deleteEvento('${doc.id}')">Excluir</button></td>`;
            });
        });
    }

    window.editEvento = function(id) {
        const newName = prompt("Novo nome para o evento:");
        const newData = prompt("Nova data para o evento:");
        if (newName && newData) {
            db.collection("eventos").doc(id).update({ nome: newName, data: newData });
        }
    }

    window.deleteEvento = function(id) {
        if (confirm("Tem certeza que deseja excluir este evento?")) {
            db.collection("eventos").doc(id).delete();
        }
    }

    loadEventos();
});