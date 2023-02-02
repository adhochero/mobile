import { Entity } from "./entity.js";

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

    entity = new Entity({x: joystickValue.x, y: joystickValue.y});
    //joystick = new Joystick();

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
    update();
    draw(context);

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function update() {
  
}

function draw(context) {
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
    entity.draw(context)


    //DRAW JOYSTICK MOVEMENT LINE
    context.strokeStyle = outerEdge ? "red" : "black";
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}

const elem = document.getElementById('displayText');
let joystickTouchID = "";
let joystickRadius = 80;
let joystickCenter = {x: 0, y: 0};
let joystickValue = {x: 0, y: 0};
let startX;
let startY;
let endX;
let endY;
let outerEdge = false;
let notjoyTouches = [];

window.addEventListener("touchstart", startTest, { passive: false });
window.addEventListener("touchmove", moveTest, { passive: false });
window.addEventListener("touchend", endTest, { passive: false });

//TODO: if 1st touch ends while 2nd touch is down and then 3rd starts 2nd touch becomes joy.
//it shouldnt only make the new touch joy after first touch ends, not the one that start while another joy exisits.

function startTest(e){
    e.preventDefault();

    for (let i = 0; i < e.touches.length; i++) {    
        //if joystickTouchID is blank and is not a notjoytouch
        if (joystickTouchID === "" && !notjoyTouches.includes(e.touches[i].identifier)){
            joystickTouchID = e.touches[i].identifier;
            joystickCenter.x = e.touches[i].clientX;
            joystickCenter.y = e.touches[i].clientY;
        }else{
            notjoyTouches.push(e.touches[i].identifier);
        }
    }

    elem.innerHTML = joystickTouchID;
}

function moveTest(e){
    e.preventDefault();

    //if joystickTouchID matches an existing touchID
    for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === joystickTouchID){
            calculateJoyValue(e.touches[i]);
            elem.innerHTML = joystickTouchID + "<br>" + joystickValue.x + " " + joystickValue.y;
        }
    }
    
}

function endTest(e){
    e.preventDefault();

    for (let i = 0; i < e.touches.length; i++) {
        //if joystickTouchID doesnt match an existing touchID
        if (e.touches[i].identifier !== joystickTouchID) resetJoy();

        //remove id from notjoyTouches array when touchend
        if (!notjoyTouches.includes(e.touches[i].identifier))
        {
            let index = notjoyTouches.indexOf(e.touches[i].identifier);
            if (index > -1)
            {
                notjoyTouches.splice(index, 1);
            }
        }
    }
    //or if there are no existing touches
    if (e.touches.length <= 0) resetJoy();

    elem.innerHTML = joystickTouchID;
}

function calculateJoyValue(touch){
    // Get the canvas position
    let canvasRect = canvas.getBoundingClientRect();

    // Get the touch start position relative to the canvas
    startX = (joystickCenter.x - canvasRect.left) / canvasRect.width * canvas.width;
    startY = (joystickCenter.y - canvasRect.top) / canvasRect.height * canvas.height;

    // Get the touch position relative to the canvas
    endX = (touch.clientX - canvasRect.left) / canvasRect.width * canvas.width;
    endY = (touch.clientY - canvasRect.top) / canvasRect.height * canvas.height;

    // Calculate the distance between the start and end points
    let dx = endX - startX;
    let dy = endY - startY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // If the distance exceeds the set radius, set the end point to the circumference of a circle with the set radius centered at the start point
    if (distance > joystickRadius) {
        endX = startX + (dx / distance) * joystickRadius;
        endY = startY + (dy / distance) * joystickRadius;

        outerEdge = true;
    } else{
        outerEdge = false;
    }

    //get joystick value
    joystickValue.x = (endX - startX) / joystickRadius;
    joystickValue.y = (endY - startY) / joystickRadius;

    // clear the canvas
    // context.clearRect(0, 0, canvas.width, canvas.height);

    // //DRAW JOYSTICK MOVEMENT LINE
    // context.beginPath();
    // context.strokeStyle = outerEdge ? "red" : "black";
    // context.moveTo(startX, startY);
    // context.lineTo(endX, endY);
    // context.stroke();
}

