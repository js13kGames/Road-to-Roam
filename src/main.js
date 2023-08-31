import { init, Sprite, GameLoop, Text, onInput } from 'kontra';
import { gameState } from './gameState';

let { canvas } = init();
let { clientWidth, clientHeight } = document.getElementById('canvas');
canvas.width = clientWidth;
canvas.height = clientHeight;

let randInt = (min, max) => Math.random() * (max - min + 1) + min;

let sprites = [];
let leftBound = canvas.width / 32;
let rightBound = canvas.width - leftBound;
let speed = canvas.height * -0.01;
let accentColor = '#FFF';

let player = Sprite({
    type: 'player',
    x: canvas.width / 2,
    y: canvas.height / 4,
    radius: canvas.width / 64,
    render() {
        this.context.strokeStyle = accentColor;
        this.context.beginPath();
        this.context.arc(0, 0, this.radius, 0, Math.PI * 2);
        this.context.stroke();
    },
    update() {
        this.dx = gameState.direction * (canvas.width / 256);
        this.advance();
        if (this.x < leftBound) {
            this.x = leftBound;
            gameState.direction = 0;
        }
        else if (this.x > rightBound) {
            this.x = rightBound;
            gameState.direction = 0;
        }
    }
});
sprites.push(player);

let arrow = Sprite({
    type: 'arrow',
    x: randInt(0, canvas.width),
    y: canvas.height + 10,
    dy: speed,
    render() {
        this.context.strokeStyle = accentColor;
        this.context.beginPath();
        this.context.moveTo(-5, 5);
        this.context.lineTo(0, -5);
        this.context.lineTo(5, 5);
        this.context.closePath();
        this.context.stroke();
    },
    update() {
        if (arrow.y < -10) {
            arrow.y = canvas.height;
            arrow.x = randInt(5, canvas.width - 5);
        }
        this.advance();
    }
});
sprites.push(arrow);

let score = Text({
    text: '',
    font: `${canvas.height / 20}px Courier New`,
    color: accentColor,
    x: 20,
    y: 20,
    value: 0,
    update() {
        score.value += -speed / 100;
        score.text = `Distance: ${score.value.toFixed(1)} m`;
        this.advance();
    }
});
sprites.push(score);

let loop = GameLoop({
    blur: true,
    update: () => {
        sprites.forEach(s => s.update());
    },
    render: () => {
        sprites.forEach(s => s.render());
    }
});
loop.start();

let pause = Text({
    text: 'paused',
    font: `italic ${canvas.height / 20}px Arial`,
    color: accentColor,
    x: canvas.width / 2,
    y: canvas.height / 2,
});

onInput(['esc', 'start'], () => {
    if (loop.isStopped) {
        loop.start();
        canvas.style.background = '#057';
    }
    else {
        loop.stop();
        canvas.style.background = '#003';
        pause.render();
    }
});

