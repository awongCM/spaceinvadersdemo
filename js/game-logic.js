
var Game = new function() {                                                                  
  var KEY_CODES = { 37:'left', 38:'up', 39:'right', 40:'down', 32 :'fire', 43:'speedup', 45: 'speeddown' };
  this.keys = {};

  var dx = 30;
  var dy = 1000;
  var defaultspeed = dx/dy; 

  this.initialize = function(canvas_dom,level_data,sprite_data,callbacks) {
    this.canvas_elem = $(canvas_dom)[0];
    this.canvas = this.canvas_elem.getContext('2d');
    this.width = $(this.canvas_elem).attr('width');
    this.height= $(this.canvas_elem).attr('height');
    

    $(window).keydown(function(event) {
      if(KEY_CODES[event.keyCode]) Game.keys[KEY_CODES[event.keyCode]] = true;
    });

    $(window).keyup(function(event) {
      if(KEY_CODES[event.keyCode]) Game.keys[KEY_CODES[event.keyCode]] = false;
    });

    $(window).keypress(function(event){
      if(KEY_CODES[event.keyCode] == 'speedup'){ if(dx<100) dx=dx+10; console.log('dx:'+ dx);}
      if(KEY_CODES[event.keyCode] == 'speeddown'){ if(dx>0) dx=dx-10; console.log('dx: '+ dx);} 
   });

    this.level_data = level_data;
    this.callbacks = callbacks;
    Sprites.load(sprite_data,this.callbacks['start']);
  };

  this.loadBoard = function(board) { Game.board = board; };

  this.displaySpeed = function(canvas, defaultspeed){
    canvas.font = "bold 16px arial";
    canvas.fillStyle = "#F3F315"
    var text = "Speed: " + (defaultspeed * 1000);
    var measure2 = canvas.measureText(text);
    canvas.fillText(text, Game.width/2 + 150, Game.height/2 - 230);

  };

  this.loop = function() {
    //update the new speed each time user toggles speed onscreen
    defaultspeed = dx/dy;

    Game.board.input(defaultspeed);
    Game.board.step(defaultspeed); 
    Game.board.render(Game.canvas);
    Game.displaySpeed(Game.canvas, defaultspeed);
    setTimeout(Game.loop,30);
  };
};

var Sprites = new function() {
  this.map = { }; 

  this.load = function(sprite_data,callback) { 
    this.map = sprite_data;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'images/sprites.png';
  };

  this.draw = function(canvas,sprite,x,y,frame) {
    var s = this.map[sprite];
    //console.log("Sprite Type: "+sprite);
    if(!frame) frame = 0;
    canvas.drawImage(this.image, s.sx + frame * s.w, s.sy, s.w, s.h, x,y, s.w, s.h);
  };
}

var GameScreen = function GameScreen(text,text2,callback) {

  this.title = "Space Invaders";

  var menus = new Array();
  menus[0] = "Play";
  menus[1] = "Settings";
  menus[2] = "Help";
  menus[3] = "Credits";

  gameMenu = new GameMenu(this.title, menus, 200, 40, 50, Game.width, Game.height);

  this.input = function(dt){
    if(Game.keys['up'] && callback){
      //callback();
      gameMenu.Input(dt);
    }
    if(Game.keys['down'] && callback){
      //callback();
      gameMenu.Input(dt);
    }
  }


  this.step = function(dt) {
    if(Game.keys['fire'] && callback) callback();
  };

  this.render = function(canvas) {
    canvas.clearRect(0,0,Game.width,Game.height);
    /*canvas.font = "bold 40px arial";
    var measure = canvas.measureText(text);  
    canvas.fillStyle = "#FFFFFF";
    
    canvas.fillText(text, Game.width/2 - measure.width/2, Game.height/4);

    canvas.font = "bold 25px arial";
    //var measure2 = canvas.measureText(text2);
    //canvas.fillText(text2,Game.width/2 - measure2.width/2,Game.height/2 + 40);
    
    var menuy = 0;
    for(var i=0; i< menus.length;i++){
        canvas.fillText(menus[i], Game.width/2 - canvas.measureText(menus[i]).width/2, Game.height/2 + menuy);
        menuy = menuy + 30;
    }*/

    gameMenu.Render(canvas);
  };

};

