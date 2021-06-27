// --- positionInGame --- //

function InGamePosition(setting, level) {
    this.setting = setting;
    this.level = level;
    this.object = null;
    this.spaceship = null;
}

InGamePosition.prototype.entry = function (play) {
    this.spaceship_image = new Image(); 
    this.upSec = this.setting.updateSeconds;
    this.spaceshipSpeed = this.setting.spaceshipSpeed;

    this.object = new Objects();
    this.spaceship = this.object.spaceship((play.width / 2), play.playBoundaries.bottom, this.spaceship_image);
}

InGamePosition.prototype.update = function (play) {
    if (play.pressedKeys[37]) {
        this.spaceship.x -= this.spaceshipSpeed * this.upSec;
    }
    if (play.pressedKeys[39]) {
        this.spaceship.x += this.spaceshipSpeed * this.upSec;
    }
}

InGamePosition.prototype.draw = function (play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.drawImage(this.spaceship_image, this.spaceship.x - (this.spaceship.width / 2), this.spaceship.y - (this.spaceship.height / 2));
}

InGamePosition.prototype.keyDown = function (play, keyboardCode) {

}





