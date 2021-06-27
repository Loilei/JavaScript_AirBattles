const canvas = document.getElementById('ufoCanvas');
canvas.width = 900;
canvas.height = 750;

function resize(){
    const height = window.innerHeight - 20;
    const ratio = canvas.width / canvas.height;
    const width = height * ratio;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
};

window.addEventListener('load',resize,false);

function gameBasics(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;

    this.playBoundaries = {
        top: 150,
        bottom: 650,
        left: 100,
        right: 800
    };

    this.setting = {
        // TODO game settings
    }

    this.positionContainer = [];
};

gameBasics.prototype.presentPosition = function () {
    return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null;
};

gameBasics.prototype.goToPosition = function (position) {
    if (this.presentPosition()) {
        this.positionContainer.length = 0;
    }

    if (position.entry) {
        position.entry(play);
    }

    this.positionContainer.push(position);
};

gameBasics.prototype.pushPosition = function (position) {
    this.positionContainer.push(position);
};

gameBasics.prototype.popPosition = function (position) {
    this.positionContainer.pop();
};