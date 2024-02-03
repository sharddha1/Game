//Get the grid and score container elemnts
const gridContainer = document.querySelector('.grid-container');
const scoreElement = document.getElementById('score');

//Intialize variables
let grid = [];
let score = 0;
let currentPlayer = 0;
const playerButton = document.getElementById('playerButton');
const playerOptions = document.getElementById('playerOptions');
var DPselectedPlayers = "";

//start game takes size of grid as input and sets scores of all players to zero and creates new grid
function startGame(selectedPlayers) {

    if (DPselectedPlayers != "") {
        selectedPlayers = DPselectedPlayers;
    }
    players = [];
    for (let i = 0; i < selectedPlayers; i++) {
        const player = {
            name: `Player ${i + 1}`,
            score: 0,
        };
        players.push(player);
    }
    console.log(players);
    gridSize = prompt('Enter grid size :');
    if (gridSize >=5 && gridSize<=10) {
        createGrid(gridSize);
    } else {
        alert('Invalid grid size!');
    }
    const removeFieldersButton = document.getElementById('disableField');
    removeFieldersButton.style.display = 'block';
}

playerButton.addEventListener('click', function () {
    // Clear any existing options
    playerOptions.innerHTML = '';

    // Create a select element for the dropdown menu
    const selectElement = document.createElement('select');
    selectElement.classList.add("button2");
    // Add options for number of players
    for (let i = 1; i <= 4; i++) {
        const optionElement = document.createElement('option');
        optionElement.value = i;
        optionElement.textContent = `${i} Player${i > 1 ? 's' : ''}`;
        selectElement.appendChild(optionElement);
    }

    // Add the select element to the playerOptions div
    playerOptions.appendChild(selectElement);
    // Listen for the change event on the select element
    selectElement.addEventListener('change', function () {
        DPselectedPlayers = parseInt(this.value); // Get the selected number of players as an integer
    });
});


// Function to create grid
function createGrid(size) {
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    grid = [];
    score = 0;
    scoreElement.textContent = ' ';

    //Create score elements for each player and append them to the score container
    for (let i = 0; i < players.length; i++) {
        const playerScoreElement = document.createElement('div');
        playerScoreElement.id = `player${i + 1}-score`;
        playerScoreElement.className = '${players[i].name}';
        playerScoreElement.textContent = `${players[i].name} Score: ${players[i].score}`;
        scoreElement.appendChild(playerScoreElement);
    }
    // Create the grid blocks
    for (let i = 0; i < size; i++) {
        grid[i] = [];
        for (let j = 0; j < size; j++) {
            const block = document.createElement('div');
            block.className = 'grid-block';
            block.id = i + '' + j;
            block.dataset.row = i;
            block.dataset.column = j;
            block.addEventListener('click', revealBlock);
            gridContainer.appendChild(block);
            grid[i][j] = { revealed: false, hasFielder: false, points: Math.floor(Math.random() * 4) + 1 };

        }
    }
    currentPlayer=0;
    assignPoints(size);
    placeFielders(size);
    placeRandomPowerUps(size);
}

//assign random points ranging from 1-6 to every grid
function assignPoints(size) {
    const points = [1, 2, 3, 4, 6]; // Points ranging from 1 to 6
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const randomIndex = Math.floor(Math.random() * points.length);
            grid[i][j].points = points[randomIndex];
        }
    }
}

//places 5 powerups in 5 random grids
function placeRandomPowerUps(size) {
    const totalPowerUps = 5;
    let count = 0;

    while (count < totalPowerUps) {
        const randomRow = Math.floor(Math.random() * size);
        const randomColumn = Math.floor(Math.random() * size);

        if (!grid[randomRow][randomColumn].hasRandomPowerUps && !grid[randomRow][randomColumn].hasFielder) {
            grid[randomRow][randomColumn].hasRandomPowerUps = true;
            count++;
        }
    }
}

//places 11 fielders in 11 random grids 
function placeFielders(size) {
    const totalFielders = 11;
    let count = 0;

    while (count < totalFielders) {
        const randomRow = Math.floor(Math.random() * size);
        const randomColumn = Math.floor(Math.random() * size);

        if (!grid[randomRow][randomColumn].hasFielder) {
            grid[randomRow][randomColumn].hasFielder = true;
            count++;
        }
    }
}
// Define the players array with names and scores
var players = [];

// Function to switch turns between players
function switchTurn() {
    currentPlayer = (currentPlayer + 1) % players.length;
    currentPlayerElement.textContent = `Current Player: ${players[currentPlayer].name}`;

    // Display scores of all players
    scoreElement.textContent = "Scores: ";
    for (let i = 0; i < players.length; i++) {
        scoreElement.textContent += `${players[i].name}: ${players[i].score} `;
    }
}

