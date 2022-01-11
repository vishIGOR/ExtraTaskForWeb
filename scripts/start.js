var startButton = document.getElementById("startButton");
startButton.onclick = function () {
    var enemyMoveSpeedValue = document.getElementById("enemyMoveSpeed");
    localStorage.setItem("enemyMoveSpeed", enemyMoveSpeedValue.value);
    var enemyAttackSpeedValue = document.getElementById("enemyAttackSpeed");
    localStorage.setItem("enemyAttackSpeed", enemyAttackSpeedValue.value);
    var enemySpawnSpeedValue = document.getElementById("enemySpawnSpeed");
    localStorage.setItem("enemySpawnSpeed", enemySpawnSpeedValue.value);
    document.location = '/index.html';
};
