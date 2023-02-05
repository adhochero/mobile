import { AnimatedSprite } from "./animatedSprite.js";

export class Entity{
    constructor(inputDirection){
        this.inputDirection = inputDirection;
        this.inputSmoothing = {x: 0, y: 0};
        this.velocity = {x: 0, y: 0};
        this.moveDirection = {x: 0, y: 0};
        this.position = {x: 333, y: 250};
        this.inputResponsiveness = 8;
        this.moveSpeed = 200;

        this.radius = 40;

        this.sprite = new AnimatedSprite(
            document.getElementById('walk'),
            8, //scale
            0, //position.x,
            0, //position.y,
            4, //total columns
            5, //total rows
            1, //current row
            4, //frames on row
            0.12, //sec per frame
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

        //update sprite
        this.sprite.updateSprite(secondsPassed);

        if(this.inputDirection.y > 0.75)
        {
            if(this.sprite.currentRow != 1) this.sprite.currentFrame = 0;
            this.sprite.currentRow = 1;
            this.sprite.framesOnRow = 4;
            this.sprite.secPerFrame = 0.26;
        }
        else if(this.inputDirection.y < 0.75 && this.inputDirection.y > 0.25)
        {
            if(this.sprite.currentRow != 2) this.sprite.currentFrame = 0;
            this.sprite.currentRow = 2;
            this.sprite.framesOnRow = 4;
            this.sprite.secPerFrame = 0.26;
        }
        else if(this.inputDirection.y < 0.25 && this.inputDirection.y > -0.25)
        {
            if(this.sprite.currentRow != 3) this.sprite.currentFrame = 0;
            this.sprite.currentRow = 3;
            this.sprite.framesOnRow = 4;
            this.sprite.secPerFrame = 0.26;
        }
        else if(this.inputDirection.y < -0.25 && this.inputDirection.y > -0.75)
        {
            if(this.sprite.currentRow != 4) this.sprite.currentFrame = 0;
            this.sprite.currentRow = 4;
            this.sprite.framesOnRow = 4;
            this.sprite.secPerFrame = 0.26;
        }
        else if(this.inputDirection.y < -0.75)
        {
            if(this.sprite.currentRow != 5) this.sprite.currentFrame = 0;
            this.sprite.currentRow = 5;
            this.sprite.framesOnRow = 4;
            this.sprite.secPerFrame = 0.26;
        }

    }

    draw(context){
        //draw sprite
        context.save();
        context.beginPath();
        context.translate(this.position.x, this.position.y);  //location on the canvas to draw your sprite, this is important.
        context.scale(this.inputDirection.x < 0 ? -1 : 1, 1);  //This does your mirroring/flipping
        this.sprite.drawSprite(context); //draw x/y is 0, position set on translate
        // context.strokeStyle = "black";
        // context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI); //draw x/y is 0, position set on translate
        // context.stroke();
        context.restore();
    }

    lerp(start, end, t){
        return  (1 - t) * start + end * t;
    }
}