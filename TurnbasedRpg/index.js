const _rootDirimage = "./img/"
const _dirCharacters = "Characters/"
const _dirBattle = "Battle/"
const _dirEnemies = "Enemies/"
const _dirOverworld = "Overworld/"

const _startingpositionTestScreen = [-80,-200];
let _offset = {
    x: _startingpositionTestScreen[0],
    y: _startingpositionTestScreen[1]
}
const _startingPosTileCount = 30;
const _zoomLevel = 2.5;

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
                    x: j * _tileDimensions + _offset.x -_tileDimensions,
                    y: i * _tileDimensions + _offset.y-_tileDimensions
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
                    x: j * _tileDimensions + _offset.x - _tileDimensions,
                    y: i * _tileDimensions + _offset.y - _tileDimensions
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
const _playerSpecialImage = new Image();
_playerSpecialImage.src = _rootDirimage+_dirCharacters+"marinSpecial.png";

const _enemyEntryImage = new Image();
_enemyEntryImage.src = _rootDirimage+_dirEnemies+"Slime/slimeEntry.png";
const _enemyIdleImage = new Image();
_enemyIdleImage.src = _rootDirimage+_dirEnemies+"Slime/slimeBlinking.png";
const _enemyAttackImage = new Image();
_enemyAttackImage.src = _rootDirimage+_dirEnemies+"Slime/slimeAttack.png";
const _enemyHurtImage = new Image();
_enemyHurtImage.src = _rootDirimage+_dirEnemies+"Slime/slimeHurt.png";


const _startScreen = new Image();
_startScreen.src = _rootDirimage+_dirOverworld+"Testscreen.png";
_currentBackground = _startScreen;

const _secondScreen = new Image();
_secondScreen.src = _rootDirimage+_dirBattle+"TestBattlescreen.png";



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

const _battlePlayer = new Sprite({
    position: {
        x: _canvas.width/5,
        y: _canvas.height/3
    },
    image: _playerSpecialImage,
    frames: { max: _playerSpriteFrames, hold: 20},
    animate: true,
    isEnemy: false,
    sprites: {
        entry:_playerSpecialImage,
        idle: _playerSpecialImage,
        attack: _playerSpecialImage,
        hurt: _playerSpecialImage
    }
})

const _enemy = new Sprite({
    position: {
        x: _canvas.width/5 * 3,
        y: _canvas.height/3
    },
    image: _enemyEntryImage,
    frames: { max: _playerSpriteFrames, hold: 30},
    sprites: {
        entry: _enemyEntryImage,
        idle: _enemyIdleImage,
        attack: _enemyAttackImage,
        hurt: _enemyHurtImage
    },
    animate: true
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
function Activatebattle(animID){
    gsap.to("#overlappingDiv", {
        opacity:1,
        repeat: 3,
        yoyo: true,
        duration: 0.3,
        onComplete(){
            gsap.to("#overlappingDiv", {
                opacity:1,
                duration: 0.3,
                onComplete(){
                    AnimateBattle(),
                    gsap.to("#overlappingDiv",{
                        opacity:0,
                        duration:1
                    })
                }
            })
        }
    });
    window.cancelAnimationFrame(animID);
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

function AnimateBattle(){
    const animationBattleID = window.requestAnimationFrame(AnimateBattle); 
    _battleBG.draw();
    _enemy.draw();
    _battlePlayer.draw();
}

function CalculateDamage(attack, recipient){
    let remainingHealth;
    recipient.health -= attack;
    remainingHealth = recipient.health;
    return remainingHealth;
}

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
        _battlePlayer.attack({attack: {
            name: "Tackle",
            damage: 50,
            type: "Normal"
            },
            recipient: _enemy,
            remainingHealthPercent: CalculateDamage(50, _enemy),
        });
    })
});

let _lastkey = " ";
window.addEventListener("keydown", (e) => {
    switch (e.key){
        case "w":
            _keys.w.pressed = true;
            _keys.a.pressed = false;
            _keys.s.pressed = false;
            _keys.d.pressed = false;
            _lastkey = "w";
            break;
        case "a":
            _keys.a.pressed = true;
            _keys.w.pressed = false;
            _keys.s.pressed = false;
            _keys.d.pressed = false;
            _lastkey = "a";
            break;
        case "s":           
            _keys.w.pressed = false;
            _keys.a.pressed = false;
            _keys.s.pressed = true;
            _keys.d.pressed = false;
            _lastkey = "s";
            break;
        case "d":
            _keys.w.pressed = false;
            _keys.a.pressed = false;
            _keys.s.pressed = false;
            _keys.d.pressed = true;
            _lastkey = "d"; 
            break;
    }
})
window.addEventListener("keyup", (e) => {
    switch (e.key){
        case "w":
            _keys.w.pressed = false;
            break;
        case "a":
            _keys.a.pressed = false;
            break;
        case "s":
            _keys.s.pressed = false;
            break;
        case "d":
            _keys.d.pressed = false;
            break;
    }
})