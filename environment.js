export class Environment{
    constructor(){
        this.walls = [];

        this.textMap = [
            'wwwwwwww',
            'w      w',
            'w      w',
            'w      w',
            'w      w',
            'wwwwwwww'
        ];

        for(let y = 0; y < this.textMap.length; y++){
            let row = this.textMap[y]
            for(let x = 0; x < this.textMap[y].length; x++){
                let char = row[x];
                if(char === 'w'){
                    let wall = {
                        x: 100 * x,
                        y: 100 * y,
                        width: 100,
                        height: 100,
                        color: 'black'
                    }
                    this.walls.push(wall);
                }
            }
        }
    }

    draw(context){
        for(let i = 0; i < this.walls.length; i++){
            context.fillStyle = this.walls[i].color;
            context.fillRect(
                this.walls[i].x - this.walls[i].width/2,
                this.walls[i].y - this.walls[i].height/2,
                this.walls[i].width,
                this.walls[i].height);
        }  
    }

}