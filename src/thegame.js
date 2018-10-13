//@TODO update Phaser version to 3

var gameTitle = function(game) {};
gameTitle.prototype = {
    preload: function() {
      this.game.load.image("gametitle", "assets/gametitle-regular.png");
      this.game.load.image("play", "assets/play-regular-white.png");
    },
  	create: function(){
      game.stage.backgroundColor = "#87CEEB";
  		var gameTitle = this.game.add.sprite(160,160,"gametitle");
  		gameTitle.anchor.setTo(0.5,0.5);
  		var playButton = this.game.add.button(160,320,"play",this.playTheGame,this);
  		playButton.anchor.setTo(0.5,0.5);
	},
	  playTheGame: function(){
		  this.game.state.start("TheGame");
	}
}

var gameOver = function(game) {};
gameOver.prototype = {
  init: function(){
    alert("You scored!")
  },
  preload: function() {
    this.game.load.image("gameOver", "assets/gameover.png");
  },
  create: function(){
    var gameOverTitle = this.game.add.sprite(160,160, "gameOver");
    gameOverTitle.anchor.setTo(0.5, 0.5);
    var playButton = this.game.add.button(160, 320, "play", this.playTheGame, this);
    playButton.anchor.setTo(0.5, 0,5);

  },
  playTheGame: function(){
    this.game.state.start("TheGame");
  }
}

var theGame = function(game) {};

var bird;
var birdGravity = 800;
var birdSpeed = 125;
     // flap thrust
var birdFlapPower = 300;
     // milliseconds between the creation of two pipes
var pipeInterval = 2000;
     // hole between pipes, in puxels
var pipeHole = 120;
var pipeGroup;
var score = 0;
var scoreText;

theGame.prototype = {
  preload:function() {
    game.load.image("bird", "assets/flappybird.png");
    game.load.image("pipe", "assets/pipe.png");
  },

  create:function() {
    pipeGroup = game.add.group();
    score = 0;
    scoreText = game.add.text(10,10, "-", {
      font: "bold 16px Arial"
    });
    updateScore();
    game.stage.backgroundColor = "#87CEEB";
    game.stage.disableVisibilityChange = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    bird = game.add.sprite(80,240,"bird");
    bird.anchor.set(0.5);
    game.physics.arcade.enable(bird);
    bird.body.gravity.y = birdGravity;

    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(flap, this);
    game.time.events.loop(pipeInterval, addPipe);
    addPipe();
  },
  update:function(){
    game.physics.arcade.collide(bird, pipeGroup, die);
    //if(this.bird.angle < 20) this.bird.angle += 1;
    if(bird.y > game.height) {
      die();
    }
  }
}

function updateScore(){
  scoreText.text = "Score: " + score;
}

function flap() {
  bird.body.velocity.y = -birdFlapPower;
}

function addPipe() {
  var pipeHolePosition = game.rnd.between(50, 430-pipeHole);
  var upperPipe = new Pipe(game, 320, pipeHolePosition-480, -birdSpeed);
  game.add.existing(upperPipe);
  pipeGroup.add(upperPipe);
  var lowerPipe = new Pipe(game, 320, pipeHolePosition+pipeHole, -birdSpeed);
  game.add.existing(lowerPipe);
  pipeGroup.add(lowerPipe);
};

Pipe = function(game, x, y, speed) {
  Phaser.Sprite.call(this, game, x, y, "pipe");
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.velocity.x = speed;
  this.giveScore = true;
};



Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.update = function() {
  if(this.x+this.width<bird.x && this.giveScore){
    score += 0.5;
    updateScore();
    this.giveScore = false;
  }
  if(this.x <- this.width) {
    this.destroy();
  }
};

function die() {
  game.state.start("GameOver");
};


var game = new Phaser.Game(320, 480, Phaser.AUTO, "game");
game.state.add("GameTitle", gameTitle);
game.state.add("TheGame", theGame);
game.state.add("GameOver", gameOver);
game.state.start("GameTitle");
