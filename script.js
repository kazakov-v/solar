// Planet data
const planets = [
    {
        name: "Меркурий",
        nameEn: "Mercury",
        color: "#b5b5b5",
        radius: 4,
        orbitRadius: 60,
        speed: 4.15,
        diameter: "4 879 км",
        distance: "57.9 млн км",
        period: "88 дней",
        temperature: "от -180°C до +430°C",
        moons: "0",
        icon: "☿",
        description: "Самая маленькая и ближайшая к Солнцу планета. Не имеет атмосферы и спутников. Поверхность покрыта кратерами."
    },
    {
        name: "Венера",
        nameEn: "Venus",
        color: "#e8cda0",
        radius: 7,
        orbitRadius: 95,
        speed: 1.62,
        diameter: "12 104 км",
        distance: "108.2 млн км",
        period: "225 дней",
        temperature: "~465°C",
        moons: "0",
        icon: "♀",
        description: "Самая горячая планета из-за парникового эффекта. Вращается в обратном направлении. Часто называется 'сестрой Земли'."
    },
    {
        name: "Земля",
        nameEn: "Earth",
        color: "#4da6ff",
        radius: 8,
        orbitRadius: 130,
        speed: 1.0,
        diameter: "12 742 км",
        distance: "149.6 млн км",
        period: "365.25 дней",
        temperature: "от -89°C до +57°C",
        moons: "1 (Луна)",
        icon: "🌍",
        description: "Наш дом! Единственная известная планета с жизнью. Имеет жидкую воду на поверхности и защитную атмосферу."
    },
    {
        name: "Марс",
        nameEn: "Mars",
        color: "#e07040",
        radius: 6,
        orbitRadius: 170,
        speed: 0.53,
        diameter: "6 779 км",
        distance: "227.9 млн км",
        period: "687 дней",
        temperature: "от -140°C до +20°C",
        moons: "2 (Фобос, Деймос)",
        icon: "♂",
        description: "Красная планета. Имеет самый большой вулкан (Олимп) и каньон (Долина Маринер) в Солнечной системе."
    },
    {
        name: "Юпитер",
        nameEn: "Jupiter",
        color: "#d4a574",
        radius: 18,
        orbitRadius: 230,
        speed: 0.084,
        diameter: "139 820 км",
        distance: "778.5 млн км",
        period: "11.86 лет",
        temperature: "~-110°C",
        moons: "95+",
        icon: "♃",
        description: "Крупнейшая планета. Газовый гигант с Большим Красным Пятном — гигантским штормом, бушующим уже более 350 лет."
    },
    {
        name: "Сатурн",
        nameEn: "Saturn",
        color: "#f0d890",
        radius: 15,
        orbitRadius: 290,
        speed: 0.034,
        diameter: "116 460 км",
        distance: "1 434 млн км",
        period: "29.46 лет",
        temperature: "~-140°C",
        moons: "146+",
        icon: "♄",
        description: "Знаменита своими кольцами из льда и камней. Плотность настолько мала, что планета могла бы плавать в воде."
    },
    {
        name: "Уран",
        nameEn: "Uranus",
        color: "#7de8e8",
        radius: 12,
        orbitRadius: 345,
        speed: 0.012,
        diameter: "50 724 км",
        distance: "2 871 млн км",
        period: "84 года",
        temperature: "~-195°C",
        moons: "27",
        icon: "♅",
        description: "Ледяной гигант, вращающийся 'на боку' — ось наклонена на 98°. Имеет бледно-голубой цвет из-за метана в атмосфере."
    },
    {
        name: "Нептун",
        nameEn: "Neptune",
        color: "#4466ff",
        radius: 11,
        orbitRadius: 390,
        speed: 0.006,
        diameter: "49 244 км",
        distance: "4 495 млн км",
        period: "164.8 лет",
        temperature: "~-200°C",
        moons: "16",
        icon: "♆",
        description: "Самая далёкая планета. Имеет самые сильные ветры в Солнечной системе — до 2100 км/ч. Открыт математически."
    }
];

// Canvas setup
const canvas = document.getElementById('solarSystem');
const ctx = canvas.getContext('2d');

let width, height, centerX, centerY;
let animationId;
let isPlaying = true;
let speedMultiplier = 1.0;
let zoomLevel = 1.0;
let showOrbits = true;
let showLabels = true;
let showTrails = false;
let selectedPlanet = null;
let time = 0;
let stars = [];
let trails = {};

