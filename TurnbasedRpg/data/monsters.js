const _rootDirimage = "./img/"
const _dirEnemies = "Enemies/"
const _dirCharacters = "Characters/"

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



const monsters = {
    Player: {
        name: "You",
        health: {
            max: 100,
            current:100,
        },
        position: {
            x: 200,
            y: 200
        },
        image: {src: _rootDirimage+_dirCharacters+"marinSpecial.png"},
        frames: { max: 3, hold: 100},
        animate: true,
        isEnemy: false,
        sprites: {
            entry:_playerSpecialImage,
            idle: _playerSpecialImage,
            attack: _playerSpecialImage,
            hurt: _playerSpecialImage
        },
        attacks: [attacks.Dagger, attacks.Tackle, attacks.Slingshot]
    },
    Slime: {
        name: "Slime",
        health: {max: 50, current:50},
        position: {
            x: 700,
            y: 200
        },
        image: {src: _rootDirimage+_dirEnemies+"Slime/slimeBlinking.png"},
        frames: { max: 3, hold: 100},
        sprites: {
            entry: _enemyEntryImage,
            idle: _enemyIdleImage,
            attack: _enemyAttackImage,
            hurt: _enemyHurtImage
        },
        animate: true,
        attacks: [attacks.Tackle, attacks.Splash]
    }
}