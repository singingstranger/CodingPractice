class Boundary{
    constructor({position}){
        this.position = position
        this.width = _tileDimensions
        this.height = _tileDimensions
    }
    draw(){
        _context.fillStyle = "rgba(255,0, 0, 0)"
        _context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Sprite{
    constructor({
        position,
        image, 
        frames = {max: 1, hold: 10}, 
        sprites, 
        animate = false,
        health = 100,
        isEnemy = true
    }){
        this.position = position;
        this.image = image;
        this.frames = {
            ...frames,
            val: 0,
            elapsed: 0
        };
        this.width = 0;
        this.image.onload=()=>{
            this.width = this.image.width/this.frames.max;
            this.height = this.image.height;
        }
        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.health = health;
        this.isEnemy = isEnemy;
    }

    draw(){
        _context.save();
        _context.globalAlpha = this.opacity;
        _context.drawImage(
            this.image, 
            this.frames.val * this.width,
            0,
            this.image.width/this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max,
            this.image.height
        );
        _context.restore();

        if (!this.animate){return;};
        if (this.frames.max <= 1){return;};

        this.frames.elapsed++;
        if (this.frames.elapsed % this.frames.hold === 0){
            if (this.frames.val < this.frames.max-1) this.frames.val++;
            else this.frames.val = 0;
        };      
    };

    attack({attack, recipient, remainingHealthPercent}){
        const timeline = gsap.timeline(); 
        let movementDistance = 20;
        let healthBar = "#enemyCurrentHealthbar"
        if (this.isEnemy === true){
            movementDistance *= -1; 
            healthBar = "#playerCurrentHealthbar"
        } 
        timeline.to(this.position, {
            x: this.position.x - movementDistance,
            duration: 0.2
        }).to(this.position, {
            x: this.position.x + movementDistance*2,
            duration: 0.1,
            onComplete(){
                recipient.image = recipient.sprites.hurt;
                const timelineEnemy = gsap.timeline();
                timelineEnemy.to(recipient.position,{
                    x: recipient.position.x +movementDistance,
                    duration: 0.1
                }).to(recipient.position, {
                    x: recipient.position.x,
                    duration: 0.4
                })
                timelineEnemy.to(recipient, {
                    opacity: 0,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.1,
                    onComplete(){
                        timelineEnemy.delay(1);
                        recipient.image = recipient.sprites.idle;
                        if(remainingHealthPercent <= 0){
                            gsap.to(recipient, {
                                opacity:0
                            })
                        }
                    }
                }),
                gsap.to(healthBar,{
                    width: remainingHealthPercent+"%"
                })
                
            }
        }).to(this.position, {
            x: this.position.x 
        })
    }
}