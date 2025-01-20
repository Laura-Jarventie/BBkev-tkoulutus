let BOARD_SIZE = 20
let board; //kenttä tallennetaan tähän
const cellSize = calculateCellSize();
let player;
let ghosts = []; // List to hold the ghosts


document.getElementById('new-game-btn').addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
      player.move(0, -1); // Liikuta ylös
      break;
      case 'ArrowDown':
      player.move(0, 1); // Liikuta alas
      break;
      case 'ArrowLeft':
      player.move(-1, 0); // Liikuta vasemmalle
     break;
      case 'ArrowRight':
      player.move(1, 0); // Liikuta oikealle
      break;
      }
     event.preventDefault(); // Prevent default scrolling behaviour
     });


document.addEventListener('keydown', (event) => {
switch (event.key) {
    case 'w':
        shootAt(player.x, player.y - 1); // shoot up
        break;
    case 's':
        shootAt(player.x, player.y + 1); // shoot down
        break;
    case 'a':
        shootAt(player.x - 1, player.y); // shoot left
        break;
    case 'd':
        shootAt(player.x + 1, player.y); // shoot right
        break;
}
event.preventDefault(); // Prevent default scrolling behavior
});

function getCell(board, x, y) {
    return board[y][x];
}


function setCell(board, x, y, value) {
    board[y][x] = value;
}

function calculateCellSize() {
     // Otetaan talteen pienempi luku ikkunan leveydestä ja korkeudesta
     const screenSize = Math.min(window.innerWidth, window.innerHeight);
     // Tehdään pelilaudasta hieman tätä pienempi, jotta jää pienet reunat
     const gameBoardSize = 0.95 * screenSize;
     // Laudan koko jaetaan ruutujen määrällä, jolloin saadaan yhden ruudun koko
     return gameBoardSize / BOARD_SIZE;
    }
    
function startGame(){
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    player = new Player(0,0);

    // Generate board and draw it
    board = generateRandomBoard();
    drawBoard(board);
}

function generateRandomBoard() {

    const newBoard = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(' '));
    
    //console.log(newBoard);
    
    // set walls in edges
    for (let y = 0; y < BOARD_SIZE; y++) {
     for (let x = 0; x < BOARD_SIZE; x++) {
      if (y === 0 || y === BOARD_SIZE - 1 || x === 0 || x === BOARD_SIZE - 1) {
      newBoard[y][x] = 'W'; //W is wall
      }
     }
    } 
    generateObstacles(newBoard);

    for (let i = 0; i < 5; i++) {
        const [ghostX, ghostY] = randomEmptyPosition(newBoard);
        console.log(ghostX,ghostY);
        setCell(newBoard, ghostX, ghostY, 'H');
        ghosts.push(new Ghost(ghostX, ghostY)); // Add each ghost to the list
        console.log(ghosts);
       }

    const [playerX, playerY] = randomEmptyPosition(newBoard);
    setCell(newBoard, playerX, playerY, 'P');
    player.x = playerX;
    player.y = playerY;
    return newBoard;
}


function drawBoard(board) {
    const gameBoard = document.getElementById('game-board');

    gameBoard.innerHTML = ''; // Tyhjennä olemassa oleva sisältö

    // Asetetaan grid-sarakkeet ja rivit dynaamisesti BOARD_SIZE:n mukaan
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

    // Luodaan jokainen ruutu
    for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = cellSize + "px";
            cell.style.height = cellSize + "px";
            if (getCell(board, x, y) === 'W') {
                cell.classList.add('wall'); // 'W' on seinä
            } else if (getCell(board, x, y) === 'P') {
                cell.classList.add('player'); // 'P' on pelaaja
                } else if (getCell(board, x, y) === 'H'){
                    cell.classList.add('hornmonster'); //H on ghost
                  } else if (getCell(board, x, y) === 'B'){
                    cell.classList.add('bullet'); //B on ammus
                    setTimeout(() => {
                      setCell(board, x, y, ' ') 
                  }, 500); // Ammus näkyy 500 ms
                  }
            gameBoard.appendChild(cell);
        }
    }
}
    
function generateObstacles(board) {
    // Lista esteitä koordinaattiparien listoina
    const obstacles = [
        [[0,0],[0,1],[1,0],[1,1]], // Square
        [[0,0],[0,1],[0,2],[0,3]],  // I
        [[0,0],[1,0],[2,0],[1,1]], // T
        [[1,0],[2,0],[1,1],[0,2],[1,2]], // Z
        [[1,0],[2,0],[0,1],[1,1]], // S
        [[0,0],[1,0],[1,1],[1,2]], // L
        [[0,2],[0,1],[1,1],[2,1]]  // J
    ];

    // Valitse muutama paikka esteille pelikentällä
    //nyt kun kovakoodattu niin X tai Y ei saa olla niin että palikka ei mahdu. Nyt palikat max 4 ruudun päästä reunasta.
    const positions = [
        { startX: 2, startY: 2 },
        { startX: 8, startY: 2 },
        { startX: 4, startY: 8 },
        { startX: 3, startY: 16 },
        { startX: 10, startY: 10 },
        { startX: 12, startY: 5 },
        { startX: 12, startY: 10 },
        { startX: 16, startY: 10 },
        { startX: 13, startY: 14 }
    ];

    

  // Käydään läpi valitut paikat ja arvotaan niihin esteet
    positions.forEach(pos => {
        const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
        placeObstacle(board, randomObstacle, pos.startX, pos.startY);
    }); 
}

 function placeObstacle(board, obstacle, startX, startY) {
    for (coordinatePair of obstacle) {
        [x,y] = coordinatePair;
        board[startY + y][startX + x] = 'W';
    }
}
 
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
   }

function randomEmptyPosition(board) {
    x = randomInt(1, BOARD_SIZE - 2);
    y = randomInt(1, BOARD_SIZE - 2);
    if (getCell(board, x, y)  === ' ') {
        return [x, y];
    } else {
        return randomEmptyPosition(board);
    }
}

class Player {
    constructor(x, y){
      this.x = x;
      this.y = y;
    }
    move(deltaX, deltaY) {
        // pelaajan nykyiset koordinaatit tallennetaan muuttujiin
        const currentX = player.x;
        const currentY = player.y;
       
        console.log(`Current Position: (${currentX}, ${currentY})`);
       
        // Laske uusi sijainti
       const newX = currentX + deltaX;
       const newY = currentY + deltaY;
   
        // Tarkista, onko aidan uusi paikka kentällä ja tyhjä
       if (getCell(board,newX,newY) === ' ') {
  
        // Päivitä pelaajan sijainti
        player.x = newX;
        player.y = newY;
  
        // Päivitä pelikenttä
        board[currentY][currentX] = ' '; // Tyhjennetään vanha paikka
        board[newY][newX] = 'P'; // Asetetaan uusi paikka
        
      }  
        drawBoard(board);
       }
}

class Ghost {
    constructor(x, y) {
    this.x = x;
   this.y = y;
     }
    }

function shootAt(x, y) {
 
    if(getCell(board,x,y)=== 'W'){
        return;
    } 
    
     // Find the ghost at the given coordinates
    const ghostIndex = ghosts.findIndex(ghost => ghost.x === x && ghost.y === y);
    
    if (ghostIndex !== -1) {
        // Remove the ghost from the list
        ghosts.splice(ghostIndex, 1);
    }
    //console.log(ghosts); 
    
    setCell(board, x, y, 'B');
    
    drawBoard(board);
    
     if (ghosts.length === 0){
        alert('kaikki ammuttu');
        } 
    }