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
    Entity.prototype.endGame = function () {
        this.die();
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
    Hero.prototype.shot = function () {
        var newBullet = new HeroBullet(this._map, this._map.getCell(this._cell.x, this._cell.y - 1));
        this._map.addBullet(newBullet);
    };
    Hero.prototype.die = function () {
        this._map.endGame();
    };
    return Hero;
}(Spaceship));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._moveCounter = 0;
        _this._explosionType = String(getRandomInt(1, 4));
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
        this._htmlObject.classList.add("dying");
        var dyingHtmlObject = this._htmlObject;
        setTimeout(function () {
            dyingHtmlObject.parentElement.removeChild(dyingHtmlObject);
        }, 300);
        // this._htmlObject.parentElement.removeChild(this._htmlObject);
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
        return _this;
    }
    ShootingEnemy.prototype.chooseAction = function (stage) {
        if (stage === 1) {
            this._moveCounter++;
            if (this._moveCounter >= this._moveBorder) {
                this._moveCounter = 0;
                var possibleCells = [];
                for (var i = -1; i < 2; i++) {
                    for (var j = 0; j < 2; j++) {
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
        if (this._attackCounter >= this._attackBorder && this.isPossibleToShot()) {
            this._attackCounter = 0;
            this.shot();
        }
    };
    ShootingEnemy.prototype.isPossibleToShot = function () {
        if (this._cell.y + this._height > this._map.height) {
            return false;
        }
        for (var i = this._cell.y + this._height; i < this._map.height; i++) {
            for (var j = 0; j < this._width; j++) {
                if (this._map.getCell(this._cell.x + j, i).isContainsEnemy()) {
                    return false;
                }
            }
        }
        return true;
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
                _this._attackBorder = 22;
                break;
            case 2:
                _this._attackBorder = 15;
                break;
            case 3:
                _this._attackBorder = 11;
                break;
        }
        _this._attackCounter = _this._attackBorder;
        _this._moveCounter = _this._moveBorder;
        _this.takeCells();
        return _this;
    }
    Enemy1.prototype.shot = function () {
        var newBullet = new Enemy1Bullet(this._map, this._map.getCell(this._cell.x, this._cell.y + 2));
        this._map.addBullet(newBullet);
    };
    return Enemy1;
}(ShootingEnemy));
var Enemy2 = /** @class */ (function (_super) {
    __extends(Enemy2, _super);
    function Enemy2(map, startCell) {
        var _this = _super.call(this, map, startCell) || this;
        _this._height = 2;
        _this._width = 2;
        _this._maxHitPoints = 3;
        _this._hitPoints = 3;
        _this._reward = 30;
        _this._htmlObject = document.createElement("div");
        _this._htmlObject.classList.add("entity");
        _this._htmlObject.classList.add("enemy2");
        _this._htmlObject.classList.add("width-two");
        _this._htmlObject.classList.add("height-two");
        _this._map.htmlObject.append(_this._htmlObject);
        _this.redraw();
        switch (_this._map.enemyMoveSpeed) {
            case 1:
                _this._moveBorder = 24;
                break;
            case 2:
                _this._moveBorder = 18;
                break;
            case 3:
                _this._moveBorder = 11;
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
        _this._attackCounter = _this._attackBorder;
        _this._moveCounter = _this._moveBorder;
        _this.takeCells();
        return _this;
    }
    Enemy2.prototype.shot = function () {
        var newBullet = new Enemy2Bullet(this._map, this._map.getCell(this._cell.x, this._cell.y + 2));
        this._map.addBullet(newBullet);
    };
    return Enemy2;
}(ShootingEnemy));
var Enemy3 = /** @class */ (function (_super) {
    __extends(Enemy3, _super);
    function Enemy3(map, startCell) {
        var _this = _super.call(this, map, startCell) || this;
        _this._height = 1;
        _this._width = 2;
        _this._maxHitPoints = 2;
        _this._hitPoints = 2;
        _this._reward = 30;
        _this._htmlObject = document.createElement("div");
        _this._htmlObject.classList.add("entity");
        _this._htmlObject.classList.add("enemy3");
        _this._htmlObject.classList.add("width-two");
        _this._htmlObject.classList.add("height-one");
        _this._map.htmlObject.append(_this._htmlObject);
        _this.redraw();
        switch (_this._map.enemyMoveSpeed) {
            case 1:
                _this._moveBorder = 16;
                break;
            case 2:
                _this._moveBorder = 12;
                break;
            case 3:
                _this._moveBorder = 7;
                break;
        }
        switch (_this._map.enemyAttackSpeed) {
            case 1:
                _this._attackBorder = 22;
                break;
            case 2:
                _this._attackBorder = 15;
                break;
            case 3:
                _this._attackBorder = 11;
                break;
        }
        _this._attackCounter = _this._attackBorder;
        _this._moveCounter = _this._moveBorder;
        _this.takeCells();
        return _this;
    }
    Enemy3.prototype.shot = function () {
        var newBullet = new Enemy3Bullet(this._map, this._map.getCell(this._cell.x, this._cell.y + 1));
        var newBullet2 = new Enemy3Bullet(this._map, this._map.getCell(this._cell.x + 1, this._cell.y + 1));
        this._map.addBullet(newBullet);
        this._map.addBullet(newBullet2);
    };
    return Enemy3;
}(ShootingEnemy));
var Enemy4 = /** @class */ (function (_super) {
    __extends(Enemy4, _super);
    function Enemy4(map, startCell) {
        var _this = _super.call(this, map, startCell) || this;
        _this._height = 1;
        _this._width = 1;
        _this._maxHitPoints = 1;
        _this._hitPoints = 1;
        _this._reward = 15;
        _this._htmlObject = document.createElement("div");
        _this._htmlObject.classList.add("entity");
        _this._htmlObject.classList.add("enemy4");
        _this._htmlObject.classList.add("width-one");
        _this._htmlObject.classList.add("height-one");
        _this._map.htmlObject.append(_this._htmlObject);
        _this.redraw();
        switch (_this._map.enemyMoveSpeed) {
            case 1:
                _this._moveBorder = 12;
                break;
            case 2:
                _this._moveBorder = 8;
                break;
            case 3:
                _this._moveBorder = 4;
                break;
        }
        switch (_this._map.enemyAttackSpeed) {
            case 1:
                _this._attackBorder = 18;
                break;
            case 2:
                _this._attackBorder = 13;
                break;
            case 3:
                _this._attackBorder = 10;
                break;
        }
        _this._attackCounter = _this._attackBorder;
        _this._moveCounter = _this._moveBorder;
        _this.takeCells();
        return _this;
    }
    Enemy4.prototype.shot = function () {
        var newBullet = new Enemy4Bullet(this._map, this._map.getCell(this._cell.x, this._cell.y + 1));
        this._map.addBullet(newBullet);
    };
    return Enemy4;
}(ShootingEnemy));
// abstract class KamikazeEnemy extends Enemy {
//     public chooseAction(stage: number): void {
//? в реализации отказано
//     }
// }
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
            if (this._moveCounter >= this._moveBorder) {
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
var RayBullet = /** @class */ (function (_super) {
    __extends(RayBullet, _super);
    function RayBullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._explosionCounter = 0;
        return _this;
    }
    RayBullet.prototype.chooseAction = function (stage) {
        if (stage === 1) {
            return;
        }
        this._explosionCounter++;
        if (this._explosionCounter >= this._explosionBorder) {
            this.isHitTarget();
            this.die();
        }
    };
    RayBullet.prototype.isHitTarget = function () {
        for (var i = this._cell.y; i < this._map.height; i++) {
            for (var j = 0; j < this._width; j++) {
                if (this._map.getCell(this._cell.x + j, i).isContainsHero()) {
                    this._map.player.getDamage(this.damageValue);
                    return;
                }
            }
        }
    };
    return RayBullet;
}(Bullet));
var Enemy2Bullet = /** @class */ (function (_super) {
    __extends(Enemy2Bullet, _super);
    function Enemy2Bullet(map, cell) {
        var _this = _super.call(this, map, cell) || this;
        _this._width = 2;
        _this._explosionBorder = 10;
        _this.damageValue = 2;
        _this._htmlObject = document.createElement("div");
        _this._htmlObject.classList.add("entity");
        _this._htmlObject.classList.add("bullet-enemy2");
        _this._htmlObject.classList.add("width-two");
        _this._htmlObject.classList.add("shot-ray");
        _this._height = _this._map.height - _this._cell.y;
        _this._htmlObject.style.height = String(_this._height * _this._map.cellSize) + "px";
        _this._map.htmlObject.append(_this._htmlObject);
        _this.redraw();
        _this.takeCells();
        return _this;
    }
    return Enemy2Bullet;
}(RayBullet));
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
        _this._moveBorder = 3;
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
var Enemy4Bullet = /** @class */ (function (_super) {
    __extends(Enemy4Bullet, _super);
    function Enemy4Bullet(map, startCell) {
        var _this = _super.call(this, map, startCell) || this;
        _this._width = 1;
        _this._height = 1;
        _this._moveBorder = 2;
        _this.damageValue = 1;
        _this._htmlObject = document.createElement("div");
        _this._htmlObject.classList.add("entity");
        _this._htmlObject.classList.add("bullet-enemy4");
        _this._htmlObject.classList.add("width-one");
        _this._htmlObject.classList.add("height-one");
        _this._map.htmlObject.append(_this._htmlObject);
        _this.redraw();
        _this.takeCells();
        _this._directionX = 0;
        _this._directionY = 1;
        return _this;
    }
    return Enemy4Bullet;
}(EnemyMovingBullet));
var Enemy3Bullet = /** @class */ (function (_super) {
    __extends(Enemy3Bullet, _super);
    function Enemy3Bullet(map, startCell) {
        var _this = _super.call(this, map, startCell) || this;
        _this._width = 1;
        _this._height = 1;
        _this._moveBorder = 1;
        _this.damageValue = 1;
        _this._htmlObject = document.createElement("div");
        _this._htmlObject.classList.add("entity");
        _this._htmlObject.classList.add("bullet-enemy3");
        _this._htmlObject.classList.add("width-one");
        _this._htmlObject.classList.add("height-one");
        _this._map.htmlObject.append(_this._htmlObject);
        _this.redraw();
        _this.takeCells();
        _this._directionX = 0;
        _this._directionY = 1;
        return _this;
    }
    return Enemy3Bullet;
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
var Bonus = /** @class */ (function (_super) {
    __extends(Bonus, _super);
    function Bonus() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._dyingCounter = 0;
        return _this;
    }
    Bonus.prototype.chooseAction = function (stage) {
        if (stage === 1) {
            this._dyingCounter++;
            if (this._dyingCounter >= this._dyingBorder) {
                this.die();
            }
        }
    };
    Bonus.prototype.die = function () {
        this._htmlObject.parentElement.removeChild(this._htmlObject);
        for (var i = 0; i < this._width; ++i) {
            for (var j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }
        this._map.deleteEntity(this);
    };
    return Bonus;
}(Entity));
// class HealthBonus extends Bonus{
//! здесь закончили
// }
