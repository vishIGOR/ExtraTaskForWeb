var Cell = /** @class */ (function () {
    function Cell(x, y) {
        var _this = this;
        this._entities = Array(0);
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
    Cell.prototype.AddEntity = function (entity) {
        this._entities.push(entity);
        console.log(this.getCoordinates());
    };
    Cell.prototype.DeleteEntity = function (entity) {
        this._entities.splice(this._entities.indexOf(entity), 1);
    };
    Cell.prototype.IsContainsEnemy = function () {
        this._entities.forEach(function (entity) {
            if (entity instanceof Enemy) {
                return true;
            }
        });
        return false;
    };
    return Cell;
}());
