// class Game{
//     private enemyMoveSpeed:number;
//     private enemyAttackSpeed:number;
//     private enemySpawnSpeed:number;

//     private points:number;

//     private player: Hero;

//     public startGame():void  {
//         // создание объектов  
//     }

//     public endGame():void {}
// }

function initPlayerControls(){
    document.getElementById("arrow_top").onclick = function () {
        battleMap.player.move(0,-1);
    };
    document.getElementById("arrow_right").onclick = function () {
        battleMap.player.move(1,0);
    };

    document.getElementById("arrow_down").onclick = function () {
        battleMap.player.move(0,1);
    };

    document.getElementById("arrow_left").onclick = function () {
        battleMap.player.move(-1,0);
    };

    document.getElementById("shoot").onclick = function () {
        battleMap.player.shot();
    };

}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

let battleMap = new BattleMap(60);
initPlayerControls();
battleMap.startGame();