abstract class Entity {
    protected _height: number;
    protected _width: number;

    protected _cell: Cell;
    protected _map: BattleMap;

    protected _htmlObject: HTMLElement;


    constructor(map: BattleMap, startCell: Cell) {
        this._cell = startCell;
        this._map = map;
    }
    public abstract chooseAction(): void;



    protected redraw() {
        this._htmlObject.style.left = String(this._cell.x * this._map.cellSize) + "px";
        this._htmlObject.style.top = String(this._cell.y * this._map.cellSize) + "px";
        // console.log(String(this._cell.x * this._map.cellSize) + "px", String(this._cell.y * this._map.cellSize) + "px");
    }

}

interface IMovable {
    move(x: number, y: number): void;
    isPossibleToMove(x: number, y: number): boolean;
}

interface IShotable {
    shot(): void;
}

abstract class Spaceship extends Entity implements IMovable {
    protected _hitPoints: number;
    protected _maxHitPoints: number;
    protected _damage: number;

    public isPossibleToMove(x: number, y: number): boolean {
        if ((this._width + this._cell.x + x > this._map.width) || (this._cell.x + x < 0))
            return false;

        if ((this._height + this._cell.y + y > this._map.height) || (this._cell.y + y < 0))
            return false;

        return true;
    }

    public move(x: number, y: number): void {
        if (!this.isPossibleToMove(x,y)) {
            return;
        }

        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).DeleteEntity(this);
            }
        }

        this._cell = this._map.getCell(this._cell.x + x, this._cell.y + y);

        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).AddEntity(this);
            }
        }

        this._htmlObject.style.left = String(this._cell.x * this._map.cellSize);
        this._htmlObject.style.top = String(this._cell.y * this._map.cellSize);

        this.redraw();
        //нужно ограничение столкновение - логика разная у разных классов
    }

    public damageIt(value: number): void {
        this._hitPoints -= value;
    }
}

class Hero extends Spaceship implements IShotable {
    _height = 2;
    _width = 1;

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);

        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).AddEntity(this);
            }
        }

        this._maxHitPoints = 3;
        this._hitPoints = 3;

        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("hero");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-two");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();
    }

    public chooseAction(): void {

    }

    // public move(x: number, y: number): void {
    //     this._cell.DeleteEntity(this);
    //     this._cell = this._map.getCell(this._cell.x, this._cell.y);
    //     //нужно ограничение на выход за поля  и столкновение
    //     this._cell.AddEntity(this);

    //     this._htmlObject.style.left = String(this._cell.x * this._map.cellSize);
    //     this._htmlObject.style.top = String(this._cell.y * this._map.cellSize);

    //     this.redraw();
    // }

    public shot(): void {

    }


}

abstract class Enemy extends Spaceship {

    
    constructor(map: BattleMap, startCell: Cell){
        super(map,startCell);

    }
    public move(x: number, y: number): void {
        if (!this.isPossibleToMove(x,y)) {
            return;
        }

        if (this._map.getCell(this._cell.x + x, this._cell.y + y).IsContainsEnemy) {
            return;
        }
        super.move(x, y);
    }
}

abstract class Bullet extends Entity {
    protected damageValue: number;
}