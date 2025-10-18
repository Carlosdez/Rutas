// Módulo para cálculos de rutas

/**
 * Calcula todas las rutas posibles entre origen y destino
 * @param {Object} origin - Ubicación de origen
 * @param {Object} destination - Ubicación de destino
 * @param {Array} allRoutes - Todas las rutas disponibles
 * @param {Array} transportTypes - Tipos de transporte seleccionados
 * @returns {Array} Rutas calculadas
 */
export function calculateRoutes(origin, destination, allRoutes, transportTypes) {
    const possibleRoutes = allRoutes.filter(route => {
        const firstSegment = route.segments[0];
        const lastSegment = route.segments[route.segments.length - 1];
        
        return firstSegment.from === origin.id && 
               lastSegment.to === destination.id &&
               route.segments.every(segment => transportTypes.includes(segment.transport));
    });
    
    return possibleRoutes.map(route => {
        const totalTime = calculateTotalTime(route.segments);
        const totalCost = calculateTotalCost(route.segments);
        const transfers = route.segments.length - 1;
        
        return {
            ...route,
            origin,
            destination,
            totalTime,
            totalCost,
            transfers,
            transport: transportTypes
        };
    });
}

/**
 * Calcula el tiempo total de una ruta (suma de tiempos de segmentos)
 * @param {Array} segments - Segmentos de la ruta
 * @returns {number} Tiempo total en minutos
 */
function calculateTotalTime(segments) {
    return segments.reduce((total, segment) => total + segment.time_min, 0);
}

/**
 * Calcula el costo total de una ruta (suma de costos de segmentos)
 * @param {Array} segments - Segmentos de la ruta
 * @returns {number} Costo total en pesos dominicanos
 */
function calculateTotalCost(segments) {
    return segments.reduce((total, segment) => total + segment.cost, 0);
}

/**
 * Aplica alertas activas a las rutas calculadas
 * @param {Array} routes - Rutas a las que aplicar alertas
 * @param {Array} alerts - Alertas activas
 * @returns {Array} Rutas con alertas aplicadas
 */
export function applyAlerts(routes, alerts) {
    const activeAlerts = alerts.filter(alert => alert.active);
    
    if (activeAlerts.length === 0) return routes;
    
    return routes.map(route => {
        let adjustedTime = route.totalTime;
        let adjustedCost = route.totalCost;
        let appliedAlerts = [];
        
        activeAlerts.forEach(alert => {
            adjustedTime = Math.round(adjustedTime * (1 + alert.time_pct / 100));
            adjustedCost += alert.cost_extra;
            appliedAlerts.push(alert);
        });
        
        return {
            ...route,
            adjustedTime,
            adjustedCost,
            appliedAlerts
        };
    });
}

/**
 * Ordena rutas según criterio seleccionado
 * @param {Array} routes - Rutas a ordenar
 * @param {string} criteria - Criterio de ordenamiento (time, cost, transfers)
 * @returns {Array} Rutas ordenadas
 */
export function sortRoutes(routes, criteria = 'time') {
    const sortedRoutes = [...routes];
    
    switch (criteria) {
        case 'cost':
            sortedRoutes.sort((a, b) => (a.adjustedCost || a.totalCost) - (b.adjustedCost || b.totalCost));
            break;
        case 'transfers':
            sortedRoutes.sort((a, b) => a.transfers - b.transfers);
            break;
        case 'time':
        default:
            sortedRoutes.sort((a, b) => (a.adjustedTime || a.totalTime) - (b.adjustedTime || b.totalTime));
            break;
    }
    
    return sortedRoutes;
}