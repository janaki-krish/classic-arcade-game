/** @file Classic arcade game for Udacity FEND
    @author Janaki K
*/

// Place all enemy objects in an array called allEnemies
var allEnemies = [];

//constants
var constants = {
    //Default canvas text font family
    FONT: '34pt Press-Start-2P' , //'24pt ArcadeClassic',
    //Default text color on canvas
    FONT_COLOR: 'white',
    //tile height
    TILE_HEIGHT: 50,
    //tile width
    TILE_WIDTH: 50,
    //enemy minimum speed
    ENEMY_MIN_SPEED: 50,
    //enemy maximum speed
    ENEMY_MAX_SPEED: 400,
    //Player's start x position
    PLAYER_X_POSITION: 300,
    //Player's start y position
    PLAYER_Y_POSITION: 470,
    //player speed
    PLAYER_SPEED: 50,
    //canvas left edge
    CANVAS_LEFT: 0,
    //canvas right edge
    CANVAS_RIGHT: 600,
    //canvas top
    CANVAS_TOP: 20,
    //canvas_bottom
    CANVAS_BOTTOM: 470,
    //X position array
    POSITION_X: [0, 100, 200, 300, 400, 500, 600],
    //Y position array
    POSITION_Y: [160, 230, 310, 390]

};



$(document).ready(function() {
    gameMusic.play();
    gameMusic.volume(0.3);

    //hide the game over screen on Play click
    $("#playAgain").click(function() {
        $("#gameOver").hide();
        level.reset();
        gameMusic.fade(0.3, 0.1, 1000);
        paused = false;
    });
});

/*  Enemy class
 *  Accepts positionY and speed
 */

var Enemy = function(positionY, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = getRandomInt(-1000, -100);
    this.y = positionY;
    this.height = constants.TILE_HEIGHT;
    this.width = constants.TILE_WIDTH;
    this.speed = speed;
};

/* Update the enemy's position on the canvas
 * multiply speed by dt to ensure game runs on same
 * speed on all computers
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    //if enemy position goes off the canvas, reset to a random
    //position on the canvas
    if (this.x > canvas.width)
        this.x = getRandomInt(-2000, -100);

};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Spawn enemies
var Enemies = function()
{
    this.enemiesArray = [];
};

/* Spawns enemies. This function takes as an argument
 * the number of enemies to spawn
*/
Enemies.prototype.spawn = function(num) {
    for (var i=0;i<num;i++)
    {
        var speed = getRandomInt(constants.ENEMY_MIN_SPEED, constants.ENEMY_MAX_SPEED);
        var pos = getRandomInt(0, 3);
        this.enemiesArray[allEnemies.length] = new Enemy(constants.POSITION_Y[pos], speed);
        allEnemies.push(this.enemiesArray[allEnemies.length]);
    }
};

/* Reset the enemies
*/
Enemies.prototype.reset = function() {
    var enemycount = allEnemies.length;
    allEnemies.splice(0, allEnemies.length);
};

var enemies = new Enemies();


/*
 * The player class handles all the behaviors/properties of the player
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = constants.PLAYER_X_POSITION;
    this.y = constants.PLAYER_Y_POSITION;
    this.height = constants.TILE_HEIGHT;
    this.width = constants.TILE_WIDTH;
    this.lives = 3;
};

/*
 * Update method retains the x and y positions of the player
 * These properties are used to check if the player moves out of the canvas
*/
Player.prototype.update = function() {
    this.xNow = this.x;
    this.yNow = this.y;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.reset = function() {
    this.x = constants.PLAYER_X_POSITION;
    this.y = constants.PLAYER_Y_POSITION;
    this.lives = 3;
}

/*
 * This method handles the keyboard inputs - up, down, right, left arrows
 * Moves the player accordingly adding/subtracting the player speed
*/
Player.prototype.handleInput = function(keycode) {
    if ((keycode == 'left') && (this.x != constants.CANVAS_LEFT))
        this.x = this.xNow + -constants.PLAYER_SPEED;
    if ((keycode == 'right') && (this.x <= constants.CANVAS_RIGHT))
        this.x = this.xNow + constants.PLAYER_SPEED;
    if ((keycode == 'up') && (this.y != constants.CANVAS_TOP))
        this.y = this.yNow + -constants.PLAYER_SPEED;
    if ((keycode == 'down') && (this.y != constants.CANVAS_BOTTOM))
        this.y = this.yNow + constants.PLAYER_SPEED;
};

/*
 * When there is a collision, reset the player to default x,y positions
 * with a small effect
*/
Player.prototype.hit = function()
{
    this.x = constants.PLAYER_X_POSITION;
    this.y = constants.PLAYER_Y_POSITION;
    $("#collision").show().fadeOut();
};


Player.prototype.crossed = function() {
    gameMusic.fade(0.3, 0.7, 2000);
    gameSelect.play();
    $('#success').show().fadeOut();

};

/*
 * Update player lives
 * Parameter value indicates the number of lives to add/remove
 * Action indicates whether to add or remove
 */

Player.prototype.updateLives = function(action, value) {
    if (action === 'add')
        this.lives += value;
    if (action === 'remove')
        this.lives -= value;
    stats.updateLives(this.lives);
};

var player = new Player();

/*
 *  Level class - Handles the game reset and update
*/

var Level = function() {
    this.level = 1;
    enemies.spawn(4);
};

/*
 *  Level Reset code shall be invoked if all the 3 lives are used up
 *  or the Play again button is pressed
*/
Level.prototype.reset = function(i=0) {
    if (i != 0)
    {
        gameOver.play();
        gameMusic.fade(1.0, 0.3, 1000);
        paused = true;
        $("#gameOver").show();
    }
    else
    {
        this.level = 1;
        enemies.reset();
        player.reset();
        stats.reset();
        enemies.spawn(3);
    }

};

Level.prototype.update = function() {
        player.reset();
};

var level = new Level();

/*
 * Status panel - Panel at the top of the canvas
 * Handles the display of score/lives of the player
*/

var Stats = function()
{
    this.font = constants.FONT;
    this.fontColor = constants.FONT_COLOR;
    this.currentLevel = level.level;
    this.currentLives = player.lives;
    this.currentScore = 0;
}

Stats.prototype.render = function() {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 50, 707, 45);
    this.lives();
};

Stats.prototype.lives = function() {
    ctx.drawImage(Resources.get('images/stat-heart.png'), 500, 2);
    ctx.font = this.font;
    ctx.fillStyle = this.fontColor;
    ctx.textAlign = 'center';
    ctx.fillText(this.currentLives, 650, 90);

};

Stats.prototype.updateLives = function(lives) {
        this.currentLives = lives;
        this.render();
};

Stats.prototype.reset = function() {
    this.currentLives = player.lives;
}
var stats = new Stats();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//const canvaswidth = window.ctx.width;
//const canvasheight = window.ctx.height;
