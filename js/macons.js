document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore();

    const form = document.getElementById('form-macons');
    const table = document.getElementById('macons-table').getElementsByTagName('tbody')[0];

    // Load graus into dropdown
    db.collection("graus").onSnapshot((querySnapshot) => {
        const select = document.getElementById('grau');
        select.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.text = doc.data().nome;
            select.appendChild(option);
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const grauId = document.getElementById('grau').value;

        db.collection("macons").add({
            nome: nome,
            grau: grauId,
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            form.reset();
            loadMacons();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    });

    function loadMacons() {
        db.collection("macons").onSnapshot((querySnapshot) => {
            table.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const macon = doc.data();
                db.collection("graus").doc(macon.grau).get().then((grauDoc) => {
                    const row = table.insertRow();
                    row.innerHTML = `<td>${macon.nome}</td>
                                     <td>${grauDoc.data().nome}</td>
                                     <td><button onclick="editMacon('${doc.id}')">Editar</button></td>
                                     <td><button onclick="deleteMacon('${doc.id}')">Excluir</button></td>`;
                });
            });
        });
    }

    window.editMacon = function(id) {
        const newName = prompt("Novo nome para o maçom:");
        if (newName) {
            db.collection("macons").doc(id).update({ nome: newName });
        }
    }

    window.deleteMacon = function(id) {
        if (confirm("Tem certeza que deseja excluir este maçom?")) {
            db.collection("macons").doc(id).delete();
        }
    }

    loadMacons();
});