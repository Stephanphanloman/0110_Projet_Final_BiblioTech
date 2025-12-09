// =====================================================
//  DONNÉES & CONSTANTES
// =====================================================

// On charge la base de données depuis le LocalStorage
// (loadDatabase est définie dans storage.js)
// → Si aucune donnée n'est présente, loadDatabase() renvoie un tableau vide.
// ramy Données & Constantes
let database = loadDatabase();

// On calcule le plus grand uid déjà utilisé dans la base.
// Cela permet de continuer la numérotation sans écraser les livres existants.
let uidCounter = database.reduce((max, b) => Math.max(max, b.uid), 0);

// Dictionnaire de catégories : la valeur affichée pour chaque code.
const CATEGORIES = {
    "1": "Science-Fiction",
    "2": "Documentaire",
    "3": "Roman"
};


// =====================================================
//  FONCTIONS UTILITAIRES
// =====================================================

/**
 * Affiche un message temporaire dans la zone prévue (#zoneMessage).
 * @param {string} msg - Le texte à afficher à l'utilisateur.
 */
function showMessage(msg) {
    const el = document.getElementById("zoneMessage");
    el.textContent = msg;

    // Après 3 secondes, on efface le message
    setTimeout(() => el.textContent = "", 3000);
}

/**
 * Renvoie la date du jour au format JJ/MM/AAAA.
 * Exemple : "8/12/2025"
 */
function currentDate() {
    const d = new Date();
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}


// =====================================================
//  AFFICHAGE DU TABLEAU PRINCIPAL
// =====================================================

/**
 * Reconstruit entièrement le tableau HTML des livres
 * à partir des données contenues dans "database".
 * On ne montre que les livres qui ne sont pas "supprimés" (isDeleted = false).
 */
function renderTable() {
    // Récupération du <tbody> dans le DOM
    const tbody = document.getElementById("tableBody");
    // On vide tout le contenu actuel du tableau
    tbody.innerHTML = "";

    // On filtre les livres visibles (non supprimés logiquement)
    const visibleBooks = database.filter(b => !b.isDeleted);

    // Mise à jour du compteur de livres (ex : "3" livres affichés)
    document.getElementById("count").textContent = visibleBooks.length;

    // Pour chaque livre visible, on crée une ligne <tr> avec ses colonnes
    visibleBooks.forEach(book => {
        const tr = document.createElement("tr");

        // ---------- Colonne Num (identifiant du livre) ----------
        const tdNum = document.createElement("td");
        tdNum.textContent = "#" + book.uid;  // ex : "#1"
        tr.appendChild(tdNum);

        // ---------- Colonne Infos (Titre + Auteur) ----------
        const tdInfo = document.createElement("td");
        // On met le titre en majuscules, puis l'auteur en italique
        tdInfo.innerHTML =
            `<b>${book.title.toUpperCase()}</b><br><i>${book.author}</i>`;
        tr.appendChild(tdInfo);

        // ---------- Colonne Catégorie ----------
        const tdCat = document.createElement("td");
        const span = document.createElement("span");
        span.className = "muted-pill";       // style visuel du badge catégorie
        span.textContent = book.categoryLabel;
        tdCat.appendChild(span);
        tr.appendChild(tdCat);

        // ---------- Colonne Détails (ISBN + date d'ajout) ----------
        const tdDetails = document.createElement("td");
        tdDetails.textContent = book.details; // ex : "9780XXX | 8/12/2025"
        tr.appendChild(tdDetails);

        // ---------- Colonne Bouton de suppression ----------
        const tdDel = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "X";           // symbole de suppression
        btn.className = "btn-del";       // style bouton rouge
        // Quand on clique sur le bouton, on appelle deleteBook pour ce livre
        btn.onclick = () => deleteBook(book.uid);
        tdDel.appendChild(btn);
        tr.appendChild(tdDel);

        // On ajoute finalement la ligne <tr> au tableau
        tbody.appendChild(tr);
    });
}


// =====================================================
//  AJOUT D'UN NOUVEAU LIVRE
// =====================================================

/**
 * Récupère les valeurs du formulaire, vérifie les champs,
 * construit un objet "book" et l'ajoute à la base de données.
 * Puis on sauvegarde dans le LocalStorage et on raffraîchit le tableau.
 */
