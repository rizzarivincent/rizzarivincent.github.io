const canvas = document.getElementById("boidsCanvas");
const ctx = canvas.getContext("2d");

function init() {
    requestAnimationFrame(animate);
}

let x = 0;

function animate() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(x, canvas.height / 2, 4, 4);
    x = x + 1;
    requestAnimationFrame(animate);
}

init();
