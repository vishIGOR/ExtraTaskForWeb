class BattleMap {
    private _htmlObject:HTMLElement;

    private _height: number;
    private _width: number;

    private _cellSize:number;

    private _cells: Cell[][];
    private _entities: Entity[];

    private _enemyMoveSpeed: string;
    private _enemyAttackSpeed: string;
    private _enemySpawnSpeed: string;

    private _points: number;

    public player: Hero;

    

    

    constructor(sellSize:number) {
        this._htmlObject = document.getElementById("content");

        this._cellSize = sellSize;
        this._height = Math.floor(this.htmlObject.offsetHeight/this._cellSize);
        this._width =  Math.floor(this.htmlObject.offsetWidth/this._cellSize);

        this._cells = new Array(this._width);
        for (let i = 0; i < this._width; ++i) {
            this._cells[i] = new Array(this._height);
            for (let j = 0; j < this._height; ++j) {
                this._cells[i][j] = new Cell(i, j);
            }
        }
    }

    public get height():number{
        return this._height;
    }

    public get width():number{
        return this._width;
    }

    public get cellSize():number{
        return this._cellSize;
    }

    public get htmlObject():HTMLElement{
        return this._htmlObject;
    }

    public startGame(): void {
        this._enemyMoveSpeed = localStorage.getItem("enemyMoveSpeed");
        this._enemyAttackSpeed = localStorage.getItem("enemyAttackSpeed");
        this._enemySpawnSpeed = localStorage.getItem("enemySpawnSpeed");
        
        
        this.player = new Hero(this, this._cells[0][this._height-2]);
    }

    public endGame(): void {

    }

    // public setDifficultyLevel(enemyMS:number,enemyAS:number,enemySS:number){
    //     this.enemyMoveSpeed = enemyMS;
    //     this.enemyAttackSpeed = enemyAS;
    //     this.enemySpawnSpeed = enemySS;
    // }

    public getCells(): Cell[][] {
        return this._cells;
    }

    public getCell(x: number, y: number): Cell {
        return this._cells[x][y];
    }

    public updateMap(): void {
        this._entities.forEach(entity => {
            entity.chooseAction();
        });
    }

    public DeleteEntity(entity: Entity): void {
        this._entities.splice(this._entities.indexOf(entity), 1);
    }

}
