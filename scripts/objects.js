function Objects() {
};

Objects.prototype.player = function (x, y, playerImage) {
	this.x = x;
	this.y = y;
	this.width = 34;
	this.height = 28;
	this.playerImage = playerImage;
	this.playerImage.src = "images/ship.png";
	return this;
};

Objects.prototype.bullet = function(x, y) {
    this.x = x;
    this.y = y;
	return this;
};

Objects.prototype.enemy = function(x, y, line, column, enemyImage, level) {
    this.x = x;
    this.y = y;
    this.line = line;
    this.column = column;
    this.width = 32;  
    this.height = 24;  
	this.enemyImage = enemyImage;  
	this.level = level;
	//even-odd level selector		 
	this.enemyImage.src = (this.level%2==0) ? "images/enemy2.png" : "images/enemy.png"; 
	return this;	
};

Objects.prototype.bomb = function(x, y) {
    this.x = x;
    this.y = y;
	return this;
};