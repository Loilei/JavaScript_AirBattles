
const canvas = document.getElementById('ufoCanvas')
canvas.width = 1150;
canvas.height = 700;

const ctx = canvas.getContext('2d');


// ctx.fillStyle = 'green';
// ctx.fillRect(0,0,150,75);

// ctx.font = '38 px Arial';
// ctx.fillStyle = 'red';
// ctx.fillText("UFO",30,130);
// ctx.strokeText("Hunter", 120,120);

// aircraftImage = new Image();
// aircraftImage.src = "images/aircraft.png";

// aircraftImage.onload = function() {
//     return ctx.drawImage(aircraftImage, 0, 0);
// };

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
        right: 1050
    };

    this.setting = {
        //FPS :
        updateSeconds: (1/60),

    }

    this.settings = {

        //game settings
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
    };
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
    setInterval(function() {gameLoop(play);}, this.setting.updateSeconds * 1000);
    (method) GameBasics.goToPosition(position: any): void
    this.goToPosition(new OpeningPosition());

    // let num = 1;
    //
    // function exampleFunction(){
    //     ctx.clearRect(0,0,play.width, play.height);
    //     ctx.font = "90px Arial";
    //     ctx.fillStyle = "#999999";
    //     ctx.fillText(num, 1100/2,300);
    //     num++;
    //
    // }

};

const play = new GameBasics(canvas);
play.start();

function gameLoop(play) {

    let presentPosition = play.presentPosition;

    if(presentPosition) {
        //update
        if(presentPosition.update) {
            presentPosition.update(play);

        };
        if(presentPosition.draw){
            presentPosition.draw(play);
        };
        //draw
    };
}