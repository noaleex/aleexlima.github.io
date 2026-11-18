const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const mazeButtons = document.querySelectorAll('.maze-button');
const playerOneScore = document.getElementById('display-p1');
const playerTwoScore = document.getElementById('display-p2');

const music = document.getElementById('music');
const shotp1 = document.getElementById('shotp1');
const shotp2 = document.getElementById('shotp2');
let musicPlaybackErrorReported = false;

const TILE = 24;
const BOARD = { x: 24, y: 82, width: 912, height: 480 };
const GRID_BOARD = { x: BOARD.x, y: BOARD.y, width: BOARD.width, height: 560 };
const STANDARD_CANVAS_HEIGHT = 600;
const GRID_CANVAS_HEIGHT = 700;
const WALL_THICKNESS = 0.48;
const WINNING_SCORE = 5;
const PLAYER_SIZE = 30;
const MAX_FORWARD_SPEED = 125;
const ACCELERATION = 190;
const BRAKING = 500;
const PROJECTILE_RADIUS = 5;
const keys = new Set();
const pressedKeys = new Set();

const MAZE_COLUMNS = 19;
const MAZE_ROWS = 10;
const CELL_SIZE = TILE * 2;
const msPacManMazeGrid = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,1],
    [2,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,2],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
const pacmanMazeGrid = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,2,2,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,0,1,1,0,1,0,0,0,0,0,0,1,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

function startBackgroundMusic() {
    if (!music) return;
    music.loop = true;
    music.volume = 0.35;
    if (music.error) {
        reportMusicPlaybackError(music.error);
        return;
    }
    if (music.paused) {
        music.play().catch(reportMusicPlaybackError);
    }
}

function reportMusicPlaybackError(error) {
    if (musicPlaybackErrorReported) return;
    musicPlaybackErrorReported = true;
    console.error('Não foi possível reproduzir audio/music.wav.', error);
}

function playShotSound(playerIndex) {
    const shot = playerIndex === 0 ? shotp1 : shotp2;
    if (!shot) return;

    shot.volume = 1;
    shot.currentTime = 0;
    shot.play().catch(error => {
        console.error(`Não foi possível reproduzir o som do jogador ${playerIndex + 1}.`, error);
        announce(`Não foi possível reproduzir o som do jogador ${playerIndex + 1}.`);
    });
}

function createMaze(name, seed, extraPassages) {
    let randomState = seed >>> 0;
    const random = () => {
        randomState = (randomState * 1664525 + 1013904223) >>> 0;
        return randomState / 4294967296;
    };
    const verticalWalls = Array.from(
        { length: MAZE_ROWS },
        () => Array(MAZE_COLUMNS - 1).fill(true)
    );
    const horizontalWalls = Array.from(
        { length: MAZE_ROWS - 1 },
        () => Array(MAZE_COLUMNS).fill(true)
    );
    const visited = Array.from(
        { length: MAZE_ROWS },
        () => Array(MAZE_COLUMNS).fill(false)
    );
    const stack = [[0, 0]];
    visited[0][0] = true;

    while (stack.length > 0) {
        const [row, column] = stack[stack.length - 1];
        const neighbors = [];
        if (column > 0 && !visited[row][column - 1]) {
            neighbors.push([row, column - 1, verticalWalls[row], column - 1]);
        }
        if (column < MAZE_COLUMNS - 1 && !visited[row][column + 1]) {
            neighbors.push([row, column + 1, verticalWalls[row], column]);
        }
        if (row > 0 && !visited[row - 1][column]) {
            neighbors.push([row - 1, column, horizontalWalls[row - 1], column]);
        }
        if (row < MAZE_ROWS - 1 && !visited[row + 1][column]) {
            neighbors.push([row + 1, column, horizontalWalls[row], column]);
        }

        if (neighbors.length === 0) {
            stack.pop();
            continue;
        }

        const [nextRow, nextColumn, wallRow, wallColumn] =
            neighbors[Math.floor(random() * neighbors.length)];
        wallRow[wallColumn] = false;
        visited[nextRow][nextColumn] = true;
        stack.push([nextRow, nextColumn]);
    }

    const remainingWalls = [];
    verticalWalls.forEach((row, rowIndex) => {
        row.forEach((hasWall, columnIndex) => {
            if (hasWall) remainingWalls.push([rowIndex, columnIndex, 'vertical']);
        });
    });
    horizontalWalls.forEach((row, rowIndex) => {
        row.forEach((hasWall, columnIndex) => {
            if (hasWall) remainingWalls.push([rowIndex, columnIndex, 'horizontal']);
        });
    });
    for (let index = remainingWalls.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [remainingWalls[index], remainingWalls[swapIndex]] =
            [remainingWalls[swapIndex], remainingWalls[index]];
    }
    remainingWalls.slice(0, extraPassages).forEach(([row, column, orientation]) => {
        if (orientation === 'vertical') {
            verticalWalls[row][column] = false;
        } else {
            horizontalWalls[row][column] = false;
        }
    });

    const walls = [];
    verticalWalls.forEach((row, rowIndex) => {
        row.forEach((hasWall, columnIndex) => {
            if (!hasWall) return;
            walls.push([
                (columnIndex + 1) * 2 - WALL_THICKNESS / 2,
                rowIndex * 2,
                WALL_THICKNESS,
                2
            ]);
        });
    });
    horizontalWalls.forEach((row, rowIndex) => {
        row.forEach((hasWall, columnIndex) => {
            if (!hasWall) return;
            walls.push([
                columnIndex * 2,
                (rowIndex + 1) * 2 - WALL_THICKNESS / 2,
                2,
                WALL_THICKNESS
            ]);
        });
    });

    return { name, walls };
}

