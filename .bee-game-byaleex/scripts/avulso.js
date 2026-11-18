class Obj {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.frame = 1;
        this.timer = 0;
    }
    
    desenha() {
        var img = new Image();
        img.src = this.color;
        pincel.drawImage(img, this.x, this.y, this.width, this.height);
    }
    
    animation(name) {
        this.timer += 1;
        if (this.timer > 10) {
            this.timer = 0;
            this.frame += 1;
        }
        if (this.frame > 4) {
            this.frame = 1;
        }
        this.color = "img/" + name + this.frame + ".png";
    }
}

class Abelha extends Obj {
    dir = 0;
    lifes = 3;

    move() {
        this.x += this.dir;
    }

    collide(obj) {
        if (this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.y + this.height > obj.y) {
            return true;
        } else {
            return false;
        }
    }
}

class Aranha extends Obj {
    move() {
        this.y += 6; 
        if (this.y > 720) {
            this.mudaPosicao();
        }
    }
    
    mudaPosicao() {
        this.y = -50; 
        this.x = Math.random() * (900 - this.width);
    }
}

class Flor extends Aranha {
    
}

class Bg extends Obj {
    move(speed, limit, pos) {
        this.y += speed;
        if (this.y > limit) {
            this.y = pos;
        }
    }
}

class Text {
    draw(texto, x, y) {
        pincel.font = "24px Arial";
        pincel.fillStyle = "White";
        pincel.fillText(texto, x, y);
    }
}

class AudioObj {
    constructor(src) {
        this.som = new Audio(src);
    }
    play() {
        this.som.currentTime = 0; 
        this.som.play();
    }
}