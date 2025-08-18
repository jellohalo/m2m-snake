const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const tileSize = 70;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

let snake, direction, banana, gameInterval, score;

const playerImg = new Image();
const bananaImg = new Image();
const trailImg = new Image();

playerImg.src = "player.png";
bananaImg.src = "banana.png";
trailImg.src = "trail.png";

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP", rotationAngle = -Math.PI / 2;
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN", rotationAngle = Math.PI / 2;
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT", rotationAngle = Math.PI;
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT", rotationAngle = 0;
});

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

    // Check that the new position is not on the snake
    const onSnake = snake.some(segment => segment.x === newBanana.x && segment.y === newBanana.y);

    if (!onSnake) {
      banana = newBanana;
      valid = true;
    }
  }
}


function updateGame() {
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
    ctx.fillStyle = (x + y) % 2 === 0 ? "#92D3D9" : "#78a7ab"; // or use brown tones for dirt
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  }
}




  // Draw snake body
  for (let i = 1; i < snake.length; i++) {
    drawTile(trailImg, snake[i].x, snake[i].y);
  }

  // Draw player and banana
  drawTile(playerImg, snake[0].x, snake[0].y, rotationAngle);
  drawTile(bananaImg, banana.x, banana.y);
}


let highScore = 0;

function startGame() {
  if (score > highScore) {
    highScore = score;
    document.getElementById("highScore").textContent = "High Score: " + highScore;
  }
  snake = [{ x: 5, y: 5 }];
  direction = "RIGHT";
  score = 0;
  scoreEl.textContent = "Score: 0";
  placeBanana();
  clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, 250);
}


let rotationAngle = 0;

window.onload = () => {
  let loadedCount = 0;
  const totalImages = 3;
  const checkStart = () => {
    loadedCount++;
    if (loadedCount === totalImages) startGame();
  };

  playerImg.onload = checkStart;
  bananaImg.onload = checkStart;
  trailImg.onload = checkStart;
};
