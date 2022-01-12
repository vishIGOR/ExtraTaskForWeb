class Cell {
    private _x: number;
    private _y: number;
    private _entities: Entity[];

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public get x():number{
        return this._x;
    }

    public get y():number{
        return this._y;
    }

    public getCoordinates = (): [number, number] => {
        return [this._x, this._y]
    }

    public AddEntity(entity:Entity):void{
        this._entities.push(entity);
    }

    public DeleteEntity(entity:Entity):void{
        this._entities.splice(this._entities.indexOf(entity),1);
    }

    public IsContainsEnemy():boolean{
        
        this._entities.forEach(entity => {
            if(entity instanceof Enemy){
                return true;
            }
        });
        
        return false;
    }
}