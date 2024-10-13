const _collisionMaps = []
for (let i = 0; i<collision.length; i+=_startingPosTileCount){
    _collisionMaps.push(collision.slice(i,i+_startingPosTileCount));
}

const _battleMaps = []
for (let i = 0; i < battleTilesData.length; i+=_startingPosTileCount){
    _battleMaps.push(battleTilesData.slice(i, i+_startingPosTileCount));
}

const _startScreen = new Image();
_startScreen.src = _rootDirimage+_dirOverworld+"island_1.png";
_currentBackground = _startScreen;

const _secondScreen = new Image();
_secondScreen.src = _rootDirimage+_dirBattle+"TestBattlescreen2.png";

