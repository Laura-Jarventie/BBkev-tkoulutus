let BOARD_SIZE = 15
let board; //kenttä tallennetaan tähän


document.getElementById("new-game-btn").addEventListener('click', startGame);

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
      }
     }
    }
    
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
                if (board[y][x] === 'W') {
                    cell.classList.add('wall'); // 'W' on seinä
                }
                gameBoard.appendChild(cell);
            }
        }
    
    }
