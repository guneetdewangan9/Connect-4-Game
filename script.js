const ROWS = 6;
const COLS = 7;
let currentPlayer = 'red';
let board = [];

// Initialize the board as a 2D array
for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLS; c++) {
        board[r][c] = null;
    }
}

const boardElement = document.getElementById('board');
const currentPlayerElement = document.getElementById('currentPlayer');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');

// Create the board UI
function createBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.column = c;
            cell.dataset.row = r;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

// Handle cell click
function handleCellClick(e) {
    const column = parseInt(e.currentTarget.dataset.column);
    // Find the lowest empty cell in the column
    for (let r = ROWS - 1; r >= 0; r--) {
        if (!board[r][column]) {
            board[r][column] = currentPlayer;
            const cell = getCellElement(r, column);
            cell.classList.add(currentPlayer);
            if (checkWin(r, column)) {
                statusElement.textContent = `Player ${capitalize(currentPlayer)} wins!`;
                removeClickListeners();
                return;
            }
            if (isBoardFull()) {
                statusElement.textContent = `It's a draw!`;
                return;
            }
            // Switch player
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
            currentPlayerElement.textContent = capitalize(currentPlayer);
            return;
        }
    }
    alert('Column is full! Choose another one.');
}

// Get the cell element based on row and column
function getCellElement(row, col) {
    const index = row * COLS + col;
    return boardElement.children[index];
}

// Check if the board is full
function isBoardFull() {
    for (let c = 0; c < COLS; c++) {
        if (!board[0][c]) {
            return false;
        }
    }
    return true;
}

// Check for win conditions
function checkWin(row, col) {
    return (
        checkDirection(row, col, -1, 0) + checkDirection(row, col, 1, 0) > 2 || // Vertical
        checkDirection(row, col, 0, -1) + checkDirection(row, col, 0, 1) > 2 || // Horizontal
        checkDirection(row, col, -1, -1) + checkDirection(row, col, 1, 1) > 2 || // Diagonal /
        checkDirection(row, col, -1, 1) + checkDirection(row, col, 1, -1) > 2    // Diagonal \
    );
}

// Check a specific direction for consecutive discs
function checkDirection(row, col, deltaRow, deltaCol) {
    let count = 0;
    let r = row + deltaRow;
    let c = col + deltaCol;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === currentPlayer) {
        count++;
        r += deltaRow;
        c += deltaCol;
    }
    return count;
}

// Capitalize the first letter
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Remove all click listeners when game is over
function removeClickListeners() {
    for (let cell of boardElement.children) {
        cell.removeEventListener('click', handleCellClick);
    }
}

// Restart the game
function restartGame() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
        board[r] = [];
        for (let c = 0; c < COLS; c++) {
            board[r][c] = null;
        }
    }
    createBoard();
    currentPlayer = 'red';
    currentPlayerElement.textContent = capitalize(currentPlayer);
    statusElement.textContent = `Player ${capitalize(currentPlayer)}'s turn`;
}

// Initialize the game
createBoard();
restartButton.addEventListener('click', restartGame);
