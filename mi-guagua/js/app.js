// Aplicación completa en un solo archivo
class RoutePlanner {
    constructor() {
        this.locations = [];
        this.routes = [];
        this.alerts = [];
        this.translations = {};
        this.favorites = [];
        
        // Configuraciones
        this.currentTheme = 'auto';
        this.currentLanguage = 'es';
        this.savingsMode = false;

        // AGREGA ESTO:
        this.transportNames = {
            'concho': 'Concho',
            'guagua': 'Guagua', 
            'carro-publico': 'Carro Público',
            'motoconcho': 'Motoconcho'
        };

         // AGREGAR ESTO EN EL CONSTRUCTOR:
        this.transportNames = {
            'concho': 'Concho',
            'guagua': 'Guagua', 
            'carro-publico': 'Carro Público',
            'motoconcho': 'Motoconcho'
        };
        
        console.log('🔄 Inicializando RoutePlanner...');
        
        this.init();
    }
    
    async init() {
        try {
            // Cargar configuraciones PRIMERO
            this.loadSettings();
            
            // Luego cargar datos
            await this.loadData();
            
            // Inicializar UI (que aplicará las configuraciones)
            this.initUI();
            
            // Cargar favoritos
            this.loadFavorites();
            
            console.log('✅ Aplicación lista con configuraciones:', {
                theme: this.currentTheme,
                language: this.currentLanguage,
                savingsMode: this.savingsMode
            });
        } catch (error) {
            console.error('❌ Error inicializando:', error);
        }
    }
    
 async loadData() {
    try {
        console.log('📥 Cargando datos...');
        
        // Cargar datos desde archivos JSON
        this.locations = await this.loadLocations();
        this.routes = await this.loadRoutes();
        this.alerts = await this.loadAlerts();
        this.translations = await this.loadTranslations();
        
        console.log('📊 Datos cargados:', {
            locations: this.locations.length,
            routes: this.routes.length,
            alerts: this.alerts.length
        });
        
        // Si no hay rutas, cargar datos de fallback
        if (this.routes.length === 0) {
            console.warn('⚠️ No se cargaron rutas, usando datos de fallback');
            this.loadFallbackData();
        }
        
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        console.warn('🔄 Cargando datos de fallback...');
        this.loadFallbackData();
    }
}
    
async loadLocations() {
    try {
        console.log('📍 Cargando ubicaciones...');
        const response = await fetch('data/locations.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('✅ Ubicaciones cargadas:', data.length);
        return data;
    } catch (error) {
        console.error('❌ Error cargando ubicaciones:', error);
        return [];
    }
}

async loadRoutes() {
    try {
        console.log('🛣️ Cargando rutas...');
        const response = await fetch('data/routes.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('✅ Rutas cargadas:', data.length);
        return data;
    } catch (error) {
        console.error('❌ Error cargando rutas:', error);
        return [];
    }
}

async loadAlerts() {
    try {
        console.log('⚠️ Cargando alertas...');
        const response = await fetch('data/alerts.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('✅ Alertas cargadas:', data.length);
        return data;
    } catch (error) {
        console.error('❌ Error cargando alertas:', error);
        return [];
    }
}

async loadTranslations() {
    try {
        console.log('🌐 Cargando traducciones...');
        const response = await fetch('data/i18n.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('✅ Traducciones cargadas');
        return data;
    } catch (error) {
        console.error('❌ Error cargando traducciones:', error);
        return { es: {}, en: {} };
    }
}
    
    loadFallbackData() {
    this.locations = [
        // Coordenadas más compactas (0-100 en lugar de 0-400)
        { id: 'gz', name: 'Gazcue', coords: { x: 20, y: 30 } },
        { id: 'vs', name: 'Villa Consuelo', coords: { x: 40, y: 20 } },
        { id: 'cm', name: 'Ciudad Modelo', coords: { x: 60, y: 40 } },
        { id: 'nc', name: 'Naco', coords: { x: 30, y: 50 } },
        { id: 'pl', name: 'Piantini', coords: { x: 50, y: 60 } },
        { id: 'el', name: 'Ensanche La Fe', coords: { x: 70, y: 30 } },
        { id: 'cc', name: 'Centro de los Heroes', coords: { x: 24, y: 36 } },
        { id: 'zm', name: 'Zona Colonial', coords: { x: 16, y: 24 } },
        { id: 'cp', name: 'Capotillo', coords: { x: 36, y: 16 } },
        { id: '27', name: '27 de Febrero', coords: { x: 44, y: 44 } },
        { id: 'im', name: 'Invivienda', coords: { x: 56, y: 24 } },
        { id: 'sc', name: 'San Carlos', coords: { x: 30, y: 36 } }
    ];
    
    // YA NO NECESITAMOS RUTAS PREDEFINIDAS - se calculan dinámicamente
    this.routes = [];
    
    this.alerts = []; // Solo esta línea
}
// NUEVO MÉTODO: Genera alertas aleatorias para cada búsqueda
generateRandomAlerts() {
    const alertTypes = [
        {
            type: 'rain',
            name: 'Lluvia Intensa',
            time_pct: [20, 35],
            cost_extra: [10, 20],
            probability: 0.3,
            icon: '🌧️',
            description: 'Tráfico lento por lluvia intensa'
        },
        {
            type: 'peak',
            name: 'Hora Pico',
            time_pct: [30, 50],
            cost_extra: [0, 0],
            probability: 0.4,
            icon: '🚗',
            description: 'Tráfico congestionado por hora pico'
        },
        // ... resto de alertTypes
    ];

    // Limpiar alertas anteriores
    this.alerts = [];
    
    // Generar nuevas alertas aleatorias
    alertTypes.forEach(alertConfig => {
        if (Math.random() < alertConfig.probability) {
            const time_pct = this.getRandomInRange(alertConfig.time_pct[0], alertConfig.time_pct[1]);
            const cost_extra = this.getRandomInRange(alertConfig.cost_extra[0], alertConfig.cost_extra[1]);
            
            this.alerts.push({
                id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                type: alertConfig.type,
                name: alertConfig.name,
                active: true,
                time_pct: time_pct,
                cost_extra: cost_extra,
                icon: alertConfig.icon,
                description: alertConfig.description
            });
        }
    });

    if (this.alerts.length > 3) {
        this.alerts = this.alerts.slice(0, 3);
    }

    console.log(`🎲 Alertas generadas: ${this.alerts.length}`, this.alerts);
}

// NUEVO MÉTODO: Genera número aleatorio en un rango
getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// NUEVO MÉTODO: Aplica todas las alertas activas a una ruta
applyActiveAlerts(route) {
    const activeAlerts = this.alerts.filter(alert => alert.active);
    
    if (activeAlerts.length === 0) {
        return route;
    }
    
    let totalTimeIncrease = 0;
    let totalCostIncrease = 0;
    let appliedAlerts = [];
    
    activeAlerts.forEach(alert => {
        const timeIncrease = Math.round(route.totalTime * (alert.time_pct / 100));
        const costIncrease = alert.cost_extra;
        
        totalTimeIncrease += timeIncrease;
        totalCostIncrease += costIncrease;
        
        appliedAlerts.push({
            type: alert.type,
            name: alert.name,
            time_pct: alert.time_pct,
            cost_extra: alert.cost_extra,
            time_increase: timeIncrease,
            cost_increase: costIncrease
        });
    });
    
    return {
        ...route,
        totalTime: route.totalTime + totalTimeIncrease,
        totalCost: route.totalCost + totalCostIncrease,
        appliedAlerts: appliedAlerts,
        originalTime: route.totalTime,
        originalCost: route.totalCost
    };
}
       
    
    initUI() {
        console.log('🎨 Inicializando interfaz...');
        
        // Formulario principal
        const form = document.getElementById('route-form');
        form.addEventListener('submit', (e) => this.handleSearch(e));
        
        // Inicializar navegación y menús
        this.initNavigation();
        
        // Configurar listeners del sistema
        this.setupSystemListeners();
        
        // Mostrar sección inicial
        this.showSection('search');
        
        console.log('✅ Interfaz inicializada completamente');
    }
    
    initNavigation() {
        console.log('🚀 Inicializando navegación...');
        
        // Menú móvil toggle
        const navToggle = document.querySelector('.nav__toggle');
        const navList = document.querySelector('.nav__list');
        
        if (navToggle && navList) {
            navToggle.addEventListener('click', () => {
                console.log('📱 Menú toggle clickeado');
                navList.classList.toggle('nav__list--open');
            });
        }
        
        // Navegación por secciones
        this.setupSectionNavigation();
        
        // Botones de funcionalidad
        this.setupFeatureToggles();
    }
    
    setupSectionNavigation() {
        // Navegación por enlaces del menú
        const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.showSection(targetId);
                
                // Cerrar menú móvil si está abierto
                const navList = document.querySelector('.nav__list');
                navList.classList.remove('nav__list--open');
            });
        });
    }
    
