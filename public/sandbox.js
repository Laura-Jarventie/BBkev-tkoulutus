let BOARD_SIZE = 20
let board; //kenttä tallennetaan tähän
const cellSize = calculateCellSize();
let player;
let ghosts = []; // List to hold the ghosts
let ghostInterval;
let ghostSpeed = 1000; // Aloitusnopeus haamuille (millisekunteina)
let isGameRunning = false;
let score = 0;

document.getElementById('new-game-btn').addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    if (isGameRunning) {
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

      }}
     event.preventDefault(); // Prevent default scrolling behaviour
     });

function getCell(board, x, y) {
    return board[y][x];
}


function setCell(board, x, y, value) {
    board[y][x] = value;
}

function updateScoreBoard(points) {
    const scoreBoard = document.getElementById('score-board');
    score = score + points;
    scoreBoard.textContent = `Pisteet: ${score}`;
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
    isGameRunning = true; // Nollaa pelitilan tila
    player = new Player(0,0);

    // Generate board and draw it
    board = generateRandomBoard();
    drawBoard(board);
    //Haamut alkavat liikkumaan sekunnin päästä startin painamisesta
    setTimeout(() => {
    ghostInterval = setInterval(moveGhosts, ghostSpeed)
    }, 1000);
    
    score = 0;
    updateScoreBoard(0); // Päivitä pistetaulu funktio
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

    ghosts = [];

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
       moveGhostTowardsPlayer(player, board, oldGhosts) {
           let dx = player.x - this.x;
           let dy = player.y - this.y;
        
           // lista mahdollisista siirroista pelaajaan päin 
           let moves = [];
        
           // Lisää siirrot listalle riippuen siitä, kumpi koordinaatti on suurempi
           // Tämä päättää, mihin suuntaan haamu liikkuu ensisijaisesti, perustuen siihen, kumpi etäisyys on suurempi, x- vai y-suuntainen.
           //Tämä lisää mahdolliset pelaajaan päin liikkeet listaan moves siten, että ensisijainen liikesuunta on se, joka vähentää etäisyyttä pelaajaan eniten.
           if (Math.abs(dx) > Math.abs(dy)) {
             if (dx > 0) moves.push({ x: this.x + 1, y: this.y }); // Move right
             else moves.push({ x: this.x - 1, y: this.y }); // Move left
             if (dy > 0) moves.push({ x: this.x, y: this.y + 1 }); // Move down
             else moves.push({ x: this.x, y: this.y - 1 }); // Move up
           } else {
             if (dy > 0) moves.push({ x: this.x, y: this.y + 1 }); // Move down
             else moves.push({ x: this.x, y: this.y - 1 }); // Move up
             if (dx > 0) moves.push({ x: this.x + 1, y: this.y }); // Move right
             else moves.push({ x: this.x - 1, y: this.y }); // Move left
            }
        
           // Valitse ensimmäinen mahdollinen siirto, joka ei ole seinä tai toisen haamun päällä
           //.some(): Tämä on JavaScriptin taulukkometodi, joka tarkistaa, täyttääkö vähintään yksi taulukon alkio annetun ehdon. Se palauttaa true, jos jokin alkio täyttää ehdon, muuten false.
           //h => h.x === move.x && h.y === move.y: Tämä on nuolifunktio (arrow function), joka toimii ehtona .some()-metodille. Se tarkistaa, onko jokin haamu (g) samassa paikassa kuin move-koordinaatit (move.x ja move.y).
           // g.x === move.x: Tarkistaa, onko haamun x-koordinaatti sama kuin move.x.
           //g.y === move.y: Tarkistaa, onko haamun y-koordinaatti sama kuin move.y.
           //&&: Molempien ehtojen täytyy olla totta, jotta koko ehto olisi totta.
           //! (looginen NOT): Tämä kääntää .some()-metodin palauttaman arvon. 
           // Jos .some() palauttaa true (eli jokin haamu on samassa paikassa kuin move), ! kääntää sen false:ksi. Jos .some() palauttaa false (eli mikään haamu ei ole samassa paikassa kuin move), ! kääntää sen true:ksi.
        
            for (let move of moves) {
              if (board[move.y][move.x] === ' ' || board[move.y][move.x] === 'P' &&
               !oldGhosts.some(h => h.x === move.x && h.y === move.y)) // Tarkista, ettei haamu liiku toisen haamun päälle) 
               { 
                 return move;
               }
            }
            // Jos kaikki pelaajaan päin suunnat ovat esteitä, pysy paikallaan
            return { x: this.x, y: this.y };
          }  
    }

    function moveGhosts() {
            // Säilytä haamujen vanhat paikat
            const oldGhosts = ghosts.map(ghost => ({ x: ghost.x, y: ghost.y }));
          
            ghosts.forEach(ghost => {
            
            const newPosition = ghost.moveGhostTowardsPlayer(player, board, oldGhosts);
          
            ghost.x = newPosition.x;
            ghost.y = newPosition.y;
          
            // Päivitä haamun uusi sijainti pelilaudalle
            setCell(board, ghost.x, ghost.y, 'H');

            // Check if ghost touches the player
            if (ghost.x === player.x && ghost.y === player.y) {
                endGame() // End the game
                return;
                    }

            });

            
          
            // Tyhjennä haamujen vanhat paikat pelilaudalta
            oldGhosts.forEach(ghost => {
            board[ghost.y][ghost.x] = ' '; // Poista vanha haamun sijainti
            });

            // Update the board with new ghost positions
            ghosts.forEach(ghost => {
            board[ghost.y][ghost.x] = 'H';
                });
          
            // Piirrä lauta uudelleen
            drawBoard(board);
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
        updateScoreBoard(50);
    }
    //console.log(ghosts); 
    
    setCell(board, x, y, 'B');
    
    drawBoard(board);
    
     if (ghosts.length === 0){
        startNextLevel();
        } 
    }

function endGame() {
    isGameRunning = false; // Set the game as game over
    clearInterval(ghostInterval);
    alert('Game Over! The ghost caught you!');
    // Show intro-view ja hide game-view
    
    document.getElementById('intro-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
    
    }

function startNextLevel() {
    alert('Level Up! Haamujen nopeus kasvaa.');
    
    // Generoi uusi pelikenttä
    board = generateRandomBoard();
    drawBoard(board);
    
    ghostSpeed = ghostSpeed*0.9;
    
    // Pysäytä vanha intervalli ja käynnistä uusi nopeammin
    clearInterval(ghostInterval);
    
    //Haamut alkavat liikkumaan sekunnin päästä startin painamisesta
    setTimeout(() => {
    //Laitetaan haamut liikkumaan sekunnin välein
    ghostInterval = setInterval(moveGhosts, ghostSpeed)
    }, 1000);
    
    }