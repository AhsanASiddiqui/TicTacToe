const board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
const humanPlayer = "X";
const aiPlayer = "O";
let currentPlayer = humanPlayer;
let gameOver = false;

function checkWinner(player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winningCombinations) {
        if (board[combo[0]] === player && board[combo[1]] === player && board[combo[2]] === player) {
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return board.indexOf(" ") === -1;
}

function evaluateScore() {
    if (checkWinner(aiPlayer)) {
        return 1;
    } else if (checkWinner(humanPlayer)) {
        return -1;
    } else {
        return 0;
    }
}

function minimax(depth, isMaximizing) {
    if (checkWinner(aiPlayer)) {
        return 1;
    } else if (checkWinner(humanPlayer)) {
        return -1;
    } else if (checkDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === " ") {
                board[i] = aiPlayer;
                bestScore = Math.max(bestScore, minimax(depth + 1, false));
                board[i] = " ";
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === " ") {
                board[i] = humanPlayer;
                bestScore = Math.min(bestScore, minimax(depth + 1, true));
                board[i] = " ";
            }
        }
        return bestScore;
    }
}

function findBestMove() {
    let bestMove;
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === " ") {
            board[i] = aiPlayer;
            let score = minimax(0, false);
            board[i] = " ";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function makeMove(index) {
    if (!gameOver && board[index] === " " && currentPlayer === humanPlayer) {
        board[index] = humanPlayer;
        document.getElementById(`cell-${index}`).textContent = humanPlayer;

        if (checkWinner(humanPlayer)) {
            document.getElementById("game-over").textContent = "Player X wins!";
            gameOver = true;
        } else if (checkDraw()) {
            document.getElementById("game-over").textContent = "It's a draw!";
            gameOver = true;
        } else {
            currentPlayer = aiPlayer;
            setTimeout(makeAiMove, 500);
        }
    }
}

function makeAiMove() {
    if (!gameOver && currentPlayer === aiPlayer) {
        const bestMove = findBestMove();
        board[bestMove] = aiPlayer;
        document.getElementById(`cell-${bestMove}`).textContent = aiPlayer;

        if (checkWinner(aiPlayer)) {
            document.getElementById("game-over").textContent = "Player O wins!";
            gameOver = true;
        } else if (checkDraw()) {
            document.getElementById("game-over").textContent = "It's a draw!";
            gameOver = true;
        } else {
            currentPlayer = humanPlayer;
        }
    }
}

function resetGame() {
    for (let i = 0; i < board.length; i++) {
        board[i] = " ";
        document.getElementById(`cell-${i}`).textContent = "";
    }
    document.getElementById("game-over").textContent = "";
    gameOver = false;
    currentPlayer = humanPlayer;
}

window.addEventListener("load", () => {
    const gameBoard = document.getElementById("game-board");
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `cell-${i}`;
        cell.addEventListener("click", () => makeMove(i));
        gameBoard.appendChild(cell);
    }

    const resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", resetGame);
});
