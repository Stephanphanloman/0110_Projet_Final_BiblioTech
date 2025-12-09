
// ramy Données & Constantes
let database = loadDatabase();
let uidCounter = database.reduce((max, b) => Math.max(max, b.uid), 0);

const CATEGORIES = {
    "1": "Science-Fiction",
    "2": "Documentaire",
    "3": "Roman"
};


// Utilitaires
function showMessage(msg) {
    const el = document.getElementById("zoneMessage");
    el.textContent = msg;
    setTimeout(() => el.textContent = "", 3000);
}

function currentDate() {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}


// Affichage du tableau
function renderTable() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    const visibleBooks = database.filter(b => !b.isDeleted);
    document.getElementById("count").textContent = visibleBooks.length;

    visibleBooks.forEach(book => {
        const tr = document.createElement("tr");

        // Num
        const tdNum = document.createElement("td");
        tdNum.textContent = "#" + book.uid;
        tr.appendChild(tdNum);

        // Info
        const tdInfo = document.createElement("td");
        tdInfo.innerHTML =
            `<b>${book.title.toUpperCase()}</b><br><i>${book.author}</i>`;
        tr.appendChild(tdInfo);

        // Catégorie
        const tdCat = document.createElement("td");
        const span = document.createElement("span");
        span.className = "muted-pill";
        span.textContent = book.categoryLabel;
        tdCat.appendChild(span);
        tr.appendChild(tdCat);

        // Détails
        const tdDetails = document.createElement("td");
        tdDetails.textContent = book.details;
        tr.appendChild(tdDetails);

        // Bouton suppression
        const tdDel = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "X";
        btn.className = "btn-del";
        btn.onclick = () => deleteBook(book.uid);
        tdDel.appendChild(btn);
        tr.appendChild(tdDel);

        tbody.appendChild(tr);
    });
}


// Ajout
function addBook() {
    const title = document.getElementById("titleInput").value.trim();
    const author = document.getElementById("authorInput").value.trim();
    const category = document.getElementById("categorySelect").value;
    const isbn = document.getElementById("isbnInput").value.trim();

    if (!title) return alert("Erreur Titre");
    if (!author) return alert("Erreur Auteur");
    if (isbn.length < 4) return alert("Erreur ISBN");

    uidCounter++;

    database.push({
        uid: uidCounter,
        title,
        author,
        categoryLabel: CATEGORIES[category],
        details: `${isbn} | ${currentDate()}`,
        isDeleted: false
    });

    saveDatabase(database);
    renderTable();
    showMessage("C'est bon");

    document.getElementById("titleInput").value = "";
    document.getElementById("authorInput").value = "";
    document.getElementById("isbnInput").value = "";
}


// Suppression
function deleteBook(uid) {
    if (!confirm("Supprimer ?")) return;

    const b = database.find(b => b.uid === uid);
    if (b) b.isDeleted = true;

    saveDatabase(database);
    renderTable();
}


// Recherche
function searchBooks(query) {
    const value = query.toUpperCase();
    const rows = document.querySelectorAll("#tableBody tr");

    rows.forEach(row => {
        const infoCell = row.children[1];
        const text = infoCell.textContent.toUpperCase();
        row.style.display = text.includes(value) ? "" : "none";
    });
}


// Reset
function resetDatabase() {
    if (!confirm("Supprimer toute la base ?")) return;

    localStorage.clear();
    database = [];
    uidCounter = 0;
    renderTable();
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    renderTable();

    document.getElementById("saveBtn").onclick = addBook;
    document.getElementById("resetBtn").onclick = resetDatabase;
    document.getElementById("searchInput").oninput =
        e => searchBooks(e.target.value);
});
