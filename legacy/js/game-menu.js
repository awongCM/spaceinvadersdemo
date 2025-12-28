GameMenu = function(title, menuitems, y, size, width, gameheight, gamewidth){
	this.title = title;
	this.menuitems = menuitems;
	this.selectedItemIndex = 0;
	this.size = size;
	this.width = width;
	this.y = y;
	this.fonttype = "Arial";
	this.gameheight = gameheight;
	this.gamewidth = gamewidth;
}

GameMenu.prototype.constructor = GameMenu;

GameMenu.prototype.Render = function(canvas){
	canvas.textAlign = "center";
	canvas.fillStyle = "White";
	//canvas.fillText(this.title, canvas.width/2, y);

	var y = this.y;

	if(this.title){
		canvas.font = Math.floor(this.size*1.3).toString() + "px "+this.fonttype;
		canvas.fillStyle = "White";
		canvas.fillText(this.title, this.gamewidth/2, this.gameheight/4);
	}

	for(var i=0; i<this.menuitems.length;i++){

		var size = Math.floor(this.size*0.8);

		if(i==this.selectedItemIndex){
			canvas.fillStyle = "rgba(255,255,0,255)";
			size = this.size;
		}

		canvas.font = size.toString() +"px "+this.fonttype;
		y+= this.size;
		canvas.fillText(this.menuitems[i], this.gamewidth/2, y);
		canvas.fillStyle = "White";
	}
}

GameMenu.prototype.Input = function(dt){

	var preSelected = this.selectedItemIndex;
	if(Game.keys['up'])
		this.selectedItemIndex = (this.selectedItemIndex + this.menuitems.length - 1) %	this.menuitems.length;
	if(Game.keys['down'])
		this.selectedItemIndex = (this.selectedItemIndex + 1 ) % this.menuitems.length;
}