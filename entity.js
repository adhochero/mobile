import { AnimatedSprite } from "./animatedSprite.js";

export class Entity{
    constructor(inputDirection){
        this.elem = document.getElementById('displayText');

        this.inputDirection = inputDirection;
        this.inputSmoothing = {x: 0, y: 0};
        this.velocity = {x: 0, y: 0};
        this.moveDirection = {x: 0, y: 0};
        this.position = {x: 333, y: 250};
        this.inputResponsiveness = 8;
        this.moveSpeed = 200;

        this.inputValueAbs = 0;
        this.walkSecPerFrame = 0.16;
        this.lookingLeft = false;

        this.walkAnim = new AnimatedSprite(
            document.getElementById('walk'),
            8, //scale
            0, //position.x,
            0, //position.y,
            4, //total columns
            5, //total rows
            1, //current row
            4, //frames on row
            this.walkSecPerFrame, //sec per frame
            false
        );

        this.idleAnim = new AnimatedSprite(
            document.getElementById('idle'),
            8, //scale
            0, //position.x,
            0, //position.y,
            2, //total columns
            5, //total rows
            1, //current row
            2, //frames on row
            0.5, //sec per frame
            false
        );
    }

    update(secondsPassed){
        //smooth input movement using lerp
        this.inputSmoothing.x = this.lerp(this.inputSmoothing.x, this.inputDirection.x, this.inputResponsiveness * secondsPassed);
        this.inputSmoothing.y = this.lerp(this.inputSmoothing.y, this.inputDirection.y, this.inputResponsiveness * secondsPassed);
        
        //lerp velocity to zero
        this.velocity.x = this.lerp(this.velocity.x, 0, this.inputResponsiveness * secondsPassed);
        this.velocity.y = this.lerp(this.velocity.y, 0, this.inputResponsiveness * secondsPassed);
        
        //combine velocity and input movement
        this.moveDirection.x = this.velocity.x + (this.inputSmoothing.x * this.moveSpeed);
        this.moveDirection.y = this.velocity.y + (this.inputSmoothing.y * this.moveSpeed);
        
        //move
        this.position.x += this.moveDirection.x * secondsPassed;
        this.position.y += this.moveDirection.y * secondsPassed;
        


        //switch between idle and walk
        if(this.inputValueAbs === 0){
            this.elem.innerHTML = "idling";
            this.idleAnim.updateSprite(secondsPassed);
            return;
        }
        
        //sprite update
        this.elem.innerHTML = "walking";
        this.walkAnim.updateSprite(secondsPassed);
        
        //spf adjust with inputDirection value
        this.inputValueAbs = Math.abs(this.inputDirection.x) + Math.abs(this.inputDirection.y);
        this.walkAnim.secPerFrame  = Math.min(this.walkSecPerFrame / this.inputValueAbs, 0.2);

        //get dot value after normalizing input
        const magnitude = Math.sqrt(this.inputDirection.x * this.inputDirection.x + this.inputDirection.y * this.inputDirection.y);
        const normalized = {x: this.inputDirection.x / magnitude, y: this.inputDirection.y / magnitude};
        const dot = normalized.x * 0 + normalized.y * 1;
        
        //change sprite row for direction
        if(dot > 0.90){
            this.walkAnim.currentRow = 1;
            this.idleAnim.currentRow = 1;
        }
        else if(dot < 0.90 && dot > 0.30){
            this.walkAnim.currentRow = 2;
            this.idleAnim.currentRow = 2;
        }
        else if(dot < 0.30 && dot > -0.30){
            this.walkAnim.currentRow = 3;
            this.idleAnim.currentRow = 3;
        }
        else if(dot < -0.30 && dot > -0.90){
            this.walkAnim.currentRow = 4;
            this.idleAnim.currentRow = 4;
        }
        else if(dot < -0.90){
            this.walkAnim.currentRow = 5;
            this.idleAnim.currentRow = 5;
        }

        //used for horzontal flip
        this.lookingLeft = this.inputDirection.x < 0 ? true : false;
    }

    draw(context){
        //draw sprite
        context.save();
        context.beginPath();
        context.translate(this.position.x, this.position.y);  //location on the canvas to draw your sprite, this is important.
        context.scale(this.lookingLeft ? -1 : 1, 1);  //This does your mirroring/flipping
        this.inputValueAbs === 0
            ? this.idleAnim.drawSprite(context) //draw x/y is 0, position set on translate
            : this.walkAnim.drawSprite(context); 
        context.restore();
    }

    lerp(start, end, t){
        return  (1 - t) * start + end * t;
    }
}