const mazes = [
    {
        name: 'CLOSED',
        grid: msPacManMazeGrid,
        gridWalls: createGridWalls(msPacManMazeGrid),
        tunnelRow: 11,
        starts: [[1, 1], [33, 21]],
        wallStyle: 'atari'
    },
    createMaze('CIRCUITO', 1983, 36),
    {
        name: 'ATARI',
        grid: pacmanMazeGrid,
        gridWalls: createGridWalls(pacmanMazeGrid),
        tunnelRow: 14,
        starts: [[1, 1], [26, 29]],
        wallStyle: 'outlined'
    }
];

function createGridWalls(grid) {
    const walls = [];
    grid.forEach((row, rowIndex) => {
        let start = -1;
        row.forEach((cell, columnIndex) => {
            if (cell === 1 && start === -1) start = columnIndex;
            if (start !== -1 && (cell !== 1 || columnIndex === row.length - 1)) {
                const end = cell === 1 && columnIndex === row.length - 1
                    ? columnIndex + 1
                    : columnIndex;
                walls.push([start, rowIndex, end - start, 1]);
                start = -1;
            }
        });
    });
    return walls;
}

function gridMazeMetrics(maze = mazes[game.mazeIndex]) {
    const rows = maze.grid ? maze.grid.length : MAZE_ROWS;
    const columns = maze.grid ? maze.grid[0].length : MAZE_COLUMNS;
    const area = maze.grid ? GRID_BOARD : BOARD;
    const tileSize = Math.min(area.width / columns, area.height / rows);
    const width = columns * tileSize;
    const height = rows * tileSize;
    return {
        x: area.x + (area.width - width) / 2,
        y: area.y + (area.height - height) / 2,
        width,
        height,
        tileSize
    };
}

function mazeBounds() {
    const maze = mazes[game.mazeIndex];
    if (maze.grid) return gridMazeMetrics(maze);
    return BOARD;
}

function currentPlayerSize() {
    const maze = mazes[game.mazeIndex];
    return maze.grid ? gridMazeMetrics(maze).tileSize * 0.9 : PLAYER_SIZE;
}

function currentProjectileRadius() {
    return mazes[game.mazeIndex].grid ? 3 : PROJECTILE_RADIUS;
}

function isInTunnel(y) {
    const maze = mazes[game.mazeIndex];
    if (!maze.grid) return false;
    const metrics = gridMazeMetrics(maze);
    return Math.floor((y - metrics.y) / metrics.tileSize) === maze.tunnelRow;
}

