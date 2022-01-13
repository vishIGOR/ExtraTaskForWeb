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
    Entity.prototype.redraw = function () {
        this._htmlObject.style.left = String(this._cell.x * this._map.cellSize) + "px";
        this._htmlObject.style.top = String(this._cell.y * this._map.cellSize) + "px";
        // console.log(String(this._cell.x * this._map.cellSize) + "px", String(this._cell.y * this._map.cellSize) + "px");
    };
    return Entity;
}());
var Spaceship = /** @class */ (function (_super) {
    __extends(Spaceship, _super);
    function Spaceship() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
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
                this._map.getCell(this._cell.x + i, this._cell.y + j).DeleteEntity(this);
            }
        }
        this._cell = this._map.getCell(this._cell.x + x, this._cell.y + y);
        for (var i = 0; i < this._width; ++i) {
            for (var j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).AddEntity(this);
            }
        }
        this._htmlObject.style.left = String(this._cell.x * this._map.cellSize);
        this._htmlObject.style.top = String(this._cell.y * this._map.cellSize);
        this.redraw();
        //нужно ограничение столкновение - логика разная у разных классов
    };
    Spaceship.prototype.damageIt = function (value) {
        this._hitPoints -= value;
    };
    return Spaceship;
}(Entity));
var Hero = /** @class */ (function (_super) {
    __extends(Hero, _super);
    function Hero(map, startCell) {
        var _this = _super.call(this, map, startCell) || this;
        _this._height = 2;
        _this._width = 1;
        for (var i = 0; i < _this._width; ++i) {
            for (var j = 0; j < _this._height; ++j) {
                _this._map.getCell(_this._cell.x + i, _this._cell.y + j).AddEntity(_this);
            }
        }
        _this._maxHitPoints = 3;
        _this._hitPoints = 3;
        _this._htmlObject = document.createElement("div");
        _this._htmlObject.classList.add("entity");
        _this._htmlObject.classList.add("hero");
        _this._htmlObject.classList.add("width-one");
        _this._htmlObject.classList.add("height-two");
        _this._map.htmlObject.append(_this._htmlObject);
        _this.redraw();
        return _this;
    }
    Hero.prototype.chooseAction = function () {
    };
    // public move(x: number, y: number): void {
    //     this._cell.DeleteEntity(this);
    //     this._cell = this._map.getCell(this._cell.x, this._cell.y);
    //     //нужно ограничение на выход за поля  и столкновение
    //     this._cell.AddEntity(this);
    //     this._htmlObject.style.left = String(this._cell.x * this._map.cellSize);
    //     this._htmlObject.style.top = String(this._cell.y * this._map.cellSize);
    //     this.redraw();
    // }
    Hero.prototype.shot = function () {
    };
    return Hero;
}(Spaceship));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Enemy.prototype.move = function (x, y) {
        if (!this.isPossibleToMove(x, y)) {
            return;
        }
        if (this._map.getCell(this._cell.x + x, this._cell.y + y).IsContainsEnemy) {
            return;
        }
        _super.prototype.move.call(this, x, y);
    };
    return Enemy;
}(Spaceship));
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Bullet;
}(Entity));
