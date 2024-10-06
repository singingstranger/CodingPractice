const _dirBattle = "Battle/"
const _dirOverworld = "Overworld/"

const _startingpositionTestScreen = [-80,-200];
let _offset = {
    x: _startingpositionTestScreen[0],
    y: _startingpositionTestScreen[1]
}
const _startingPosTileCount = 30;
const _zoomLevel = 2.4;

const _playerSpriteFrames = 3;
const _playerSpriteDimensions = { x: 168, y: 100}
let _playerAnimationSpeed = 10;
let _tileDimensions = 25;
let _currentBackground;

let _movables = [];
let _movementSpeed = 3;


const _canvas = document.querySelector("canvas");
const _context = _canvas.getContext("2d");

const _spritesheetDimensions = [3, 1]

_canvas.width = 1024;
_canvas.height = 576;

const _collisionMaps = []
for (let i = 0; i<collision.length; i+=_startingPosTileCount){
    _collisionMaps.push(collision.slice(i,i+_startingPosTileCount));
}

const _battleMaps = []
for (let i = 0; i < battleTilesData.length; i+=_startingPosTileCount){
    _battleMaps.push(battleTilesData.slice(i, i+_startingPosTileCount));
}
let _encounterRate = 0.01
const _battle = {
    initiated: false
}


function SetTileSize(zoom){
    _tileDimensions *= zoom;
}




//START
document.querySelector("#userInterface").style.display = "none";
console.log(document.querySelector("#userInterface"));
gsap.to("#overlappingDiv", {
    opacity:0,
    duration: 1
});

SetTileSize(_zoomLevel);

const _boundaries = [];
_collisionMaps.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol != 0){
            _boundaries.push(new Boundary({
                position:{
                    x: j * _tileDimensions + _offset.x -_tileDimensions/2,
                    y: i * _tileDimensions + _offset.y-_tileDimensions/2
            }}))
        }
    })
})

const _battleTiles = []
_battleMaps.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol!=0){
            _battleTiles.push(new Boundary({
                position:{
                    x: j * _tileDimensions + _offset.x - _tileDimensions/2,
                    y: i * _tileDimensions + _offset.y - _tileDimensions/2
                }
            }))
        }
    })
})

const _playerFrontImage = new Image();
_playerFrontImage.src = _rootDirimage+_dirCharacters+"marinFront.png";
const _playerBackImage = new Image();
_playerBackImage.src = _rootDirimage+_dirCharacters+"marinBack.png";
const _playerRightImage = new Image();
_playerRightImage.src = _rootDirimage+_dirCharacters+"marinRight.png";
const _playerLeftImage = new Image();
_playerLeftImage.src = _rootDirimage+_dirCharacters+"marinLeft.png";

const _startScreen = new Image();
_startScreen.src = _rootDirimage+_dirOverworld+"Testscreen.png";
_currentBackground = _startScreen;

const _secondScreen = new Image();
_secondScreen.src = _rootDirimage+_dirBattle+"TestBattlescreen2.png";



const _background = new Sprite({
    position: {
        x: _offset.x, 
        y: _offset.y
    },
    image: _currentBackground
});

const _battleBG = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: _secondScreen
});

const _player = new Sprite({
    name: "You",
    position: {
        x: _canvas.width/2 - _playerSpriteDimensions.x/_playerSpriteFrames/2,
        y:  _canvas.height/2 - _playerSpriteDimensions.y/2,
    },
    image: _playerFrontImage,
    frames: { max: _playerSpriteFrames, hold: _playerAnimationSpeed},
    sprites: {
        down: _playerFrontImage,
        up: _playerBackImage,
        right: _playerRightImage,
        left: _playerLeftImage,
        special: _playerSpecialImage
    },
    isEnemy: false
})

_startScreen.onload = () => {
    Animate();
}

