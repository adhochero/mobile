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
    }

    draw(context){
        //draw sprite
        context.save();
        context.translate(this.position.x, this.position.y);  //location on the canvas to draw your sprite, this is important.
        context.scale(this.inputDirection.x < 0 ? -1 : 1, 1);  //This does your mirroring/flipping
        context.arc(0, 0, this.radius, 0, 2 * Math.PI); //draw x/y is 0, position set on translate
        context.stroke();
        context.restore();
    }

    lerp(start, end, t){
        return  (1 - t) * start + end * t;
    }
}