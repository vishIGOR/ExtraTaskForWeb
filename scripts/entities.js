var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Entity = /** @class */ (function () {
    function Entity(map, startCell) {
        this._cell = startCell;
        this._map = map;
    }
    Entity.prototype.takeCells = function () {
        for (var i = 0; i < this._width; ++i) {
            for (var j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).addEntity(this);
            }
        }
    };
    Entity.prototype.leaveCells = function () {
        for (var i = 0; i < this._width; ++i) {
            for (var j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }
    };
    Entity.prototype.redraw = function () {
        this._htmlObject.style.left = String(this._cell.x * this._map.cellSize) + "px";
        this._htmlObject.style.top = String(this._cell.y * this._map.cellSize) + "px";
    };
    return Entity;
}());
var Spaceship = /** @class */ (function (_super) {
    __extends(Spaceship, _super);
    function Spaceship() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Spaceship.prototype, "hitPoints", {
        get: function () {
            return this._hitPoints;
        },
        enumerable: false,
        configurable: true
    });
    Spaceship.prototype.isPossibleToMove = function (x, y) {
        if ((this._width + this._cell.x + x > this._map.width) || (this._cell.x + x < 0))
            return false;
        if ((this._height + this._cell.y + y > this._map.height) || (this._cell.y + y < 0))
            return false;
        return true;
    };
    Spaceship.prototype.move = function (x, y) {
        if (!this.isPossibleToMove(x, y)) {
            return;
        }
        for (var i = 0; i < this._width; ++i) {
            for (var j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }
        this._cell = this._map.getCell(this._cell.x + x, this._cell.y + y);
        for (var i = 0; i < this._width; ++i) {
            for (var j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).addEntity(this);
            }
        }
        this._htmlObject.style.left = String(this._cell.x * this._map.cellSize);
        this._htmlObject.style.top = String(this._cell.y * this._map.cellSize);
        this.redraw();
    };
    Spaceship.prototype.getDamage = function (value) {
        this._hitPoints -= value;
        if (this.hitPoints <= 0) {
            this.die();
        }
    };
    return Spaceship;
}(Entity));
var Hero = /** @class */ (function (_super) {
    __extends(Hero, _super);
    function Hero(map, startCell) {
        var _this = _super.call(this, map, startCell) || this;
        _this._height = 2;
        _this._width = 1;
        _this._explosionType = "3";
        _this._maxHitPoints = _this._map.numberOfLives;
        _this._hitPoints = _this._maxHitPoints;
        _this._htmlObject = document.createElement("div");
        _this._htmlObject.classList.add("entity");
        _this._htmlObject.classList.add("hero");
        _this._htmlObject.classList.add("width-one");
        _this._htmlObject.classList.add("height-two");
        _this._map.htmlObject.append(_this._htmlObject);
        _this.redraw();
        _this.takeCells();
        return _this;
    }
    Hero.prototype.getDamage = function (value) {
        _super.prototype.getDamage.call(this, value);
        this._map.redrawHitPoints();
    };
    Hero.prototype.chooseAction = function () {
    };
    // public move(x: number, y: number): void {
    //     this._cell.deleteEntity(this);
    //     this._cell = this._map.getCell(this._cell.x, this._cell.y);
    //     //нужно ограничение на выход за поля  и столкновение
    //     this._cell.addEntity(this);
    //     this._htmlObject.style.left = String(this._cell.x * this._map.cellSize);
    //     this._htmlObject.style.top = String(this._cell.y * this._map.cellSize);
    //     this.redraw();
    // }
    Hero.prototype.shot = function () {
        var newBullet = new HeroBullet(this._map, this._map.getCell(this._cell.x, this._cell.y - 1));
        this._map.addBullet(newBullet);
    };
    Hero.prototype.die = function () {
    };
    return Hero;
}(Spaceship));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._moveCounter = 0;
        return _this;
    }
    Enemy.prototype.isPossibleToMove = function (x, y) {
        if (_super.prototype.isPossibleToMove.call(this, x, y) === false) {
            return false;
        }
        this.leaveCells();
        for (var i = 0; i < this._width; i++) {
            for (var j = 0; j < this._height; j++) {
                if (this._map.getCell(this._cell.x + i + x, this._cell.y + j + y).isContainsEnemy()) {
                    this.takeCells();
                    return false;
                }
            }
        }
        this.takeCells();
        return true;
    };
    Enemy.prototype.die = function () {
        this._htmlObject.parentElement.removeChild(this._htmlObject);
        for (var i = 0; i < this._width; ++i) {
            for (var j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }
        this._map.increaseScore(this._reward);
        this._map.deleteEntity(this);
        var explosion = new Explosion(this._map, this._cell, this._explosionType);
    };
    return Enemy;
}(Spaceship));
var ShootingEnemy = /** @class */ (function (_super) {
    __extends(ShootingEnemy, _super);
    function ShootingEnemy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._attackCounter = 0;
        _this._explosionType = "1";
        return _this;
    }
    ShootingEnemy.prototype.chooseAction = function (stage) {
        if (stage === 1) {
            this._moveCounter++;
            if (this._moveCounter === this._moveBorder) {
                this._moveCounter = 0;
                var possibleCells = [];
                for (var i = -1; i < 2; i++) {
                    for (var j = -1; j < 2; j++) {
                        if ((i + j) % 2 === 0) {
                            continue;
                        }
                        if (this.isPossibleToMove(i, j)) {
                            possibleCells.push(this._map.getCell(this._cell.x + i, this._cell.y + j));
                        }
                    }
                }
                if (possibleCells.length !== 0) {
                    var randomCell = possibleCells[getRandomInt(0, possibleCells.length)];
                    this.move(randomCell.x - this._cell.x, randomCell.y - this._cell.y);
                }
            }
            return;
        }
        //stage === 2
        this._attackCounter++;
        if (this._attackCounter === this._attackBorder) {
            this._attackCounter = 0;
            this.shot();
        }
    };
    ShootingEnemy.prototype.shot = function () {
        var newBullet = new Enemy1Bullet(this._map, this._map.getCell(this._cell.x, this._cell.y + 2));
        this._map.addBullet(newBullet);
    };
    return ShootingEnemy;
}(Enemy));
var Enemy1 = /** @class */ (function (_super) {
    __extends(Enemy1, _super);
    function Enemy1(map, startCell) {
        var _this = _super.call(this, map, startCell) || this;
        _this._height = 2;
        _this._width = 1;
        _this._maxHitPoints = 1;
        _this._hitPoints = 1;
        _this._reward = 10;
        _this._htmlObject = document.createElement("div");
        _this._htmlObject.classList.add("entity");
        _this._htmlObject.classList.add("enemy1");
        _this._htmlObject.classList.add("width-one");
        _this._htmlObject.classList.add("height-two");
        _this._map.htmlObject.append(_this._htmlObject);
        _this.redraw();
        switch (_this._map.enemyMoveSpeed) {
            case 1:
                _this._moveBorder = 20;
                break;
            case 2:
                _this._moveBorder = 14;
                break;
            case 3:
                _this._moveBorder = 8;
                break;
        }
        switch (_this._map.enemyAttackSpeed) {
            case 1:
                _this._attackBorder = 26;
                break;
            case 2:
                _this._attackBorder = 18;
                break;
            case 3:
                _this._attackBorder = 12;
                break;
        }
        _this.takeCells();
        return _this;
    }
    return Enemy1;
}(ShootingEnemy));
var KamikazeEnemy = /** @class */ (function (_super) {
    __extends(KamikazeEnemy, _super);
    function KamikazeEnemy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KamikazeEnemy.prototype.chooseAction = function (stage) {
    };
    return KamikazeEnemy;
}(Enemy));
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bullet.prototype.die = function () {
        this._htmlObject.parentElement.removeChild(this._htmlObject);
        for (var i = 0; i < this._width; ++i) {
            for (var j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }
        this._map.deleteEntity(this);
    };
    return Bullet;
}(Entity));
var MovingBullet = /** @class */ (function (_super) {
    __extends(MovingBullet, _super);
    function MovingBullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._moveCounter = 0;
        return _this;
    }
    MovingBullet.prototype.isPossibleToMove = function (x, y) {
        if ((this._width + this._cell.x + x > this._map.width) || (this._cell.x + x < 0))
            return false;
        if ((this._height + this._cell.y + y > this._map.height) || (this._cell.y + y < 0))
            return false;
        return true;
    };
    MovingBullet.prototype.move = function (x, y) {
        if (!this.isPossibleToMove(x, y)) {
            return;
        }
        for (var i = 0; i < this._width; ++i) {
            for (var j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }
        this._cell = this._map.getCell(this._cell.x + x, this._cell.y + y);
        for (var i = 0; i < this._width; ++i) {
            for (var j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).addEntity(this);
            }
        }
        this._htmlObject.style.left = String(this._cell.x * this._map.cellSize);
        this._htmlObject.style.top = String(this._cell.y * this._map.cellSize);
        this.redraw();
    };
    MovingBullet.prototype.chooseAction = function (stage) {
        if (stage === 1) {
            this._moveCounter++;
            if (this._moveCounter === this._moveBorder) {
                this._moveCounter = 0;
                if (this.isPossibleToMove(this._directionX, this._directionY)) {
                    this.move(this._directionX, this._directionY);
                }
                else {
                    this.die();
                }
            }
            return;
        }
        this.isHitTarget();
    };
    return MovingBullet;
}(Bullet));
var HeroBullet = /** @class */ (function (_super) {
    __extends(HeroBullet, _super);
    function HeroBullet(map, startCell) {
        var _this = _super.call(this, map, startCell) || this;
        _this._width = 1;
        _this._height = 1;
        _this._moveBorder = 1;
        _this.damageValue = 1;
        _this._htmlObject = document.createElement("div");
        _this._htmlObject.classList.add("entity");
        _this._htmlObject.classList.add("bullet-hero");
        _this._htmlObject.classList.add("width-one");
        _this._htmlObject.classList.add("height-one");
        _this._map.htmlObject.append(_this._htmlObject);
        _this.redraw();
        _this.takeCells();
        _this._directionX = 0;
        _this._directionY = -1;
        return _this;
    }
    HeroBullet.prototype.isHitTarget = function () {
        var _this = this;
        if (this._cell.isContainsEnemy()) {
            this._cell.entities.forEach(function (entity) {
                if (entity instanceof Enemy) {
                    entity.getDamage(_this.damageValue);
                }
            });
            this.die();
        }
    };
    return HeroBullet;
}(MovingBullet));
var EnemyMovingBullet = /** @class */ (function (_super) {
    __extends(EnemyMovingBullet, _super);
    function EnemyMovingBullet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EnemyMovingBullet.prototype.isHitTarget = function () {
        if (this._cell.isContainsHero()) {
            this._map.player.getDamage(this.damageValue);
            this.die();
        }
    };
    return EnemyMovingBullet;
}(MovingBullet));
var Enemy1Bullet = /** @class */ (function (_super) {
    __extends(Enemy1Bullet, _super);
    function Enemy1Bullet(map, startCell) {
        var _this = _super.call(this, map, startCell) || this;
        _this._width = 1;
        _this._height = 1;
        _this._moveBorder = 1;
        _this.damageValue = 1;
        _this._htmlObject = document.createElement("div");
        _this._htmlObject.classList.add("entity");
        _this._htmlObject.classList.add("bullet-enemy1");
        _this._htmlObject.classList.add("width-one");
        _this._htmlObject.classList.add("height-one");
        _this._map.htmlObject.append(_this._htmlObject);
        _this.redraw();
        _this.takeCells();
        _this._directionX = 0;
        _this._directionY = 1;
        return _this;
    }
    return Enemy1Bullet;
}(EnemyMovingBullet));
var Explosion = /** @class */ (function () {
    function Explosion(map, cell, type) {
        var _this = this;
        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-one");
        this._htmlObject.classList.add("explosion-" + type);
        map.htmlObject.append(this._htmlObject);
        this._htmlObject.style.left = String(cell.x * map.cellSize) + "px";
        this._htmlObject.style.top = String(cell.y * map.cellSize) + "px";
        setTimeout(function () {
            _this._htmlObject.parentElement.removeChild(_this._htmlObject);
        }, 200);
    }
    return Explosion;
}());
