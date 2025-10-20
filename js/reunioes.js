document.addEventListener('DOMContentLoaded', function() {
    const db = firebase.firestore();

    const form = document.getElementById('form-reunioes');
    const table = document.getElementById('reunioes-table').getElementsByTagName('tbody')[0];

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const data = document.getElementById('data').value;
        const pauta = document.getElementById('pauta').value;

        db.collection("reunioes").add({
            data: data,
            pauta: pauta,
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            form.reset();
            loadReunioes();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    });

    function loadReunioes() {
        db.collection("reunioes").onSnapshot((querySnapshot) => {
            table.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const reuniao = doc.data();
                const row = table.insertRow();
                row.innerHTML = `<td>${reuniao.data}</td>
                                 <td>${reuniao.pauta}</td>
                                 <td><button onclick="editReuniao('${doc.id}')">Editar</button></td>
                                 <td><button onclick="deleteReuniao('${doc.id}')">Excluir</button></td>`;
            });
        });
    }

    window.editReuniao = function(id) {
        const newData = prompt("Nova data para a reunião:");
        const newPauta = prompt("Nova pauta para a reunião:");
        if (newData && newPauta) {
            db.collection("reunioes").doc(id).update({ data: newData, pauta: newPauta });
        }
    }

    window.deleteReuniao = function(id) {
        if (confirm("Tem certeza que deseja excluir esta reunião?")) {
            db.collection("reunioes").doc(id).delete();
        }
    }

    loadReunioes();
});