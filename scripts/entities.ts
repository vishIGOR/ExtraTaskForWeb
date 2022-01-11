abstract class Entity {
    protected _height: number;
    protected _width: number;
    protected _cell: Cell;

    public abstract chooseAction(): void;
}

interface IMovable {
    move(x: number, y: number): void;
}

abstract class Spaceship extends Entity implements IMovable {
    protected _hitPoints: number;
    protected _damage: number;

    public abstract move(x: number, y: number): void;
    
    public damageIt(value:number):void{
        this._hitPoints-=value;
    }
}

class Hero extends Spaceship {
    _height = 2;
    _width = 1;
    public chooseAction(): void {

    }
    public move(x: number, y: number): void {

    }
}

abstract class Enemy extends Spaceship {
}

abstract class Bullet extends Entity {
    protected damageValue: number;
}