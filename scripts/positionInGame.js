// --- positionInGame --- //

function InGamePosition(setting, level) {
    this.setting = setting;
    this.level = level;
    this.object = null;
    this.spaceship = null;
    this.bullets = [];
    this.lastBulletTime = null;
    this.ufos = [];
}

InGamePosition.prototype.entry = function (play) {
    this.spaceship_image = new Image();
    this.ufo_image = new Image();
    this.upSec = this.setting.updateSeconds;
    this.turnAround = 1;

    // Values ​​that change with levels (1. UFO speed, 2. Bomb falling speed, 3. Bomb dropping frequency)
    let presentLevel = this.level;
    // 1. UFO speed
    this.ufoSpeed = this.setting.ufoSpeed + (presentLevel * 7); //Level1: 35 + (1*7) = 42, Level2: 42 + (2*7) = 49, ...

    // Creating Spaceship
    this.spaceshipSpeed = this.setting.spaceshipSpeed;
    this.object = new Objects();
    this.spaceship = this.object.spaceship((play.width / 2), play.playBoundaries.bottom, this.spaceship_image);

    // Creating UFOS
    const lines = this.setting.ufoLines;
    const columns = this.setting.ufoColumns;
    const ufosInitial = [];

    let line, column;
    for (line = 0; line < lines; line++) {
        for (column = 0; column < columns; column++) {
            this.object = new Objects();
            let x, y;
            x = (play.width / 2) + (column * 50) - ((columns - 1) * 25);
            y = (play.playBoundaries.top + 30) + (line * 30);
            ufosInitial.push(this.object.ufo(
                x,
                y,
                line,
                column,
                this.ufo_image
            ));
        }
    }
    this.ufos = ufosInitial;
}

InGamePosition.prototype.update = function (play) {
    const spaceship = this.spaceship;
    const spaceshipSpeed = this.spaceshipSpeed;
    const upSec = this.setting.updateSeconds;
    const bullets = this.bullets;

    // Keyboard events
    if (play.pressedKeys[37]) {
        spaceship.x -= spaceshipSpeed * upSec;
    }
    if (play.pressedKeys[39]) {
        spaceship.x += spaceshipSpeed * upSec;
    }
    if (play.pressedKeys[32]) {
        this.shoot();
    }

    // Keep spaceship in 'Active playing field'
    if (spaceship.x < play.playBoundaries.left) {
        spaceship.x = play.playBoundaries.left;
    }
    if (spaceship.x > play.playBoundaries.right) {
        spaceship.x = play.playBoundaries.right;
    }

    //  Moving bullets
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.y -= upSec * this.setting.bulletSpeed;
        // If our bullet flies out from the canvas, it will be cleared
        if (bullet.y < 0) {
            bullets.splice(i--, 1);
        }
    }

    // Movements of UFOS
    let reachedRight = false;
    let reachedLeft = false;

    for (let i = 0; i < this.ufos.length; i++) {
        let ufo = this.ufos[i];
        let fresh_x = ufo.x + this.ufoSpeed * upSec * this.turnAround;
        if (fresh_x > play.playBoundaries.right) {
            this.turnAround *= -1;
            reachedRight = true;
        }
        if (fresh_x < play.playBoundaries.left) {
            this.turnAround *= -1;
            reachedLeft = true;
        }
        if (!reachedRight == true && !reachedLeft == true) {
            ufo.x = fresh_x;
        }
    }
}

InGamePosition.prototype.draw = function (play) {
    // draw Spaceship
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.drawImage(this.spaceship_image, this.spaceship.x - (this.spaceship.width / 2), this.spaceship.y - (this.spaceship.height / 2));

    // draw Bullets 
    ctx.fillStyle = '#ff0000';
    for (let i = 0; i < this.bullets.length; i++) {
        let bullet = this.bullets[i];
        ctx.fillRect(bullet.x - 1, bullet.y - 6, 3, 6);
    }

    // draw UFOS     
    for (let i = 0; i < this.ufos.length; i++) {
        let ufo = this.ufos[i];
        ctx.drawImage(this.ufo_image, ufo.x - (ufo.width / 2), ufo.y - (ufo.height / 2));
    }
}

InGamePosition.prototype.shoot = function () {
    if (this.lastBulletTime === null || ((new Date()).getTime() - this.lastBulletTime) > (this.setting.bulletMaxFrequency)) {
        this.object = new Objects();
        this.bullets.push(this.object.bullet(this.spaceship.x, this.spaceship.y - this.spaceship.height / 2, this.setting.bulletSpeed));
        this.lastBulletTime = (new Date()).getTime();
    }
};

InGamePosition.prototype.keyDown = function (play, keyboardCode) {
    // more code
}





