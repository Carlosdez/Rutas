// Módulo para la interfaz de usuario

let appInstance;

export function initUI(app) {
    appInstance = app;
    
    // Inicializar eventos
    initEvents();
    
    // Inicializar búsquedas con debounce
    initSearchWithDebounce();

    // En initUI, agregar:
    initSearchWithDebounce(); {
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    
    // Crear contenedores de sugerencias si no existen
    if (!document.getElementById('origin-suggestions')) {
        const originSuggestions = document.createElement('ul');
        originSuggestions.id = 'origin-suggestions';
        originSuggestions.className = 'search-suggestions';
        originInput.parentNode.appendChild(originSuggestions);
    }
    
    if (!document.getElementById('destination-suggestions')) {
        const destinationSuggestions = document.createElement('ul');
        destinationSuggestions.id = 'destination-suggestions';
        destinationSuggestions.className = 'search-suggestions';
        destinationInput.parentNode.appendChild(destinationSuggestions);
    }
    
    let originTimeout, destinationTimeout;
    
    originInput.addEventListener('input', (e) => {
        clearTimeout(originTimeout);
        originTimeout = setTimeout(() => {
            this.showSuggestions(e.target.value, 'origin');
        }, 300);
    });
    
    destinationInput.addEventListener('input', (e) => {
        clearTimeout(destinationTimeout);
        destinationTimeout = setTimeout(() => {
            this.showSuggestions(e.target.value, 'destination');
        }, 300);
    });
    }

    showSuggestions(query, type); {
    const suggestionsContainer = document.getElementById(`${type}-suggestions`);
    if (!query) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    const filtered = this.locations.filter(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    suggestionsContainer.innerHTML = '';
    filtered.forEach(location => {
        const li = document.createElement('li');
        li.textContent = location.name;
        li.addEventListener('click', () => {
            document.getElementById(type).value = location.name;
            suggestionsContainer.style.display = 'none';
        });
        suggestionsContainer.appendChild(li);
    });
    
    suggestionsContainer.style.display = filtered.length ? 'block' : 'none';
    }
   
}

function initEvents() {
    // Formulario de búsqueda
    const routeForm = document.getElementById('route-form');
    routeForm.addEventListener('submit', handleRouteSearch);
    
    // Ordenamiento
    const sortSelect = document.getElementById('sort-by');
    sortSelect.addEventListener('change', handleSortChange);
    
    // Toggles
    document.getElementById('theme-toggle').addEventListener('click', () => {
        appInstance.toggleTheme();
    });
    
    document.getElementById('language-toggle').addEventListener('click', () => {
        appInstance.toggleLanguage();
    });
    
    document.getElementById('savings-toggle').addEventListener('click', () => {
        appInstance.toggleSavingsMode();
    });
    
    // Menú móvil
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    
    navToggle.addEventListener('click', () => {
        navList.classList.toggle('nav__list--open');
    });
}

function initSearchWithDebounce() {
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    const originSuggestions = document.getElementById('origin-suggestions');
    const destinationSuggestions = document.getElementById('destination-suggestions');
    
    // Debounce para búsquedas
    let originTimeout, destinationTimeout;
    
    originInput.addEventListener('input', () => {
        clearTimeout(originTimeout);
        originTimeout = setTimeout(() => {
            showSuggestions(originInput.value, originSuggestions, appInstance.locations);
        }, 300);
    });
    
    destinationInput.addEventListener('input', () => {
        clearTimeout(destinationTimeout);
        destinationTimeout = setTimeout(() => {
            showSuggestions(destinationInput.value, destinationSuggestions, appInstance.locations);
        }, 300);
    });
    
    // Ocultar sugerencias al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!originInput.contains(e.target)) {
            originSuggestions.style.display = 'none';
        }
        if (!destinationInput.contains(e.target)) {
            destinationSuggestions.style.display = 'none';
        }
    });
}

