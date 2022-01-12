abstract class Entity {
    protected _height: number;
    protected _width: number;

    protected _cell: Cell;
    protected _map: BattleMap;

    protected _htmlObject: HTMLElement;


    constructor(map:BattleMap, startCell:Cell) {
        this._cell = startCell;
        this._map = map;
    }
    public abstract chooseAction(): void;

    protected redraw(){
        this._htmlObject.style.left = String(this._cell.x* this._map.cellSize)+"px";
        this._htmlObject.style.top = String(this._cell.y* this._map.cellSize)+"px";
        console.log(String(this._cell.x* this._map.cellSize)+"px", String(this._cell.y* this._map.cellSize)+"px");
    }
}

interface IMovable {
    move(x: number, y: number): void;
}

interface IShotable {
    shot(): void;
}

abstract class Spaceship extends Entity implements IMovable {
    protected _hitPoints: number;
    protected _maxHitPoints: number;
    protected _damage: number;

    public abstract move(x: number, y: number): void;

    public damageIt(value: number): void {
        this._hitPoints -= value;
    }
}

class Hero extends Spaceship implements IShotable {
    _height = 2;
    _width = 1;

    constructor(map:BattleMap, startCell:Cell) {
        super(map, startCell);

        this._maxHitPoints = 3;
        this._hitPoints = 3;

        this._htmlObject =document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("hero");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-two");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();
    }

    public chooseAction(): void {

    }

    public move(x: number, y: number): void {
        this._cell.DeleteEntity(this);
        this._cell = this._map.getCell(this._cell.x, this._cell.y);
        //нужно ограничение на выход за поля  и столкновение
        this._cell.AddEntity(this);

        this._htmlObject.style.left = String(this._cell.x * this._map.cellSize);
        this._htmlObject.style.top = String(this._cell.y * this._map.cellSize);

        this.redraw();
    }

    public shot(): void {

    }


}

abstract class Enemy extends Spaceship {
}

abstract class Bullet extends Entity {
    protected damageValue: number;
}