const players = [
    createPlayer(0, '#ff3b4f', '#ff9aa5', 'WASD + ESPAÇO'),
    createPlayer(1, '#00f0ff', '#a8f7ff', 'SETAS + ENTER')
];

const game = {
    mazeIndex: 0,
    projectiles: [],
    paused: false,
    over: false,
    lastFrame: 0,
    message: '',
    messageTimer: 0
};

function createPlayer(index, color, highlight, controls) {
    return {
        index,
        color,
        highlight,
        controls,
        x: 0,
        y: 0,
        angle: index === 0 ? 0 : Math.PI,
        speed: 0,
        direction: { x: index === 0 ? 1 : -1, y: 0 },
        score: 0,
        invulnerable: 0,
        pendingTurn: 0
    };
}

function resetGame() {
    game.projectiles = [];
    game.paused = false;
    game.over = false;
    game.message = '';
    game.messageTimer = 0;
    keys.clear();
    pressedKeys.clear();

    players.forEach(player => {
        placeAtStart(player);
        player.score = 0;
        player.invulnerable = 0.8;
    });

    updateScoreboard();
    updateButtons();
}

function updateScoreboard() {
    if (playerOneScore) playerOneScore.textContent = `P1 SCORE: ${players[0].score}`;
    if (playerTwoScore) playerTwoScore.textContent = `P2 SCORE: ${players[1].score}`;
}

function updateButtons() {
    pauseButton.setAttribute('aria-pressed', String(game.paused));
    pauseButton.setAttribute('aria-label', game.paused ? 'Continuar jogo' : 'Pausar jogo');
    pauseButton.innerHTML = game.paused ? '▶ <span>Continuar</span>' : 'Ⅱ <span>Pausar</span>';
}

function placeAtStart(player) {
    const startsAtTopLeft = player.index === 0;
    const maze = mazes[game.mazeIndex];
    if (maze.grid) {
        const { x, y, tileSize } = gridMazeMetrics(maze);
        const [column, row] = maze.starts[player.index];
        player.x = x + (column + 0.5) * tileSize;
        player.y = y + (row + 0.5) * tileSize;
        player.angle = startsAtTopLeft ? 0 : Math.PI;
        player.speed = 0;
        player.pendingTurn = 0;
        player.direction = { x: startsAtTopLeft ? 1 : -1, y: 0 };
        return;
    }

    player.x = startsAtTopLeft
        ? BOARD.x + CELL_SIZE / 2
        : BOARD.x + BOARD.width - CELL_SIZE / 2;
    player.y = startsAtTopLeft
        ? BOARD.y + CELL_SIZE / 2
        : BOARD.y + BOARD.height - CELL_SIZE / 2;
    player.angle = startsAtTopLeft ? 0 : Math.PI;
    player.speed = 0;
    player.pendingTurn = 0;
    player.direction = { x: startsAtTopLeft ? 1 : -1, y: 0 };
}

function setPaused(paused) {
    if (game.over) return;
    game.paused = paused;
    keys.clear();
    updateButtons();
    announce(game.paused ? 'Jogo pausado.' : 'Jogo retomado.');

    if (music) {
        if (game.paused) {
            music.pause();
        } else {
            startBackgroundMusic();
        }
    }
}

function announce(message) {
    const status = document.getElementById('gameStatus');
    if (status) status.textContent = message;
}

function focusGame() {
    canvas.focus({ preventScroll: true });
}

function activeWalls() {
    const maze = mazes[game.mazeIndex];
    if (maze.grid) {
        const { x, y, tileSize } = gridMazeMetrics(maze);
        return maze.gridWalls.map(([column, row, width, height]) => ({
            x: x + column * tileSize,
            y: y + row * tileSize,
            width: width * tileSize,
            height: height * tileSize
        }));
    }

    return maze.walls.map(([x, y, width, height]) => ({
        x: BOARD.x + x * TILE,
        y: BOARD.y + y * TILE,
        width: width * TILE,
        height: height * TILE
    }));
}

function overlaps(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x &&
        a.y < b.y + b.height && a.y + a.height > b.y;
}