    setupFeatureToggles() {
        // Cargar configuraciones guardadas
        this.loadSettings();
        
        // Toggle de tema oscuro
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            // Configurar estado inicial
            this.applyTheme(this.currentTheme);
            
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Toggle de idioma
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            // Configurar estado inicial
            this.applyLanguage(this.currentLanguage);
            
            languageToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
        
        // Toggle de modo ahorro
        const savingsToggle = document.getElementById('savings-toggle');
        if (savingsToggle) {
            // Configurar estado inicial
            this.applySavingsMode(this.savingsMode);
            
            savingsToggle.addEventListener('click', () => {
                this.toggleSavingsMode();
            });
        }
    }
    
    setupSystemListeners() {
        // Escuchar cambios en preferencias de tema del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.currentTheme === 'auto') {
                this.applySystemTheme();
            }
        });
    }
    
    // === MÉTODOS PARA TEMA OSCURO ===
    toggleTheme() {
        const themes = ['light', 'dark', 'auto'];
        const currentIndex = themes.indexOf(this.currentTheme);
        this.currentTheme = themes[(currentIndex + 1) % themes.length];
        
        this.applyTheme(this.currentTheme);
        this.saveSettings();
        console.log('🌙 Tema cambiado a:', this.currentTheme);
    }

    applyTheme(theme) {
        // Remover todas las clases de tema
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-auto', 'system-dark');
        
        // Aplicar nueva clase
        document.body.classList.add(`theme-${theme}`);
        
        // Actualizar el botón
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const labels = {
                'light': '☀️ Modo Claro',
                'dark': '🌙 Modo Oscuro', 
                'auto': '⚙️ Modo Auto'
            };
            themeToggle.textContent = labels[theme] || 'Modo Oscuro';
        }
        
        // Aplicar tema basado en preferencia del sistema si es auto
        if (theme === 'auto') {
            this.applySystemTheme();
        }
    }

    applySystemTheme() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkMode) {
            document.body.classList.add('system-dark');
        } else {
            document.body.classList.remove('system-dark');
        }
    }

    // === MÉTODOS PARA IDIOMA ===
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
        this.applyLanguage(this.currentLanguage);
        this.saveSettings();
        console.log('🌐 Idioma cambiado a:', this.currentLanguage);
    }

    applyLanguage(lang) {
        // Cambiar atributo lang del HTML
        document.documentElement.lang = lang;
        
        // Actualizar textos de la interfaz
        this.updateUITexts(lang);
        
        // Actualizar el botón
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.textContent = lang === 'es' ? 'EN' : 'ES';
        }
    }

    updateUITexts(lang) {
        const translations = this.translations[lang] || this.translations.es;
        
        // Actualizar textos clave
        const elementsToTranslate = {
            '.header__title': 'app_title',
            '.search-section .section__title': 'search_routes',
            '#origin': 'origin_placeholder',
            '#destination': 'destination_placeholder',
            '.transport-options label:nth-child(1) .transport-option__label': 'concho',
            '.transport-options label:nth-child(2) .transport-option__label': 'guagua', 
            '.transport-options label:nth-child(3) .transport-option__label': 'carro_publico',
            '.transport-options label:nth-child(4) .transport-option__label': 'motoconcho',
            '.search-form__submit': 'search',
            '.results-section .section__title': 'found_routes',
            '.favorites-section .section__title': 'favorites',
            '.alerts-section .section__title': 'alerts'
        };
        
        for (const [selector, key] of Object.entries(elementsToTranslate)) {
            const element = document.querySelector(selector);
            if (element && translations[key]) {
                if (selector.startsWith('#')) {
                    // Es un input, actualizar placeholder
                    element.placeholder = translations[key];
                } else if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
                    // Es un botón o input, actualizar texto
                    element.textContent = translations[key];
                } else {
                    // Es un título o label
                    element.textContent = translations[key];
                }
            }
        }
    }

    // === MÉTODOS PARA MODO AHORRO ===
    toggleSavingsMode() {
        this.savingsMode = !this.savingsMode;
        this.applySavingsMode(this.savingsMode);
        this.saveSettings();
        console.log('💾 Modo ahorro:', this.savingsMode ? 'activado' : 'desactivado');
    }

    applySavingsMode(enabled) {
        if (enabled) {
            document.body.classList.add('savings-mode');
        } else {
            document.body.classList.remove('savings-mode');
        }
        
        const savingsToggle = document.getElementById('savings-toggle');
        if (savingsToggle) {
            savingsToggle.textContent = enabled ? '🚀 Modo Normal' : '💾 Modo Ahorro';
        }
    }

    // === CONFIGURACIONES Y ALMACENAMIENTO ===
    loadSettings() {
        const saved = localStorage.getItem('routePlannerSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.currentTheme = settings.theme || 'auto';
            this.currentLanguage = settings.language || 'es';
            this.savingsMode = settings.savingsMode || false;
        }
    }

    saveSettings() {
        const settings = {
            theme: this.currentTheme,
            language: this.currentLanguage,
            savingsMode: this.savingsMode
        };
        localStorage.setItem('routePlannerSettings', JSON.stringify(settings));
    }
    
    showSection(sectionId) {
        console.log('📌 Mostrando sección:', sectionId);
        
        // Ocultar todas las secciones principales
        const sections = ['search', 'results', 'favorites', 'alerts', 'map'];
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                section.classList.add('hidden');
            }
        });
        
        // Mostrar la sección solicitada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
            
            // Acciones específicas por sección
            switch(sectionId) {
                case 'favorites':
                    this.showFavorites();
                    break;
                case 'alerts':
                    this.showAlertsSection();
                    break;
                case 'search':
                    // Asegurar que el formulario esté listo
                    break;
            }
        } else {
            // Si no encuentra la sección, mostrar búsqueda por defecto
            document.getElementById('search').classList.remove('hidden');
        }
    }
    
    handleSearch(e) {
        e.preventDefault();
        console.log('🔍 Buscando rutas...');
        
        const origin = document.getElementById('origin').value;
        const destination = document.getElementById('destination').value;
        
        if (!origin || !destination) {
            this.showAlert('Por favor ingresa origen y destino', 'warning');
            return;
        }
        
        const transportTypes = Array.from(document.querySelectorAll('input[name="transport"]:checked'))
            .map(cb => cb.value);
            
        if (transportTypes.length === 0) {
            this.showAlert('Selecciona al menos un medio de transporte', 'warning');
            return;
        }
            
        this.searchRoutes(origin, destination, transportTypes);
    }

    searchRoutes(originName, destinationName, transportTypes) {
    console.log('Buscando:', { originName, destinationName, transportTypes });
    
    const origin = this.locations.find(loc => 
        loc.name.toLowerCase().includes(originName.toLowerCase())
    );
    const destination = this.locations.find(loc => 
        loc.name.toLowerCase().includes(destinationName.toLowerCase())
    );
    
    if (!origin || !destination) {
        const availableLocations = this.locations.map(loc => loc.name).join(', ');
        this.showAlert(`Ubicación no encontrada. Ubicaciones disponibles: ${availableLocations}`, 'error');
        return;
    }
    
    if (origin.id === destination.id) {
        this.showAlert('El origen y destino no pueden ser la misma ubicación', 'warning');
        return;
    }
    
    console.log('📍 Ubicaciones encontradas:', { origin: origin.name, destination: destination.name });
    
    // GENERAR ALERTAS ALEATORIAS PARA ESTA BÚSQUEDA
    this.generateRandomAlerts();
    
    // Calcular rutas dinámicamente
    const possibleRoutes = this.findRoutesBetweenLocations(origin.id, destination.id, transportTypes);
    
    console.log('🛣️ Rutas calculadas:', possibleRoutes.length);
    
    if (possibleRoutes.length === 0) {
        this.showAlert('No se pudieron calcular rutas para los transportes seleccionados', 'info');
        return;
    }
    
    this.displayRoutes(possibleRoutes, origin, destination);
}

