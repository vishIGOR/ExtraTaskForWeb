function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
var battleMap = new BattleMap(60);
// setInterval(() => {
//     battleMap.updateMap();
// }, 100);
// window.onresize = () => {
//     battleMap = new BattleMap(60);
//     initPlayerControls();
//     battleMap.startGame();
//     alert("Размер окна изменён. Размер поля изменён, Игра запущена заново.")
// }
