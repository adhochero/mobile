let canvas;
let context;
let secondsPassed = 0;
let oldTimeStamp = 0;
let fps = 0;

let joystick;

window.onload = init;

function init(){
    // Get a reference to the canvas
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = 666;
    canvas.height = 333;

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
    draw();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function update() {
  
}

function draw() {
    
}



window.addEventListener("touchstart", test);

function test(e){
    const elem = document.getElementById('displayText');
    elem.innerHTML = touch.identifier.toString();
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