function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

let battleMap = new BattleMap(60);
// setInterval(() => {
//     battleMap.updateMap();
// }, 100);

window.onresize = () => {
    window.location.reload();
}