/*
Flood It! game created with p5.js
– created by Clayton Chew, me@claytonchew.com, 2020
*/


// game properties
var table;
var colours;
var max_turns;

// game state
var game_config;
var game_types;
var selected_colours;
var turn;
var outOfTurns;
var isWon;

// button positions & size
var restartButton;
var switchGame_24x24;
var switchGame_12x12;
var switchGame_6x6;
var switchGame_6c;
var switchGame_3c;

var messages;

function setup() {

    createCanvas(900, 620);

    table = {
        x: 360,         // x position of the table
        y: 50,          // y position of the table
        max_width: 480, // maximum width of the table
        grid_size: 0,   // number of rows and columns of the table
        cell_size: 0,   // size of table cell
        data: []
    }

    colours = [
        "red",
        "green",
        "blue",
        "yellow",
        "purple",
        "orange"
    ];

    game_types = {
        type_24x24: {
            grid_size: 24
        },
        type_16x16: {
            grid_size: 16
        },
        type_8x8: {
            grid_size: 8
        },
        type_6c: {
            colours: 6
        },
        type_3c: {
            colours: 3
        }
    }

    // game configurations
    game_config = {
        grid_size: 16,
        colours: colours.length
    }

    // initialise buttons position
    restartButton = {
        x: table.x - 330,
        y: table.y + 430,
        width: 300,
        height: 60,
        text: "RESTART"
    }
    switchGame_24x24 = {
        x: 30,
        y: 250,
        width: 93,
        height: 60,
        text: "24x24"
    }
    switchGame_16x16 = {
        x: 133,
        y: 250,
        width: 93,
        height: 60,
        text: "16x16"
    }
    switchGame_8x8 = {
        x: 236,
        y: 250,
        width: 93,
        height: 60,
        text: "8x8"
    }
    switchGame_6c = {
        x: 30,
        y: 320,
        width: 145,
        height: 60,
        text: "6 Colours"
    }
    switchGame_3c = {
        x: 184,
        y: 320,
        width: 145,
        height: 60,
        text: "3 Colours"
    }

    messages = {
        desc: "Fill the board with a single colour.",
        instruction: "Click color tile to start filling. Filling always starts in the left top corner of the game board.",
        about: "This is a JavaScript version of the game, made with p5js.",
        algorithm: "Recursive Flood Fill",
        copyright: "Created by Clayton Chew"
    }

    newGameStates(game_config.grid_size, game_config.colours);
    populateTable();
}

function draw() {

    // reset p5 attributes
    noStroke();
    background(240);

    // texts
    drawTitle(30, 87);
    push();
    textFont("Arial");
    fill(120);

    textStyle(BOLD);
    textSize(18);
    text(messages.desc, 30, 135);

    textStyle(NORMAL);
    textSize(14);
    text(messages.instruction, 30, 165, 300);

    textSize(14);
    textStyle(BOLD);
    text("Algorithm: ", 30, 215, 300);
    textStyle(NORMAL);
    text(messages.algorithm, 104, 215, 300);

    textSize(14);
    textAlign(CENTER);
    textStyle(NORMAL);
    text(messages.about, 600, 573);
    textStyle(BOLD);
    text(messages.copyright, 600, 595);
    pop();

    // game renders
    drawTable(table.x, table.y);
    drawTurns(table.x - 110, table.y - 10);

    // display switch buttons
    drawSwitchGame_24x24(switchGame_24x24.x, switchGame_24x24.y);
    drawSwitchGame_16x16(switchGame_16x16.x, switchGame_16x16.y);
    drawSwitchGame_8x8(switchGame_8x8.x, switchGame_8x8.y);
    drawSwitchGame_6c(switchGame_6c.x, switchGame_6c.y);
    drawSwitchGame_3c(switchGame_3c.x, switchGame_3c.y);

    // display restart button if outOfTurns or isWon
    if (outOfTurns || isWon) {
        drawRestartButton(restartButton.x, restartButton.y);
    }

    // state checker
    checkOutOfTurns();
    checkIfWon();

}

function mousePressed() {

    play();
    restartGame();
    switchGameType();

}

// ----------------------------------
// Main game logic functions
// ----------------------------------

// Play logic

function play() {
    // Allow gameplay if not outOfTurns.
    if (!outOfTurns) {
        for (row = 0; row < table.data.length; row++) {
            for (col = 0; col < table.data[row].length; col++) {

                if (table.x + row * table.cell_size <= mouseX &&
                    mouseX < table.x + table.cell_size + row * table.cell_size &&
                    table.y + col * table.cell_size <= mouseY &&
                    mouseY < table.y + table.cell_size + col * table.cell_size) {

                    // register the selected cell
                    var selected_cell = {
                        row: row,
                        col: col
                    }

                    // increment turn if target_colour is not equal to replacement_colour
                    if (table.data[0][0].colour != table.data[selected_cell.row][selected_cell.col].colour) {
                        turn += 1;
                    }

                    // apply the flood algorithm
                    flood(0, 0, table.data[0][0].colour, table.data[selected_cell.row][selected_cell.col].colour);
                }
            }
        }
    }
}

