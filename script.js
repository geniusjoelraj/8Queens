const boardSize = 8;
let board = Array(boardSize).fill().map(() => Array(boardSize).fill(false));
let queensPlaced = 0;
let solutions = [];
let currentSolutionIndex = 0;

// Creating the chessboard
const chessboardEl = document.getElementById('chessboard');

for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
        const cell = document.createElement('div');
        cell.className = `cell ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener('click', () => toggleQueen(row, col));
        chessboardEl.appendChild(cell);
    }
}

// Check for safe position
function isSafe(row, col) {
    // row and column
    for (let i = 0; i < boardSize; i++) {
        if (board[row][i] || board[i][col]) {
            return false;
        }
    }
    // diagonals
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] && (Math.abs(row - i) === Math.abs(col - j))) {
                return false;
            }
        }
    }
    
    return true;
}

// Toggle queen 
function toggleQueen(row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    
    if (board[row][col]) {
        board[row][col] = false;
        queensPlaced--;
        cell.innerHTML = '';
        cell.classList.remove('queen');
        updateBoard();
        updateQueenCount();
        return;
    }
    
    // Check if position is safe
    if (isSafe(row, col)) {
        board[row][col] = true;
        queensPlaced++;
        cell.innerHTML = '♛';
        cell.classList.add('queen');
        updateBoard();
        updateQueenCount();
        
        // Check if solved
        if (queensPlaced === boardSize) {
            setTimeout(() => {
                alert("Congratulations! You've solved the 8 Queens Problem!");
            }, 100);
        }
    } else {
        alert("Invalid position! Queens cannot threaten each other.");
    }
}

function updateBoard() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('threatened');
    });
    
    // Mark threatened cells
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (!board[row][col]) {
                // Check rows and columns
                let threatened = false;
                
                // Check row
                for (let i = 0; i < boardSize; i++) {
                    if (board[row][i]) {
                        threatened = true;
                        break;
                    }
                }
                
                // Check column
                if (!threatened) {
                    for (let i = 0; i < boardSize; i++) {
                        if (board[i][col]) {
                            threatened = true;
                            break;
                        }
                    }
                }
                
                // Check diagonals
                if (!threatened) {
                    for (let i = 0; i < boardSize; i++) {
                        for (let j = 0; j < boardSize; j++) {
                            if (board[i][j] && (Math.abs(row - i) === Math.abs(col - j))) {
                                threatened = true;
                                break;
                            }
                        }
                        if (threatened) break;
                    }
                }
                
                if (threatened) {
                    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    cell.classList.add('threatened');
                }
            }
        }
    }
}

function updateQueenCount() {
    document.getElementById('solution-count').textContent = `Queens placed: ${queensPlaced} / ${boardSize}`;
}

document.getElementById('clear-board').addEventListener('click', () => {
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(false));
    queensPlaced = 0;
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('queen');
        cell.classList.remove('threatened');
    });
    
    updateQueenCount();
});

function solveNQueens(n) {
    const solutions = [];
    const board = Array(n).fill().map(() => Array(n).fill('.'));
    
    function backtrack(row) {
        if (row === n) {
            // Found a solution
            const solution = board.map(row => [...row]);
            solutions.push(solution);
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (isValidPosition(row, col)) {
                board[row][col] = 'Q';
                backtrack(row + 1);
                board[row][col] = '.';
            }
        }
    }
    
    function isValidPosition(row, col) {
        // Check column
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 'Q') return false;
        }
        
        // Check upper-left diagonal
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] === 'Q') return false;
        }
        
        // Check upper-right diagonal
        for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
            if (board[i][j] === 'Q') return false;
        }
        
        return true;
    }
    
    backtrack(0);
    return solutions;
}

// Show a solution
document.getElementById('show-solution').addEventListener('click', () => {
    if (solutions.length === 0) {
        solutions = solveNQueens(boardSize);
        currentSolutionIndex = 0;
    }
    
    displaySolution(solutions[currentSolutionIndex]);
});

// Show the next solution
document.getElementById('next-solution').addEventListener('click', () => {
    if (solutions.length === 0) {
        solutions = solveNQueens(boardSize);
    }
    
    currentSolutionIndex = (currentSolutionIndex + 1) % solutions.length;
    displaySolution(solutions[currentSolutionIndex]);
});

// Display a solution on the board
function displaySolution(solution) {
    // Clear the current board
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(false));
    queensPlaced = 0;
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('queen');
        cell.classList.remove('threatened');
    });
    
    // Place queens according to the solution
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (solution[row][col] === 'Q') {
                board[row][col] = true;
                queensPlaced++;
                
                const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                cell.innerHTML = '♛';
                cell.classList.add('queen');
            }
        }
    }
    
    updateBoard();
    updateQueenCount();
    document.getElementById('solution-count').textContent = `Queens placed: ${queensPlaced} / ${boardSize} (Solution ${currentSolutionIndex + 1} of ${solutions.length})`;
}
