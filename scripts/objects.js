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
    this.width = 40;
    this.height = 40;
	this.enemyImage = enemyImage;  
	this.level = level;
	//even-odd level selector		 
	this.enemyImage.src = (this.level%2==0) ? "images/corona2.png" : "images/corona1.png";
	return this;	
};

Objects.prototype.bomb = function(x, y) {
    this.x = x;
    this.y = y;
	return this;
};