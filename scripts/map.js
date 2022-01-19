var BattleMap = /** @class */ (function () {
    function BattleMap(sellSize) {
        this._entities = [];
        this._enemies = [];
        this._bullets = [];
        this._bonuses = [];
        this._enemySpawnCounter = 0;
        this._bonusSpawnCounter = 0;
        this._bonusSpawnBorder = 125;
        this._points = 0;
        this._movingAccess = true;
        this._attackAccess = true;
        this._movingBlockDuration = 200;
        this._attackBlockDuration = 300;
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
        this.initPlayerControls();
        this._isGameOn = true;
        this._enemyMoveSpeed = localStorage.getItem("enemyMoveSpeed");
        this._enemyAttackSpeed = localStorage.getItem("enemyAttackSpeed");
        this._enemySpawnSpeed = localStorage.getItem("enemySpawnSpeed");
        this._numberOfLives = localStorage.getItem("numberOfLives");
        switch (this.enemySpawnSpeed) {
            case 1:
                this._enemySpawnBorder = 20;
                break;
            case 2:
                this._enemySpawnBorder = 15;
                break;
            case 3:
                this._enemySpawnBorder = 11;
                break;
        }
        this.player = new Hero(this, this._cells[0][this._height - 2]);
        this.redrawHitPoints();
        this.updateMap();
    }
    BattleMap.prototype.blockMovingAccess = function () {
        this._movingAccess = false;
    };
    BattleMap.prototype.unblockMovingAccess = function () {
        var _this = this;
        setTimeout(function () {
            _this._movingAccess = true;
        }, this._movingBlockDuration);
    };
    BattleMap.prototype.blockAttackAccess = function () {
        this._attackAccess = false;
    };
    BattleMap.prototype.unblockAttackAccess = function () {
        var _this = this;
        setTimeout(function () {
            _this._attackAccess = true;
        }, this._attackBlockDuration);
    };
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
        var _this = this;
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
        if (this._enemySpawnCounter >= this._enemySpawnBorder) {
            this._enemySpawnCounter = 0;
            var cellForEnemy = this.findCellToAddEnemy();
            if (cellForEnemy !== null) {
                this.addRandomEnemy(cellForEnemy);
            }
        }
        this._bonusSpawnCounter++;
        if (this._bonusSpawnCounter >= this._bonusSpawnBorder) {
            this._bonusSpawnCounter = 0;
            var cellForBonus = this.findCellToAddBonus();
            if (cellForBonus !== null) {
                this.addRandomBonus(cellForBonus);
            }
        }
        if (this._isGameOn) {
            setTimeout(function () {
                _this.updateMap();
            }, 100);
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
        var randomInt = getRandomInt(0, 4);
        if (randomInt === 0) {
            newEnemy = new Enemy1(this, startCell);
            this._enemies.push(newEnemy);
            this._entities.push(newEnemy);
            return;
        }
        if (randomInt === 1) {
            newEnemy = new Enemy2(this, startCell);
            this._enemies.push(newEnemy);
            this._entities.push(newEnemy);
            return;
        }
        if (randomInt === 2) {
            newEnemy = new Enemy3(this, startCell);
            this._enemies.push(newEnemy);
            this._entities.push(newEnemy);
            return;
        }
        newEnemy = new Enemy4(this, startCell);
        this._enemies.push(newEnemy);
        this._entities.push(newEnemy);
    };
    BattleMap.prototype.deleteEntity = function (entity) {
        this._entities.splice(this._entities.indexOf(entity), 1);
        if (entity instanceof Enemy) {
            this._enemies.splice(this._enemies.indexOf(entity), 1);
            return;
        }
        if (entity instanceof Bullet) {
            this._bullets.splice(this._bullets.indexOf(entity), 1);
            return;
        }
        if (entity instanceof Bonus) {
            this._bonuses.splice(this._bonuses.indexOf(entity), 1);
            return;
        }
    };
    BattleMap.prototype.addBullet = function (bullet) {
        this._entities.push(bullet);
        this._bullets.push(bullet);
    };
    BattleMap.prototype.findCellToAddBonus = function () {
        var possibleCells = [];
        var cellsCounter;
        for (var i = 0; i < this._width - 1; i++) {
            for (var j = 2; j < this._height - 3; j++) {
                if (!this.getCell(i, j).isContainsEnemy() && !this.getCell(i, j).isContainsHero() && !this.getCell(i, j).isContainsBonus()) {
                    cellsCounter++;
                    possibleCells.push(this.getCell(i, j));
                }
            }
        }
        // console.log("//", possibleCells);
        if (possibleCells.length === 0) {
            return null;
        }
        return possibleCells[getRandomInt(0, possibleCells.length)];
    };
    BattleMap.prototype.addRandomBonus = function (cell) {
        var randomInt = getRandomInt(1, 5);
        var newBonus;
        if (randomInt === 1) {
            newBonus = new HealthBonus(this, cell);
            this._entities.push(newBonus);
            this._bonuses.push(newBonus);
            return;
        }
        if (randomInt === 2) {
            newBonus = new AttackSpeedBonus(this, cell);
            this._entities.push(newBonus);
            this._bonuses.push(newBonus);
            return;
        }
        if (randomInt === 3) {
            newBonus = new MoveSpeedBonus(this, cell);
            this._entities.push(newBonus);
            this._bonuses.push(newBonus);
            return;
        }
        if (randomInt === 4) {
            newBonus = new enemyMoveSpeedDebuffBonus(this, cell);
            this._entities.push(newBonus);
            this._bonuses.push(newBonus);
            return;
        }
    };
    BattleMap.prototype.increasePlayerAttackSpeed = function (newAS, duration) {
        var _this = this;
        var oldAS = this._attackBlockDuration;
        this._attackBlockDuration = newAS;
        setTimeout(function () {
            _this._attackBlockDuration = oldAS;
        }, duration);
    };
    BattleMap.prototype.increasePlayerMoveSpeed = function (newMS, duration) {
        var _this = this;
        var oldMS = this._movingBlockDuration;
        this._movingBlockDuration = newMS;
        setTimeout(function () {
            _this._movingBlockDuration = oldMS;
        }, duration);
    };
    BattleMap.prototype.decreaseEnemyMoveSpeed = function (coef, duration) {
        this._enemies.forEach(function (enemy) {
            enemy.decreaseMoveSpeed(coef, duration);
        });
    };
    BattleMap.prototype.initPlayerControls = function () {
        document.getElementById("arrow_top").onclick = function () {
            if (battleMap._movingAccess) {
                battleMap.blockMovingAccess();
                battleMap.player.move(0, -1);
                battleMap.unblockMovingAccess();
            }
        };
        document.getElementById("arrow_right").onclick = function () {
            if (battleMap._movingAccess) {
                battleMap.blockMovingAccess();
                battleMap.player.move(1, 0);
                battleMap.unblockMovingAccess();
            }
        };
        document.getElementById("arrow_down").onclick = function () {
            if (battleMap._movingAccess) {
                battleMap.blockMovingAccess();
                battleMap.player.move(0, 1);
                battleMap.unblockMovingAccess();
            }
        };
        document.getElementById("arrow_left").onclick = function () {
            if (battleMap._movingAccess) {
                battleMap.blockMovingAccess();
                battleMap.player.move(-1, 0);
                battleMap.unblockMovingAccess();
            }
        };
        document.getElementById("shoot").onclick = function () {
            if (battleMap._attackAccess) {
                battleMap.blockAttackAccess();
                battleMap.player.shot();
                battleMap.unblockAttackAccess();
            }
        };
        document.addEventListener('keydown', function (event) {
            if (event.code == 'ArrowUp') {
                if (battleMap._movingAccess) {
                    battleMap.blockMovingAccess();
                    battleMap.player.move(0, -1);
                    battleMap.unblockMovingAccess();
                }
                return;
            }
            if (event.code == 'ArrowRight') {
                if (battleMap._movingAccess) {
                    battleMap.blockMovingAccess();
                    battleMap.player.move(1, 0);
                    battleMap.unblockMovingAccess();
                }
                return;
            }
            if (event.code == 'ArrowDown') {
                if (battleMap._movingAccess) {
                    battleMap.blockMovingAccess();
                    battleMap.player.move(0, 1);
                    battleMap.unblockMovingAccess();
                }
                return;
            }
            if (event.code == 'ArrowLeft') {
                if (battleMap._movingAccess) {
                    battleMap.blockMovingAccess();
                    battleMap.player.move(-1, 0);
                    battleMap.unblockMovingAccess();
                }
                return;
            }
            if (event.code == 'Space') {
                if (battleMap._attackAccess) {
                    battleMap.blockAttackAccess();
                    battleMap.player.shot();
                    battleMap.unblockAttackAccess();
                }
                return;
            }
        });
    };
    return BattleMap;
}());