//three random background images for fielder when game is over
var backgroundImages = [
    'url("catch.jpg")',
    'url("catching.jpg")',
    'url("bowl.jpg")',
];

// Function to reveal a block when clicked
function revealBlock(event) {
    debugger;
    const row = parseInt(event.target.dataset.row);
    const column = parseInt(event.target.dataset.column);
    const block = event.target;

    if (!grid[row][column].revealed) {
        grid[row][column].revealed = true;
        //if block has fielder game is over
        if (grid[row][column].hasFielder) {
            const randomIndex = Math.floor(Math.random() * backgroundImages.length);
            block.style.backgroundImage = backgroundImages[randomIndex];
            gameOver();
        //else if block has powerup player gets another chance to play and popup box will come    
        } else if (grid[row][column].hasRandomPowerUps == true) {
            const points = grid[row][column].points;
            players[currentPlayer].score += points;
            block.style.backgroundImage = 'url("power.webp")';
            const popupContainer = document.getElementById('popup-container');
            const popupMessage = document.getElementById('popup-message');
            const popupButton = document.getElementById('popup-button');
            popupMessage.innerHTML = [`Congratulations! <br> You have won another chance!`]; // Set the popup message
            popupContainer.style.display = 'flex'; // Show the popup container

            popupButton.addEventListener('click', function () {
                popupContainer.style.display = 'none'; // Hide the popup container
            });

            for (let i = 0; i < players.length; i++) {
                const playerScoreElement = document.getElementById(`player${i + 1}-score`);
                playerScoreElement.textContent = `${players[i].name} Score: ${players[i].score}`;
            }

        //else increases score and displays points on block
        } else {
            const points = grid[row][column].points;
            players[currentPlayer].score += points;
            block.textContent = points;
            //background colour of block changes based on current player
            if (currentPlayer == 0) {
                block.style.backgroundColor = 'orange';
            }
            else if (currentPlayer == 1) {
                block.style.backgroundColor = 'yellow';
            }
            else if (currentPlayer == 2) {
                block.style.backgroundColor = 'blue';
            }
            else if (currentPlayer == 3) {
                block.style.backgroundColor = 'green';
            }
            //displays points won by player on block 
            for (let i = 0; i < players.length; i++) {
                const playerScoreElement = document.getElementById(`player${i + 1}-score`);
                playerScoreElement.textContent = `${players[i].name} Score: ${players[i].score}`;
            }
            switchTurn();
        }
    }
}

var gridSize = 0;

//shows positions of fielders for one second and can be used only once
function removeAllFielders() {
    debugger;
    var row1 = column1 = "";
    var randomIndex1 = "";
    for (var i = 0; i < parseInt(gridSize); i++) {
        row1 = parseInt(i);
        for (var j = 0; j < parseInt(gridSize); j++) {
            column1 = parseInt(j);
            gridId = row1 + '' + column1;
            if (grid[row1][column1].hasFielder) {
                randomIndex1 = Math.floor(Math.random() * backgroundImages.length);
                document.getElementById(gridId).style.backgroundImage = backgroundImages[randomIndex1];
            }
        }

    }
    players[currentPlayer].score -= 5;

    setTimeout(() => {
        for (var i = 0; i < parseInt(gridSize); i++) {
            row1 = parseInt(i);
            for (var j = 0; j < parseInt(gridSize); j++) {
                column1 = parseInt(j);
                gridId = row1 + '' + column1;
                if (grid[row1][column1].hasFielder) {
                    document.getElementById(gridId).style.backgroundImage = "";
                }
            }
        }
        document.getElementById('disableField').style.display = "none";
    }, 1000);
}

//displays scores of all players in popup box and game is over
function gameOver() {
    const popupContainer = document.getElementById('popup-container');
    const popupMessage = document.getElementById('popup-message');
    const popupButton = document.getElementById('popup-button');

    if (players.length == 1) {
        popupMessage.innerHTML = [`Game Over! Final Score of <br> player 1 is ${players[0].score}`];
    } else if (players.length == 2) {
        popupMessage.innerHTML = [`Game Over! Final Score of <br> player 1 is ${players[0].score} <br> player 2 is ${players[1].score}`];
    } else if (players.length == 3) {
        popupMessage.innerHTML = [`Game Over! Final Score of <br> player 1 is ${players[0].score} <br> player 2 is ${players[1].score} <br> player 3 is ${players[2].score}`];
    } else if (players.length == 4) {
        popupMessage.innerHTML = [`Game Over! Final Score of <br> player 1 is ${players[0].score} <br> player 2 is ${players[1].score} <br> player 3 is ${players[2].score} <br> player 4 is ${players[3].score}`];
    }
    popupContainer.style.display = 'flex'; // Show the popup container

    popupButton.addEventListener('click', function () {
        popupContainer.style.display = 'none'; // Hide the popup container
    });

}