function addBook() {
    // Récupération des valeurs saisies dans les champs du formulaire
    const title = document.getElementById("titleInput").value.trim();
    const author = document.getElementById("authorInput").value.trim();
    const category = document.getElementById("categorySelect").value;
    const isbn = document.getElementById("isbnInput").value.trim();

    // Vérifications simples des champs (validation minimale)
    if (!title) return alert("Erreur Titre");        // Titre vide → erreur
    if (!author) return alert("Erreur Auteur");      // Auteur vide → erreur
    if (isbn.length < 4) return alert("Erreur ISBN"); // ISBN trop court

    // Incrémenter l'identifiant unique
    uidCounter++;

    // Création d'un nouvel objet livre et ajout dans le tableau "database"
    database.push({
        uid: uidCounter,                     // identifiant unique du livre
        title,                               // titre saisi
        author,                              // auteur saisi
        categoryLabel: CATEGORIES[category], // libellé de la catégorie
        details: `${isbn} | ${currentDate()}`, // ISBN + date
        isDeleted: false                     // le livre est actif (non supprimé)
    });

    // Sauvegarde de la base dans le LocalStorage
    saveDatabase(database);
    // Réaffichage du tableau HTML avec le nouveau livre
    renderTable();
    // Message de confirmation pour l'utilisateur
    showMessage("C'est bon");

    // On vide les champs du formulaire pour la prochaine saisie
    document.getElementById("titleInput").value = "";
    document.getElementById("authorInput").value = "";
    document.getElementById("isbnInput").value = "";
}


// =====================================================
//  SUPPRESSION D'UN LIVRE
// =====================================================

/**
 * Marque un livre comme "supprimé" (isDeleted = true) après confirmation.
 * La suppression est logique : le livre reste dans la base mais n'est plus affiché.
 */
function deleteBook(uid) {
    // Demande de confirmation à l'utilisateur
    if (!confirm("Supprimer ?")) return;

    // Recherche du livre correspondant dans la base
    const b = database.find(b => b.uid === uid);
    if (b) b.isDeleted = true;  // on le marque comme supprimé

    // Sauvegarde de la nouvelle base + rafraîchissement de l'affichage
    saveDatabase(database);
    renderTable();
}


// =====================================================
//  RECHERCHE DANS LE TABLEAU
// =====================================================

/**
 * Filtre les lignes du tableau en fonction de la chaîne de recherche.
 * La recherche se fait sur la colonne "Infos" (Titre + Auteur).
 *
 * @param {string} query - texte saisi dans le champ de recherche
 */
function searchBooks(query) {
    const value = query.toUpperCase();                 // on met en majuscules
    const rows = document.querySelectorAll("#tableBody tr");

    // Pour chaque ligne du tableau, on teste si le texte contient la recherche
    rows.forEach(row => {
        const infoCell = row.children[1];              // 2e colonne = Infos
        const text = infoCell.textContent.toUpperCase();
        // Si le texte contient la valeur recherchée → on affiche, sinon on cache
        row.style.display = text.includes(value) ? "" : "none";
    });
}


// =====================================================
//  RAZ / RESET DE TOUTE LA BASE
// =====================================================

/**
 * Réinitialise complètement la base :
 * - demande une confirmation
 * - vide le localStorage
 * - réinitialise le tableau des livres en mémoire
 * - remet le compteur d'uid à 0
 * - rafraîchit l'affichage (tableau vide)
 */
function resetDatabase() {
    if (!confirm("Supprimer toute la base ?")) return;

    // Efface toutes les données du LocalStorage du site
    localStorage.clear();
    // Vide la base en mémoire
    database = [];
    // Réinitialise le compteur d'identifiants
    uidCounter = 0;
    // Réaffiche le tableau (qui sera vide)
    renderTable();
}


// =====================================================
//  INITIALISATION AU CHARGEMENT DE LA PAGE
// =====================================================

/**
 * Au chargement du DOM :
 * - affiche le tableau avec les données existantes
 * - attache les gestionnaires d'événements aux boutons et au champ de recherche
 */
document.addEventListener("DOMContentLoaded", () => {
    // Premier affichage du tableau avec les données déjà présentes
    renderTable();

    // Bouton "Enregistrer" → appelle addBook()
    document.getElementById("saveBtn").onclick = addBook;

    // Bouton "RAZ" → appelle resetDatabase()
    document.getElementById("resetBtn").onclick = resetDatabase;

    // Champ de recherche → à chaque frappe, filtre les livres affichés
    document.getElementById("searchInput").oninput =
        e => searchBooks(e.target.value);
});