function resetJoy(){
    joystickTouchID = "";

    joystickCenter.x = 0;
    joystickCenter.y = 0;
    joystickValue.x = 0;
    joystickValue.y = 0;

    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
}

class Joystick{
    constructor(){
        this.joystickRadius = 100;
        this.joystickCenter = {x: 0, y: 0};
        this.joystickValue = {x: 0, y: 0};
        this.outerEdge = false;

        // register touchstart and touchend events on the canvas
        window.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: false });
        window.addEventListener("touchend", this.handleTouchEnd.bind(this), { passive: false });

        window.addEventListener("mousedown", this.handleTouchStart.bind(this));
        window.addEventListener("mouseup", this.handleTouchEnd.bind(this));

        // store the bound instance of the handleTouchMove function
        this.boundHandleTouchMove = this.handleTouchMove.bind(this);
    }

    //
    // TODO: make it work with touchevents. currently its useing mouse as test
    //       also make draw function to call in app.js draw
    //
    
    handleTouchStart(event) {
        event.preventDefault();
        
        // set joystick center
        let touch = event.type === 'touchstart' ? event.touches[0] : event;3
        this.joystickCenter.x = touch.clientX;
        this.joystickCenter.y = touch.clientY;

        // register touchmove event on the canvas
        window.addEventListener("touchmove", this.boundHandleTouchMove, { passive: false });
        window.addEventListener("mousemove", this.boundHandleTouchMove);
    }

    handleTouchMove(event) {
        event.preventDefault();

        // Get the canvas position
        let canvasRect = canvas.getBoundingClientRect();

        // Get the touch start position relative to the canvas
        let touch = event.type === 'touchmove' ? event.touches[0] : event;
        let startX = (this.joystickCenter.x - canvasRect.left) / canvasRect.width * canvas.width;
        let startY = (this.joystickCenter.y - canvasRect.top) / canvasRect.height * canvas.height;

        // Get the touch position relative to the canvas
        let endX = (touch.clientX - canvasRect.left) / canvasRect.width * canvas.width;
        let endY = (touch.clientY - canvasRect.top) / canvasRect.height * canvas.height;

        // Calculate the distance between the start and end points
        let dx = endX - startX;
        let dy = endY - startY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // If the distance exceeds the set radius, set the end point to the circumference of a circle with the set radius centered at the start point
        if (distance > this.joystickRadius) {
            endX = startX + (dx / distance) * this.joystickRadius;
            endY = startY + (dy / distance) * this.joystickRadius;

            this.outerEdge = true;
        }
        else{
            this.outerEdge = false;
        }

        //get joystick value
        this.joystickValue.x = (endX - startX) / this.joystickRadius;
        this.joystickValue.y = (endY - startY) / this.joystickRadius;

        //clamp values, extra procaution
        // this.joystickValue.x = Math.min(Math.max(this.joystickValue.x, -1), 1);
        // this.joystickValue.y = Math.min(Math.max(this.joystickValue.y, -1), 1);

        //console.log(this.joystickValue.x, this.joystickValue.y);

        // clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        //DRAW JOYSTICK MOVEMENT LINE
        context.beginPath();
        context.strokeStyle = this.outerEdge ? "red" : "black";
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
    }

    handleTouchEnd(event) {
        event.preventDefault();

        // reset the joystick values to 0
        this.joystickValue.x = 0;
        this.joystickValue.y = 0;
        this.joystickCenter.x = 0;
        this.joystickCenter.y = 0;

        // clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
    
        // remove the touchmove event from the canvas
        window.removeEventListener("touchmove", this.boundHandleTouchMove);
        window.removeEventListener("mousemove", this.boundHandleTouchMove);
    }

}