console.log("hello! :)")

const canvas = document.getElementById("landing-bg");
const ctx = canvas.getContext("2d");

function resizeCanvas()  {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Comet {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width / 1.25;
        this.y = Math.random() * canvas.height / 1.5;

        this.speed = 2 + Math.random() * 3;
        this.angle = Math.random() * (Math.PI / 2.5 - Math.PI / 4) + Math.PI / 4;
        this.vx = Math.sin(this.angle) * this.speed;
        this.vy = Math.cos(this.angle) * this.speed;

        this.tailLength = 100;
        this.size = 3 + Math.random() * 2;
        this.alpha = 1;
        this.trail = [];
    }

    update() {
        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > this.tailLength) {
            this.trail.shift();
        }

        this.x += this.vx;
        this.y += this.vy;
        this.alpha *= 0.98 * (1 - this.speed * 0.01);

        this.angle -= Math.PI / 2400;
        if (this.angle <= Math.PI / 8) {
            this.angle = Math.PI / 8;
        }

        this.speed -= 0.001;

        this.vx = Math.sin(this.angle) * this.speed;
        this.vy = Math.cos(this.angle) * this.speed;

        if (this.x < 0 || this.y < 0 || this.alpha <= 0.0005) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * this.trail.length / this.tailLength})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < this.trail.length; i++) {
            const { x, y, alpha } = this.trail[i];
            const tailAlpha = alpha * (i / this.trail.length);
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${tailAlpha * this.trail.length / this.tailLength})`;
            ctx.arc(x, y, this.size * (i / this.trail.length), 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

const comets = Array.from({ length: 10 }, () => new Comet());

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    comets.forEach(comet => {
        comet.update();
        comet.draw(ctx);
    });

    requestAnimationFrame(animate);
}

animate();