function playerBounds(player) {
    const size = currentPlayerSize();
    return {
        x: player.x - size / 2,
        y: player.y - size / 2,
        width: size,
        height: size
    };
}

function isBlocked(player) {
    const bounds = playerBounds(player);
    const maze = mazes[game.mazeIndex];
    const boundsOnMap = mazeBounds();
    const outsideVertically = bounds.y < boundsOnMap.y ||
        bounds.y + bounds.height > boundsOnMap.y + boundsOnMap.height;
    const outsideHorizontally = bounds.x < boundsOnMap.x ||
        bounds.x + bounds.width > boundsOnMap.x + boundsOnMap.width;
    if (outsideVertically || (outsideHorizontally &&
        (!maze.grid || !isInTunnel(player.y)))) return true;

    return activeWalls().some(wall => overlaps(bounds, wall));
}

function movementFor(player) {
    if (player.index === 0) {
        return {
            throttle: Number(keys.has('KeyW')) - Number(keys.has('KeyS')),
            firing: keys.has('Space')
        };
    }

    return {
        throttle: Number(keys.has('ArrowUp')) - Number(keys.has('ArrowDown')),
        firing: keys.has('Enter')
    };
}

function updateDirection(player) {
    const quarterTurn = Math.PI / 2;
    const directionIndex = ((Math.round(player.angle / quarterTurn) % 4) + 4) % 4;
    player.angle = directionIndex * quarterTurn;
    player.direction = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 }
    ][directionIndex];
}

function turnPlayer(player, turn) {
    player.angle += turn * Math.PI / 2;
    updateDirection(player);
}

function requestTurn(player, turn) {
    player.pendingTurn = turn;
}

function pathGridMetrics() {
    const maze = mazes[game.mazeIndex];
    if (maze.grid) {
        const metrics = gridMazeMetrics(maze);
        return {
            centerX: metrics.x + metrics.tileSize / 2,
            centerY: metrics.y + metrics.tileSize / 2,
            stepX: metrics.tileSize,
            stepY: metrics.tileSize
        };
    }

    return {
        centerX: BOARD.x + CELL_SIZE / 2,
        centerY: BOARD.y + CELL_SIZE / 2,
        stepX: CELL_SIZE,
        stepY: CELL_SIZE
    };
}

function nextCellCenter(position, firstCenter, spacing, direction) {
    const cellPosition = (position - firstCenter) / spacing;
    const cellIndex = direction > 0
        ? Math.floor(cellPosition + 0.000001) + 1
        : Math.ceil(cellPosition - 0.000001) - 1;
    return firstCenter + cellIndex * spacing;
}

function canMoveIntoTurn(player, metrics) {
    const probeDistance = (player.direction.x ? metrics.stepX : metrics.stepY) / 2 +
        currentPlayerSize() / 2;
    const probeStep = Math.max(2, currentPlayerSize() / 4);
    const sampleCount = Math.ceil(probeDistance / probeStep);
    const originX = player.x;
    const originY = player.y;

    for (let sample = 1; sample <= sampleCount; sample += 1) {
        const distance = probeDistance * sample / sampleCount;
        player.x = originX + player.direction.x * distance;
        player.y = originY + player.direction.y * distance;
        wrapPlayerAtTunnel(player);
        if (isBlocked(player)) {
            player.x = originX;
            player.y = originY;
            return false;
        }
    }

    player.x = originX;
    player.y = originY;
    return true;
}

function canTurnIntoPath(player, turn, metrics) {
    const originalAngle = player.angle;
    turnPlayer(player, turn);
    const canTurn = canMoveIntoTurn(player, metrics);
    player.angle = originalAngle;
    updateDirection(player);
    return canTurn;
}

