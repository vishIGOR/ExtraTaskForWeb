var BattleMap = /** @class */ (function () {
    function BattleMap(sellSize) {
        this._entities = [];
        this._enemies = [];
        this._bullets = [];
        this._enemySpawnCounter = 0;
        this._points = 0;
        this._htmlObject = document.getElementById("content");
        this._cellSize = sellSize;
        this._height = Math.floor(this.htmlObject.offsetHeight / this._cellSize);
        this._width = Math.floor(this.htmlObject.offsetWidth / this._cellSize);
        this._cells = new Array(this._width);
        for (var i = 0; i < this._width; ++i) {
            this._cells[i] = new Array(this._height);
            for (var j = 0; j < this._height; ++j) {
                this._cells[i][j] = new Cell(i, j);
            }
        }
    }
    Object.defineProperty(BattleMap.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BattleMap.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BattleMap.prototype, "cellSize", {
        get: function () {
            return this._cellSize;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BattleMap.prototype, "htmlObject", {
        get: function () {
            return this._htmlObject;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BattleMap.prototype, "enemyMoveSpeed", {
        get: function () {
            return Number(this._enemyMoveSpeed);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BattleMap.prototype, "enemyAttackSpeed", {
        get: function () {
            return Number(this._enemyAttackSpeed);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BattleMap.prototype, "enemySpawnSpeed", {
        get: function () {
            return Number(this._enemySpawnSpeed);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BattleMap.prototype, "numberOfLives", {
        get: function () {
            return Number(this._numberOfLives);
        },
        enumerable: false,
        configurable: true
    });
    BattleMap.prototype.startGame = function () {
        this._enemyMoveSpeed = localStorage.getItem("enemyMoveSpeed");
        this._enemyAttackSpeed = localStorage.getItem("enemyAttackSpeed");
        this._enemySpawnSpeed = localStorage.getItem("enemySpawnSpeed");
        this._numberOfLives = localStorage.getItem("numberOfLives");
        switch (this.enemySpawnSpeed) {
            case 1:
                this._enemySpawnBorder = 11;
                break;
            case 2:
                this._enemySpawnBorder = 8;
                break;
            case 3:
                this._enemySpawnBorder = 5;
                break;
        }
        this.player = new Hero(this, this._cells[0][this._height - 2]);
        this.redrawHitPoints();
    };
    BattleMap.prototype.endGame = function () {
        //логика пересоздания и результатов
    };
    BattleMap.prototype.redrawHitPoints = function () {
        document.getElementById("hitPoints").innerText = String(this.player.hitPoints);
    };
    BattleMap.prototype.increaseScore = function (value) {
        this._points += value;
        this.redrawScore();
    };
    BattleMap.prototype.redrawScore = function () {
        document.getElementById("score").innerText = String(this._points);
    };
    // public setDifficultyLevel(enemyMS:number,enemyAS:number,enemySS:number){
    //     this.enemyMoveSpeed = enemyMS;
    //     this.enemyAttackSpeed = enemyAS;
    //     this.enemySpawnSpeed = enemySS;
    // }
    BattleMap.prototype.getCells = function () {
        return this._cells;
    };
    BattleMap.prototype.getCell = function (x, y) {
        return this._cells[x][y];
    };
    BattleMap.prototype.updateMap = function () {
        this._entities.forEach(function (entity) {
            entity.chooseAction(1);
        });
        this._bullets.forEach(function (bullet) {
            bullet.chooseAction(2);
        });
        this._enemies.forEach(function (enemy) {
            enemy.chooseAction(2);
        });
        this._enemySpawnCounter++;
        if (this._enemySpawnCounter == this._enemySpawnBorder) {
            this._enemySpawnCounter = 0;
            var cellForEnemy = this.findCellToAddEnemy();
            if (cellForEnemy !== null) {
                this.addRandomEnemy(cellForEnemy);
            }
        }
    };
    BattleMap.prototype.findCellToAddEnemy = function () {
        var possibleCells = [];
        var cellsCounter;
        for (var i = 0; i < this._width - 1; i++) {
            cellsCounter = 0;
            for (var x = 0; x < 2; x++) {
                for (var y = 0; y < 2; y++) {
                    if (this.getCell(i + x, y).isContainsEnemy()) {
                        cellsCounter++;
                    }
                }
            }
            if (cellsCounter === 0) {
                possibleCells.push(this.getCell(i, 0));
            }
        }
        // console.log("//", possibleCells);
        if (possibleCells.length === 0) {
            return null;
        }
        return possibleCells[getRandomInt(0, possibleCells.length)];
    };
    BattleMap.prototype.addRandomEnemy = function (startCell) {
        var newEnemy;
        newEnemy = new Enemy1(this, startCell);
        this._enemies.push(newEnemy);
        this._entities.push(newEnemy);
    };
    BattleMap.prototype.deleteEntity = function (entity) {
        if (entity instanceof Enemy) {
            this._enemies.splice(this._enemies.indexOf(entity), 1);
        }
        if (entity instanceof Bullet) {
            this._bullets.splice(this._bullets.indexOf(entity), 1);
        }
        this._entities.splice(this._entities.indexOf(entity), 1);
    };
    BattleMap.prototype.addBullet = function (bullet) {
        this._entities.push(bullet);
        this._bullets.push(bullet);
    };
    return BattleMap;
}());
