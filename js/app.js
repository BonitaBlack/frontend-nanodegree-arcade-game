// Grid constants
var gridY = 83;
var gridX = 101;
var gridTop = 50;
var gridBottom = 20;
var maxMovUp = 0 * gridY + gridTop;
var maxMovDown = 5 * gridY - gridBottom;
var maxMovLeft = 0;
var maxMovRight = 4 * gridX;
// Player start constant
var beginX = gridX * 2;
var beginY = gridY * 5 - gridBottom;
// Enemy Speed Min Max constants
var minSpeed = 30;
var maxSpeed = 700;
// Enemy Spawn
var bugStart = 3;
// box Adjustment
var mvRight = 83;
var mvLeft = 18;
var mvTop = 81;
var mvBottom = 132;
// Bug Box Adjustment
var bugMvRight = 98;
var bugMvLeft = 3;
var bugMvTop= 81;
var bugMvBottom = 132;

var catGirl = 'images/char-cat-girl.png';


// Returns a random integer between min and max
function getRanNum(min, max)
{
  return Math.floor(Math.random() * (max - min)) + min;
}

// Returns a random number between min  and max
function getRanDigit(min, max)
{
  return Math.random() * (max - min) + min;
}

// Returns true if compared Characters collide
function collide(char1, char2)
{
        return !(char1.right < char2.left ||
                char1.left > char2.right ||
                char1.top > char2.bottom ||
                char1.bottom < char2.top);
}

// Character class to hold repeatable position definitions for both the bug and
//the player


var Character = function(x, y, img, plusX, minusX, plusY, minusY)
{
    this.x = x;
    this.y = y;
    this.plusX = plusX;
    this.minusX = minusX;
    this.plusY = plusY;
    this.minusY = minusY;
    this.sprite = img;
    this.right = this.x + this.plusX;
    this.left = this.x + this.minusX;
    this.top = this.y + this.plusY;
    this.bottom = this.y + this.minusY;
};
Character.prototype.render = function()
{
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Character.prototype.updateBox = function()
{
    this.right = this.x + this.plusX;
    this.left = this.x + this.minusX;
    this.top = this.y + this.plusY;
    this.bottom = this.y + this.minusY;
};
// Enemy Class
var Enemy = function(x, y, plusX, minusX, plusY, minusY)
{
    Character.call(this, x, y, 'images/enemy-bug.png', plusX, minusX, plusY, minusY);
    // Determines a random speed for the bugs
    this.speed = getRanDigit(minSpeed, maxSpeed);
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(dt)
{
  // Bug come back!  After moving off of the screen on right.
    if(this.x > gridX * 5) {
        this.x = gridX * -1;
        this.y = gridY * getRanNum(1, 4) - gridBottom;
        this.speed = getRanDigit(minSpeed, maxSpeed);
    }
    this.x = this.x + this.speed * dt;
};

// Player Class

var Player = function(x, y, plusX, minusX, plusY, minusY)
{
    Character.call(this, x, y, 'images/char-cat-girl.png', plusX, minusX, plusY, minusY);
    this.alive = true;
    this.score = 0;
    this.highScore = 0;
    this.lives = 3;
};
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
Player.prototype.handleInput = function(keyCode)
{
    if(keyCode == "up" && this.y > maxMovUp) this.y = this.y - gridY;
    else if(keyCode == "down" &&  this.y < maxMovDown) this.y = this.y + gridY;
    else if(keyCode == "left" && this.x > maxMovLeft) this.x = this.x - gridX;
    else if(keyCode == "right" && this.x < maxMovRight) this.x = this.x + gridX;
};
Player.prototype.update = function()
{
    // Is it a WIN?
    if(this.y <= 0 * gridY + gridTop)
    {
        this.x = beginX;
        this.y = beginY;
        this.sprite = catGirl;
        this.score = this.score + 1;
    }

    // Are you alive?
    if(this.alive === false)
    {
        this.x = beginX;
        this.y = beginY;
        this.sprite = catGirl;
        this.alive = true;
        this.lives = this.lives - 1;
        if(this.lives === 0)
        {
            this.score = 0;
            this.lives = 3;
        }
    }
};
Player.prototype.renderStatus = function()
{
    ctx.clearRect(0, 20 , 505 , 25);
    // Draw scores on the top left
    ctx.fillText("Score: " + this.score, 0, 40);
    // Draw lives on the top right
    ctx.fillText("Lives: " + this.lives, 404, 40);
    // High score during gaming session
    if(this.score > this.highScore) this.highScore = this.score;
    ctx.fillText("High Score: " + this.highScore, 202, 40);
};

Player.prototype.checkCollisions = function(allEnemies)
{

    var girl = this;
    allEnemies.forEach(function(enemy)
    {
        if(collide(enemy, girl))
        {
           girl.alive = false;
        }
    });
};
// Instantiate Objects


// Instantiate Player Object
var player = new Player(beginX, beginY, mvRight, mvLeft, mvTop, mvBottom);

// Enemy  array
var allEnemies = [];
for (var i = 0; i < bugStart; i++)
    allEnemies.push(new Enemy(gridX * -1, gridY * getRanNum(1, 4) - gridBottom, bugMvRight, bugMvLeft, bugMvTop, bugMvBottom));


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e)
{
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
