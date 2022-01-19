var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function authorize() {
    return __awaiter(this, void 0, void 0, function* () {
        postRequest('https://sas.front.kreosoft.space/api/auth', {
            "username": "admin_vish",
            "password": "password_vish"
        })
            .then((response) => {
            return response.json();
        })
            .then((json) => {
            localStorage.setItem("todoToken", json.accessToken);
        })
            .catch(error => console.error(error));
    });
}
function postRequest(url, data) {
    return fetch(url, {
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
    });
}
function postRequestWithAuth(url, data) {
    let token = 'Bearer ' + localStorage.getItem("todoToken");
    return fetch(url, {
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        }),
    });
}
function setNewScore(score, name) {
    return __awaiter(this, void 0, void 0, function* () {
        postRequestWithAuth('https://sas.front.kreosoft.space/api/ToDoItem', {
            "name": String(score),
            "description": name,
            "priority": 1,
            "listId": 3108
        })
            .then((response) => {
            return response;
        })
            .catch(error => console.error(error));
    });
}
function sortTuples(a, b) {
    if (a[0] < b[0])
        return 1;
    if (a[0] == b[0])
        return 0;
    if (a[0] > b[0])
        return -1;
}
function getScores() {
    let resultTable = [];
    let newScore = Number(localStorage.getItem("currentScore"));
    function viewLeaderboard() {
        let leaderboard = document.getElementById("leaderboard");
        leaderboard.classList.remove("element-disabled");
        leaderboard.classList.add("d-flex");
        let leadersTable = document.getElementById("leadersTable");
        let currentNumber = 0;
        let newRow;
        let newFirstElement;
        let newSecondElement;
        if (resultTable.length > 5)
            resultTable.splice(5, resultTable.length - 5);
        while (currentNumber < 5 || resultTable.length > currentNumber) {
            currentNumber++;
            newFirstElement = document.createElement("div");
            newFirstElement.classList.add("col-8");
            newFirstElement.innerText = String(6 - currentNumber) + ". " + resultTable[5 - currentNumber][1];
            newSecondElement = document.createElement("div");
            newSecondElement.classList.add("col-4");
            newSecondElement.classList.add("text-right");
            newSecondElement.innerText = String(resultTable[5 - currentNumber][0]) + " points";
            newRow = document.createElement("div");
            newRow.classList.add("row", "d-flex", "justify-content-between");
            newRow.append(newFirstElement);
            newRow.append(newSecondElement);
            leadersTable.after(newRow);
        }
    }
    function closeFormToAddNewScore() {
        let newScoreForm = document.getElementById("addNewScoreForm");
        newScoreForm.classList.add("element-disabled");
        newScoreForm.classList.remove("d-flex");
    }
    function viewFormToAddNewScore() {
        let newScoreForm = document.getElementById("addNewScoreForm");
        newScoreForm.classList.remove("element-disabled");
        newScoreForm.classList.add("d-flex");
        let scoreRow = document.getElementById("scoreRow");
        scoreRow.innerText = "Congratulations! You scored " + String(newScore) + "\n points and got to the leaderboard!";
        let usernameForm = document.getElementById("usernameForm");
        let usernameButton = document.getElementById("usernameButton");
        usernameForm.oninput = () => {
            if (usernameForm.value == "") {
                usernameButton.setAttribute("disabled", "true");
                usernameButton.classList.add("button-disabled");
            }
            else {
                usernameButton.removeAttribute("disabled");
                usernameButton.classList.remove("button-disabled");
            }
        };
        usernameButton.onclick = () => {
            setNewScore(newScore, usernameForm.value)
                .then(() => {
                localStorage.setItem("currentScore", "0");
                newScore = 0;
                closeFormToAddNewScore();
                viewLeaderboard();
            });
        };
    }
    let token = 'Bearer ' + localStorage.getItem("todoToken");
    fetch('https://sas.front.kreosoft.space/api/ToDoList', {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then((response) => {
        return response.json();
    })
        .then((json) => {
        let currentNumber = 0;
        console.log(json[0]);
        json[0].items.forEach(item => {
            resultTable.push([0, ""]);
            resultTable[currentNumber][0] = Number(item.name);
            resultTable[currentNumber][1] = item.description;
            currentNumber++;
            console.log(resultTable[currentNumber - 1]);
        });
        resultTable = resultTable.sort(sortTuples);
        if (resultTable.length < 5 || (resultTable.length > 5 && newScore > resultTable[4][0])
            || (resultTable.length <= 5 && newScore > resultTable[resultTable.length - 1][0])) {
            viewFormToAddNewScore();
        }
        else {
            viewLeaderboard();
        }
    })
        .catch(error => console.error(error));
}
document.getElementById("playAgainButton").onclick = () => {
    document.location = "/start.html";
};
window.onload = () => {
    authorize()
        .then(() => {
        getScores();
    });
};