function tryTurnAtIntersection(player) {
    if (!player.pendingTurn) return false;

    const metrics = pathGridMetrics();
    const centerX = Math.round((player.x - metrics.centerX) / metrics.stepX) *
        metrics.stepX + metrics.centerX;
    const centerY = Math.round((player.y - metrics.centerY) / metrics.stepY) *
        metrics.stepY + metrics.centerY;
    if (Math.abs(player.x - centerX) > 1 || Math.abs(player.y - centerY) > 1) {
        return false;
    }

    player.x = centerX;
    player.y = centerY;
    const requestedTurn = player.pendingTurn;
    if (!canTurnIntoPath(player, requestedTurn, metrics)) {
        if (canTurnIntoPath(player, -requestedTurn, metrics)) {
            player.pendingTurn = 0;
        }
        return false;
    }

    turnPlayer(player, requestedTurn);
    player.pendingTurn = 0;
    return true;
}

function turnAtWall(player, metrics) {
    const horizontal = player.direction.x !== 0;
    const firstCenter = horizontal ? metrics.centerX : metrics.centerY;
    const spacing = horizontal ? metrics.stepX : metrics.stepY;
    const position = horizontal ? player.x : player.y;
    const center = Math.round((position - firstCenter) / spacing) * spacing + firstCenter;
    if (horizontal) player.x = center;
    else player.y = center;

    player.pendingTurn = 0;
    for (const turn of [1, -1]) {
        if (!canTurnIntoPath(player, turn, metrics)) continue;
        turnPlayer(player, turn);
        return;
    }

    turnPlayer(player, 2);
}

function wrapPlayerAtTunnel(player) {
    const maze = mazes[game.mazeIndex];
    if (!maze.grid || !isInTunnel(player.y)) return;
    const bounds = mazeBounds();
    const halfSize = currentPlayerSize() / 2;
    if (player.x < bounds.x) {
        player.x = bounds.x + bounds.width - halfSize;
    } else if (player.x > bounds.x + bounds.width) {
        player.x = bounds.x + halfSize;
    }
}

function movePlayer(player, input, delta) {
    if (input.throttle > 0) {
        player.speed = Math.min(MAX_FORWARD_SPEED, player.speed + ACCELERATION * delta);
    } else if (input.throttle < 0) {
        player.speed = Math.max(0, player.speed - BRAKING * delta);
    }

    if (player.speed <= 0) return;
    tryTurnAtIntersection(player);

    const metrics = pathGridMetrics();
    const previousX = player.x;
    const previousY = player.y;
    const distance = player.speed * delta;
    const isHorizontal = player.direction.x !== 0;
    const position = isHorizontal ? player.x : player.y;
    const firstCenter = isHorizontal ? metrics.centerX : metrics.centerY;
    const spacing = isHorizontal ? metrics.stepX : metrics.stepY;
    const direction = isHorizontal ? player.direction.x : player.direction.y;
    const target = position + direction * distance;
    const center = nextCellCenter(position, firstCenter, spacing, direction);
    const crossesCenter = direction > 0
        ? center <= target + 0.000001
        : center >= target - 0.000001;

    if (crossesCenter) {
        if (isHorizontal) player.x = center;
        else player.y = center;

        if (tryTurnAtIntersection(player)) return;
        if (isHorizontal) player.x = target;
        else player.y = target;
    } else if (isHorizontal) {
        player.x = target;
    } else {
        player.y = target;
    }

    wrapPlayerAtTunnel(player);
    if (isBlocked(player)) {
        player.x = previousX;
        player.y = previousY;
        turnAtWall(player, metrics);
    }
}

function fire(player) {
    if (game.projectiles.some(projectile => projectile.owner === player.index)) return;

    playShotSound(player.index);

    const direction = player.direction;
    const radius = currentProjectileRadius();
    const offset = currentPlayerSize() / 2 + radius + 1;
    game.projectiles.push({
        x: player.x + direction.x * offset,
        y: player.y + direction.y * offset,
        vx: direction.x * 340,
        vy: direction.y * 340,
        owner: player.index
    });
}

function respawn(player) {
    placeAtStart(player);
    player.invulnerable = 1.4;
}

