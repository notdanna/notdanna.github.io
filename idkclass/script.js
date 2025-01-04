// Seleccionamos el canvas
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

// Ajustamos el tamaño del canvas al tamaño de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Definimos la cantidad de nodos basada en el tamaño de la pantalla
let numNodes;
const smallScreenThreshold = 768; // Umbral para pantallas pequeñas

if (window.innerWidth < smallScreenThreshold) {
    numNodes = 30; // Menos nodos para pantallas pequeñas
} else {
    numNodes = 100; // Más nodos para pantallas más grandes
}


// Definimos los nodos
let nodes = [];
const maxDistance = 150;

// Creamos nodos aleatorios
for (let i = 0; i < numNodes; i++) {
    nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        radius: Math.random() * 5 + 2
    });
}

// Función para actualizar las posiciones de los nodos
function updateNodes() {
    for (let node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Rebote en los bordes del canvas
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
    }
}

// Función para dibujar las conexiones entre nodos
function drawConnections() {
    for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
            const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (dist < maxDistance) {
                ctx.strokeStyle = `rgba(196, 167, 231, ${1 - dist / maxDistance})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.stroke();
            }
        }
    }
}

// Función para dibujar los nodos
function drawNodes() {
    for (let node of nodes) {
        ctx.fillStyle = 'rgba(196, 167, 231, 0.5)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Función principal para renderizar la animación
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujamos nodos y conexiones
    drawConnections();
    drawNodes();
    
    // Actualizamos la posición de los nodos
    updateNodes();

    requestAnimationFrame(animate);
}

// Ajuste de tamaño del canvas al redimensionar la ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Efecto de movimiento según el desplazamiento del scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    for (let node of nodes) {
        node.y += scrollPosition * 0.02;
    }
});

// Iniciamos la animación
animate();

// Selección de elementos
const startButton = document.getElementById('start-button');
const counterDisplay = document.getElementById('counter-display');
const thankYouMessage = document.getElementById('thank-you-message');
const contentWrapper = document.querySelector('.content-wrapper');  // Todo el contenido dentro de este div
let countdown;

// Lógica del temporizador
startButton.addEventListener('click', () => {
    let timeLeft = 3 * 60; // 3 minutos en segundos
    counterDisplay.textContent = formatTime(timeLeft);
    
    countdown = setInterval(() => {
        timeLeft--;
        counterDisplay.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(countdown);
            contentWrapper.classList.add('hidden'); // Ocultar todo el contenido
            counterDisplay.style.display = 'none'; // Ocultar el contador
            startButton.style.display = 'none'; // Ocultar el botón

            // Añadir un pequeño retraso antes de mostrar el mensaje de "Gracias"
            setTimeout(() => {
                thankYouMessage.style.display = 'block'; // Mostrar el mensaje de "Gracias"
                thankYouMessage.classList.add('show'); // Iniciar el fade-in
                startParticles(); // Iniciar partículas alrededor del mensaje de "Gracias"
            }, 100); // Retraso de 100 milisegundos para que la transición sea fluida
        }
    }, 1000);
});

// Función para formatear el tiempo en mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Lógica para las partículas alrededor del mensaje de "Gracias"
function startParticles() {
    const particleCanvas = document.getElementById('particleCanvas');
    const ctx = particleCanvas.getContext('2d');

    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 100;

    // Crear partículas
    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = 'rgba(255, 255, 255, 0.8)';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Si las partículas salen del canvas, las reposicionamos
            if (this.size > 0.2) this.size -= 0.1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Función para manejar partículas
    function handleParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();

            // Remover partículas pequeñas
            if (particlesArray[i].size <= 0.2) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
    }

    // Generar nuevas partículas continuamente
    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        handleParticles();
        if (particlesArray.length < numberOfParticles) {
            particlesArray.push(new Particle());
        }
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}
