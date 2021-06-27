
const canvas = document.getElementById('ufoCanvas')
canvas.width = 900;
canvas.height = 750

function resize() {
    const height = window.innerHeight -20;
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
    //game settings
    this.setting = {
        updateSeconds: (1 / 60),
        
    }
    //collect the positions here
    this.positionContainer = [];

}

//current game position
GameBasics.prototype.presentPosition = function () {

    return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null
}

//move to desired position

GameBasics.prototype.goToPosition = function(position) {
    //If we're already in a position clear the positionContainer
    if (this.presentPosition()) {
        this.positionContainer.length = 0;

    }
    //if we infds an 'entry' in a given position, we call it
    if (position.entry) {
        position.entry(play);
    }
    //setting the current game position in the positionContainer
    this.positionContainer.push(position);

};

//push our new position into the positionContainer

GameBasics.prototype.pushPosition = function () {
    this.positionContainer.push(position);
};

//pop the position from the positionContainer

GameBasics.prototype.popPosition = function () {
this.positionContainer.pop();

};

GameBasics.prototype.start = function () {
    setInterval(function(){ gameLoop(play); }, this.setting.updateSeconds * 1000);
    this.goToPosition(new OpeningPosition()); 
    
};

const play = new GameBasics(canvas);

function gameLoop(play) {
    let presentPosition = play.presentPosition;

    if(presentPosition) {
        //update
        if(presentPosition.update) {
            presentPosition.update(play);
        }
        //draw
        if(presentPosition.draw) {
            presentPosition.draw(play);
        }
    }
}