function updateProjectiles(delta) {
    const walls = activeWalls();
    const maze = mazes[game.mazeIndex];
    const projectileBounds = mazeBounds();
    const radius = currentProjectileRadius();
    for (let i = game.projectiles.length - 1; i >= 0; i -= 1) {
        const projectile = game.projectiles[i];
        let nextX = projectile.x + projectile.vx * delta;
        const nextY = projectile.y + projectile.vy * delta;
        if (maze.grid && isInTunnel(nextY)) {
            if (nextX < projectileBounds.x) {
                nextX = projectileBounds.x + projectileBounds.width;
            } else if (nextX > projectileBounds.x + projectileBounds.width) {
                nextX = projectileBounds.x;
            }
        }
        let bounds = {
            x: nextX - radius,
            y: nextY - radius,
            width: radius * 2,
            height: radius * 2
        };
        const xOutsideMap = nextX - radius < projectileBounds.x ||
            nextX + radius > projectileBounds.x + projectileBounds.width;
        const mayWrap = maze.grid && isInTunnel(nextY);
        const hitsWall = (!mayWrap && xOutsideMap) ||
            nextY - radius < projectileBounds.y ||
            nextY + radius > projectileBounds.y + projectileBounds.height ||
            walls.some(wall => overlaps(bounds, wall));
        if (hitsWall) {
            [projectile.vx, projectile.vy] = [-projectile.vy, projectile.vx];
            continue;
        }

        projectile.x = nextX;
        projectile.y = nextY;
        bounds = {
            x: projectile.x - radius,
            y: projectile.y - radius,
            width: radius * 2,
            height: radius * 2
        };
        const target = players[1 - projectile.owner];
        if (target.invulnerable <= 0 && overlaps(bounds, playerBounds(target))) {
            players[projectile.owner].score += 1;
            updateScoreboard();
            game.projectiles.splice(i, 1);

            if (players[projectile.owner].score >= WINNING_SCORE) {
                game.over = true;
                game.message = `JOGADOR ${projectile.owner + 1} VENCEU!`;
                const victoryAchievement = document.getElementById('ach-4');
                if (victoryAchievement) {
                    victoryAchievement.classList.add('desbloqueado');
                }
                if (music) music.pause();
                announce(`Jogador ${projectile.owner + 1} venceu a partida!`);
            } else {
                game.message = `PONTO DO JOGADOR ${projectile.owner + 1}!`;
                game.messageTimer = 1.2;
                announce(`Ponto do jogador ${projectile.owner + 1}.`);
                respawn(target);
            }
            if (game.over) break;
            continue;
        }

        const owner = players[projectile.owner];
        if (Math.hypot(projectile.x - owner.x, projectile.y - owner.y) <=
            currentPlayerSize() / 2 + radius + 2) {
            game.projectiles.splice(i, 1);
            announce(`Jogador ${owner.index + 1} recolheu a bala.`);
        }

        if (game.over) break;
    }
}

function update(delta) {
    if (game.paused || game.over) return;

    players.forEach((player, index) => {
        player.invulnerable = Math.max(0, player.invulnerable - delta);
        const input = movementFor(player);
        movePlayer(player, input, delta);
        if (input.firing) fire(player);
    });

    if (game.messageTimer > 0) {
        game.messageTimer -= delta;
        if (game.messageTimer <= 0) game.message = '';
    }

    updateProjectiles(delta);
}

function drawBackground() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, 68);
    ctx.strokeStyle = '#b88a35';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 68);
    ctx.lineTo(canvas.width, 68);
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.fillRect(BOARD.x, BOARD.y, BOARD.width, BOARD.height);
    ctx.strokeStyle = '#b88a35';
    ctx.lineWidth = 3;
    const maze = mazes[game.mazeIndex];
    if (maze.grid) {
        const bounds = mazeBounds();
        ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    } else {
        ctx.strokeRect(BOARD.x, BOARD.y, BOARD.width, BOARD.height);
    }
}

function drawScore(player, x, alignRight) {
    const labelX = alignRight ? x - 134 : x;
    const scoreX = alignRight ? x : x + 120;
    ctx.textAlign = alignRight ? 'right' : 'left';
    ctx.fillStyle = player.color;
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillText(`JOGADOR ${player.index + 1}`, labelX, 27);

    ctx.textAlign = alignRight ? 'right' : 'left';
    ctx.fillStyle = '#fff4cf';
    ctx.font = 'bold 23px "Courier New", monospace';
    ctx.fillText(String(player.score).padStart(2, '0'), scoreX, 51);
}

