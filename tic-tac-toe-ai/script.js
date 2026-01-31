/*******************************
 TIC TAC TOE – SINGLE JS FILE
 3x3 & 4x4 | Friend & AI
 Alpha-Beta Pruning
********************************/

let boardSize = 3;
let board = [];
let currentPlayer = "X";
let gameOver = false;
let isAI = false;

// DOM ELEMENTS
const boardDiv = document.getElementById("board");
const statusDiv = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const boardSizeSelect = document.getElementById("boardSize");
const modeSelect = document.getElementById("mode");

/* ===============================
   EVENT LISTENERS
================================ */
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", initGame);

/* ===============================
   START GAME
================================ */
function startGame() {
  boardSize = parseInt(boardSizeSelect.value);
  isAI = modeSelect.value === "ai";
  initGame();
}

/* ===============================
   INITIALIZE GAME
================================ */
function initGame() {
  board = Array(boardSize * boardSize).fill("");
  currentPlayer = "X";
  gameOver = false;

  statusDiv.innerText = "Player X's Turn";

  boardDiv.innerHTML = "";
  boardDiv.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

  board.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.addEventListener("click", () => handleMove(index));
    boardDiv.appendChild(cell);
  });
}

/* ===============================
   HANDLE PLAYER MOVE
================================ */
function handleMove(index) {
  if (board[index] || gameOver) return;

  board[index] = currentPlayer;
  boardDiv.children[index].innerText = currentPlayer;

  if (checkWin(board, currentPlayer)) {
    statusDiv.innerText = `Player ${currentPlayer} Wins!`;
    gameOver = true;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusDiv.innerText = "Draw!";
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDiv.innerText = `Player ${currentPlayer}'s Turn`;

  if (isAI && currentPlayer === "O" && !gameOver) {
    setTimeout(aiMove, 200); // fast AI response
  }
}

/* ===============================
   AI MOVE (ALPHA-BETA)
================================ */
function aiMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false, -Infinity, Infinity);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  if (bestMove !== null) {
    handleMove(bestMove);
  }
}

/* ===============================
   MINIMAX + ALPHA BETA
================================ */
function minimax(b, depth, isMax, alpha, beta) {
  if (checkWin(b, "O")) return 10 - depth;
  if (checkWin(b, "X")) return depth - 10;
  if (b.every(cell => cell !== "")) return 0;

  // DEPTH LIMIT FOR SPEED (VERY IMPORTANT)
  const depthLimit = boardSize === 3 ? 6 : 4;
  if (depth >= depthLimit) return 0;

  if (isMax) {
    let maxEval = -Infinity;
    for (let i = 0; i < b.length; i++) {
      if (b[i] === "") {
        b[i] = "O";
        let eval = minimax(b, depth + 1, false, alpha, beta);
        b[i] = "";
        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) break; // PRUNING
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < b.length; i++) {
      if (b[i] === "") {
        b[i] = "X";
        let eval = minimax(b, depth + 1, true, alpha, beta);
        b[i] = "";
        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) break; // PRUNING
      }
    }
    return minEval;
  }
}

/* ===============================
   CHECK WIN (DYNAMIC)
================================ */
function checkWin(b, player) {
  const winLines = [];

  // Rows
  for (let r = 0; r < boardSize; r++) {
    winLines.push(
      [...Array(boardSize)].map((_, c) => r * boardSize + c)
    );
  }

  // Columns
  for (let c = 0; c < boardSize; c++) {
    winLines.push(
      [...Array(boardSize)].map((_, r) => r * boardSize + c)
    );
  }

  // Diagonals
  winLines.push(
    [...Array(boardSize)].map((_, i) => i * (boardSize + 1))
  );

  winLines.push(
    [...Array(boardSize)].map((_, i) => (i + 1) * (boardSize - 1))
  );

  return winLines.some(line =>
    line.every(index => b[index] === player)
  );
}