function showSuggestions(query, container, locations) {
    if (!query) {
        container.style.display = 'none';
        return;
    }
    
    const filtered = locations.filter(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    container.innerHTML = '';
    filtered.forEach(location => {
        const li = document.createElement('li');
        li.textContent = location.name;
        li.addEventListener('click', () => {
            container.previousElementSibling.value = location.name;
            container.style.display = 'none';
        });
        container.appendChild(li);
    });
    
    container.style.display = filtered.length ? 'block' : 'none';
}

function handleRouteSearch(e) {
    e.preventDefault();
    
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const transportCheckboxes = document.querySelectorAll('input[name="transport"]:checked');
    const transportTypes = Array.from(transportCheckboxes).map(cb => cb.value);
    
    if (transportTypes.length === 0) {
        showAlert('Selecciona al menos un medio de transporte', 'warning');
        return;
    }
    
    appInstance.searchRoutes(origin, destination, transportTypes);
    
    // Mostrar sección de resultados
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('favorites').classList.add('hidden');
}

function handleSortChange(e) {
    const routesList = document.getElementById('routes-list');
    const currentRoutes = JSON.parse(routesList.dataset.currentRoutes || '[]');
    const sortedRoutes = sortRoutes(currentRoutes, e.target.value);
    
    showRoutesList(sortedRoutes, appInstance);
}

export function showResults(routes, app) {
    const resultsSection = document.getElementById('results');
    const routesList = document.getElementById('routes-list');
    const alertsContainer = document.getElementById('alerts-container');
    
    // Mostrar alertas activas
    showActiveAlerts(alertsContainer, app.alerts);
    
    if (routes.length === 0) {
        routesList.innerHTML = '<p>No se encontraron rutas para tu búsqueda</p>';
        return;
    }
    
    // Ordenar por tiempo por defecto
    const sortedRoutes = sortRoutes(routes, 'time');
    
    // Guardar rutas actuales para reordenamiento
    routesList.dataset.currentRoutes = JSON.stringify(sortedRoutes);
    
    showRoutesList(sortedRoutes, app);
    
    // Mostrar sección de resultados
    resultsSection.classList.remove('hidden');
    document.getElementById('favorites').classList.add('hidden');
}

function showActiveAlerts(container, alerts) {
    const activeAlerts = alerts.filter(alert => alert.active);
    
    if (activeAlerts.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = activeAlerts.map(alert => `
        <div class="alert alert--${alert.type}">
            <span class="alert__icon">⚠️</span>
            <div>
                <strong>${getAlertTitle(alert.type)}</strong>
                <p>${getAlertDescription(alert)}</p>
            </div>
        </div>
    `).join('');
}

function getAlertTitle(type) {
    const titles = {
        rain: 'Lluvia Intensa',
        peak: 'Hora Pico',
        strike: 'Paro de Transporte'
    };
    return titles[type] || 'Alerta';
}

function getAlertDescription(alert) {
    const baseDescriptions = {
        rain: 'Tráfico más lento debido a lluvia',
        peak: 'Tráfico congestionado por hora pico',
        strike: 'Posibles interrupciones en el servicio'
    };
    
    const base = baseDescriptions[alert.type] || 'Condición que afecta el transporte';
    const timeEffect = alert.time_pct > 0 ? ` (+${alert.time_pct}% tiempo)` : '';
    const costEffect = alert.cost_extra > 0 ? ` (+${alert.cost_extra} pesos)` : '';
    
    return base + timeEffect + costEffect;
}

export function showRoutesList(routes, app) {
    const routesList = document.getElementById('routes-list');
    
    routesList.innerHTML = routes.map((route, index) => `
        <article class="route-card">
            <div class="route-card__header">
                <h3 class="route-card__title">Ruta ${index + 1}</h3>
                <div class="route-card__actions">
                    <button class="route-card__action favorite-toggle" 
                            data-route='${JSON.stringify(route).replace(/'/g, "\\'")}'>
                        ${isFavorite(route, app.favorites) ? '★' : '☆'}
                    </button>
                    <button class="route-card__action map-toggle" 
                            data-route='${JSON.stringify(route).replace(/'/g, "\\'")}'>
                        🗺️
                    </button>
                </div>
            </div>
            
            <div class="route-card__details">
                <div class="route-card__detail">
                    <span class="route-card__label">Tiempo Total</span>
                    <span class="route-card__value">
                        ${route.adjustedTime || route.totalTime} min
                        ${route.adjustedTime ? `<small>(original: ${route.totalTime} min)</small>` : ''}
                    </span>
                </div>
                
                <div class="route-card__detail">
                    <span class="route-card__label">Costo Total</span>
                    <span class="route-card__value">
                        $${route.adjustedCost || route.totalCost} DOP
                        ${route.adjustedCost ? `<small>(original: $${route.totalCost} DOP)</small>` : ''}
                    </span>
                </div>
                
                <div class="route-card__detail">
                    <span class="route-card__label">Transbordos</span>
                    <span class="route-card__value">${route.transfers}</span>
                </div>
                
                <div class="route-card__detail">
                    <span class="route-card__label">Transporte</span>
                    <span class="route-card__value">
                        ${route.segments.map(seg => getTransportLabel(seg.transport)).join(' → ')}
                    </span>
                </div>
            </div>
            
            <div class="route-card__transfers">
                <h4>Detalles del Recorrido:</h4>
                ${route.segments.map((segment, segIndex) => `
                    <div class="route-card__transfer">
                        <span class="transport-icon transport-icon--${segment.transport}">
                            ${getTransportIcon(segment.transport)}
                        </span>
                        <div>
                            <strong>${getLocationName(segment.from, app.locations)} → ${getLocationName(segment.to, app.locations)}</strong>
                            <div>${segment.time_min} min - $${segment.cost} DOP</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </article>
    `).join('');
    
    // Agregar event listeners a los botones
    routesList.querySelectorAll('.favorite-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const route = JSON.parse(button.dataset.route);
            app.toggleFavorite(route);
            button.textContent = isFavorite(route, app.favorites) ? '★' : '☆';
        });
    });
    
    routesList.querySelectorAll('.map-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const route = JSON.parse(button.dataset.route);
            updateMap(route.origin, route.destination, route);
            document.getElementById('map').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

export function showFavorites(favorites, app) {
    const favoritesList = document.getElementById('favorites-list');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No tienes rutas favoritas guardadas</p>';
        return;
    }
    
    showRoutesList(favorites, app);
    
    // Mostrar sección de favoritos
    document.getElementById('favorites').classList.remove('hidden');
    document.getElementById('results').classList.add('hidden');
}

function isFavorite(route, favorites) {
    return favorites.some(fav => 
        fav.origin.id === route.origin.id && 
        fav.destination.id === route.destination.id &&
        JSON.stringify(fav.transport) === JSON.stringify(route.transport)
    );
}

function getTransportLabel(transport) {
    const labels = {
        'concho': 'Concho',
        'guagua': 'Guagua',
        'carro-publico': 'Carro Público',
        'motoconcho': 'Motoconcho'
    };
    return labels[transport] || transport;
}

function getTransportIcon(transport) {
    const icons = {
        'concho': 'C',
        'guagua': 'G',
        'carro-publico': 'CP',
        'motoconcho': 'M'
    };
    return icons[transport] || '?';
}

function getLocationName(locationId, locations) {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : locationId;
}

export function updateMap(origin, destination, route) {
    const svg = document.getElementById('schematic-map');
    const locations = appInstance.locations;
    
    // Limpiar mapa
    svg.innerHTML = '';
    
    // Dibujar líneas de ruta
    if (route && route.segments) {
        route.segments.forEach(segment => {
            const fromLoc = locations.find(loc => loc.id === segment.from);
            const toLoc = locations.find(loc => loc.id === segment.to);
            
            if (fromLoc && toLoc) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', fromLoc.coords.x);
                line.setAttribute('y1', fromLoc.coords.y);
                line.setAttribute('x2', toLoc.coords.x);
                line.setAttribute('y2', toLoc.coords.y);
                line.setAttribute('class', 'map-line');
                svg.appendChild(line);
            }
        });
    }
    
    // Dibujar nodos
    locations.forEach(location => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', location.coords.x);
        circle.setAttribute('cy', location.coords.y);
        circle.setAttribute('r', 8);
        circle.setAttribute('class', 'map-node');
        
        if (location.id === origin.id) {
            circle.setAttribute('class', 'map-node map-node--origin');
        } else if (location.id === destination.id) {
            circle.setAttribute('class', 'map-node map-node--destination');
        }
        
        // Tooltip
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = location.name;
        circle.appendChild(title);
        
        svg.appendChild(circle);
        
        // Etiqueta
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', location.coords.x);
        text.setAttribute('y', location.coords.y - 15);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'map-label');
        text.textContent = location.name;
        svg.appendChild(text);
    });
}

export function showAlert(message, type = 'info') {
    // Implementación simple de alerta
    alert(`${type.toUpperCase()}: ${message}`);
}