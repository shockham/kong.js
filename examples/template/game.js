//init the game
var game = new Game(960, 480, 960, 480);

//init the menu state
var menuState = new State();
game.State = menuState;

menuState.update = function(modifier){
    if(32 in keysDown){
        game.State = playState;
    }
};

var menuBg = new Entity(0, 0, "img/bg.png", game.width, game.height, 0);
menuState.add(menuBg);

var title = new Textity(0,00, "twoduga", "#FFA500", 70, 2);
menuState.add(title);

var pressX = new Textity(0, game.height - 20, "press space to start", "#FFA500", 20, 2);
menuState.add(pressX);

//init the playState
var playState = new State();

//player
var player = new Entity(0, game.height/2, "img/player.png", 24, 24, 1);
player.Speed = 400;
player.Type = "player";
player.Reloaded = true;
player.update = function (modifier){
    if (87 in keysDown && player.y > 0) { // Player holding up
        player.y -= player.Speed * modifier;
    }
    if (83 in keysDown && player.y + player.Height < game.height ) { // Player holding down
        player.y += player.Speed * modifier;
    }
    if (65 in keysDown && player.x > 0) { // Player holding left
        player.x -= player.Speed * modifier;
    }
    if (68 in keysDown && player.x + player.Width < game.width) { // Player holding right
        player.x += player.Speed * modifier;
    }
}
playState.add(player);

//starting the playState loop
game.start();