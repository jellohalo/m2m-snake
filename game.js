const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

let tileSize;
const rows = 10;
const cols = 10;

let snake, direction, banana, gameInterval, score;
let nextDirection;
let waitingForFirstMove = false;
let rotationAngle = 0;
let highScore = 0;

const playerImg = new Image();
const bananaImg = new Image();
const trailImg = new Image();

playerImg.src = "player.png";
bananaImg.src = "banana.png";
trailImg.src = "trail.png";

function resizeCanvas() {
  const minSize = Math.min(window.innerWidth, window.innerHeight) * 0.6;
  canvas.width = canvas.height = Math.floor(minSize / rows) * rows;
  tileSize = canvas.width / cols;
}

document.addEventListener("keydown", (e) => {
  if (waitingForFirstMove) {
    waitingForFirstMove = false;
    gameInterval = setInterval(updateGame, 250);
  }

  if (e.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
});

document.getElementById("btn-up").addEventListener("click", () => handleMobileInput("UP"));
document.getElementById("btn-down").addEventListener("click", () => handleMobileInput("DOWN"));
document.getElementById("btn-left").addEventListener("click", () => handleMobileInput("LEFT"));
document.getElementById("btn-right").addEventListener("click", () => handleMobileInput("RIGHT"));

function handleMobileInput(dir) {
  if (waitingForFirstMove) {
    waitingForFirstMove = false;
    gameInterval = setInterval(updateGame, 250);
  }
  if (dir === "UP" && direction !== "DOWN") nextDirection = "UP";
  if (dir === "DOWN" && direction !== "UP") nextDirection = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") nextDirection = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") nextDirection = "RIGHT";
}

function drawTile(img, x, y, rotation = 0) {
  ctx.save();
  ctx.translate(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
  ctx.rotate(rotation);
  ctx.drawImage(img, -tileSize / 2, -tileSize / 2, tileSize, tileSize);
  ctx.restore();
}

function placeBanana() {
  let valid = false;
  while (!valid) {
    const newBanana = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
    const onSnake = snake.some(segment => segment.x === newBanana.x && segment.y === newBanana.y);
    if (!onSnake) {
      banana = newBanana;
      valid = true;
    }
  }
}

function updateGame() {
  if (nextDirection) {
    direction = nextDirection;
    if (direction === "UP") rotationAngle = -Math.PI / 2;
    if (direction === "DOWN") rotationAngle = Math.PI / 2;
    if (direction === "LEFT") rotationAngle = Math.PI;
    if (direction === "RIGHT") rotationAngle = 0;
    nextDirection = null;
  }

  const head = { ...snake[0] };
  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;
  if (direction === "LEFT") head.x--;
  if (direction === "RIGHT") head.x++;

  if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) {
    clearInterval(gameInterval);
    alert("Game Over: Crashed!");
    return;
  }

  for (let segment of snake) {
    if (segment.x === head.x && segment.y === head.y) {
      clearInterval(gameInterval);
      alert("Game Over: Ran into yourself!");
      return;
    }
  }

  snake.unshift(head);

  if (head.x === banana.x && head.y === banana.y) {
    score++;
    scoreEl.textContent = "Score: " + score;
    placeBanana();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "#92D3D9" : "#78a7ab";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  for (let i = 1; i < snake.length; i++) {
    drawTile(trailImg, snake[i].x, snake[i].y);
  }

  drawTile(playerImg, snake[0].x, snake[0].y, rotationAngle);
  drawTile(bananaImg, banana.x, banana.y);
}

function startGame() {
  if (typeof score !== "number") score = 0;

  if (score > highScore) {
    highScore = score;
    document.getElementById("highScore").textContent = "High Score: " + highScore;
  }

  snake = [{ x: 5, y: 5 }];
  direction = "RIGHT";
  rotationAngle = 0;
  nextDirection = null;
  score = 0;
  scoreEl.textContent = "Score: 0";
  placeBanana();

  clearInterval(gameInterval);
  waitingForFirstMove = true;

  document.getElementById("startBtn").textContent = "Restart"; // ✅ switch label
  draw();
}


window.onload = () => {
  resizeCanvas();
  draw(); // ✅ Force initial grid draw even before images

  let loadedCount = 0;
  const totalImages = 3;
  const checkStart = () => {
    loadedCount++;
    if (loadedCount === totalImages) {
      startGame(); // Wait for first move
    }
  };

  playerImg.onload = checkStart;
  bananaImg.onload = checkStart;
  trailImg.onload = checkStart;
};

window.addEventListener("resize", () => {
  resizeCanvas();
  draw();
});
