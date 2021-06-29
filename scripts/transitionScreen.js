function transitionScreen(level) {
    this.level = level;
    this.fontSize = 140;
    this.fontColor = 255;
}


transitionScreen.prototype.update = function (play) {
    this.fontSize -= 1;
    this.fontColor -= 2;
    if (this.fontSize < 1) {
        play.changeScreen(new gameplayScreen(play.settings, this.level));
    }
};


transitionScreen.prototype.draw = function (play) {
    ctx.clearRect(0, 0, play.width, play.height);
    ctx.font = this.fontSize + "px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, " + this.fontColor + ", " + this.fontColor + ", 1)";
    ctx.fillText("Get ready for level " + this.level, play.width / 2, play.height / 2);
};