// Flood function based on recursive flood fill algorithm

function flood(cell_row, cell_col, target_colour, replacement_colour) {
    /* This is a recursive flood fill 
    algorithm */
    if (cell_row >= table.grid_size || cell_col >= table.grid_size || cell_row < 0 || cell_col < 0) {
        return
    } else if (target_colour == replacement_colour) {
        return
    } else if (table.data[cell_row][cell_col].colour != target_colour) {
        return
    } else {
        table.data[cell_row][cell_col].colour = replacement_colour;
    }
    flood(cell_row + 1, cell_col, target_colour, replacement_colour);
    flood(cell_row, cell_col + 1, target_colour, replacement_colour);
    flood(cell_row - 1, cell_col, target_colour, replacement_colour);
    flood(cell_row, cell_col - 1, target_colour, replacement_colour);
}

// Restart Game function

function restartGame() {

    if (outOfTurns || isWon) {
        if (restartButton.x <= mouseX &&
            mouseX <= restartButton.x + restartButton.width &&
            restartButton.y <= mouseY &&
            mouseY <= restartButton.y + restartButton.height) {
            newGameStates(game_config.grid_size, game_config.colours);
            populateTable();
        }
    }
}

// Switch Game Type function

function switchGameType() {
    if (switchGame_24x24.x <= mouseX &&
        mouseX <= switchGame_24x24.x + switchGame_24x24.width &&
        switchGame_24x24.y <= mouseY &&
        mouseY <= switchGame_24x24.y + switchGame_24x24.height) {
        initialiseNewGameType(game_types.type_24x24.grid_size, game_config.colours);
    }
    if (switchGame_16x16.x <= mouseX &&
        mouseX <= switchGame_16x16.x + switchGame_16x16.width &&
        switchGame_16x16.y <= mouseY &&
        mouseY <= switchGame_16x16.y + switchGame_16x16.height) {
        initialiseNewGameType(game_types.type_16x16.grid_size, game_config.colours);
    }
    if (switchGame_8x8.x <= mouseX &&
        mouseX <= switchGame_8x8.x + switchGame_8x8.width &&
        switchGame_8x8.y <= mouseY &&
        mouseY <= switchGame_8x8.y + switchGame_8x8.height) {
        initialiseNewGameType(game_types.type_8x8.grid_size, game_config.colours);
    }
    if (switchGame_6c.x <= mouseX &&
        mouseX <= switchGame_6c.x + switchGame_6c.width &&
        switchGame_6c.y <= mouseY &&
        mouseY <= switchGame_6c.y + switchGame_6c.height) {
        initialiseNewGameType(game_config.grid_size, game_types.type_6c.colours);
    }
    if (switchGame_3c.x <= mouseX &&
        mouseX <= switchGame_3c.x + switchGame_3c.width &&
        switchGame_3c.y <= mouseY &&
        mouseY <= switchGame_3c.y + switchGame_3c.height) {
        initialiseNewGameType(game_config.grid_size, game_types.type_3c.colours);
    }
}

// Check if play is out of turns

function checkOutOfTurns() {
    if (max_turns - turn == 0) {
        outOfTurns = true;
    }
}

// Check if play has won

function checkIfWon() {
    var current_colour = table.data[0][0].colour;

    var checkState = true;

    for (row = 0; row < table.data.length; row++) {
        for (col = 0; col < table.data[row].length; col++) {
            if (table.data[row][col].colour != current_colour) {
                checkState = false;
            }
        }
    }

    isWon = checkState;
}

// ----------------------------------
// Game state initialiser
// ----------------------------------

// Function to initialise a new game states

function newGameStates(grid_size_of_table, no_of_colours) {
    /* This functions initialises a new game
    state. */
    table.grid_size = grid_size_of_table;
    table.cell_size = table.max_width / table.grid_size

    selected_colours = colours.slice(0, no_of_colours);

    max_turns = grid_size_of_table * 2 * no_of_colours / 6;
    turn = 0;

    outOfTurns = false;
    isWon = false;
}

// Populate table data

function populateTable() {
    /* This functions creates a new table and 
    populates them in table.data. */
    table.data = [];

    for (row = 0; row < table.grid_size; row++) {
        table.data.push(row);
        table.data[row] = [];
        for (col = 0; col < table.grid_size; col++) {
            table.data[row].push(col);
            table.data[row][col] = {
                colour: choose(selected_colours)
            };
        }
    }
}

// Initialise New Game Type

