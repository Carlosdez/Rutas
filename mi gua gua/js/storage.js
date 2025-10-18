// Módulo para almacenamiento local

const STORAGE_KEYS = {
    FAVORITES: 'rutas_dominicanas_favorites',
    SETTINGS: 'rutas_dominicanas_settings'
};

/**
 * Guarda una ruta como favorita
 * @param {Object} route - Ruta a guardar
 */
export function saveFavorite(route) {
    const favorites = getFavorites();
    
    // Evitar duplicados
    const exists = favorites.some(fav => 
        fav.origin.id === route.origin.id && 
        fav.destination.id === route.destination.id &&
        JSON.stringify(fav.transport) === JSON.stringify(route.transport)
    );
    
    if (!exists) {
        favorites.push({
            id: generateId(),
            origin: route.origin,
            destination: route.destination,
            transport: route.transport,
            segments: route.segments,
            totalTime: route.totalTime,
            totalCost: route.totalCost,
            createdAt: new Date().toISOString()
        });
        
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
}

/**
 * Obtiene todas las rutas favoritas
 * @returns {Array} Rutas favoritas
 */
export function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    } catch (error) {
        console.error('Error loading favorites:', error);
        return [];
    }
}

/**
 * Elimina una ruta de favoritos
 * @param {Object} route - Ruta a eliminar
 */
export function removeFavorite(route) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => 
        !(fav.origin.id === route.origin.id && 
          fav.destination.id === route.destination.id &&
          JSON.stringify(fav.transport) === JSON.stringify(route.transport))
    );
    
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
}

/**
 * Guarda configuraciones de la aplicación
 * @param {Object} settings - Configuraciones a guardar
 */
export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

/**
 * Obtiene configuraciones guardadas
 * @returns {Object} Configuraciones
 */
export function getSettings() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
    } catch (error) {
        console.error('Error loading settings:', error);
        return {};
    }
}

/**
 * Genera un ID único para las rutas favoritas
 * @returns {string} ID único
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}