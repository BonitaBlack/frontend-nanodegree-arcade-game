//grid taken fromhttp://blog.sklambert.com/html5-canvas-game-2d-collision-detection#d-collision-detection
var gridY = 83;
var gridX = 101;
var gridTop = 20;
var gridBottom = 20;
// box Adjustment
var boxRight = 83;
var boxLeft = 18;
var boxTop = 81;
var boxBottom = 132;
// Enemy box
var enemyRight = 98;
var enemyLeft = 3;
var enemyTop = 81;
var enemyBottom = 132;

//check if objects touching
function intersect(enemy, player)
{
        return !(enemy.right < player.left ||
                enemy.left > player.right ||
                enemy.top > player.bottom ||
                enemy.bottom < player.top);
}

// Enemies our player must avoid
var Enemy = function(x, y, speeds, boxRight, boxLeft, boxTop, boxBottom)
{
  this.x = x;
  this.y = y;
  this.boxRight = boxRight;
  this.boxLeft = boxLeft;
  this.boxTop = boxTop;
  this.boxBottom= boxBottom;
  this.speeds = speeds;
  this.right = this.x + this.boxRight;
  this.left = this.x + this.boxLeft;
  this.top = this.y + this.boxTop;
  this.bottom = this.y + this.boxBottom;
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt)
{
  this.x +=this.speeds *dt;
    // You should multiply any movement by the dt parameter
    //when the bug gets to end.... it needs to be reset()
    this.right = this.x + this.boxRight;
    this.left = this.x + this.boxLeft;
    this.top = this.y + this.boxTop;
    this.bottom = this.y + this.boxBottom;
    if (this.x > 505)
    {
      this.reset();
    }

    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function()
{
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// reset the bug at the start
Enemy.prototype.reset = function()
{
  this.x = -200;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Beggining coordinates for player
var beginX = 200;
var beginY = 400;

var Player = function(x, y, boxRight, boxLeft, boxTop, boxBottom)
{
  this.x = beginX;
  this.y = beginY;
  this.sprite = 'images/char-cat-girl.png';
  this.alive = true;
  this.score = 0;
  this.highScore = 0;
  this.lives = 3;
  this.boxRight = boxRight;
  this.boxLeft = boxLeft;
  this.boxTop = boxTop;
  this.boxBottom= boxBottom;
  this.right = this.x + this.boxRight;
  this.left = this.x + this.boxLeft;
  this.top = this.y + this.boxTop;
  this.bottom = this.y + this.boxBottom;
};

//create the ends of places where the player can go and can't go

Player.prototype.update = function()
{
  if(this.y <= 0 * gridY + gridTop)
  {
    this.x = beginX;
    this.y = beginY;
    this.score = this.score + 1;
  }
  if (this.x < 0)
  {
    this.x=0;
  }
  else if (this.x > 400)
  {
    this.x = 400;
  }
  else if (this.y > 400)
  {
    this.y = 400;
  }

 if(this.alive === false)
    {
    player.reset();
       this.alive = true;
       this.lives = this.lives - 1;
     }
};

//reset function to start over

Player.prototype.reset = function()
{
  this.x = beginX;
  this.y = beginY;
};

Player.prototype.render = function()
{
  ctx.clearRect(0, 20, 505, 25);
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  ctx.fillText("Score: " + this.score, 0, 40);
    // Draw lives on the top right
    ctx.fillText("Lives: " + this.lives, 404, 40);
    // High score during gaming session
    if(this.score > this.highScore) this.highScore = this.score;
    ctx.fillText("High Score: " + this.highScore, 202, 40);
};

Player.prototype.checkCollisions= function(allEnemies)
{
  var self = this;
  allEnemies.forEach(function(enemy)
{
  if (intersect(enemy, self))
  {
    self.alive = false;
  }
})

};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];

for (var i = 0; i < 3; i++)
{
  var bugY = 65 + 80 *i;
  var bugX = Math.floor(Math.random()*30);
  var bugSpeeds = 50 + Math.floor(Math.random()*200);
  allEnemies.push(new Enemy(bugX, bugY, bugSpeeds));
}

var player = new Player(beginX, beginY, boxRight, boxLeft, boxTop, boxBottom);

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

Player.prototype.handleInput = function(key)
{
  switch (key)
  {
    case 'up':
    this.y -=90;
    break;

    case 'down':
    this.y += 90;
    break;

    case 'left':
    this.x -=100;
    break;

    case 'right':
    this.x +=100;
    break;

    default:
    break;
  }
};
//collision checkCollisions
