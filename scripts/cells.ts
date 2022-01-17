class Cell {
    private _x: number;
    private _y: number;
    private _entities: Entity[] = [];

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

    public get entities():Entity[]{
        return this._entities;
    }
    public getCoordinates = (): [number, number] => {
        return [this._x, this._y]
    }

    public addEntity(entity:Entity):void{
        this._entities.push(entity);
    }

    public deleteEntity(entity:Entity):void{
        this._entities.splice(this._entities.indexOf(entity),1);
    }

    public isContainsEnemy():boolean{
        let flag:boolean = false;
        this._entities.forEach(entity => {
            if(entity instanceof Enemy){
                flag = true;
            }
        });
        
        return flag;
    }

    public isContainsHero():boolean{
        let flag:boolean = false;
        this._entities.forEach(entity => {
            if(entity instanceof Hero){
                flag = true;
            }
        });
        
        return flag;
    }
}