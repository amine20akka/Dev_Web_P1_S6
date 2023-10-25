// Fonction pour vérifier la date
function verifDate() {
    var dateInput = document.getElementById('dateNaissance');
    var enteredDate = new Date(dateInput.value);
    var currentDate = new Date();

    if (enteredDate > currentDate) {
        // Date is in the future - set invalid styles
        dateInput.style.border = '1px solid #FF6347';
        dateInput.style.background = '#FF6347';
        dateInput.style.textShadow = '0 0 4px #FF6347';
        alert("Veuillez choisir une date avant aujourd'hui : " + currentDate);
        document.getElementById('Ajouter-client').disabled = true;
    } else {
        // Date is valid - set valid styles
        dateInput.style.border = '1px solid #4CAF50';
        dateInput.style.background = '#85ed89';
        dateInput.style.textShadow = 'none';
        document.getElementById('Ajouter-client').disabled = false;
    }
}


// Fonction JavaScript pour la suppression d'un contact
function SupprimeContact(n) {
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    if (n >= 0 && n < contacts.length) {
        contacts.splice(n, 1);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}


$(document).ready(function () {

    // Stockage dans localStorage
    $('#contact-form').submit(function () {
        var nom = $("#nom").val();
        var prenom = $("#prenom").val();
        var telephone = $("#telephone").val();
        var email = $("#email").val();
        var dateNaissance = $("#dateNaissance").val();
        var nombreEnfants = $("#nombreEnfants").val();
        var contact = {
            nom: nom,
            prenom: prenom,
            telephone: telephone,
            email: email,
            dateNaissance: dateNaissance,
            nombreEnfants: nombreEnfants
        };

        var contacts = JSON.parse(localStorage.getItem('contacts')) || [];

        contacts.push(contact);

        localStorage.setItem('contacts', JSON.stringify(contacts));

        $("#nom, #prenom, #telephone, #email, #dateNaissance").val('');
        $("#nombreEnfants").val(0);
    }, construitTable(JSON.parse(localStorage.getItem('contacts')) || [])
    );


    // Construction du tableau des contacts (document + poubelle + deleteIcon)
    function construitTable(tableauDeContacts) {
        var tableBody = $("#tableContacts tbody");
        tableBody.empty();

        $.each(tableauDeContacts, function (index, contact) {
            var row = $("<tr>");

            // Ajout de l'image "document.png"
            var dragIcon = $("<img src='document.png' alt='Déplacer' class='drag-icon' draggable='true'>");
            dragIcon.attr('data-id', index);
            var dragCell = $("<td>").append(dragIcon);
            row.append(dragCell);

            $("<td>").text(contact.nom).appendTo(row);
            $("<td>").text(contact.prenom).appendTo(row);
            $("<td>").text(contact.telephone).appendTo(row);
            $("<td>").text(contact.email).appendTo(row);
            $("<td>").text(contact.dateNaissance).appendTo(row);
            $("<td>").text(contact.nombreEnfants).appendTo(row);
            row.appendTo(tableBody);

            // Ajout de l'image "delete.jpg"
            var deleteIcon = $("<img src='delete.jpg' alt='Supprimer' class='delete-icon' style='height: 30px;width: 30px;'>");
            deleteIcon.attr('data-id', index);
            var deleteCell = $("<td>").append(deleteIcon);
            row.append(deleteCell); row.appendTo(tableBody);
        });
    }


    // Event pour le delete d'un contact
    $(document).on('click', '.delete-icon', function () {
        var contactId = $(this).attr('data-id');
        SupprimeContact(contactId);
        construitTable(JSON.parse(localStorage.getItem('contacts')) || []);
    });


    // Drag-and-drop du document dans la poubelle pour la suppression
    $(document).on('dragstart', '.drag-icon', function (event) {
        var contactId = $(this).attr('data-id');
        event.originalEvent.dataTransfer.setData("text/plain", contactId);
    });
    $("#poubelle").on('dragover', function (event) {
        event.preventDefault();
    });
    $("#poubelle").on('drop', function (event) {
        var poubelleSound = document.getElementById('poubelleSound');
        poubelleSound.play();
        event.preventDefault();
        var contactId = event.originalEvent.dataTransfer.getData("text/plain");
        SupprimeContact(contactId);
        construitTable(JSON.parse(localStorage.getItem('contacts')) || []);
    });

});



