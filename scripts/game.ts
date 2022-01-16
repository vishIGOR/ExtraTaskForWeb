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

function blockMovingAccess() {
    movingAccess = false;
}

function unblockMovingAccess() {
    setTimeout(() => {
        movingAccess = true;
    }, 200)
}
function initPlayerControls() {
    document.getElementById("arrow_top").onclick = function () {
        if (movingAccess) {
            blockMovingAccess();
            battleMap.player.move(0, -1);
            unblockMovingAccess();
        }
    };
    document.getElementById("arrow_right").onclick = function () {
        if (movingAccess) {
            blockMovingAccess();
            battleMap.player.move(1, 0);
            unblockMovingAccess();
        }

    };

    document.getElementById("arrow_down").onclick = function () {
        if (movingAccess) {
            blockMovingAccess();
            battleMap.player.move(0, 1);
            unblockMovingAccess();
        }
    };

    document.getElementById("arrow_left").onclick = function () {
        if (movingAccess) {
            blockMovingAccess();
            battleMap.player.move(-1, 0);
            unblockMovingAccess();
        }
    };

    document.getElementById("shoot").onclick = function () {
        battleMap.player.shot();
    };

}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

let movingAccess: boolean = true;
let battleMap = new BattleMap(60);
initPlayerControls();
battleMap.startGame();
setInterval(() => {
    battleMap.updateMap();
}, 200);

// setTimeout(()=>{
//     clearInterval(game);
// }, 1600)

// window.onresize = () => {
//     battleMap = new BattleMap(60);
//     initPlayerControls();
//     battleMap.startGame();
//     alert("Размер окна изменён. Размер поля изменён, Игра запущена заново.")
// }