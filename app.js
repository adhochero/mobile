import { Entity } from "./entity.js";
import { Joystick } from "./joystick.js";

let canvas;
let context;
let secondsPassed = 0;
let oldTimeStamp = 0;
let fps = 0;

let entity;
let joystick;

window.onload = init;

function init(){
    // Get a reference to the canvas
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = 666;
    canvas.height = 333;

    joystick = new Joystick(canvas);
    entity = new Entity(
        joystick.joystickValue,
        {x: canvas.width * 0.5, y: canvas.height * 0.5},
        8,
        200
    );

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    // Move forward in time with a maximum amount
    secondsPassed = Math.min(secondsPassed, 0.1);

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    //functions to run each frame
    update(secondsPassed);
    draw(context);

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function update(secondsPassed) {
    entity.update(secondsPassed);
}

function draw(context) {
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();

    joystick.draw(context);
    entity.draw(context);

    //draw fps
    context.fillStyle = "#fff";
    context.font = "14px Special Elite";
    context.textAlign = "center";
    context.fillText("FPS: "+ fps, 40, 20);
}