// Initialize
function init() {
    resizeCanvas();
    generateStars();
    createPlanetButtons();
    setupEventListeners();
    animate();
}

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height || 600;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
}

function generateStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * 1400,
            y: Math.random() * 800,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.7 + 0.3,
            twinkleSpeed: Math.random() * 0.02 + 0.005
        });
    }
}

function createPlanetButtons() {
    const container = document.getElementById('planetButtons');
    planets.forEach((planet, index) => {
        const btn = document.createElement('button');
        btn.className = 'planet-btn';
        btn.innerHTML = `<span class="planet-dot" style="background:${planet.color}"></span>${planet.name}`;
        btn.addEventListener('click', () => selectPlanet(index));
        container.appendChild(btn);
    });
}

function setupEventListeners() {
    // Play/Pause/Reset
    document.getElementById('playBtn').addEventListener('click', () => {
        isPlaying = true;
        document.getElementById('playBtn').classList.add('active');
        document.getElementById('pauseBtn').classList.remove('active');
    });

    document.getElementById('pauseBtn').addEventListener('click', () => {
        isPlaying = false;
        document.getElementById('pauseBtn').classList.add('active');
        document.getElementById('playBtn').classList.remove('active');
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        time = 0;
        trails = {};
        planets.forEach((_, i) => trails[i] = []);
    });

    // Speed slider
    document.getElementById('speedSlider').addEventListener('input', (e) => {
        speedMultiplier = parseFloat(e.target.value);
        document.getElementById('speedValue').textContent = speedMultiplier.toFixed(1) + 'x';
    });

    // Zoom slider
    document.getElementById('zoomSlider').addEventListener('input', (e) => {
        zoomLevel = parseFloat(e.target.value);
        document.getElementById('zoomValue').textContent = zoomLevel.toFixed(1) + 'x';
    });

    // Toggles
    document.getElementById('showOrbits').addEventListener('change', (e) => {
        showOrbits = e.target.checked;
    });

    document.getElementById('showLabels').addEventListener('change', (e) => {
        showLabels = e.target.checked;
    });

    document.getElementById('showTrails').addEventListener('change', (e) => {
        showTrails = e.target.checked;
        if (!showTrails) trails = {};
        planets.forEach((_, i) => trails[i] = []);
    });

    // Canvas click
    canvas.addEventListener('click', handleCanvasClick);

    // Close info
    document.getElementById('closeInfo').addEventListener('click', () => {
        document.getElementById('planetInfo').classList.remove('visible');
        selectedPlanet = null;
        updatePlanetButtons();
    });

    // Resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        generateStars();
    });

    // Initialize trails
    planets.forEach((_, i) => trails[i] = []);
}

function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = planets.length - 1; i >= 0; i--) {
        const planet = planets[i];
        const pos = getPlanetPosition(planet, i);
        const dx = x - pos.x;
        const dy = y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = Math.max(planet.radius * zoomLevel + 5, 15);

        if (dist <= hitRadius) {
            selectPlanet(i);
            return;
        }
    }
}

function selectPlanet(index) {
    selectedPlanet = index;
    const planet = planets[index];

    document.getElementById('planetName').textContent = planet.name;
    document.getElementById('infoIcon').textContent = planet.icon;
    document.getElementById('planetDiameter').textContent = planet.diameter;
    document.getElementById('planetDistance').textContent = planet.distance;
    document.getElementById('planetPeriod').textContent = planet.period;
    document.getElementById('planetTemp').textContent = planet.temperature;
    document.getElementById('planetMoons').textContent = planet.moons;
    document.getElementById('planetDesc').textContent = planet.description;

    document.getElementById('planetInfo').classList.add('visible');
    updatePlanetButtons();
}

function updatePlanetButtons() {
    const buttons = document.querySelectorAll('.planet-btn');
    buttons.forEach((btn, i) => {
        btn.classList.toggle('active', i === selectedPlanet);
    });
}

function getPlanetPosition(planet, index) {
    const angle = time * planet.speed * 0.01;
    const orbitR = planet.orbitRadius * zoomLevel;
    const x = centerX + Math.cos(angle) * orbitR;
    const y = centerY + Math.sin(angle) * orbitR * 0.4; // Elliptical perspective
    return { x, y };
}

function drawStars() {
    stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();
    });
}

