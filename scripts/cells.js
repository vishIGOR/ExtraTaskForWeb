var Cell = /** @class */ (function () {
    function Cell(x, y) {
        var _this = this;
        this._entities = [];
        this.getCoordinates = function () {
            return [_this._x, _this._y];
        };
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Cell.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "y", {
        get: function () {
            return this._y;
        },
        enumerable: false,
        configurable: true
    });
    Cell.prototype.addEntity = function (entity) {
        this._entities.push(entity);
    };
    Cell.prototype.deleteEntity = function (entity) {
        this._entities.splice(this._entities.indexOf(entity), 1);
    };
    Cell.prototype.IsContainsEnemy = function () {
        var flag = false;
        this._entities.forEach(function (entity) {
            if (entity instanceof Enemy) {
                flag = true;
            }
        });
        return flag;
    };
    return Cell;
}());