const _keys = {
    w: {
        pressed: false
    },
    a: {
        pressed:false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

_movables = [_background, ..._boundaries, ..._battleTiles];
function RectangularCollision({rectangle1, rectangle2}){
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}
function Animate(){
    const animationID = window.requestAnimationFrame(Animate);
    _background.draw();
    
    _boundaries.forEach(boundary => {
        boundary.draw();
    })
    _battleTiles.forEach(battleTile => {
        battleTile.draw();
    })
    _player.draw();

    let moving = true;
    let inBattleTile = false;
    let movementSpeed = _movementSpeed+3;

    _player.animate = false;

    if (_battle.initiated){return;}

//battle activation
    if (_keys.w.pressed || _keys.a.pressed || _keys.s.pressed || _keys.d.pressed){
        for (let i = 0; i<_battleTiles.length; i++){
            const battleTile = _battleTiles[i];
            const overlappingArea = (Math.min(_player.position.x + _player.width, battleTile.position.x + battleTile.width) - Math.max(_player.position.x, battleTile.position.x)) * (Math.min(_player.position.y + _player.height, battleTile.position.y + battleTile.height) - Math.max(_player.position.y, battleTile.position.y)); 
            if (RectangularCollision({
                rectangle1: _player, 
                rectangle2: battleTile
                }) &&
                overlappingArea > (_player.width * _player.height/2) && Math.random() < _encounterRate
            ){
                console.log("entered battle tile");
                Activatebattle(animationID);
                _battle.initiated = true;
                _player.animate = false;
                break;
            }
        }
    }

    
//playermovement
    if (_keys.w.pressed) {
        for (let i = 0; i<_boundaries.length && _lastkey == "w"; i++){
            _player.animate = true;
            _player.image = _player.sprites.up;
            const boundary = _boundaries[i];
            if (RectangularCollision({
                rectangle1: _player, 
                rectangle2: {
                    ...boundary, 
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + movementSpeed
                    }
                }
            })
            ){
                console.log("colliding");
                moving = false;
                break;
            }
        }
        if (!moving){ return; }
        _movables.forEach(movable => {
            movable.position.y += _movementSpeed;
        })

    }
    else if (_keys.a.pressed) {
        for (let i = 0; i<_boundaries.length && _lastkey == "a"; i++){
            _player.animate = true;
            _player.image = _player.sprites.left;
            const boundary = _boundaries[i];
            if (RectangularCollision({
                rectangle1: _player, 
                rectangle2: {
                    ...boundary, 
                    position: {
                        x: boundary.position.x+ movementSpeed,
                        y: boundary.position.y 
                    }
                }
            })
            ){
                console.log("colliding");
                moving = false;
                break;
            }
        }
        if (!moving){ return; }
        _movables.forEach(movable => {
            movable.position.x += _movementSpeed;
        })
    }

    else if (_keys.s.pressed) {
        for (let i = 0; i<_boundaries.length && _lastkey == "s"; i++){
            _player.animate = true;
            _player.image = _player.sprites.down;
            const boundary = _boundaries[i];
            if (RectangularCollision({
                rectangle1: _player, 
                rectangle2: {
                    ...boundary, 
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y - movementSpeed
                    }
                }
            })
            ){
                console.log("colliding");
                moving = false;
                break;
            }
        }
        if (!moving){ return; }
        _movables.forEach(movable => {
            movable.position.y -= _movementSpeed;
        })
    }

    else if (_keys.d.pressed) {
        for (let i = 0; i<_boundaries.length && _lastkey == "d"; i++){
            _player.animate = true;
            _player.image = _player.sprites.right;
            const boundary = _boundaries[i];
            if (RectangularCollision({
                rectangle1: _player, 
                rectangle2: {
                    ...boundary, 
                    position: {
                        x: boundary.position.x - movementSpeed,
                        y: boundary.position.y 
                    }
                }
            })
            ){
                console.log("colliding");
                moving = false;
                break;
            }
        }
        if (!moving){ return; }
        _movables.forEach(movable => {
            movable.position.x -= _movementSpeed;
        })
    }
}
