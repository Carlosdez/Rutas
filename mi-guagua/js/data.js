// Módulo para cargar datos desde archivos JSON
const DATA_BASE_URL = './data/';

export async function loadLocations() {
    try {
        const response = await fetch(`${DATA_BASE_URL}locations.json`);
        if (!response.ok) throw new Error('Error cargando ubicaciones');
        return await response.json();
    } catch (error) {
        console.error('Error loading locations:', error);
        // Datos de ejemplo como fallback
        return [
            { id: 'gz', name: 'Gazcue', coords: { x: 100, y: 150 } },
            { id: 'vs', name: 'Villa Consuelo', coords: { x: 200, y: 100 } },
            { id: 'cm', name: 'Ciudad Modelo', coords: { x: 300, y: 200 } },
            { id: 'nc', name: 'Naco', coords: { x: 150, y: 250 } },
            { id: 'pl', name: 'Piantini', coords: { x: 250, y: 300 } },
            { id: 'el', name: 'Ensanche La Fe', coords: { x: 350, y: 150 } }
        ];
    }
}

export async function loadRoutes() {
    try {
        const response = await fetch(`${DATA_BASE_URL}routes.json`);
        if (!response.ok) throw new Error('Error cargando rutas');
        return await response.json();
    } catch (error) {
        console.error('Error loading routes:', error);
        // Datos de ejemplo como fallback
        return [
            {
                id: 'r1',
                segments: [
                    { from: 'gz', to: 'vs', transport: 'concho', time_min: 15, cost: 50 },
                    { from: 'vs', to: 'cm', transport: 'guagua', time_min: 20, cost: 25 }
                ]
            },
            {
                id: 'r2',
                segments: [
                    { from: 'gz', to: 'nc', transport: 'motoconcho', time_min: 10, cost: 80 },
                    { from: 'nc', to: 'pl', transport: 'concho', time_min: 12, cost: 60 },
                    { from: 'pl', to: 'cm', transport: 'carro-publico', time_min: 18, cost: 40 }
                ]
            },
            {
                id: 'r3',
                segments: [
                    { from: 'gz', to: 'el', transport: 'guagua', time_min: 25, cost: 30 },
                    { from: 'el', to: 'cm', transport: 'motoconcho', time_min: 8, cost: 70 }
                ]
            }
        ];
    }
}

export async function loadAlerts() {
    try {
        const response = await fetch(`${DATA_BASE_URL}alerts.json`);
        if (!response.ok) throw new Error('Error cargando alertas');
        return await response.json();
    } catch (error) {
        console.error('Error loading alerts:', error);
        // Datos de ejemplo como fallback
        return [
            { id: 'a1', type: 'rain', active: true, time_pct: 25, cost_extra: 10 },
            { id: 'a2', type: 'peak', active: false, time_pct: 40, cost_extra: 0 },
            { id: 'a3', type: 'strike', active: false, time_pct: 100, cost_extra: 20 }
        ];
    }
}

export async function loadTranslations() {
    try {
        const response = await fetch(`${DATA_BASE_URL}i18n.json`);
        if (!response.ok) throw new Error('Error cargando traducciones');
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        // Datos de ejemplo como fallback
        return {
            es: {
                app_title: 'Rutas Dominicanas',
                search_routes: 'Buscar Rutas',
                origin: 'Origen',
                destination: 'Destino',
                // ... más traducciones
            },
            en: {
                app_title: 'Dominican Routes',
                search_routes: 'Search Routes',
                origin: 'Origin',
                destination: 'Destination',
                // ... más traducciones
            }
        };
    }
}