function drawHud() {
    drawScore(players[0], 38, false);
    drawScore(players[1], canvas.width - 38, true);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#efb83f';
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.fillText(`LABIRINTO ${String(game.mazeIndex + 1).padStart(2, '0')} - ${mazes[game.mazeIndex].name}`, canvas.width / 2, 27);
    ctx.fillStyle = '#b4aa8c';
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.fillText(`PRIMEIRO A ${WINNING_SCORE}`, canvas.width / 2, 47);

    ctx.fillStyle = '#b4aa8c';
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
        'DESVIE DOS DISPAROS E ENCONTRE SEU OPONENTE',
        canvas.width / 2,
        canvas.height - 13
    );
}

function drawWalls() {
    const maze = mazes[game.mazeIndex];
    if (maze.grid || game.mazeIndex === 1) {
        const { x, y, tileSize } = gridMazeMetrics(maze);
        if (!maze.grid) {
            for (let row = 0; row < MAZE_ROWS; row += 1) {
                for (let column = 0; column < MAZE_COLUMNS; column += 1) {
                    ctx.fillStyle = '#11131a';
                    ctx.fillRect(
                        x + (column + 0.5) * tileSize - 1,
                        y + (row + 0.5) * tileSize - 1,
                        2,
                        2
                    );
                }
            }
            activeWalls().forEach(wall => {
                ctx.fillStyle = '#101629';
                ctx.fillRect(wall.x + 1, wall.y + 1, wall.width - 2, wall.height - 2);
                ctx.strokeStyle = '#2873df';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(
                    wall.x + 1.5,
                    wall.y + 1.5,
                    wall.width - 3,
                    wall.height - 3
                );
            });
            return;
        }

        if (maze.wallStyle === 'atari') {
            maze.grid.forEach((row, rowIndex) => {
                row.forEach((cell, columnIndex) => {
                    if (cell !== 1) return;
                    ctx.fillStyle = '#8b5a2b';
                    ctx.fillRect(
                        x + columnIndex * tileSize,
                        y + rowIndex * tileSize,
                        tileSize,
                        tileSize
                    );
                });
            });
            ctx.fillStyle = '#8b5a2b';
            for (let index = 0; index < 4; index += 1) {
                const stripeY = y + (maze.tunnelRow + 0.25 + index * 0.15) * tileSize;
                ctx.fillRect(x, stripeY, tileSize * 0.35, 1);
                ctx.fillRect(x + 34 * tileSize + tileSize * 0.65, stripeY, tileSize * 0.35, 1);
            }
            return;
        }

        maze.grid.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellX = x + columnIndex * tileSize;
                const cellY = y + rowIndex * tileSize;
                if (cell === 1) {
                    ctx.fillStyle = '#101629';
                    ctx.fillRect(cellX + 1, cellY + 1, tileSize - 2, tileSize - 2);
                    ctx.strokeStyle = '#2873df';
                    ctx.lineWidth = 1.2;
                    ctx.strokeRect(cellX + 1.5, cellY + 1.5, tileSize - 3, tileSize - 3);
                } else if (cell === 2) {
                    ctx.fillStyle = '#ff654d';
                    ctx.fillRect(cellX, cellY + tileSize * 0.375, tileSize, tileSize * 0.25);
                } else {
                    ctx.fillStyle = '#11131a';
                    ctx.fillRect(cellX + tileSize / 2 - 1, cellY + tileSize / 2 - 1, 2, 2);
                }
            });
        });
        return;
    }

    activeWalls().forEach(wall => {
        ctx.fillStyle = '#d99e35';
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}

function drawCar(player) {
    if (player.invulnerable > 0 && Math.floor(player.invulnerable * 12) % 2 === 0) return;

    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    const carScale = mazes[game.mazeIndex].grid || game.mazeIndex === 1
        ? currentPlayerSize() / 24.15
        : 1.15;
    ctx.scale(carScale, carScale);

    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(13, 0);
    ctx.lineTo(6, -10);
    ctx.lineTo(-11, -10);
    ctx.lineTo(-11, 10);
    ctx.lineTo(6, 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#080808';
    ctx.fillRect(-4, -6, 7, 12);
    ctx.fillStyle = '#fff4cf';
    ctx.fillRect(8, -2, 3, 4);
    ctx.restore();
}

function drawProjectiles() {
    const radius = currentProjectileRadius();
    game.projectiles.forEach(projectile => {
        const color = players[projectile.owner].highlight;
        ctx.fillStyle = color;
        ctx.fillRect(projectile.x - radius, projectile.y - radius,
            radius * 2, radius * 2);
    });
}

function drawOverlay(title, subtitle) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
    ctx.fillRect(BOARD.x, BOARD.y, BOARD.width, BOARD.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#efb83f';
    ctx.font = 'bold 30px "Courier New", monospace';
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 8);
    ctx.fillStyle = '#fff4cf';
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 23);
}

