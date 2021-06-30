// Canvas drawing
const canvas = document.getElementById('gameCanvas');
canvas.width = 960;
canvas.height = 720;
const ctx = canvas.getContext('2d');

// Canvas automatic resizing
function resize() {
  const height = window.innerHeight - 20;

  const ratio = canvas.width / canvas.height;
  const width = height * ratio;

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
}


window.addEventListener('load', resize, false);


function GameBasics(canvas) {

  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;

  this.playBoundaries = {
    top: 150,
    bottom: 650,
    left: 100,
    right: 800
  };

  this.level = 1;
  this.score = 0;
  this.extraLives = 2;

  this.settings = {  
    fps: (1 / 144),
    playerSpeed: 200,

    bulletSpeed: 130,
    bulletMaxFrequency: 500,
 	
    enemyLines: 4,                                           	
    enemyColumns: 8,                                      	 
    enemySpeed: 35,
    enemyDecreaseRate: 30,
    
    bombSpeed: 75,
    bombFrequency: 0.05,
    
    pointsPerEnemy: 1,
  };

  this.gameState = [];
  this.pressedKeys = {};
}


GameBasics.prototype.currentGameState = function () {
  return this.gameState.length > 0 ? this.gameState[this.gameState.length - 1] : null;
};


GameBasics.prototype.changeScreen = function (position) {
  // If we're already in a position clear the gameState.
  if (this.currentGameState()) {
    this.gameState.length = 0;
  }
  // If we find an 'entry' in a given position, we call it. 
  if (position.entry) {
    position.entry(play);
  }
  // Setting the current game position in the gameState
  this.gameState.push(position);
};


GameBasics.prototype.pushPosition = function (position) {
  this.gameState.push(position);
};


GameBasics.prototype.popPosition = function () {
  this.gameState.pop();
};


GameBasics.prototype.start = function () {
  setInterval(function () { gameLoop(play); }, this.settings.fps * 1000);
  this.changeScreen(new mainMenu());
};


GameBasics.prototype.keyDown = function (keyboardCode) {
  this.pressedKeys[keyboardCode] = true;
  // ???
  if (this.currentGameState() && this.currentGameState().keyDown) {
    this.currentGameState().keyDown(this, keyboardCode);
  }
};


GameBasics.prototype.keyUp = function (keyboardCode) {
  delete this.pressedKeys[keyboardCode];
};


function gameLoop(play) {
  let currentGameState = play.currentGameState();

  if (currentGameState) {
    if (currentGameState.update) {
      currentGameState.update(play);
    }
    if (currentGameState.draw) {
      currentGameState.draw(play);
    }
  }
}



window.addEventListener("keydown", function (e) {
  const keyboardCode = e.which || event.keyCode;
  if (keyboardCode == 37 || keyboardCode == 39 || keyboardCode == 32) { e.preventDefault(); } //space/left/right (32/37/29)
  play.keyDown(keyboardCode);
});


window.addEventListener("keyup", function (e) {
  const keyboardCode = e.which || event.keyCode;
  play.keyUp(keyboardCode);
});


// Create a GameBasics object
const play = new GameBasics(canvas);
play.sounds = new Sounds(); 
play.sounds.init();
play.start();