function drawSun() {
    // Sun glow
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 45 * zoomLevel);
    gradient.addColorStop(0, '#fff8e0');
    gradient.addColorStop(0.3, '#ffd700');
    gradient.addColorStop(0.6, '#ff8c00');
    gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, 45 * zoomLevel, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Sun core
    const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 22 * zoomLevel);
    coreGradient.addColorStop(0, '#ffffff');
    coreGradient.addColorStop(0.5, '#fff4a0');
    coreGradient.addColorStop(1, '#ffa500');

    ctx.beginPath();
    ctx.arc(centerX, centerY, 22 * zoomLevel, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.fill();

    // Sun corona
    ctx.beginPath();
    ctx.arc(centerX, centerY, 55 * zoomLevel, 0, Math.PI * 2);
    const coronaGradient = ctx.createRadialGradient(centerX, centerY, 25 * zoomLevel, centerX, centerY, 55 * zoomLevel);
    coronaGradient.addColorStop(0, 'rgba(255, 200, 50, 0.15)');
    coronaGradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = coronaGradient;
    ctx.fill();
}

function drawOrbits() {
    if (!showOrbits) return;

    planets.forEach((planet) => {
        const orbitR = planet.orbitRadius * zoomLevel;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, orbitR, orbitR * 0.4, 0, 0, Math.PI * 2);
        ctx.strokeStyle = selectedPlanet !== null && planets[selectedPlanet] === planet
            ? 'rgba(255, 255, 255, 0.25)'
            : 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = selectedPlanet !== null && planets[selectedPlanet] === planet ? 1.5 : 0.8;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    });
}

function drawTrails() {
    if (!showTrails) return;

    planets.forEach((planet, index) => {
        const trail = trails[index];
        if (trail.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.strokeStyle = planet.color + '60';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function drawPlanets() {
    planets.forEach((planet, index) => {
        const pos = getPlanetPosition(planet, index);
        const r = planet.radius * zoomLevel;
        const isSelected = selectedPlanet === index;

        // Store trail
        if (showTrails) {
            trails[index].push({ x: pos.x, y: pos.y });
            if (trails[index].length > 150) trails[index].shift();
        }

        // Selection glow
        if (isSelected) {
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, r + 8, 0, Math.PI * 2);
            const glowGrad = ctx.createRadialGradient(pos.x, pos.y, r, pos.x, pos.y, r + 8);
            glowGrad.addColorStop(0, planet.color + '40');
            glowGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGrad;
            ctx.fill();
        }

        // Planet shadow (3D effect)
        const planetGrad = ctx.createRadialGradient(
            pos.x - r * 0.3, pos.y - r * 0.3, r * 0.1,
            pos.x, pos.y, r
        );
        planetGrad.addColorStop(0, lightenColor(planet.color, 40));
        planetGrad.addColorStop(0.7, planet.color);
        planetGrad.addColorStop(1, darkenColor(planet.color, 40));

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = planetGrad;
        ctx.fill();

        // Saturn rings
        if (planet.name === "Сатурн") {
            ctx.beginPath();
            ctx.ellipse(pos.x, pos.y, r * 2, r * 0.5, -0.3, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(240, 216, 144, 0.6)';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(pos.x, pos.y, r * 1.7, r * 0.4, -0.3, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(240, 216, 144, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Earth - add a tiny moon
        if (planet.name === "Земля") {
            const moonAngle = time * 0.05;
            const moonX = pos.x + Math.cos(moonAngle) * (r + 8);
            const moonY = pos.y + Math.sin(moonAngle) * (r + 5);
            ctx.beginPath();
            ctx.arc(moonX, moonY, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ccc';
            ctx.fill();
        }

        // Labels
        if (showLabels) {
            ctx.font = `${isSelected ? 'bold ' : ''}${11 * zoomLevel}px Segoe UI`;
            ctx.fillStyle = isSelected ? '#fff' : 'rgba(255, 255, 255, 0.7)';
            ctx.textAlign = 'center';
            ctx.fillText(planet.name, pos.x, pos.y - r - 8);
        }
    });
}

function lightenColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
    return `rgb(${r},${g},${b})`;
}

function darkenColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
    return `rgb(${r},${g},${b})`;
}

function animate() {
    // Clear canvas
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawStars();

    // Update time
    if (isPlaying) {
        time += speedMultiplier;
    }

    // Draw elements
    drawOrbits();
    drawTrails();
    drawSun();
    drawPlanets();

    animationId = requestAnimationFrame(animate);
}

// Start
init();