var GameBoard = function GameBoard(level_number) {
  this.removed_objs = [];
  this.missiles = 0;
  this.level = level_number;
  var board = this;

  this.add =    function(obj) { obj.board=this; this.objects.push(obj); return obj; };
  this.remove = function(obj) { this.removed_objs.push(obj);
   };

  this.addSprite = function(name,x,y,opts) {
    var sprite = this.add(new Sprites.map[name].cls(opts));
    sprite.name = name;
    sprite.x = x; sprite.y = y;
    sprite.w = Sprites.map[name].w; 
    sprite.h = Sprites.map[name].h;
    return sprite;
  };
  
  this.input = function(dt){
    //For now, nothing...
  }

  this.iterate = function(func) {
     for(var i=0,len=this.objects.length;i<len;i++) {
       func.call(this.objects[i]);
     }
  };

  this.detect = function(func) {
    for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
      if(func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  this.step = function(dt) { 
    this.removed_objs = [];
    this.iterate(function() { 
        if(!this.step(dt)) this.die();
    }); 

    for(var i=0,len=this.removed_objs.length;i<len;i++) {
      var idx = this.objects.indexOf(this.removed_objs[i]);
      if(idx != -1) this.objects.splice(idx,1);
    }
  };

  this.render = function(canvas) {
    canvas.clearRect(0,0,Game.width,Game.height);
    this.iterate(function() { this.draw(canvas); });
  };

  this.collision = function(o1,o2) {
    return !((o1.y+o1.h-1<o2.y) || (o1.y>o2.y+o2.h-1) ||
             (o1.x+o1.w-1<o2.x) || (o1.x>o2.x+o2.w-1));
  };

  this.collide = function(obj) {
    return this.detect(function() {
      if(obj != this && !this.invulnrable)
       return board.collision(obj,this) ? this : false;
    });
  };

  this.loadLevel = function(level) {
    this.objects = [];
    this.player = this.addSprite('player', // Sprite
                                 Game.width/2, // X
                                 Game.height - Sprites.map['player'].h - 15); // Y
    this.shield = this.addSprite('shield1',  //Sprite
                                  Game.width/2 - 70,  //X
                                 Game.height - Sprites.map['shield1'].h - 50); //Y
    this.shield = this.addSprite('shield2',  //Sprite
                                  Game.width/2 - 10,  //X
                                 Game.height - Sprites.map['shield2'].h - 50); //Y
    this.shield = this.addSprite('shield3',  //Sprite
                                  Game.width/2 + 50,  //X
                                 Game.height - Sprites.map['shield3'].h - 50); //Y

    var flock = this.add(new AlienFlock());
    for(var y=0,rows=level.length;y<rows;y++) {
      for(var x=0,cols=level[y].length;x<cols;x++) {
        var alien = Sprites.map['alien' + level[y][x]];
        if(alien) { 
          this.addSprite('alien' + level[y][x], // Which Sprite
                         (alien.w+10)*x,  // X
                         alien.h*y,       // Y
                         { flock: flock }); // Options
        }
      }
    }

    
  };

  this.nextLevel = function() { 
    return Game.level_data[level_number + 1] ? (level_number + 1) : false 
  };
 
  this.loadLevel(Game.level_data[level_number]);
};

var GameAudio = new function() {
  this.load_queue = [];
  this.loading_sounds = 0;
  this.sounds = {};

  var channel_max = 10;		
  audio_channels = new Array();
  for (a=0;a<channel_max;a++) {	
    audio_channels[a] = new Array();
    audio_channels[a]['channel'] = new Audio(); 
    audio_channels[a]['finished'] = -1;	
  }

  this.load = function(files,callback) {
    var audioCallback = function() { GameAudio.finished(callback); }

    for(name in files) {
      var filename = files[name];
      this.loading_sounds++;
      var snd = new Audio();
      this.sounds[name] = snd;
      snd.addEventListener('canplaythrough',audioCallback,false);
      snd.src = filename;
      snd.load();
    }
  };

  this.finished = function(callback) {
    this.loading_sounds--;
    if(this.loading_sounds == 0) {
      callback();
    }
  };

  this.play = function(s) {
    for (a=0;a<audio_channels.length;a++) {
      thistime = new Date();
      if (audio_channels[a]['finished'] < thistime.getTime()) {	
        audio_channels[a]['finished'] = thistime.getTime() + this.sounds[s].duration*1000;
        audio_channels[a]['channel'].src = this.sounds[s].src;
        audio_channels[a]['channel'].load();
        audio_channels[a]['channel'].play();
        break;
      }
    }
  };
};

