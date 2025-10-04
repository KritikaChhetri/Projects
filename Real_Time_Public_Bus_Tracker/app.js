// Enhanced bus data with GPS coordinates
let busData = [
    {
        route: "1",
        name: "Downtown - Residential Loop",
        color: "#2563eb",
        stops: [
            { name: "Main Street", lat: 26.1445, lng: 91.7362, arrivals: [3, 18, 33] },
            { name: "City Center", lat: 26.1454, lng: 91.7335, arrivals: [8, 23, 38] },
            { name: "Park Avenue", lat: 26.1461, lng: 91.7298, arrivals: [12, 27, 42] },
            { name: "Oak Street", lat: 26.1438, lng: 91.7285, arrivals: [15, 30, 45] }
        ],
        buses: [
            { id: "B1-01", lat: 26.1449, lng: 91.7348, heading: 45, nextStop: "City Center", eta: 3 },
            { id: "B1-02", lat: 26.1455, lng: 91.7315, heading: 90, nextStop: "Park Avenue", eta: 18 }
        ],
        active: true
    },
    {
        route: "2", 
        name: "Hospital - University Shuttle",
        color: "#10b981",
        stops: [
            { name: "Hospital", lat: 26.1475, lng: 91.7405, arrivals: [7, 22] },
            { name: "Medical Center", lat: 26.1485, lng: 91.7385, arrivals: [12, 27] },
            { name: "University", lat: 26.1495, lng: 91.7365, arrivals: [18, 33] },
            { name: "Student Housing", lat: 26.1505, lng: 91.7345, arrivals: [22, 37] }
        ],
        buses: [
            { id: "B2-01", lat: 26.1480, lng: 91.7395, heading: 180, nextStop: "Medical Center", eta: 7 }
        ],
        active: true
    },
    {
        route: "3",
        name: "Industrial Zone Express", 
        color: "#f59e0b",
        stops: [
            { name: "Factory District", lat: 26.1425, lng: 91.7445, arrivals: [12, 27, 42] },
            { name: "Workers Housing", lat: 26.1435, lng: 91.7425, arrivals: [18, 33, 48] },
            { name: "City Center", lat: 26.1454, lng: 91.7335, arrivals: [25, 40, 55] }
        ],
        buses: [
            { id: "B3-01", lat: 26.1430, lng: 91.7435, heading: 270, nextStop: "Workers Housing", eta: 12 }
        ],
        active: true
    }
];

let map;
let busMarkers = {};
let stopMarkers = {};
let routeLines = {};
let userLocation = null;

// Paths for PNG icons
const ICONS = {
    bus: "icons/bus.png",
    stop: "icons/stop.png",
    user: "icons/user.png",
    sos: "icons/sos.png",
    success: "icons/success.png",
    danger: "icons/danger.png"
};

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initDemo();
    
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        filterRoutes(this.value);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (map) addUserLocationMarker();
            },
            () => console.log('Location access denied or unavailable')
        );
    }
});

function initDemo() {
    map = L.map('demoMap').setView([26.1445, 91.7362], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    updateMapData();
    renderRoutes();
    setInterval(updateDemo, 10000);
}

function addUserLocationMarker() {
    if (userLocation && map) {
        const userIcon = L.divIcon({
            className: 'user-marker',
            html: `<img src="${ICONS.user}" alt="user" style="width:20px;height:20px;">`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
         .addTo(map)
         .bindPopup('<strong><img src="' + ICONS.user + '" alt="user" style="width:16px;height:16px;"> Your Location</strong>');
    }
}

function updateMapData() {
    Object.values(busMarkers).forEach(marker => map.removeLayer(marker));
    Object.values(stopMarkers).forEach(marker => map.removeLayer(marker));
    Object.values(routeLines).forEach(line => map.removeLayer(line));
    
    busMarkers = {};
    stopMarkers = {};
    routeLines = {};

    busData.forEach(route => {
        if (!route.active) return;

        // Stops
        route.stops.forEach(stop => {
            const marker = L.circleMarker([stop.lat, stop.lng], {
                radius: 6,
                fillColor: route.color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            marker.bindPopup(`
                <strong><img src="${ICONS.stop}" alt="stop" style="width:16px;height:16px;"> ${stop.name}</strong><br>
                Route ${route.route}<br>
                Next arrivals: ${stop.arrivals.slice(0,2).join(', ')} min
            `);

            stopMarkers[`${route.route}-${stop.name}`] = marker;
        });

        // Route line
        const routeCoords = route.stops.map(stop => [stop.lat, stop.lng]);
        const routeLine = L.polyline(routeCoords, { color: route.color, weight: 4, opacity: 0.7 }).addTo(map);
        routeLines[route.route] = routeLine;

        // Buses
        route.buses.forEach(bus => {
            const busIcon = L.divIcon({
                className: 'bus-marker',
                html: `<img src="${ICONS.bus}" alt="bus" style="width:24px;height:24px;">`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const marker = L.marker([bus.lat, bus.lng], { icon: busIcon }).addTo(map);
            marker.bindPopup(`
                <strong><img src="${ICONS.bus}" alt="bus" style="width:16px;height:16px;"> Bus ${bus.id}</strong><br>
                Route ${route.route}<br>
                Next stop: ${bus.nextStop}<br>
                ETA: ${bus.eta} minutes
            `);

            busMarkers[bus.id] = marker;
        });
    });

    if (userLocation) addUserLocationMarker();
}

function renderRoutes() {
    const routesSection = document.getElementById('routesSection');
    
    routesSection.innerHTML = busData.map(route => `
        <div class="route-card" onclick="focusOnRoute('${route.route}')">
            <div class="route-header">
                <div class="route-number" style="background: ${route.color}">Route ${route.route}</div>
                <div class="route-status">
                    ${route.active 
                        ? '<img src="' + ICONS.success + '" alt="active" style="width:12px;height:12px;"> ' + route.buses.length + ' buses active'
                        : '<img src="' + ICONS.danger + '" alt="inactive" style="width:12px;height:12px;"> Out of Service'}
                </div>
            </div>
            <div class="route-name">${route.name}</div>
            ${route.active ? `
                <div class="arrival-times">
                    ${route.stops[0].arrivals.slice(0,3).map((time, index) => `
                        <div class="arrival-item">
                            <div class="arrival-time">${time} min</div>
                            <div class="arrival-label">${index === 0 ? 'Next' : index === 1 ? 'Following' : 'After'}</div>
                        </div>
                    `).join('')}
                </div>
            ` : `<div style="color: #666; font-style: italic;">Service temporarily unavailable</div>`}
        </div>
    `).join('');
}

function triggerSOS() {
    closeSOSModal();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => sendSOSAlert({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => sendSOSAlert({ lat: 26.1445, lng: 91.7362 })
        );
    } else {
        sendSOSAlert({ lat: 26.1445, lng: 91.7362 });
    }
}

function sendSOSAlert(location) {
    showAlert('<img src="' + ICONS.sos + '" style="width:18px;height:18px;"> Emergency alert sent! Location shared with authorities.', 'danger');

    if (map) {
        const emergencyIcon = L.divIcon({
            className: 'emergency-marker',
            html: `<img src="${ICONS.sos}" alt="sos" style="width:28px;height:28px;">`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        L.marker([location.lat, location.lng], { icon: emergencyIcon })
         .addTo(map)
         .bindPopup('<strong><img src="' + ICONS.sos + '" alt="sos" style="width:18px;height:18px;"> Emergency Alert</strong><br>Location sent to authorities')
         .openPopup();

        map.setView([location.lat, location.lng], 16);
    }
}