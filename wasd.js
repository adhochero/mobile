export class WASD{
    constructor(){
        this.keys = [];
        this.inputDirection = {x: 0, y: 0};

        window.addEventListener('keydown', e => {
            if((e.key.toLowerCase() === 'w' || 
                e.key.toLowerCase() === 'a' ||
                e.key.toLowerCase() === 's' ||
                e.key.toLowerCase() === 'd' ||
                e.key.toLowerCase() === 'arrowup' ||
                e.key.toLowerCase() === 'arrowleft' ||
                e.key.toLowerCase() === 'arrowright' ||
                e.key.toLowerCase() === 'arrowdown' 
                ) && this.keys.indexOf(e.key.toLowerCase()) === -1){
                this.keys.unshift(e.key.toLowerCase());
            }
        });
        window.addEventListener('keyup', e => {
            if(this.keys.indexOf(e.key.toLowerCase()) > -1){
                this.keys.splice(this.keys.indexOf(e.key.toLowerCase()), 1);
            }
        });
    }

    update(){
        //get input direction
        if((this.keys.includes('a') || this.keys.includes('arrowleft')) && (!this.keys.includes('d') && !this.keys.includes('arrowright'))) this.inputDirection.x = -1;
        else if((this.keys.includes('d') || this.keys.includes('arrowright')) && (!this.keys.includes('a') && !this.keys.includes('arrowleft'))) this.inputDirection.x = 1;
        else this.inputDirection.x = 0;

        if((this.keys.includes('w') || this.keys.includes('arrowup')) && (!this.keys.includes('s') && !this.keys.includes('arrowdown'))) this.inputDirection.y = -1;
        else if((this.keys.includes('s') || this.keys.includes('arrowdown')) && (!this.keys.includes('w') && !this.keys.includes('arrowup'))) this.inputDirection.y = 1;
        else this.inputDirection.y = 0;

        //solves diagonal movement speed discrepancy
        if(this.inputDirection.x !== 0 && this.inputDirection.y !== 0){
            this.inputDirection.x *= Math.SQRT1_2;
            this.inputDirection.y *= Math.SQRT1_2;
        }
    }
}