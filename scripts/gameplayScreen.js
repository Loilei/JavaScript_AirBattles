function gameplayScreen(settings, level) {
    this.settings = settings;
    this.level = level;
    this.object = null;
    this.player = null;
    this.bullets = [];
    this.lastBulletTime = null;
    this.enemies = [];
    this.bombs = [];
}

gameplayScreen.prototype.entry = function (play) {
    this.playerImage = new Image();
    this.enemyImage = new Image();
    this.refreshRate = this.settings.fps;
    this.turnAround = 1;
    this.horizontalMoving = 1;
    this.verticalMoving = 0;
    this.isEnemyDecreasing = false;
    this.enemyDecreasingValue = 0;

    //Difficulty increase
    let presentLevel = this.level < 11 ? this.level : 10;
    this.enemySpeed = this.settings.enemySpeed + (presentLevel * 7);
    this.bombSpeed = this.settings.bombSpeed + (presentLevel * 10);
    this.bombFrequency = this.settings.bombFrequency + (presentLevel * 0.05);

    // Creating Player
    this.playerSpeed = this.settings.playerSpeed;
    this.object = new Objects();
    this.player = this.object.player((play.width / 2), play.playBoundaries.bottom, this.playerImage);

    // Creating Enemies
    const lines = this.settings.enemyLines;
    const columns = this.settings.enemyColumns;
    const enemiesInit = [];

    let line, column;
    for (line = 0; line < lines; line++) {
        for (column = 0; column < columns; column++) {
            this.object = new Objects();
            let x, y;
            x = (play.width / 2) + (column * 50) - ((columns - 1) * 25);
            y = (play.playBoundaries.top + 30) + (line * 30);
            enemiesInit.push(this.object.enemy(
                x,
                y,
                line,
                column,
                this.enemyImage,
                this.level
            ));
        }
    }
    this.enemies = enemiesInit;
};


gameplayScreen.prototype.update = function (play) {
    const player = this.player;
    const playerSpeed = this.playerSpeed;
    const refreshRate = this.settings.fps;
    const bullets = this.bullets;

    if (play.pressedKeys[37]) {
        player.x -= playerSpeed * refreshRate;
    }
    if (play.pressedKeys[39]) {
        player.x += playerSpeed * refreshRate;
    }
    if (play.pressedKeys[32]) {
        this.shoot();
    }

    // Keep player in 'Active playing field'
    if (player.x < play.playBoundaries.left) {
        player.x = play.playBoundaries.left;
    }
    if (player.x > play.playBoundaries.right) {
        player.x = play.playBoundaries.right;
    }

    //  Moving bullets
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        bullet.y -= refreshRate * this.settings.bulletSpeed;
        if (bullet.y < 0) {
            bullets.splice(i--, 1);
        }
    }

    // Movements of Enemies
    let reachedSide = false;

    for (let i = 0; i < this.enemies.length; i++) {
        let enemy = this.enemies[i];
        let fresh_x = enemy.x + this.enemySpeed * refreshRate * this.turnAround * this.horizontalMoving;
        let fresh_y = enemy.y + this.enemySpeed * refreshRate * this.verticalMoving;
        if (fresh_x > play.playBoundaries.right || fresh_x < play.playBoundaries.left) {
            this.turnAround *= -1;
            reachedSide = true;
            this.horizontalMoving = 0;
            this.verticalMoving = 1;
            this.isEnemyDecreasing = true;
        }
        if (reachedSide !== true) {
            enemy.x = fresh_x;
            enemy.y = fresh_y;
        }
    }

    if (this.isEnemyDecreasing == true) {
        this.enemyDecreasingValue += this.enemySpeed * refreshRate;
        if (this.enemyDecreasingValue >= this.settings.enemyDecreaseRate) {
            this.isEnemyDecreasing = false;
            this.verticalMoving = 0;
            this.horizontalMoving = 1;
            this.enemyDecreasingValue = 0;
        }
    }

    // Enemies bombing 
    // Sorting Enemies - which are at the bottom of each column
    const frontLineEnemies = [];
    for (let i = 0; i < this.enemies.length; i++) {
        let enemy = this.enemies[i];
        if (!frontLineEnemies[enemy.column] || frontLineEnemies[enemy.column].line < enemy.line) {
            frontLineEnemies[enemy.column] = enemy;
        }
    }

    // Give a chance for bombing
    for (let i = 0; i < this.settings.enemyColumns; i++) {
        let enemy = frontLineEnemies[i];
        if (!enemy) continue;
        let chance = this.bombFrequency * refreshRate;
        this.object = new Objects();
        if (chance > Math.random()) {	
            this.bombs.push(this.object.bomb(enemy.x, enemy.y + enemy.height / 2));
        }
    }

    // Moving bombs
    for (let i = 0; i < this.bombs.length; i++) {
        let bomb = this.bombs[i];
        bomb.y += refreshRate * this.bombSpeed;
        if (bomb.y > this.height) {
            this.bombs.splice(i--, 1);
        }
    }

    // Enemy-bullet collision
    for (let i = 0; i < this.enemies.length; i++) {
        let enemy = this.enemies[i];
        let collision = false;
        for (let j = 0; j < bullets.length; j++) {
            let bullet = bullets[j];
            // collision check
            if (bullet.x+1 >= (enemy.x - enemy.width / 2) && bullet.x-1 <= (enemy.x + enemy.width / 2) &&
                bullet.y >= (enemy.y - enemy.height / 2) && bullet.y-6 <= (enemy.y + enemy.height / 2)) {
                bullets.splice(j--, 1);
                collision = true;
                play.score += this.settings.pointsPerEnemy;
            }
        }
        
        if (collision == true) {
            this.enemies.splice(i--, 1);
            play.sounds.playSound('ufoDeath');
        }
    }

    // Player-bomb collision
    for (let i = 0; i < this.bombs.length; i++) {
        let bomb = this.bombs[i];
        if (bomb.x + 2 >= (player.x - player.width / 2) &&
            bomb.x - 2 <= (player.x + player.width / 2) &&
            bomb.y + 6 >= (player.y - player.height / 2) &&
            bomb.y <= (player.y + player.height / 2)) {  
            this.bombs.splice(i--, 1);
            play.sounds.playSound('explosion');
            play.extraLives--;
        }
    }

    // Player-Enemy collision
    for (let i = 0; i < this.enemies.length; i++) {
        let enemy = this.enemies[i];
        if ((enemy.x + enemy.width / 2) > (player.x - player.width / 2) &&
            (enemy.x - enemy.width / 2) < (player.x + player.width / 2) &&
            (enemy.y + enemy.height / 2) > (player.y - player.height / 2) &&
            (enemy.y - enemy.height / 2) < (player.y + player.height / 2)) {
            play.sounds.playSound('explosion');
            play.extraLives = -1;
        }
    }

    // Player death check
    if (play.extraLives < 0) {
        play.changeScreen(new GameOverPosition());
    }

    // Level completed
    if (this.enemies.length == 0) {
        play.level += 1;
        play.changeScreen(new transitionScreen(play.level));
    }
};

