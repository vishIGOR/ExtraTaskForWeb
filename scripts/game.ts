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

function blockAttackAccess() {
    attackAccess = false;
}

function unblockAttackAccess() {
    setTimeout(() => {
        attackAccess = true;
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
        if (attackAccess) {
            blockAttackAccess();
            battleMap.player.shot();
            unblockAttackAccess();
        }
    };

    document.addEventListener('keydown', function (event) {
        if (event.code == 'ArrowUp') {
            if (movingAccess) {
                blockMovingAccess();
                battleMap.player.move(0, -1);
                unblockMovingAccess();
            }
            return;
        }

        if (event.code == 'ArrowRight') {
            if (movingAccess) {
                blockMovingAccess();
                battleMap.player.move(1, 0);
                unblockMovingAccess();
            }
            return;
        }

        if (event.code == 'ArrowDown') {
            if (movingAccess) {
                blockMovingAccess();
                battleMap.player.move(0, 1);
                unblockMovingAccess();
            }
            return;
        }

        if (event.code == 'ArrowLeft') {
            if (movingAccess) {
                blockMovingAccess();
                battleMap.player.move(-1, 0);
                unblockMovingAccess();
            }
            return;
        }

        if (event.code == 'Space') {
            if (attackAccess) {
                blockAttackAccess();
                battleMap.player.shot();
                unblockAttackAccess();
            }
            return;
        }
    })

}

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

let movingAccess: boolean = true;
let attackAccess: boolean = true;
let battleMap = new BattleMap(60);
initPlayerControls();
battleMap.startGame();
setInterval(() => {
    battleMap.updateMap();
}, 100);

// setTimeout(()=>{
//     clearInterval(game);
// }, 1600)

// window.onresize = () => {
//     battleMap = new BattleMap(60);
//     initPlayerControls();
//     battleMap.startGame();
//     alert("Размер окна изменён. Размер поля изменён, Игра запущена заново.")
// }