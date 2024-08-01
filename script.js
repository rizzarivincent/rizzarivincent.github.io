function modulo(n, k) {
    return ((n % k) + k) % k;
}

const r_separation = 10;
const r_alignment = 15;
const r_cohesion = 20;

const boid_size = 10;
const start_speed = 10;

class Boid {
    constructor(max_x, max_y) {
        this.x = Math.random() * max_x;
        this.y = Math.random() * max_y;

        let theta = Math.random() * 2 * Math.PI;
        this.v_x = start_speed * Math.cos(theta);
        this.v_y = start_speed * Math.sin(theta);
    }
    
    update(max_x, max_y) {
        this.x = modulo(this.x + this.v_x, max_x);
        this.y = modulo(this.y + this.v_y, max_y);
    }

    draw(ctx) {
        ctx.fillRect(this.x, this.y, boid_size, boid_size);
    }
}

const n_boids = 10;

function init() {
    boids = []
    for (let i = 0; i < n_boids; i++) {
        boids.push(new Boid(window.innerWidth, window.innerHeight));
    }
    requestAnimationFrame(animate);
}

const canvas = document.getElementById("boidsCanvas");
const ctx = canvas.getContext("2d");

console.log(window.innerWidth);
console.log(window.innerHeight);

function animate() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const boid of boids) {
        boid.update(canvas.width, canvas.height);
        boid.draw(ctx);
    }
    requestAnimationFrame(animate);
}

init();
