// Nom de la clé utilisée pour enregistrer nos données dans le localStorage.
// En gros, c'est le nom du "fichier" où le navigateur va stocker la base.
const STORAGE_KEY = "biblio_db_final";

// Fonction qui récupère les données enregistrées dans le localStorage.
// Elle essaie de lire la clé définie plus haut.
// Si tout va bien : on récupère une chaîne JSON qu'on convertit en tableau.
// Si jamais la clé n'existe pas ou qu'il y a une erreur,
// on renvoie simplement un tableau vide pour éviter que le programme plante.
function loadDatabase() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];   // si raw n'est pas null → on convertit en JSON
    } catch {
        return []; // en cas d'erreur (JSON cassé, problème navigateur, etc.)
    }
}

// Fonction qui sauvegarde les données dans le localStorage.
// Elle prend le tableau "data", le transforme en texte JSON,
// puis l'enregistre sous la clé STORAGE_KEY.
// Cela permet de garder les livres même après avoir fermé la page.
function saveDatabase(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
