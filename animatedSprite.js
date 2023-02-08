export class AnimatedSprite{
    constructor(spriteSheet, scale, x, y, totalColumns, totalRows, currentRow, framesOnRow, secPerFrame, playAllRows){
        this.playAllRows = playAllRows;
        this.spriteSheet = spriteSheet;
        this.scale = scale;
        this.x = x;
        this.y = y;
        this.totalColumns = totalColumns;
        this.totalRows = totalRows;
        
        this.currentRow = currentRow;
        this.framesOnRow = framesOnRow;
        this.currentFrame = 0;
        
        this.frameTimer = 0;
        this.secPerFrame = secPerFrame;
    }

    updateSprite(secondsPassed){
        this.frameTimer += secondsPassed;
        if(this.frameTimer <= this.secPerFrame) return;

        this.frameTimer = 0;
    
        if(this.playAllRows){
            //loop through all frames
            this.currentFrame++
            if(this.currentFrame > this.totalColumns - 1){
                this.currentFrame = 0;
                this.currentRow++
            }
            if(this.currentRow == this.totalRows && this.currentFrame == this.framesOnRow - 1){
                this.currentRow = 1;
                this.currentFrame = 0;
            }
        }
        else{
            //loop through frames on row
            if(this.currentFrame < this.framesOnRow - 1) this.currentFrame++;
            else this.currentFrame = 0;
        }
    }

    drawSprite(context){
        //get frames size based on spritesheet
        let sheetWidth = this.spriteSheet.naturalWidth;
        let sheetHeigth = this.spriteSheet.naturalHeight;
        let frameWidth = sheetWidth / this.totalColumns;
        let frameHeight = sheetHeigth / this.totalRows;
    
        context.imageSmoothingEnabled = false;
        context.drawImage(
            this.spriteSheet, //img
            this.currentFrame * frameWidth, //sx
            (this.currentRow - 1) * frameHeight, //sy
            frameWidth, //swidth
            frameHeight, //sheight
            this.x - frameWidth * 0.5 * this.scale, //x
            this.y - frameHeight * this.scale, //y
            frameHeight * this.scale, //width
            frameHeight * this.scale //height
        );
    }
}