gameplayScreen.prototype.shoot = function () {
    if (this.lastBulletTime === null || ((new Date()).getTime() - this.lastBulletTime) > (this.settings.bulletMaxFrequency)) {
        this.object = new Objects();
        this.bullets.push(this.object.bullet(this.player.x, this.player.y - this.player.height / 2, this.settings.bulletSpeed));
        this.lastBulletTime = (new Date()).getTime();
        play.sounds.playSound('shot');
    }
};

gameplayScreen.prototype.draw = function (play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.drawImage(this.playerImage, this.player.x - (this.player.width / 2), this.player.y - (this.player.height / 2));

    // draw Bullets 
    ctx.fillStyle = '#ff0000';
    for (let i = 0; i < this.bullets.length; i++) {
        let bullet = this.bullets[i];
        ctx.fillRect(bullet.x - 1, bullet.y - 6, 2, 6);
    }

    // draw Enemies     
    for (let i = 0; i < this.enemies.length; i++) {
        let enemy = this.enemies[i];
        ctx.drawImage(this.enemyImage, enemy.x - (enemy.width / 2), enemy.y - (enemy.height / 2));
    }

    // draw bombs
    ctx.fillStyle = "#FE2EF7";
    for (let i = 0; i < this.bombs.length; i++) {
        let bomb = this.bombs[i];
        ctx.fillRect(bomb.x - 2, bomb.y, 4, 6);
    }

    // draw Sound & Mute info
    ctx.font = "16px Comic Sans MS";

    ctx.fillStyle = "#424242";
    ctx.textAlign = "left";
    ctx.fillText("Press S to switch sound effects ON/OFF.  Sound:", play.playBoundaries.left, play.playBoundaries.bottom + 50);

    let soundStatus = (play.sounds.muted === true) ? "OFF" : "ON";
    ctx.fillStyle = (play.sounds.muted === true) ? '#FF0000' : '#0B6121';
    ctx.fillText(soundStatus, play.playBoundaries.left + 375, play.playBoundaries.bottom + 50);

    ctx.fillStyle = '#424242';
    ctx.textAlign = "right";
    ctx.fillText("Press P to Pause.", play.playBoundaries.right, play.playBoundaries.bottom + 50);

    // draw Score & Level
    ctx.textAlign = "center";
    ctx.fillStyle = '#BDBDBD';

    ctx.font = "bold 24px Comic Sans MS";
    ctx.fillText("Score", play.playBoundaries.right, play.playBoundaries.top - 75);
    ctx.font = "bold 30px Comic Sans MS";
    ctx.fillText(play.score, play.playBoundaries.right, play.playBoundaries.top - 25);

    ctx.font = "bold 24px Comic Sans MS";
    ctx.fillText("Level", play.playBoundaries.left, play.playBoundaries.top - 75);
    ctx.font = "bold 30px Comic Sans MS";
    ctx.fillText(play.level, play.playBoundaries.left, play.playBoundaries.top - 25);

    // draw Shields
    ctx.textAlign = "center";
    if (play.extraLives > 0) {
        ctx.fillStyle = '#BDBDBD';
        ctx.font = "bold 24px Comic Sans MS";
        ctx.fillText(" Extra Lives", play.width / 2, play.playBoundaries.top - 75);
        ctx.font = "bold 30px Comic Sans MS";
        ctx.fillText(play.extraLives, play.width / 2, play.playBoundaries.top - 25);
    }
    else {
        ctx.fillStyle = '#ff4d4d';
        ctx.font = "bold 24px Comic Sans MS";
        ctx.fillText("WARNING", play.width / 2, play.playBoundaries.top - 75);
        ctx.fillStyle = '#BDBDBD';
        ctx.fillText("No Extra Lives left!", play.width / 2, play.playBoundaries.top - 25);
    }
};

gameplayScreen.prototype.keyDown = function (play, keyboardCode) {
    if (keyboardCode == 83) {   // Mute sound: S
        play.sounds.muteSwitch();
    }
    if (keyboardCode == 80) {   // Pause: P
        play.pushScreen(new PausePosition());
    }
};
