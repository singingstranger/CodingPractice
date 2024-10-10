const _rootDirimage = "./img/"
const _dirEnemies = "Enemies/"
const _dirCharacters = "Characters/"
const _dirBattle = "Battle/"
const _dirOverworld = "Overworld/"


const _startingpositionTestScreen = [-600,-200];
let _offset = {
    x: _startingpositionTestScreen[0],
    y: _startingpositionTestScreen[1]
}
const _startingPosTileCount = 30;
const _zoomLevel = 2.5;

const _playerSpriteFrames = 3;
const _playerSpriteDimensions = { x: 168, y: 100}
let _playerAnimationSpeed = 10;
let _tileDimensions = 32;

let _movables = [];
let _movementSpeed = 3;

const _canvas = document.querySelector("canvas");
const _context = _canvas.getContext("2d");

const _spritesheetDimensions = [3, 1]

_canvas.width = 1024;
_canvas.height = 576;


let _encounterRate = 0.01
const _battle = {
    initiated: false
}

let _currentBackground;

let _renderedSprites = [];
let _battleQueue;

const _frameTime = 10;
let _timeLastFrame = 0;
let _timeCurrent = 0;