function initialiseNewGameType(grid_size_of_table, no_of_colours) {
    game_config.grid_size = grid_size_of_table;
    game_config.colours = no_of_colours;

    newGameStates(game_config.grid_size, game_config.colours);
    populateTable();
}

// ----------------------------------
// Game render functions
// ----------------------------------

// Function to draw the table.

function drawTable(x, y) {
    // draw table border
    push();
    translate(x - 10, y - 10);
    fill(200);
    rect(0, 0, table.max_width + 20, table.max_width + 20, 5);
    pop();

    // draw table
    push();
    translate(x, y);
    for (row = 0; row < table.data.length; row++) {
        for (col = 0; col < table.data[row].length; col++) {
            fill(table.data[row][col].colour);
            rect(row * table.cell_size, col * table.cell_size, table.cell_size, table.cell_size);
        }
    }
    pop();
}

// Function to draw Title

function drawTitle(x, y) {
    var title = "Flood It!";

    push();
    translate(x, y);
    textFont("Arial");
    textStyle(BOLD);
    textSize(48);
    fill(130);
    text(title, 0, 0);
    pop();
}

// Function to draw turns / max turns

function drawTurns(x, y) {
    var turn_title = "TURNS";
    var turn_counter = turn + "/" + max_turns;

    push();
    translate(x, y);
    textAlign(CENTER);
    textFont("Arial");
    textStyle(BOLD);
    fill(200);
    rect(0, 0, 80, 60, 4);
    fill(120);
    textSize(16);
    text(turn_title, 39, 24);
    if (isWon) {
        fill(0, 180, 100);
    } else if (outOfTurns) {
        fill(255, 0, 0);
    } else {
        fill(255);
    }
    textSize(18);
    text(turn_counter, 39, 25 + 22);
    pop();
}

// Function to draw switch buttons
function drawSwitchGame_24x24(x, y) {
    var button_text = switchGame_24x24.text;

    push();
    translate(x, y);
    fill(200);
    rect(0, 0, switchGame_24x24.width, switchGame_24x24.height, 5);
    textFont("Arial");
    textAlign("CENTER", "BASELINE");
    textStyle(BOLD);
    textSize(24);
    fill(255);
    text(button_text, switchGame_24x24.width / 2 - 32, switchGame_24x24.height / 2 + 8);
    pop();
}
function drawSwitchGame_16x16(x, y) {
    var button_text = switchGame_16x16.text;

    push();
    translate(x, y);
    fill(200);
    rect(0, 0, switchGame_16x16.width, switchGame_16x16.height, 5);
    textFont("Arial");
    textAlign("CENTER", "BASELINE");
    textStyle(BOLD);
    textSize(24);
    fill(255);
    text(button_text, switchGame_16x16.width / 2 - 32, switchGame_16x16.height / 2 + 8);
    pop();
}
function drawSwitchGame_8x8(x, y) {
    var button_text = switchGame_8x8.text;

    push();
    translate(x, y);
    fill(200);
    rect(0, 0, switchGame_8x8.width, switchGame_8x8.height, 5);
    textFont("Arial");
    textAlign("CENTER", "BASELINE");
    textStyle(BOLD);
    textSize(24);
    fill(255);
    text(button_text, switchGame_8x8.width / 2 - 20, switchGame_8x8.height / 2 + 8);
    pop();
}
function drawSwitchGame_6c(x, y) {
    var button_text = switchGame_6c.text;

    push();
    translate(x, y);
    fill(200);
    rect(0, 0, switchGame_6c.width, switchGame_6c.height, 5);
    textFont("Arial");
    textAlign("CENTER", "BASELINE");
    textStyle(BOLD);
    textSize(24);
    fill(255);
    text(button_text, switchGame_6c.width / 2 - 54, switchGame_6c.height / 2 + 8);
    pop();
}
function drawSwitchGame_3c(x, y) {
    var button_text = switchGame_3c.text;

    push();
    translate(x, y);
    fill(200);
    rect(0, 0, switchGame_3c.width, switchGame_3c.height, 5);
    textFont("Arial");
    textAlign("CENTER", "BASELINE");
    textStyle(BOLD);
    textSize(24);
    fill(255);
    text(button_text, switchGame_3c.width / 2 - 54, switchGame_3c.height / 2 + 8);
    pop();
}

// Function to draw 'restart' button

function drawRestartButton(x, y) {
    var button_text = restartButton.text;

    push();
    translate(x, y);
    fill(100, 50, 200);
    rect(0, 0, restartButton.width, restartButton.height, 7);
    textFont("Arial");
    textStyle(BOLD);
    textSize(24);
    fill(255, 255, 255, 220);
    text(button_text, 92, 38);
    pop();
}

// ----------------------------------
// Other helper functions
// ----------------------------------

// Select random items in an array.

function choose(choices) {
    /* This is a helper function to randomly 
    choose an item from an array of choices. */
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}