"use strict";
// To be compiled
class ColorFlipGame {
    constructor() {
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
    setupEventListeners() {
        // Callback whenever slide the Grid Size slider
        this.gridSizeSlider.addEventListener('input', () => {
            this.updateSizeValue();
            this.setupNewGame(); // Auto-restart
        });
        // Callback upon selection for a new Game Variant
        this.variantSelect.addEventListener('change', () => {
            this.updateInstructions();
            this.setupNewGame(); // Auto-restart
        });
        this.playAgainButton.addEventListener('click', () => this.handlePlayAgain());
    }
    // Respond to slider for Grid Size
    updateSizeValue() {
        const size = parseInt(this.gridSizeSlider.value);
        this.sizeValueSpan.textContent = `${size}×${size}`;
    }
    // Respond to selection of a new Game Variant
    updateInstructions() {
        const variant = this.variantSelect.value;
        let instructions = "Click cells to flip their colors. ";
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
    }
    // Set up a new Game
    setupNewGame() {
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
    }
    // Create the Grid
    createBoard() {
        // Clear the board
        this.boardElement.innerHTML = '';
        // Set grid dimensions
        this.boardElement.style.gridTemplateColumns = `repeat(${this.state.gridSize}, 1fr)`;
        // Initialize board array with all cells set to false (white)
        this.state.board = Array(this.state.gridSize).fill(null)
            .map(() => Array(this.state.gridSize).fill(true));
        // Create Cells initialized to red (true)
        for (let row = 0; row < this.state.gridSize; row++) {
            for (let col = 0; col < this.state.gridSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell', 'red');
                // Add data attributes for position
                cell.dataset.row = row.toString();
                cell.dataset.col = col.toString();
                // Add click handler to preserve 'this'
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                // Add to DOM
                this.boardElement.appendChild(cell);
            }
        }
    }
    // Randomize from solved state
    initializeSolvableBoard() {
        // Apply random moves to scramble the board
        const numRandomMoves = this.state.gridSize * this.state.gridSize * 2;
        for (let i = 0; i < numRandomMoves; i++) {
            const row = Math.floor(Math.random() * this.state.gridSize);
            const col = Math.floor(Math.random() * this.state.gridSize);
            // Apply the move without incrementing the move counter
            this.applyMove(row, col, false);
        }
    }
    // Click a cell
    handleCellClick(row, col) {
        // Stray clicks are ignored
        if (this.state.gameOver)
            return;
        // Apply the move and count it
        this.applyMove(row, col, true);
        // Check win condition
        this.checkWinCondition();
    }
    // Enact the click
    applyMove(row, col, countMove) {
        // If counting the move...
        if (countMove) {
            this.state.moves++;
            this.moveCountSpan.textContent = this.state.moves.toString();
        }
        // Flip cells based on variant
        switch (this.state.variant) {
            case 'row-col':
                this.flipSameRowAndColumn(row, col);
                break;
            case 'adjacent':
                this.flipAdjacents(row, col);
                break;
            case 'diagonal':
                this.flipDiagonals(row, col);
                break;
        }
    }
    // When Rule is to flip the same row and column
    flipSameRowAndColumn(clickedRow, clickedCol) {
        // Flip clicked cell and all cells in the same row and column
        // Flip same row
        for (let col = 0; col < this.state.gridSize; col++) {
            this.flipCell(clickedRow, col);
        }
        // Flip same column (avoiding double flipping (clickedRow, clickedCol))
        for (let row = 0; row < this.state.gridSize; row++) {
            if (row !== clickedRow) {
                this.flipCell(row, clickedCol);
            }
        }
    }
    // When Rule is to flip the same row and column
    flipAdjacents(clickedRow, clickedCol) {
        // Flip clicked cell
        this.flipCell(clickedRow, clickedCol);
        // Flip adjacent cells (up, down, left, right)
        const adjacentPositions = [
            { row: clickedRow - 1, col: clickedCol }, // N
            { row: clickedRow, col: clickedCol + 1 }, // E
            { row: clickedRow + 1, col: clickedCol }, // S
            { row: clickedRow, col: clickedCol - 1 } // W
        ];
        for (const pos of adjacentPositions) {
            this.flipCell(pos.row, pos.col);
        }
    }
    // When Rule is to flip the diagonals
    flipDiagonals(clickedRow, clickedCol) {
        // Find all cells diagonally connected to the clicked cell
        for (let row = 0; row < this.state.gridSize; row++) {
            for (let col = 0; col < this.state.gridSize; col++) {
                // Check if cell is on the same diagonal as the clicked cell
                if (Math.abs(row - clickedRow) === Math.abs(col - clickedCol)) {
                    this.flipCell(row, col);
                }
            }
        }
    }
    // Detect whether (row, col) makes sense
    isValidPosition(row, col) {
        return row >= 0 && row < this.state.gridSize && col >= 0 && col < this.state.gridSize;
    }
    // Flip a cell
    flipCell(row, col) {
        if (!this.isValidPosition(row, col))
            return;
        // Find the cell element
        const cellElement = this.getCellElement(row, col);
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
    }
    // Return the cell DOM element
    getCellElement(row, col) {
        return this.boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }
    // Check if the game is won
    checkWinCondition() {
        // Check if all cells are the same color (all red)      
        for (let row = 0; row < this.state.gridSize; row++) {
            for (let col = 0; col < this.state.gridSize; col++) {
                if (!this.state.board[row][col]) {
                    return;
                }
            }
        }
        // Only end game if all Cells were red
        this.endGame();
    }
    // Run when game is over
    endGame() {
        this.state.gameOver = true;
        // Update game over screen
        this.resultText.textContent = "Congratulations!";
        this.resultDetails.textContent = `You solved the puzzle in ${this.state.moves} moves.`;
        // Show game over screen
        this.gameOverScreen.style.display = 'flex';
    }
    // Restart
    handlePlayAgain() {
        this.setupNewGame();
    }
}
// Initialize the game when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    new ColorFlipGame();
});
