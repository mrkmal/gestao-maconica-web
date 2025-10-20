document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore();

    const form = document.getElementById('form-graus');
    const table = document.getElementById('graus-table').getElementsByTagName('tbody')[0];

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;

        db.collection("graus").add({
            nome: nome,
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            form.reset();
            loadGraus();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    });

    function loadGraus() {
        db.collection("graus").onSnapshot((querySnapshot) => {
            table.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const grau = doc.data();
                const row = table.insertRow();
                row.innerHTML = `<td>${grau.nome}</td>
                                 <td><button onclick="editGrau('${doc.id}')">Editar</button></td>
                                 <td><button onclick="deleteGrau('${doc.id}')">Excluir</button></td>`;
            });
        });
    }

    window.editGrau = function(id) {
        const newName = prompt("Novo nome para o grau:");
        if (newName) {
            db.collection("graus").doc(id).update({ nome: newName });
        }
    }

    window.deleteGrau = function(id) {
        if (confirm("Tem certeza que deseja excluir este grau?")) {
            db.collection("graus").doc(id).delete();
        }
    }

    loadGraus();
});