export class Joystick{
    constructor(canvas){
        this.canvas = canvas;
        this.elem = document.getElementById('displayText');

        this.joystickTouchID = "";
        this.joystickRadius = 80;
        this.joystickCenter = {x: 0, y: 0};
        this.joystickValue = {x: 0, y: 0};
        this.outerEdge = false;

        this.touchStart = {x: 0, y: 0};
        this.touchEnd = {x: 0, y: 0};
        this.notjoyTouches = [];

        this.startTouch = this.startTouch.bind(this);
        this.moveTouch = this.moveTouch.bind(this);
        this.endTouch = this.endTouch.bind(this);

        canvas.addEventListener("touchstart", this.startTouch, { passive: false });
        window.addEventListener("touchmove", this.moveTouch, { passive: false });
        window.addEventListener("touchend", this.endTouch, { passive: false }); 
    }

    startTouch(e){
        e.preventDefault();
    
        for (let i = 0; i < e.touches.length; i++) {    
            //if joystickTouchID is blank and is not a notjoytouch
            if (this.joystickTouchID === "" && !this.notjoyTouches.includes(e.touches[i].identifier)){
                this.joystickTouchID = e.touches[i].identifier;
                this.joystickCenter.x = e.touches[i].clientX;
                this.joystickCenter.y = e.touches[i].clientY;
            }else{
                this.notjoyTouches.push(e.touches[i].identifier);
            }
        }
    }

    moveTouch(e){
        e.preventDefault();
    
        //if joystickTouchID matches an existing touchID
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].identifier === this.joystickTouchID){
                this.calculateJoyValue(e.touches[i]);
            }
        }
        
    }

    endTouch(e){
        e.preventDefault();
    
        for (let i = 0; i < e.touches.length; i++) {
            //if joystickTouchID doesnt match an existing touchID
            // if (e.touches[i].identifier !== this.joystickTouchID) {
            //     this.resetJoy();
               
               // this.elem.innerHTML = "resetJoy ";
            //     setTimeout(() => {this.elem.innerHTML = "";}, 1000);
            // }

            //remove id from notjoyTouches array when touchend
            if (!this.notjoyTouches.includes(e.touches[i].identifier))
            {
                let index = this.notjoyTouches.indexOf(e.touches[i].identifier);
                if (index > -1)
                {
                    this.notjoyTouches.splice(index, 1);
                }
            }
        }
        //or if there are no existing touches
        // if (e.touches.length <= 0) this.resetJoy();
        
        //if joystickTouchID doesnt match an existing touchID
        if(!e.touches.some(touch => touch.identifier === this.joystickTouchID)){
            this.resetJoy();
            this.elem.innerHTML = "resetJoy ";
            setTimeout(() => {this.elem.innerHTML = "";}, 1000);
        }
    }

    calculateJoyValue(touch){
        // Get the canvas position
        let canvasRect = this.canvas.getBoundingClientRect();
    
        // Get the touch start position relative to the canvas
        this.touchStart.x = (this.joystickCenter.x - canvasRect.left) / canvasRect.width * canvas.width;
        this.touchStart.y = (this.joystickCenter.y - canvasRect.top) / canvasRect.height * canvas.height;
    
        // Get the touch position relative to the canvas
        this.touchEnd.x = (touch.clientX - canvasRect.left) / canvasRect.width * canvas.width;
        this.touchEnd.y = (touch.clientY - canvasRect.top) / canvasRect.height * canvas.height;
    
        // Calculate the distance between the start and end points
        let dx = this.touchEnd.x - this.touchStart.x;
        let dy = this.touchEnd.y - this.touchStart.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
    
        // If the distance exceeds the set radius, set the end point to the circumference of a circle with the set radius centered at the start point
        if (distance > this.joystickRadius) {
            this.touchEnd.x = this.touchStart.x + (dx / distance) * this.joystickRadius;
            this.touchEnd.y = this.touchStart.y + (dy / distance) * this.joystickRadius;
    
            this.outerEdge = true;
        } else{
            this.outerEdge = false;
        }
    
        //get joystick value
        this.joystickValue.x = (this.touchEnd.x - this.touchStart.x) / this.joystickRadius;
        this.joystickValue.y = (this.touchEnd.y - this.touchStart.y) / this.joystickRadius;
    }

    resetJoy(){
        this.joystickTouchID = "";
    
        this.joystickCenter.x = 0;
        this.joystickCenter.y = 0;
        this.joystickValue.x = 0;
        this.joystickValue.y = 0;
        this.outerEdge = false;
        this.touchStart = {x: 0, y: 0};
        this.touchEnd = {x: 0, y: 0};
    }

    draw(context){
        //DRAW JOYSTICK MOVEMENT LINE
        context.beginPath();
        context.strokeStyle = this.outerEdge ? "red" : "black";
        context.moveTo(this.touchStart.x, this.touchStart.y);
        context.lineTo(this.touchEnd.x, this.touchEnd.y);
        context.stroke();
    }

}