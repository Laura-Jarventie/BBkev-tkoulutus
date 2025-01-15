let BOARD_SIZE = 15;
const cellSize = calculateCellSize();
let board; //kenttä tallennetaan tähän


document.getElementById("new-game-btn").addEventListener('click', startGame);

//laitteen minimi korkeus tai leveys: puhelin versus screen
function calculateCellSize() {
    const screenSize = Math.min(window.innerWidth, window.innerHeight);
    return (screenSize * 0.95) / BOARD_SIZE;
}

function startGame(){
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

// Generate board and draw it
board = generateRandomBoard();

drawBoard(board);

}

function generateRandomBoard() {

    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(' '));

    console.log(newBoard);

    // set walls in edges
    for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
    if (y === 0 || y === BOARD_SIZE - 1 || x === 0 || x === BOARD_SIZE - 1) {
    newBoard[y][x] = 'W'; //W is wall
    } }
    }
    console.log(newBoard);
    generateTetrisWalls(newBoard);
    console.log(newBoard);
    return newBoard; 
}


function drawBoard(board) {
        const gameBoard = document.getElementById('game-board');

    // Asetetaan grid-sarakkeet ja rivit dynaamisesti BOARD_SIZE:n mukaan
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`; 



    // Luodaan jokainen ruutu
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const cell = document.createElement('div');
            
            cell.classList.add('cell');
            cell.style.width = cellSize + "px";
            cell.style.height = cellSize + "px";
            if (board[y][x] === 'W') {
                cell.classList.add('wall'); // 'W' on seinä
            }
            gameBoard.appendChild(cell);
        }
    }
}

function generateTetrisWalls(board) {

    const tetrisPieces = [
     [[1,1],[1,1]], // Square
     [[1,1,1,1]], // I
     [[1,1,1],[0,1,0],[0,1,0],[0,1,0]], // T
     [[1,1,0],[0,1,0],[0,1,1]], // Z
     [[0,1,1],[1,1,0]], // S
     [[1,0,0],[1,1,1]], // L
     [[0,0,1],[1,1,1]] // J
     ];
    
    
     // Valitse muutama kiinteä paikka satunnaisille Tetris-kappaleille pelikentällä
     const positions = [
      { startX: 2, startY: 2 },
      { startX: 8, startY: 2 },
      { startX: 4, startY: 8 },
      { startX: 10, startY: 10 },
      { startX: 13, startY: 14 }
    ];
    
    
    // Käy läpi valitut paikat
      positions.forEach(pos => {
        const randomPiece = tetrisPieces[Math.floor(Math.random() * tetrisPieces.length)];
     
        placePiece(board, randomPiece, pos.startY, pos.startX);
      });
    }

    function placePiece(board, piece, startY, startX) {
        for (let y = 0; y < piece.length; y++) {
          for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x] === 1) {
              board[startY + y][startX + x] = 'W'; // Aseta 'W' seinäksi
            }
          }
        }
      } 