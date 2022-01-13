var BattleMap = /** @class */ (function () {
    function BattleMap(sellSize) {
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
    BattleMap.prototype.startGame = function () {
        this._enemyMoveSpeed = localStorage.getItem("enemyMoveSpeed");
        this._enemyAttackSpeed = localStorage.getItem("enemyAttackSpeed");
        this._enemySpawnSpeed = localStorage.getItem("enemySpawnSpeed");
        this.player = new Hero(this, this._cells[0][this._height - 2]);
    };
    BattleMap.prototype.endGame = function () {
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
            entity.chooseAction();
        });
    };
    BattleMap.prototype.DeleteEntity = function (entity) {
        this._entities.splice(this._entities.indexOf(entity), 1);
    };
    return BattleMap;
}());