// NUEVO MÉTODO: Algoritmo mejorado de búsqueda de rutas
findRoutesBetweenLocations(startId, endId, transportTypes) {
    console.log(`🔍 Calculando rutas de ${this.getLocationName(startId)} a ${this.getLocationName(endId)}`);
    
    const allRoutes = [];
    
    // Calcular distancia aproximada entre ubicaciones
    const startLoc = this.locations.find(loc => loc.id === startId);
    const endLoc = this.locations.find(loc => loc.id === endId);
    
    if (!startLoc || !endLoc) {
        console.log('❌ Ubicaciones no encontradas');
        return [];
    }
    
    const distance = this.calculateDistance(startLoc.coords, endLoc.coords);
    console.log(`📏 Distancia aproximada: ${distance} unidades`);
    
    // Generar una ruta para cada tipo de transporte seleccionado
    transportTypes.forEach(transportType => {
        const route = this.generateRouteForTransport(startLoc, endLoc, transportType, distance);
        if (route) {
            allRoutes.push(route);
        }
    });
    
    console.log(`✅ Rutas generadas: ${allRoutes.length}`);
    return allRoutes;
}

// NUEVO MÉTODO: Calcula distancia entre dos puntos
calculateDistance(coords1, coords2) {
    const dx = coords2.x - coords1.x;
    const dy = coords2.y - coords1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

generateRouteForTransport(startLoc, endLoc, transportType, distance) {
    const transportConfig = {
        'concho': {
            baseTime: 3,      // minutos base
            timePerUnit: 0.3, // ← REDUCIDO: 0.3 min por unidad (18 segundos)
            baseCost: 30,
            costPerUnit: 1.2,
            minCost: 40,
            maxCost: 120
        },
        'guagua': {
            baseTime: 5,      // ← REDUCIDO
            timePerUnit: 0.4, // ← REDUCIDO
            baseCost: 15,
            costPerUnit: 0.6,
            minCost: 20,
            maxCost: 60
        },
        'carro-publico': {
            baseTime: 4,      // ← REDUCIDO
            timePerUnit: 0.35, // ← REDUCIDO
            baseCost: 25,
            costPerUnit: 1.0,
            minCost: 35,
            maxCost: 90
        },
        'motoconcho': {
            baseTime: 2,      // ← REDUCIDO
            timePerUnit: 0.25, // ← REDUCIDO: 0.25 min por unidad (15 segundos)
            baseCost: 40,
            costPerUnit: 1.5,
            minCost: 50,
            maxCost: 150
        }
    };
    
    const config = transportConfig[transportType];
    if (!config) return null;
    
    // AGREGA ESTA PARTE QUE FALTABA - CÁLCULO DE TIEMPO Y COSTO:
    // Calcular tiempo y costo basado en distancia
    let time = Math.round(config.baseTime + (distance * config.timePerUnit));
    let cost = Math.round(config.baseCost + (distance * config.costPerUnit));
    
    // Aplicar límites mínimos y máximos
    time = Math.max(5, time); // Mínimo 5 minutos
    cost = Math.max(config.minCost, Math.min(config.maxCost, cost));
    
    // Redondear a múltiplos de 5 para tiempos y múltiplos de 10 para costos
    time = Math.ceil(time / 5) * 5;
    cost = Math.ceil(cost / 10) * 10;
    
    // AHORA SÍ CREAR LA RUTA
    let route = {
        id: `dynamic_${transportType}_${startLoc.id}_${endLoc.id}`,
        name: `${this.transportNames[transportType]} Directo`,
        segments: [
            {
                from: startLoc.id,
                to: endLoc.id,
                transport: transportType,
                time_min: time,
                cost: cost
            }
        ],
        totalTime: time,
        totalCost: cost,
        isDirect: true,
        transportType: transportType
    };
    
    // APLICAR ALERTAS ALEATORIAS
    route = this.applyActiveAlerts(route);
    
    return route;
}

// NUEVO MÉTODO: Encuentra rutas directas
findDirectRoutes(startId, endId) {
    return this.routes.filter(route => {
        const firstSeg = route.segments[0];
        const lastSeg = route.segments[route.segments.length - 1];
        return firstSeg.from === startId && lastSeg.to === endId;
    });
}

// NUEVO MÉTODO: Algoritmo de búsqueda con transbordos
findRoutesWithTransfers(startId, endId, maxRoutes = 5) {
    const foundRoutes = [];
    const visited = new Set();
    
    // Usamos BFS para encontrar rutas
    const queue = [{
        path: [],
        currentLocation: startId,
        totalTime: 0,
        totalCost: 0,
        transfers: 0
    }];
    
    while (queue.length > 0 && foundRoutes.length < maxRoutes) {
        const current = queue.shift();
        
        // Si llegamos al destino, guardar la ruta
        if (current.currentLocation === endId && current.path.length > 0) {
            const route = this.createRouteFromPath(current.path, current.totalTime, current.totalCost);
            foundRoutes.push(route);
            continue;
        }
        
        // Evitar ciclos infinitos
        const locationKey = `${current.currentLocation}-${current.path.length}`;
        if (visited.has(locationKey)) continue;
        visited.add(locationKey);
        
        // Buscar todos los segmentos posibles desde la ubicación actual
        const possibleSegments = this.findAllSegmentsFrom(current.currentLocation);
        
        for (const segment of possibleSegments) {
            // Evitar volver atrás demasiado
            if (current.path.some(seg => seg.from === segment.to)) continue;
            
            const newPath = [...current.path, segment];
            const newTransfers = current.path.length > 0 && 
                               current.path[current.path.length - 1].to !== segment.from ? 
                               current.transfers + 1 : current.transfers;
            
            queue.push({
                path: newPath,
                currentLocation: segment.to,
                totalTime: current.totalTime + segment.time_min,
                totalCost: current.totalCost + segment.cost,
                transfers: newTransfers
            });
        }
        
        // Ordenar por tiempo total para priorizar rutas más rápidas
        queue.sort((a, b) => a.totalTime - b.totalTime);
        
        // Limitar la búsqueda
        if (queue.length > 50) queue.length = 50;
    }
    
    return foundRoutes;
}

// NUEVO MÉTODO: Encuentra todos los segmentos desde una ubicación
findAllSegmentsFrom(locationId) {
    const segments = [];
    
    this.routes.forEach(route => {
        route.segments.forEach(segment => {
            if (segment.from === locationId) {
                segments.push({
                    ...segment,
                    routeName: route.name,
                    routeId: route.id
                });
            }
        });
    });
    
    return segments;
}

// NUEVO MÉTODO: Crea una ruta a partir de un camino
createRouteFromPath(segments, totalTime, totalCost) {
    const transports = [...new Set(segments.map(s => s.transport))];
    
    return {
        id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: this.generateRouteName(segments),
        segments: segments,
        totalTime: totalTime,
        totalCost: totalCost,
        isCombined: segments.length > 1,
        transfers: segments.length - 1
    };
}

// NUEVO MÉTODO: Genera nombre descriptivo para la ruta
generateRouteName(segments) {
    if (segments.length === 1) {
        const transport = this.getTransportName(segments[0].transport);
        return `Directo en ${transport}`;
    }
    
    const transports = [...new Set(segments.map(s => this.getTransportName(s.transport)))];
    const transfers = segments.length - 1;
    
    if (transports.length === 1) {
        return `Ruta ${transports[0]} (${transfers} transbordo${transfers > 1 ? 's' : ''})`;
    } else {
        return `Ruta Mixta (${transports.join(' + ')})`;
    }
}

// MÉTODO PARA ENCONTRAR RUTAS CONECTADAS
findConnectedRoutes(startId, endId, transportTypes) {
    const connectedRoutes = [];
    
    // Buscar rutas que pasen por el origen y destino
    this.routes.forEach(route => {
        const segmentStarts = route.segments.map(seg => seg.from);
        const segmentEnds = route.segments.map(seg => seg.to);
        
        // Si la ruta contiene tanto el origen como el destino
        if (segmentStarts.includes(startId) && segmentEnds.includes(endId)) {
            // Encontrar la posición del origen y destino en la ruta
            const startIndex = segmentStarts.indexOf(startId);
            const endIndex = segmentEnds.lastIndexOf(endId);
            
            // Si el origen viene antes del destino en la ruta
            if (startIndex <= endIndex) {
                // Crear una sub-ruta desde el origen hasta el destino
                const relevantSegments = route.segments.slice(startIndex, endIndex + 1);
                connectedRoutes.push({
                    ...route,
                    segments: relevantSegments,
                    name: `${route.name || 'Ruta'} (Parcial)`
                });
            }
        }
    });
    
    return connectedRoutes;
}
    
    displayRoutes(routes, origin, destination) {
    const container = document.getElementById('routes-list');
    const resultsSection = document.getElementById('results');
    
    // Mostrar alertas activas
    this.showActiveAlerts();
    
    // Agrupar rutas por tipo de transporte principal
    const routesByTransport = this.groupRoutesByTransport(routes);
    
    // Generar HTML agrupado por transporte
    container.innerHTML = this.generateTransportGroupsHTML(routesByTransport, origin, destination);
    
    // Mostrar resultados
    this.showSection('results');
    console.log('✅ Rutas mostradas agrupadas por transporte:', Object.keys(routesByTransport).length);
}

// NUEVO MÉTODO: Agrupa rutas por tipo de transporte principal
groupRoutesByTransport(routes) {
    const groups = {};
    
    routes.forEach(route => {
        // Determinar el transporte principal de la ruta
        const transportCount = {};
        route.segments.forEach(segment => {
            transportCount[segment.transport] = (transportCount[segment.transport] || 0) + 1;
        });
        
        // El transporte principal es el que más se usa en la ruta
        let mainTransport = Object.keys(transportCount).reduce((a, b) => 
            transportCount[a] > transportCount[b] ? a : b
        );
        
        // Si es una ruta mixta, usar "mixed"
        if (Object.keys(transportCount).length > 1) {
            mainTransport = 'mixed';
        }
        
        if (!groups[mainTransport]) {
            groups[mainTransport] = [];
        }
        
        groups[mainTransport].push(route);
    });
    
    return groups;
}

// NUEVO MÉTODO: Genera HTML con grupos por transporte
generateTransportGroupsHTML(routesByTransport, origin, destination) {
    let html = '';
    
    // Orden de visualización de los transportes
    const transportOrder = ['concho', 'guagua', 'carro-publico', 'motoconcho', 'mixed'];
    
    transportOrder.forEach(transportType => {
        if (routesByTransport[transportType] && routesByTransport[transportType].length > 0) {
            const routes = routesByTransport[transportType];
            
            // Ordenar rutas por tiempo total
            routes.sort((a, b) => {
                const timeA = a.totalTime || a.segments.reduce((sum, seg) => sum + seg.time_min, 0);
                const timeB = b.totalTime || b.segments.reduce((sum, seg) => sum + seg.time_min, 0);
                return timeA - timeB;
            });
            
            html += this.generateTransportGroupHTML(transportType, routes, origin, destination);
        }
    });
    
    return html;
}

// NUEVO MÉTODO: Genera HTML para un grupo de transporte específico
generateTransportGroupHTML(transportType, routes, origin, destination) {
    const transportNames = {
        'concho': 'Concho',
        'guagua': 'Guagua',
        'carro-publico': 'Carro Público',
        'motoconcho': 'Motoconcho',
        'mixed': 'Rutas Mixtas'
    };
    
    const transportIcons = {
        'concho': '🚗',
        'guagua': '🚌',
        'carro-publico': '🚙',
        'motoconcho': '🏍️',
        'mixed': '🔀'
    };
    
    return `
        <div class="transport-group">
            <div class="transport-group__header">
                <span class="transport-group__icon">${transportIcons[transportType]}</span>
                <h3 class="transport-group__title">${transportNames[transportType]}</h3>
                <span class="transport-group__count">${routes.length} ruta${routes.length > 1 ? 's' : ''}</span>
            </div>
            
            <div class="transport-group__routes">
                ${routes.map((route, index) => this.generateRouteCardHTML(route, index, transportType)).join('')}
            </div>
        </div>
    `;
}

// NUEVO MÉTODO: Genera HTML para una tarjeta de ruta individual
generateRouteCardHTML(route, index, transportType) {
    const totalTime = route.totalTime || route.segments.reduce((sum, seg) => sum + seg.time_min, 0);
    const totalCost = route.totalCost || route.segments.reduce((sum, seg) => sum + seg.cost, 0);
    const transfers = route.segments.length - 1;
    
    // Aplicar alertas
    const activeAlerts = this.alerts.filter(a => a.active);
    let adjustedTime = totalTime;
    let adjustedCost = totalCost;
    
    activeAlerts.forEach(alert => {
        adjustedTime = Math.round(adjustedTime * (1 + alert.time_pct / 100));
        adjustedCost += alert.cost_extra;
    });
    
    // Determinar si es ruta directa o combinada
    const isDirect = route.segments.length === 1;
    const isMixed = transportType === 'mixed';
    
    return `
        <div class="route-card ${isMixed ? 'route-card--mixed' : ''}">
            <div class="route-card__header">
                <h4 class="route-card__title">
                    ${route.name || `Opción ${index + 1}`}
                    ${isDirect ? '<span class="route-badge route-badge--direct">DIRECTO</span>' : ''}
                    ${route.isCombined ? '<span class="route-badge route-badge--combined">COMBINADA</span>' : ''}
                </h4>
                <div class="route-card__actions">
                    <button class="route-card__action favorite-toggle" onclick="app.toggleFavorite(${JSON.stringify(route).replace(/"/g, '&quot;')})">
                        ★
                    </button>
                </div>
            </div>
            
            <div class="route-card__summary">
                <div class="route-summary__item">
                    <span class="summary-label">⏱️ Tiempo:</span>
                    <span class="summary-value">
                        <strong>${adjustedTime} min</strong>
                        ${adjustedTime !== totalTime ? 
                            `<small class="alert-effect">(+${activeAlerts[0]?.time_pct}%)</small>` : ''}
                    </span>
                </div>
                
                <div class="route-summary__item">
                    <span class="summary-label">💰 Costo:</span>
                    <span class="summary-value">
                        <strong>$${adjustedCost} DOP</strong>
                        ${adjustedCost !== totalCost ? 
                            `<small class="alert-effect">(+$${activeAlerts[0]?.cost_extra})</small>` : ''}
                    </span>
                </div>
                
                <div class="route-summary__item">
                    <span class="summary-label">🔄 Transbordos:</span>
                    <span class="summary-value"><strong>${transfers}</strong></span>
                </div>
            </div>
            
            <div class="route-card__details-toggle">
                <button class="btn-details" onclick="this.parentElement.nextElementSibling.classList.toggle('show-details')">
                    📋 Ver detalles del recorrido
                </button>
            </div>
            
            <div class="route-card__transfers">
                <h5>Detalles del Recorrido:</h5>
                ${route.segments.map((seg, segIndex) => `
                    <div class="route-segment">
                        <div class="segment-number">${segIndex + 1}</div>
                        <div class="segment-icon transport-icon--${seg.transport}">
                            ${this.getTransportIcon(seg.transport)}
                        </div>
                        <div class="segment-info">
                            <div class="segment-route">
                                <strong>${this.getLocationName(seg.from)} → ${this.getLocationName(seg.to)}</strong>
                            </div>
                            <div class="segment-details">
                                <span class="segment-transport">${this.getTransportName(seg.transport)}</span>
                                <span class="segment-time">${seg.time_min} min</span>
                                <span class="segment-cost">$${seg.cost} DOP</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// NUEVO MÉTODO: Aplica todas las alertas activas a una ruta
applyActiveAlerts(route) {
    const activeAlerts = this.alerts.filter(alert => alert.active);
    
    if (activeAlerts.length === 0) {
        return route;
    }
    
    let totalTimeIncrease = 0;
    let totalCostIncrease = 0;
    let appliedAlerts = [];
    
    activeAlerts.forEach(alert => {
        const timeIncrease = Math.round(route.totalTime * (alert.time_pct / 100));
        const costIncrease = alert.cost_extra;
        
        totalTimeIncrease += timeIncrease;
        totalCostIncrease += costIncrease;
        
        appliedAlerts.push({
            type: alert.type,
            name: alert.name,
            time_pct: alert.time_pct,
            cost_extra: alert.cost_extra,
            time_increase: timeIncrease,
            cost_increase: costIncrease
        });
    });
    
    return {
        ...route,
        totalTime: route.totalTime + totalTimeIncrease,
        totalCost: route.totalCost + totalCostIncrease,
        appliedAlerts: appliedAlerts,
        originalTime: route.totalTime,
        originalCost: route.totalCost
    };
}
    
    
    showActiveAlerts() {
    const container = document.getElementById('alerts-container');
    const activeAlerts = this.alerts.filter(alert => alert.active);
    
    if (activeAlerts.length === 0) {
        container.innerHTML = `
            <div class="alert alert--clear">
                <span class="alert__icon">✅</span>
                <div>
                    <strong>Condiciones Normales</strong>
                    <p>No hay alertas activas - tráfico fluido</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activeAlerts.map(alert => `
        <div class="alert alert--${alert.type}">
            <span class="alert__icon">${alert.icon}</span>
            <div>
                <strong>${alert.name}</strong>
                <p>${alert.description}</p>
                <small>
                    ⏱️ +${alert.time_pct}% tiempo • 
                    💰 +$${alert.cost_extra} costo
                </small>
            </div>
        </div>
    `).join('');
}
    
    showAlertsSection() {
        const alertsSection = document.getElementById('alerts');
        if (!alertsSection) return;
        
        const activeAlerts = this.alerts.filter(alert => alert.active);
        const inactiveAlerts = this.alerts.filter(alert => !alert.active);
        
        alertsSection.innerHTML = `
            <div class="container">
                <h2 class="section__title">Alertas del Sistema</h2>
                
                <div class="alerts-management">
                    <h3>Alertas Activas</h3>
                    <div class="active-alerts">
                        ${activeAlerts.length > 0 ? 
                            activeAlerts.map(alert => `
                                <div class="alert-item active">
                                    <span class="alert-icon">⚠️</span>
                                    <div class="alert-info">
                                        <h4>${this.getAlertTitle(alert.type)}</h4>
                                        <p>${alert.message || this.getAlertDescription(alert)}</p>
                                        <small>Afecta: +${alert.time_pct}% tiempo, +$${alert.cost_extra} costo</small>
                                    </div>
                                    <button class="btn-alert-toggle" onclick="app.toggleAlert('${alert.id}')">
                                        Desactivar
                                    </button>
                                </div>
                            `).join('') : 
                            '<p>No hay alertas activas en este momento</p>'
                        }
                    </div>
                    
                    <h3>Alertas Disponibles</h3>
                    <div class="inactive-alerts">
                        ${inactiveAlerts.length > 0 ?
                            inactiveAlerts.map(alert => `
                                <div class="alert-item inactive">
                                    <span class="alert-icon">ℹ️</span>
                                    <div class="alert-info">
                                        <h4>${this.getAlertTitle(alert.type)}</h4>
                                        <p>${alert.message || this.getAlertDescription(alert)}</p>
                                        <small>Afectaría: +${alert.time_pct}% tiempo, +$${alert.cost_extra} costo</small>
                                    </div>
                                    <button class="btn-alert-toggle" onclick="app.toggleAlert('${alert.id}')">
                                        Activar
                                    </button>
                                </div>
                            `).join('') :
                            '<p>Todas las alertas están activas</p>'
                        }
                    </div>
                </div>
            </div>
        `;
    }
    
    toggleAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.active = !alert.active;
            console.log(`🔔 Alerta ${alertId} ${alert.active ? 'activada' : 'desactivada'}`);
            
            // Si estamos en la sección de alertas, actualizar la vista
            if (document.getElementById('alerts') && !document.getElementById('alerts').classList.contains('hidden')) {
                this.showAlertsSection();
            }
            
            // Si hay resultados mostrados, recalcular con las nuevas alertas
            if (document.getElementById('results') && !document.getElementById('results').classList.contains('hidden')) {
                this.recalculateCurrentRoutes();
            }
        }
    }
    
    recalculateCurrentRoutes() {
        const routesList = document.getElementById('routes-list');
        const currentRoutes = JSON.parse(routesList.dataset.currentRoutes || '[]');
        
        if (currentRoutes.length > 0) {
            // Re-mostrar las rutas con las alertas actualizadas
            this.displayRoutes(currentRoutes, currentRoutes[0].origin, currentRoutes[0].destination);
        }
    }
    
    getTransportIcon(transport) {
        const icons = {
            'concho': 'C',
            'guagua': 'G',
            'carro-publico': 'CP',
            'motoconcho': 'M'
        };
        return icons[transport] || '?';
    }
    
    getTransportName(transport) {
        const names = {
            'concho': 'Concho',
            'guagua': 'Guagua', 
            'carro-publico': 'Carro Público',
            'motoconcho': 'Motoconcho'
        };
        return names[transport] || transport;
    }
    
    getLocationName(id) {
        const location = this.locations.find(loc => loc.id === id);
        return location ? location.name : id;
    }
    
    getAlertTitle(type) {
        const titles = {
            'rain': 'Lluvia Intensa',
            'peak': 'Hora Pico',
            'strike': 'Paro de Transporte',
            'accident': 'Accidente de Tránsito',
            'event': 'Evento Especial'
        };
        return titles[type] || 'Alerta';
    }

    getAlertDescription(alert) {
        const baseDescriptions = {
            'rain': 'Tráfico más lento debido a lluvia intensa',
            'peak': 'Tráfico congestionado por hora pico',
            'strike': 'Posibles interrupciones en el servicio de transporte',
            'accident': 'Retrasos por accidente de tránsito',
            'event': 'Evento especial afecta el tráfico normal'
        };
        return baseDescriptions[alert.type] || 'Condición que afecta el transporte';
    }
    
    toggleFavorite(route) {
        const favorite = {
            id: Date.now(),
            ...route,
            savedAt: new Date().toLocaleString()
        };
        
        // Verificar si ya existe
        const exists = this.favorites.some(fav => 
            fav.origin.id === route.origin.id && 
            fav.destination.id === route.destination.id &&
            JSON.stringify(fav.segments) === JSON.stringify(route.segments)
        );
        
        if (!exists) {
            this.favorites.push(favorite);
            localStorage.setItem('routeFavorites', JSON.stringify(this.favorites));
            this.showAlert('✅ Ruta guardada en favoritos', 'success');
            console.log('💾 Favorito guardado:', favorite);
        } else {
            this.showAlert('⚠️ Esta ruta ya está en favoritos', 'info');
        }
    }
    
    loadFavorites() {
        const saved = localStorage.getItem('routeFavorites');
        this.favorites = saved ? JSON.parse(saved) : [];
        console.log('📂 Favoritos cargados:', this.favorites.length);
    }
    
    showFavorites() {
        const container = document.getElementById('favorites-list');
        const section = document.getElementById('favorites');
        
        if (this.favorites.length === 0) {
            container.innerHTML = '<p>No tienes rutas favoritas guardadas</p>';
        } else {
            container.innerHTML = this.favorites.map(fav => {
                const totalTime = fav.segments.reduce((sum, seg) => sum + seg.time_min, 0);
                const totalCost = fav.segments.reduce((sum, seg) => sum + seg.cost, 0);
                
                return `
                    <div class="route-card">
                        <div class="route-card__header">
                            <h3 class="route-card__title">${fav.name || 'Ruta Favorita'}</h3>
                            <div class="route-card__actions">
                                <button class="route-card__action" onclick="app.removeFavorite(${fav.id})">
                                    🗑️
                                </button>
                            </div>
                        </div>
                        
                        <div class="route-card__details">
                            <div class="route-card__detail">
                                <span class="route-card__label">Tiempo Total</span>
                                <span class="route-card__value">${totalTime} min</span>
                            </div>
                            
                            <div class="route-card__detail">
                                <span class="route-card__label">Costo Total</span>
                                <span class="route-card__value">$${totalCost} DOP</span>
                            </div>
                            
                            <div class="route-card__detail">
                                <span class="route-card__label">Guardada</span>
                                <span class="route-card__value">${fav.savedAt}</span>
                            </div>
                        </div>
                        
                        <div class="route-card__transfers">
                            <h4>Recorrido:</h4>
                            ${fav.segments.map(seg => `
                                <div class="route-card__transfer">
                                    <span class="transport-icon transport-icon--${seg.transport}">
                                        ${this.getTransportIcon(seg.transport)}
                                    </span>
                                    <div>
                                        <strong>${this.getLocationName(seg.from)} → ${this.getLocationName(seg.to)}</strong>
                                        <div>${seg.time_min} min - $${seg.cost} DOP</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        section.classList.remove('hidden');
        this.showSection('favorites');
    }
    
    removeFavorite(id) {
        this.favorites = this.favorites.filter(fav => fav.id !== id);
        localStorage.setItem('routeFavorites', JSON.stringify(this.favorites));
        this.showFavorites();
        this.showAlert('🗑️ Ruta eliminada de favoritos', 'success');
    }
    
    updateMap(origin, destination, route) {
    const svg = document.getElementById('schematic-map');
    if (!svg) return;
    
    // Limpiar mapa
    svg.innerHTML = '';
    
    // Configuración del mapa
    const padding = 40;
    const width = 800;
    const height = 400;
    
    // Dibujar líneas de conexión entre todas las ubicaciones (fondo)
    this.drawBackgroundConnections(svg);
    
    // Dibujar la ruta seleccionada (si existe)
    if (route && route.segments) {
        this.drawRoute(svg, route);
    }
    
    // Dibujar nodos (ubicaciones)
    this.drawLocationNodes(svg, origin, destination);
    
    console.log('🗺️ Mapa actualizado');
}

// NUEVO MÉTODO: Dibuja conexiones de fondo entre ubicaciones cercanas
drawBackgroundConnections(svg) {
    this.locations.forEach((location1, index) => {
        this.locations.slice(index + 1).forEach(location2 => {
            const distance = this.calculateDistance(location1.coords, location2.coords);
            
            // Solo dibujar conexiones entre ubicaciones cercanas
            if (distance < 50) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', location1.coords.x);
                line.setAttribute('y1', location1.coords.y);
                line.setAttribute('x2', location2.coords.x);
                line.setAttribute('y2', location2.coords.y);
                line.setAttribute('class', 'map-connection');
                svg.appendChild(line);
            }
        });
    });
}

// NUEVO MÉTODO: Dibuja la ruta seleccionada
drawRoute(svg, route) {
    route.segments.forEach(segment => {
        const fromLoc = this.locations.find(loc => loc.id === segment.from);
        const toLoc = this.locations.find(loc => loc.id === segment.to);
        
        if (fromLoc && toLoc) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', fromLoc.coords.x);
            line.setAttribute('y1', fromLoc.coords.y);
            line.setAttribute('x2', toLoc.coords.x);
            line.setAttribute('y2', toLoc.coords.y);
            line.setAttribute('class', `map-route map-route--${segment.transport}`);
            line.setAttribute('stroke-width', '4');
            svg.appendChild(line);
            
            // Agregar puntos intermedios para rutas con transbordos
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', (fromLoc.coords.x + toLoc.coords.x) / 2);
            circle.setAttribute('cy', (fromLoc.coords.y + toLoc.coords.y) / 2);
            circle.setAttribute('r', '3');
            circle.setAttribute('class', `map-route-point map-route-point--${segment.transport}`);
            svg.appendChild(circle);
        }
    });
}

// NUEVO MÉTODO: Dibuja los nodos de ubicaciones
drawLocationNodes(svg, origin, destination) {
    this.locations.forEach(location => {
        // Determinar el tipo de nodo
        let nodeClass = 'map-node';
        if (location.id === origin.id) {
            nodeClass = 'map-node map-node--origin';
        } else if (location.id === destination.id) {
            nodeClass = 'map-node map-node--destination';
        }
        
        // Dibujar nodo
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', location.coords.x);
        circle.setAttribute('cy', location.coords.y);
        circle.setAttribute('r', '6');
        circle.setAttribute('class', nodeClass);
        
        // Tooltip interactivo
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = location.name;
        circle.appendChild(title);
        
        // Evento click para seleccionar ubicación
        circle.addEventListener('click', () => {
            this.selectLocationFromMap(location);
        });
        
        svg.appendChild(circle);
        
        // Etiqueta del nodo
        this.drawNodeLabel(svg, location);
    });
}

// NUEVO MÉTODO: Dibuja etiquetas de los nodos
drawNodeLabel(svg, location) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', location.coords.x);
    text.setAttribute('y', location.coords.y - 12);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'map-label');
    text.textContent = location.name;
    svg.appendChild(text);
}

// NUEVO MÉTODO: Selecciona ubicación desde el mapa
selectLocationFromMap(location) {
    // Puedes implementar aquí la lógica para seleccionar origen/destino desde el mapa
    console.log(`📍 Ubicación seleccionada desde mapa: ${location.name}`);
    // Por ejemplo: this.showLocationDetails(location);
}
    
    showAlert(message, type = 'info') {
        // Implementación simple de alerta (puedes mejorar esto con un sistema de notificaciones)
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem;
            border-radius: 4px;
            color: white;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        
        alertDiv.style.backgroundColor = colors[type] || colors.info;
        alertDiv.textContent = message;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 3000);
    }
}

// Inicializar aplicación globalmente
console.log('🚀 Creando instancia de la aplicación...');
window.app = new RoutePlanner();
console.log('🎯 Aplicación disponible como window.app');