class BattleMap {
    private _height: number;
    private _width: number;

    private _cells: Cell[][];
    private _entities: Entity[];
    constructor(height: number, width: number) {
        this._height = height;
        this._width = width;

        for (let i = 0; i < height; ++i) {
            for (let j = 0; j < height; ++j) {
                this._cells[i][j] = new Cell(i,j);
            }
        }
    }

    public getCells():Cell[][]{
        return this._cells;
    }

    public getCell(x:number,y:number):Cell{
        return this._cells[x][y];
    }
    
    public updateMap():void {
        this._entities.forEach(entity => {
            entity.chooseAction();
        });
    }

    public DeleteEntity(entity:Entity):void{
        this._entities.splice(this._entities.indexOf(entity),1);
    }
}