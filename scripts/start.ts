let startButton = document.getElementById("startButton");
startButton!.onclick = () =>{
    let enemyMoveSpeedValue = <HTMLInputElement>document.getElementById("enemyMoveSpeed");
    localStorage.setItem("enemyAttackSpeed", enemyMoveSpeedValue.value);

    let enemyAttackSpeedValue = <HTMLInputElement>document.getElementById("enemyAttackSpeed");
    localStorage.setItem("enemySpawnSpeed", enemyMoveSpeedValue.value);

    let enemySpawnSpeedValue = <HTMLInputElement>document.getElementById("enemySpawnSpeed");
    localStorage.setItem("enemySpawnSpeed", enemySpawnSpeedValue.value);

    document.location='/index.html';
    
}