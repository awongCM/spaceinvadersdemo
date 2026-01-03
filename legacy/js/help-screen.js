// Reusable HelpScreen for legacy build (top-level var for global exposure)
var HelpScreen = function(title, backCallback) {
  this.title = title;
  this.menuitems = [];
  this.selectedItemIndex = 0;
  this.size = 20;
  this.width = 0;
  this.y = 0;
  this.fonttype = 'Arial';
  this.gameheight = Game && Game.height;
  this.gamewidth = Game && Game.width;


  this.lines = [
          'Left Arrow: Move Left',
          'Right Arrow: Move Right',
          'Space: Fire',
          '+ : Speed Up',
          '- : Speed Down'
];

  this.objects = [];
  this.removed_objs = [];
  this.missiles = 0;
  this.level = 0;

  this.input = function(dt) {
    // no navigation
  };

  this.step = function(dt) {
    if (Game && Game.keys && Game.keys['fire']) {
      if (backCallback) backCallback();
    }
  };

  this.render = function(canvas) {
    canvas.clearRect(0,0,Game.width,Game.height);
    canvas.textAlign = 'center';
    canvas.fillStyle = 'White';
    canvas.font = 'bold 24px arial';
    canvas.fillText(this.title, Game.width/2, 80);

    canvas.font = '16px arial';
    var y = 120;
    for (var i=0;i<this.lines.length;i++){
      canvas.fillText(this.lines[i], Game.width/2, y + i*30);
    }

    canvas.font = '14px arial';
    canvas.fillText('(Press space to return)', Game.width/2, Game.height - 60);
  };

  this.add = function(obj) { return obj; };
  this.remove = function(obj) { this.removed_objs.push(obj); };
  this.addSprite = function(name,x,y,opts) { return {}; };
  this.iterate = function(func) {};
  this.detect = function(func) { return false; };
  this.collision = function(o1,o2) { return false; };
  this.collide = function(obj) { return false; };
  this.loadLevel = function(level) {};
  this.nextLevel = function() { return false; };
};
