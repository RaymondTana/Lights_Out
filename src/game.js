// This is the TypeScript code that would be compiled to JavaScript
var ColorFlipGame = /** @class */ (function () {
    function ColorFlipGame() {
        // Initialize game state
        this.state = {
            gridSize: 5,
            variant: 'row-col',
            moves: 0,
            board: [],
            gameOver: false
        };
        // Get DOM elements
        this.boardElement = document.getElementById('board');
        this.gridSizeSlider = document.getElementById('grid-size');
        this.sizeValueSpan = document.getElementById('size-value');
        this.variantSelect = document.getElementById('game-variant');
        this.moveCountSpan = document.getElementById('move-count');
        this.gameInstructions = document.getElementById('game-instructions');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.resultText = document.getElementById('result-text');
        this.resultDetails = document.getElementById('result-details');
        this.playAgainButton = document.getElementById('play-again');
        // Set up event listeners
        this.setupEventListeners();
        // Initialize the game
        this.setupNewGame();
    }
    ColorFlipGame.prototype.setupEventListeners = function () {
        var _this = this;
        this.gridSizeSlider.addEventListener('input', function () {
            _this.updateSizeValue();
            _this.setupNewGame(); // Auto-restart when size changes
        });
        this.variantSelect.addEventListener('change', function () {
            _this.updateInstructions();
            _this.setupNewGame(); // Auto-restart when variant changes
        });
        this.playAgainButton.addEventListener('click', function () { return _this.handlePlayAgain(); });
    };
    ColorFlipGame.prototype.updateSizeValue = function () {
        var size = parseInt(this.gridSizeSlider.value);
        this.sizeValueSpan.textContent = "".concat(size, "\u00D7").concat(size);
    };
    ColorFlipGame.prototype.updateInstructions = function () {
        var variant = this.variantSelect.value;
        var instructions = "Click cells to flip their colors. ";
        switch (variant) {
            case 'row-col':
                instructions += "Clicking a cell flips it and all cells in the same row and column.";
                break;
            case 'adjacent':
                instructions += "Clicking a cell flips it and all adjacent cells (up, down, left, right).";
                break;
            case 'diagonal':
                instructions += "Clicking a cell flips it and all cells diagonally connected to it.";
                break;
        }
        this.gameInstructions.textContent = instructions;
    };
    ColorFlipGame.prototype.setupNewGame = function () {
        // Get current settings
        this.state.gridSize = parseInt(this.gridSizeSlider.value);
        this.state.variant = this.variantSelect.value;
        // Reset game state
        this.state.moves = 0;
        this.state.gameOver = false;
        // Update UI
        this.moveCountSpan.textContent = this.state.moves.toString();
        this.updateInstructions();
        // Create board
        this.createBoard();
        // Initialize board with guaranteed solvable configuration
        this.initializeSolvableBoard();
        // Hide game over screen if visible
        this.gameOverScreen.style.display = 'none';
    };
    ColorFlipGame.prototype.createBoard = function () {
        var _this = this;
        // Clear the board
        this.boardElement.innerHTML = '';
        // Set grid dimensions
        this.boardElement.style.gridTemplateColumns = "repeat(".concat(this.state.gridSize, ", 1fr)");
        // Initialize board array with all cells set to false (white)
        this.state.board = Array(this.state.gridSize).fill(null)
            .map(function () { return Array(_this.state.gridSize).fill(false); });
        var _loop_1 = function (row) {
            var _loop_2 = function (col) {
                var cell = document.createElement('div');
                cell.classList.add('cell', 'white');
                // Add data attributes for position
                cell.dataset.row = row.toString();
                cell.dataset.col = col.toString();
                // Add click handler using arrow function to preserve 'this'
                cell.addEventListener('click', function () { return _this.handleCellClick(row, col); });
                // Add to DOM
                this_1.boardElement.appendChild(cell);
            };
            for (var col = 0; col < this_1.state.gridSize; col++) {
                _loop_2(col);
            }
        };
        var this_1 = this;
        // Create cells
        for (var row = 0; row < this.state.gridSize; row++) {
            _loop_1(row);
        }
    };
    ColorFlipGame.prototype.initializeSolvableBoard = function () {
        // Start with all red cells (solved state)
        for (var row = 0; row < this.state.gridSize; row++) {
            for (var col = 0; col < this.state.gridSize; col++) {
                this.state.board[row][col] = true;
                var cell = this.getCellElement(row, col);
                cell.classList.remove('white');
                cell.classList.add('red');
            }
        }
        // Apply random moves to scramble the board
        // Number of random moves depends on grid size
        var numRandomMoves = this.state.gridSize * this.state.gridSize * 2;
        for (var i = 0; i < numRandomMoves; i++) {
            var row = Math.floor(Math.random() * this.state.gridSize);
            var col = Math.floor(Math.random() * this.state.gridSize);
            // Apply the move without incrementing the move counter
            this.applyMove(row, col, false);
        }
    };
    ColorFlipGame.prototype.handleCellClick = function (row, col) {
        if (this.state.gameOver)
            return;
        // Apply the move and count it
        this.applyMove(row, col, true);
        // Check win condition
        this.checkWinCondition();
    };
    ColorFlipGame.prototype.applyMove = function (row, col, countMove) {
        if (countMove) {
            // Update move count
            this.state.moves++;
            this.moveCountSpan.textContent = this.state.moves.toString();
        }
        // Flip cells based on variant
        switch (this.state.variant) {
            case 'row-col':
                this.flipRowAndColumn(row, col);
                break;
            case 'adjacent':
                this.flipAdjacentCells(row, col);
                break;
            case 'diagonal':
                this.flipDiagonalCells(row, col);
                break;
        }
    };
    ColorFlipGame.prototype.flipRowAndColumn = function (clickedRow, clickedCol) {
        // Flip clicked cell and all cells in the same row and column
        for (var row = 0; row < this.state.gridSize; row++) {
            for (var col = 0; col < this.state.gridSize; col++) {
                if (row === clickedRow || col === clickedCol) {
                    this.flipCell(row, col);
                }
            }
        }
    };
    ColorFlipGame.prototype.flipAdjacentCells = function (clickedRow, clickedCol) {
        // Flip clicked cell
        this.flipCell(clickedRow, clickedCol);
        // Flip adjacent cells (up, down, left, right)
        var adjacentPositions = [
            { row: clickedRow - 1, col: clickedCol }, // Up
            { row: clickedRow + 1, col: clickedCol }, // Down
            { row: clickedRow, col: clickedCol - 1 }, // Left
            { row: clickedRow, col: clickedCol + 1 } // Right
        ];
        for (var _i = 0, adjacentPositions_1 = adjacentPositions; _i < adjacentPositions_1.length; _i++) {
            var pos = adjacentPositions_1[_i];
            if (this.isValidPosition(pos.row, pos.col)) {
                this.flipCell(pos.row, pos.col);
            }
        }
    };
    ColorFlipGame.prototype.flipDiagonalCells = function (clickedRow, clickedCol) {
        // Find all cells diagonally connected to the clicked cell
        for (var row = 0; row < this.state.gridSize; row++) {
            for (var col = 0; col < this.state.gridSize; col++) {
                // Check if cell is on the same diagonal as the clicked cell
                if (Math.abs(row - clickedRow) === Math.abs(col - clickedCol)) {
                    this.flipCell(row, col);
                }
            }
        }
    };
    ColorFlipGame.prototype.isValidPosition = function (row, col) {
        return row >= 0 && row < this.state.gridSize && col >= 0 && col < this.state.gridSize;
    };
    ColorFlipGame.prototype.flipCell = function (row, col) {
        if (!this.isValidPosition(row, col))
            return;
        // Find the cell element
        var cellElement = this.getCellElement(row, col);
        // Toggle cell color
        this.state.board[row][col] = !this.state.board[row][col];
        if (this.state.board[row][col]) {
            cellElement.classList.remove('white');
            cellElement.classList.add('red');
        }
        else {
            cellElement.classList.remove('red');
            cellElement.classList.add('white');
        }
    };
    ColorFlipGame.prototype.getCellElement = function (row, col) {
        return this.boardElement.querySelector("[data-row=\"".concat(row, "\"][data-col=\"").concat(col, "\"]"));
    };
    ColorFlipGame.prototype.checkWinCondition = function () {
        // Check if all cells are the same color (all red)
        var allRed = true;
        for (var row = 0; row < this.state.gridSize; row++) {
            for (var col = 0; col < this.state.gridSize; col++) {
                if (!this.state.board[row][col]) {
                    allRed = false;
                    break;
                }
            }
            if (!allRed)
                break;
        }
        if (allRed) {
            this.endGame();
        }
    };
    ColorFlipGame.prototype.endGame = function () {
        this.state.gameOver = true;
        // Update game over screen
        this.resultText.textContent = "Congratulations!";
        this.resultDetails.textContent = "You solved the puzzle in ".concat(this.state.moves, " moves.");
        // Show game over screen
        this.gameOverScreen.style.display = 'flex';
    };
    ColorFlipGame.prototype.handlePlayAgain = function () {
        this.setupNewGame();
    };
    return ColorFlipGame;
}());
// Initialize the game when the DOM is loaded
window.addEventListener('DOMContentLoaded', function () {
    new ColorFlipGame();
});