function draw() {
    drawBackground();
    drawHud();
    drawWalls();
    drawProjectiles();
    players.forEach(drawCar);

    if (game.over) {
        drawOverlay(game.message, 'Pressione R ou clique em Reiniciar para jogar de novo');
    } else if (game.paused) {
        drawOverlay('PAUSADO', 'Pressione ESC ou clique em Continuar');
    } else if (game.messageTimer > 0) {
        ctx.fillStyle = '#efb83f';
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(game.message, canvas.width / 2, 75);
    }
}

function frame(timestamp) {
    const delta = game.lastFrame ? Math.min((timestamp - game.lastFrame) / 1000, 0.04) : 0;
    game.lastFrame = timestamp;
    update(delta);
    draw();
    requestAnimationFrame(frame);
}

function chooseMaze(index) {
    game.mazeIndex = index;
    canvas.height = mazes[index].grid ? GRID_CANVAS_HEIGHT : STANDARD_CANVAS_HEIGHT;
    resetGame();
    mazeButtons.forEach((button, buttonIndex) => {
        const active = buttonIndex === index;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
    });
    announce(`Labirinto ${index + 1}, ${mazes[index].name}. Partida reiniciada.`);
}

mazeButtons.forEach(button => {
    button.addEventListener('click', () => {
        startBackgroundMusic();
        chooseMaze(Number(button.dataset.maze));
        focusGame();
    });
});

pauseButton.addEventListener('click', () => {
    startBackgroundMusic();
    setPaused(!game.paused);
    focusGame();
});

restartButton.addEventListener('click', () => {
    startBackgroundMusic();
    resetGame();
    announce('Partida reiniciada.');
    focusGame();
});

canvas.addEventListener('pointerdown', startBackgroundMusic);

const gameplayCodes = new Set([
    'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter',
    'Escape', 'KeyR'
]);

window.addEventListener('keydown', event => {
    startBackgroundMusic();
    if (!gameplayCodes.has(event.code)) return;
    event.preventDefault();
    const isFirstPress = !pressedKeys.has(event.code);
    pressedKeys.add(event.code);

    if (event.code === 'Escape' && isFirstPress) {
        setPaused(!game.paused);
        return;
    }
    if (event.code === 'KeyR' && isFirstPress) {
        resetGame();
        announce('Partida reiniciada.');
        return;
    }
    if (!game.paused && !game.over) {
        if (isFirstPress) {
            if (event.code === 'KeyA') requestTurn(players[0], -1);
            if (event.code === 'KeyD') requestTurn(players[0], 1);
            if (event.code === 'ArrowLeft') requestTurn(players[1], -1);
            if (event.code === 'ArrowRight') requestTurn(players[1], 1);
            if (event.code === 'Space') fire(players[0]);
            if (event.code === 'Enter') fire(players[1]);
        }
        keys.add(event.code);
    }
});

window.addEventListener('keyup', event => {
    keys.delete(event.code);
    pressedKeys.delete(event.code);
});

window.addEventListener('blur', () => {
    keys.clear();
    pressedKeys.clear();
});

resetGame();
requestAnimationFrame(frame);
