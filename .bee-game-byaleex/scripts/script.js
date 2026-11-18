var pincel = document.getElementById('canvas').getContext("2d");

var bg = new Bg(0, 0, 900, 720, "img/bg.png");
var bg2 = new Bg(0, -720, 900, 720, "img/bg.png");
var abelha = new Abelha(400, 550, 100, 100, "img/bee1.png");
var aranha = new Aranha(100, -100, 100, 100, "img/spider1.png");
var flor = new Flor(300, -300, 50, 50, "img/flower1.png");

var placarVida = new Text();
var placarScore = new Text();
var placarTempo = new Text();
var msgCentral = new Text();
var msgSub = new Text(); 

var sndCollect = new AudioObj("audio/collect.wav");
var sndHit = new AudioObj("audio/hit.wav");
var sndGameOver = new AudioObj("audio/gameover.wav");

var estadoJogo = "MENU"; 

var score = 0;
var target = 10;
var tempoMaximo = 60;
var tempo = tempoMaximo; 
var frameTempo = 0;

document.addEventListener("keydown", function(event) {
    if (estadoJogo === "JOGANDO") {
        if (event.key === "d" || event.key === "D") {
            abelha.dir = 5; 
        }
        if (event.key === "a" || event.key === "A") {
            abelha.dir = -5;
        }
    }

    if (event.key === "Enter") {
        if (estadoJogo === "MENU") {
            estadoJogo = "JOGANDO";
        } else if (estadoJogo === "GAMEOVER" || estadoJogo === "WIN") {
            reiniciarJogo();
        }
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "d" || event.key === "D" || event.key === "a" || event.key === "A") {
        abelha.dir = 0;
    }
});

function reiniciarJogo() {
    abelha.lifes = 3;
    abelha.x = 400;
    abelha.dir = 0;
    score = 0;
    tempo = tempoMaximo;
    frameTempo = 0;
    aranha.mudaPosicao();
    flor.mudaPosicao();
    
    estadoJogo = "JOGANDO";
}

function collides() {
    if (abelha.collide(aranha)) {
        aranha.mudaPosicao();
        abelha.lifes -= 1;
        sndHit.play();
    }
    
    if (abelha.collide(flor)) {
        flor.mudaPosicao();
        score += 1;
        sndCollect.play();
    }
}

function verificaFimDeJogo() {
    if (abelha.lifes <= 0 || tempo <= 0) {
        if (estadoJogo === "JOGANDO") sndGameOver.play();
        estadoJogo = "GAMEOVER";
    }
    else if (score >= target) {
        estadoJogo = "WIN";
    }
}

function update() {
    if (estadoJogo === "JOGANDO") {
        bg.move(3, 720, 0); 
        bg2.move(3, 0, -720);

        abelha.move();
        abelha.animation("bee");
        aranha.move();
        aranha.animation("spider");
        flor.move();
        
        collides();

        frameTempo += 1;
        if (frameTempo >= 100) {
            tempo -= 1;
            frameTempo = 0;
        }

        verificaFimDeJogo();
    }
}

function draw() {
    bg.desenha();
    bg2.desenha();

    if (estadoJogo === "MENU") {
        msgCentral.draw("BEE GAME", 380, 300);
        msgSub.draw("Pressione ENTER para Iniciar", 290, 360);
    } 
    else if (estadoJogo === "JOGANDO") {
        aranha.desenha();
        flor.desenha();
        abelha.desenha();

        placarVida.draw("Vidas: " + abelha.lifes, 20, 40);
        placarScore.draw("Flores: " + score + "/" + target, 20, 70);
        placarTempo.draw("Tempo: " + tempo + "s", 750, 40);
    } 
    else if (estadoJogo === "GAMEOVER") {
        msgCentral.draw("GAME OVER", 370, 300);
        placarScore.draw("Flores coletadas: " + score, 350, 350);
        msgSub.draw("Pressione ENTER para Reiniciar", 280, 410);
    } 
    else if (estadoJogo === "WIN") {
        msgCentral.draw("VOCÊ VENCEU!", 350, 300);
        placarScore.draw("Flores coletadas: " + score, 350, 350);
        msgSub.draw("Pressione ENTER para Reiniciar", 280, 410);
    }
}

function main() {
    pincel.clearRect(0, 0, 900, 720);
    update();
    draw();
}

setInterval(main, 10);