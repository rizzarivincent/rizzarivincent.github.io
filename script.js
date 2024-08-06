function modulo(n, k) {
    return ((n % k) + k) % k;
}

function clamp(x, a, b) {
    if (x < a) {
        return a;
    } else if (x > b) {
        return b;
    } else {
        return x;
    }
}

const r_separation = 2;
const r_alignment = 20;
const r_cohesion = 20;

const separation_factor = 0.0005;
const alignment_factor = 0.05;
const cohesion_factor = 0.05;

const boid_size = 10;
const start_speed = 1.0;
const speed_min = 2.0;
const speed_max = 2.0;

class Boid {
    constructor(id, max_x, max_y) {
        this.id = id;

        this.x = Math.random() * max_x;
        this.y = Math.random() * max_y;

        let theta = Math.random() * 2 * Math.PI;
        this.vx = start_speed * Math.cos(theta);
        this.vy = start_speed * Math.sin(theta);
    }

    distance_to(other) {
        let dx = this.x - other.x;
        let dy = this.y - other.y;
        return Math.sqrt(dx*dx + dy*dy);
    }
    
    update(max_x, max_y, boids) {
        let x_sep = 0.0;
        let y_sep = 0.0;

        let n_alignment_boids = 0;
        let vx_near_sum = 0.0;
        let vy_near_sum = 0.0;
        
        let n_cohesion_boids = 0;
        let x_near_sum = 0.0;
        let y_near_sum = 0.0;

        for (const other of boids) {
            if (other.id == this.id) {
                continue;
            }
            let distance = this.distance_to(other);
            // Separation
            if (distance <= r_separation) {
                x_sep += this.x - other.x;
                y_sep += this.y - other.y;
            }
            // Alignment
            if (distance <= r_alignment) {
                n_alignment_boids += 1;
                vx_near_sum += other.vx;
                vy_near_sum += other.vy;
            }
            // Cohesion
            if (distance <= r_cohesion) {
                n_cohesion_boids += 1; 
                x_near_sum += other.x;
                y_near_sum += other.y;
            }
            // Avoidance TODO
        }
        
        // Update velocity and clamp
        this.vx += x_sep * separation_factor;
        this.vy += y_sep * separation_factor;
        if (n_alignment_boids > 0) {
            let vx_near_avg = vx_near_sum / n_alignment_boids;
            let vy_near_avg = vy_near_sum / n_alignment_boids;
            this.vx += (vx_near_avg - this.vx) * alignment_factor;
            this.vy += (vy_near_avg - this.vy) * alignment_factor;
        }
        if (n_cohesion_boids > 0) {
            let x_near_avg = x_near_sum / n_cohesion_boids;
            let y_near_avg = y_near_sum / n_cohesion_boids;
            this.vx += (x_near_avg - this.x) * cohesion_factor;
            this.vy += (y_near_avg - this.y) * cohesion_factor;
        }
        let speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
        let clamped_speed = clamp(speed, speed_min, speed_max);
        this.vx *= clamped_speed / speed;
        this.vy *= clamped_speed / speed;

        // Update position
        this.x = modulo(this.x + this.vx, max_x);
        this.y = modulo(this.y + this.vy, max_y);
    }

    draw(ctx) {
        ctx.fillRect(this.x, this.y, boid_size, boid_size);
    }
}

let boids = [];
const n_boids = 10;

function init() {
    for (let i = 0; i < n_boids; i++) {
        boids.push(new Boid(i, window.innerWidth, window.innerHeight));
    }
    console.log(boids);
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
        boid.update(canvas.width, canvas.height, boids);
        boid.draw(ctx);
    }
    requestAnimationFrame(animate);
}

init();
