let startButton = document.getElementById("startButton");
startButton!.onclick = () =>{
    let enemyMoveSpeedValue = <HTMLInputElement>document.getElementById("enemyMoveSpeed");
    localStorage.setItem("enemyMoveSpeed", enemyMoveSpeedValue.value);

    let enemyAttackSpeedValue = <HTMLInputElement>document.getElementById("enemyAttackSpeed");
    localStorage.setItem("enemyAttackSpeed", enemyAttackSpeedValue.value);

    let enemySpawnSpeedValue = <HTMLInputElement>document.getElementById("enemySpawnSpeed");
    localStorage.setItem("enemySpawnSpeed", enemySpawnSpeedValue.value);

    let numberOfLivesValue = <HTMLInputElement>document.getElementById("numberOfLives");
    localStorage.setItem("numberOfLives", numberOfLivesValue.value);
    
    document.location='/index.html';
}