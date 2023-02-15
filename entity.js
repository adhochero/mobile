import { AnimatedSprite } from "./animatedSprite.js";

export class Entity{
    constructor(inputDirection, startPosition, inputResponsiveness, moveSpeed){
        this.id;
        this.isMine = false;

        this.inputDirection = inputDirection;
        this.inputSmoothing = {x: 0, y: 0};
        this.velocity = {x: 0, y: 0};
        this.moveDirection = {x: 0, y: 0};
        this.position = startPosition;
        this.inputResponsiveness = inputResponsiveness;
        this.moveSpeed = moveSpeed;

        this.walkSecPerFrameMin = 0.16;
        this.walkSecPerFrameMax = 0.2;
        this.inputValueAbs = 0;
        this.lookingLeft = false;

        this.idleSheet = document.getElementById('idle');
        this.walkSheet = document.getElementById('walk');

        this.idleAnim = new AnimatedSprite(
            this.idleSheet, //sprite sheet
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

        this.walkAnim = new AnimatedSprite(
            this.walkSheet, //sprite sheet
            8, //scale
            0, //position.x,
            0, //position.y,
            4, //total columns
            5, //total rows
            1, //current row
            4, //frames on row
            this.walkSecPerFrameMin, //sec per frame
            false
        );
    }

    update(secondsPassed){
        if(this.isMine){
            this.handleMovement(secondsPassed);
        }

        this.handleAnimation(secondsPassed);
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

    handleMovement(secondsPassed){
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
    }

    handleAnimation(secondsPassed){
        //get abs value of input
        this.inputValueAbs = Math.abs(this.moveDirection.x) + Math.abs(this.moveDirection.y);
        
        //switch between idle and walk
        if(this.inputValueAbs === 0){
            this.idleAnim.updateSprite(secondsPassed);
            return;
        }
        
        //sprite update
        this.walkAnim.updateSprite(secondsPassed);
        
        //adjust secPerFrame according to moveDirection value
        this.walkAnim.secPerFrame  = Math.min(this.walkSecPerFrameMin / this.inputValueAbs, this.walkSecPerFrameMax);

        //get dot value of normalized input
        const magnitude = Math.sqrt(this.moveDirection.x * this.moveDirection.x + this.moveDirection.y * this.moveDirection.y);
        const normalized = {x: this.moveDirection.x / magnitude, y: this.moveDirection.y / magnitude};
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
        this.lookingLeft = this.moveDirection.x < 0 ? true : false;
    }
}