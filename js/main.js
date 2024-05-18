const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "red";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 5;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update() {
        this.posY -= this.speed;

        // Si el círculo se sale del canvas por arriba, se reinicia en la parte inferior
        if (this.posY + this.radius < 0) {
            this.posY = window_height + this.radius;
        }
    }
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

let circles = [];
let numberOfCircles = 3;
let circlesClicked = 0;

function createCircle() {
    let randomX, randomY, randomRadius, newCircle;
    let isOverlapping;

    do {
        randomX = Math.random() * window_width;
        randomY = window_height + Math.random() * 100;
        randomRadius = Math.floor(Math.random() * 50 + 30);
        newCircle = new Circle(randomX, randomY, randomRadius, "black", (circles.length + 1).toString(), 1);

        isOverlapping = circles.some(circle => {
            const distance = getDistance(circle.posX, circle.posY, newCircle.posX, newCircle.posY);
            return distance < (circle.radius + newCircle.radius);
        });
    } while (isOverlapping);

    return newCircle;
}

function createCircles() {
    for (let i = 0; i < numberOfCircles; i++) {
        circles.push(createCircle());
    }
}

createCircles();

canvas.addEventListener('click', function(event) {
    const clickPos = {
        x: event.clientX,
        y: event.clientY
    };

    circles = circles.filter(circle => {
        const distance = getDistance(circle.posX, circle.posY, clickPos.x, clickPos.y);
        if (distance < circle.radius) {
            circlesClicked++;
            return false; // Eliminar el círculo
        }
        return true;
    });

    if (circles.length === 0) {
        circlesClicked = 0;
        numberOfCircles += 2;
        createCircles();
    }
});

function updateCircles() {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => {
        circle.update();
        circle.draw(ctx);
    });
}

updateCircles();