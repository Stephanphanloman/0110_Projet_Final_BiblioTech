const STORAGE_KEY = "biblio_db_final";

//Charge la base depuis le localStorage
function loadDatabase() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

//Sauvegarde la base en JSON
function saveDatabase(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
