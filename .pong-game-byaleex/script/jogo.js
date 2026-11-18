var tela = document.querySelector('canvas');
var pincel = tela.getContext("2d");

pincel.fillStyle = "#8b8b8b"

var gameState = "MENU";
var maxPoint = 5;
var transitionTime = 0;

var player1 = {
    px: 100,
    py: 210,
    tx: 20,
    ty: 300,
    dir: 0
};
var player2 = {
    px: 1170,
    py: 210,
    tx: 20,
    ty: 300,
    dir: 0
};
var ball = {
    px: 630,
    py: 350,
    tx: 20,
    ty: 20,
    dir: 8,
    diry: 2
};

pts1 = 0
pts2 = 0

function moveBall ()
{
    ball.px += ball.dir
    ball.py += ball.diry

    if (ball.py <= 0)
    {
        ball.py = 0;
        ball.diry *= -1;
    }
    else if (ball.py + ball.ty >= 720)
    {
        ball.py = 720 - ball.ty;
        ball.diry *= -1;
    }

    if (ball.px < -ball.tx)
    {
        pts2 += 1;
        resetball();
    }

    if (ball.px > 1280)
    {
        pts1 += 1;
        resetball();
    }
}

function resetball ()
{
    ball.px = 630;
    ball.py = 350;
    ball.dir *= -1;
    ball.diry = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 3);
}

function collisionBall ()
{
    if (ball.py + ball.ty >= player1.py &&
        ball.py <= player1.py + player1.ty &&
        ball.px <= player1.px + player1.tx &&
        ball.px + ball.tx >= player1.px)
    {
        ball.dir *= -1
        ball.px = player1.px + player1.tx;
    }

    if (ball.py + ball.ty >= player2.py &&
        ball.py <= player2.py + player2.ty &&
        ball.px + ball.tx >= player2.px &&
        ball.px <= player2.px + player2.tx)
    {
        ball.dir *= -1
        ball.px = player2.px - ball.tx;
    }
}

function movePlayer1 ()
{
    player1.py += player1.dir;
    if (player1.py < 0) player1.py = 0;
    if (player1.py > 720 - player1.ty) player1.py = 720 - player1.ty;
}

function movePlayer2 ()
{
    player2.py += player2.dir;
    if (player2.py < 0) player2.py = 0;
    if (player2.py > 720 - player2.ty) player2.py = 720 - player2.ty;
}

function paintMenu ()
{
    pincel.clearRect(0, 0, 1280, 720);
    pincel.fillStyle = "#8b8b8b";
    
    pincel.font = "60px Arial";
    pincel.textAlign = "center";
    pincel.fillText("PONG GAME", 640, 280);

    pincel.font = "25px Arial";
    pincel.fillText("Pressione ESPAÇO para Iniciar", 640, 400);
}

function verifyGameOver ()
{
    if (pts1 >= maxPoint || pts2 >= maxPoint) {
        gameState = "GAMEOVER";
        transitionTime = Date.now();
    }
}

function showGameOver ()
{
    pincel.clearRect(0, 0, 1280, 720);
    pincel.fillStyle = "#8b8b8b";
    pincel.textAlign = "center";

    pincel.font = "50px Arial";
    pincel.fillText("FIM DE JOGO", 640, 280);

    pincel.font = "30px Arial";
    if (pts1 < maxPoint) {
        pincel.fillText("Jogador 1 PERDEU!", 640, 360);
    } else {
        pincel.fillText("Jogador 2 PERDEU!", 640, 360);
    }

    if (Date.now() - transitionTime > 3000) {
        gameState = "RESTART";
    }
}

function showRestart ()
{
    pincel.clearRect(0, 0, 1280, 720);
    pincel.fillStyle = "#8b8b8b";
    pincel.textAlign = "center";

    pincel.font = "40px Arial";
    pincel.fillText("PONTUAÇÃO FINAL", 640, 200);

    pincel.font = "30px Arial";
    pincel.fillText("Jogador I: " + pts1 + " pts", 640, 290);
    pincel.fillText("Jogador II: " + pts2 + " pts", 640, 340);

    pincel.font = "25px Arial";
    pincel.fillText("Pressione ESPAÇO para Jogar Novamente", 640, 480);
}

function restartGame ()
{
    pts1 = 0;
    pts2 = 0;
    player1.py = 210;
    player2.py = 210;
    resetball();
    gameState = "JOGANDO";
}

function paintGame ()
{
    pincel.clearRect(0, 0, 1280, 720);
    pincel.fillRect(player1.px, player1.py, player1.tx, player1.ty);
    pincel.fillRect(player2.px, player2.py, player2.tx, player2.ty);
    pincel.fillRect(ball.px, ball.py, ball.tx, ball.ty);

    pincel.font = "20px Arial"
    pincel.textAlign = "left";
    pincel.fillText("Score I: " + pts1, 100, 75);
    pincel.fillText("Score II: " + pts2, 1080, 75);
}

function Main ()
{
    if (gameState === "MENU")
    {
        paintMenu();
    }
    else if (gameState === "JOGANDO")
    {
        paintGame();
        moveBall();
        collisionBall();
        movePlayer1();
        movePlayer2();
        verifyGameOver();
    }
    else if (gameState === "GAMEOVER")
    {
        showGameOver();
    }
    else if (gameState === "RESTART")
    {
        showRestart();
    }
}

setInterval(Main, 20)

document.addEventListener("keydown", function (e)
{
    if (e.keyCode === 32)
    {
        if (gameState === "MENU" || gameState === "RESTART")
        {
            restartGame();
        }
    }

    if (e.keyCode === 87) player1.dir = -8
    else if (e.keyCode === 83) player1.dir = +8

    if (e.keyCode === 38) player2.dir = -8
    else if (e.keyCode === 40) player2.dir = +8
});

document.addEventListener("keyup", function (e)
{
    if (e.keyCode === 87 || e.keyCode === 83) player1.dir = 0
    if (e.keyCode === 38 || e.keyCode === 40) player2.dir = 0
});