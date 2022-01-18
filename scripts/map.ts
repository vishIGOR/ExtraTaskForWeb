class BattleMap {
    private _isGameOn:boolean;
    private _htmlObject: HTMLElement;

    private _height: number;
    private _width: number;

    private _cellSize: number;

    private _cells: Cell[][];
    private _entities: Entity[] = [];
    private _enemies: Enemy[] = [];
    private _bullets: Bullet[] = [];
    private _bonuses:Bonus[] = [];

    private _enemyMoveSpeed: string;
    private _enemyAttackSpeed: string;
    private _enemySpawnSpeed: string;
    private _numberOfLives: string;

    private _enemySpawnCounter = 0;
    private _enemySpawnBorder;

    private _points: number = 0;

    public player: Hero;

    private _movingAccess:boolean = true;
    private _attackAccess:boolean = true;

    private _movingBlockDuration:number = 200;
    private _attackBlockDuration:number = 300;

    private blockMovingAccess() {
        this._movingAccess = false;
    }
    
    private unblockMovingAccess() {
        setTimeout(() => {
            this._movingAccess = true;
        }, this._movingBlockDuration)
    }
    
    private blockAttackAccess() {
        this._attackAccess = false;
    }
    
    private unblockAttackAccess() {
        setTimeout(() => {
            this._attackAccess = true;
        }, this._attackBlockDuration)
    }


    constructor(sellSize: number) {
        this._htmlObject = document.getElementById("content");

        this._cellSize = sellSize;
        this._height = Math.floor(this.htmlObject.offsetHeight / this._cellSize);
        this._width = Math.floor(this.htmlObject.offsetWidth / this._cellSize);

        this._cells = new Array(this._width);
        for (let i = 0; i < this._width; ++i) {
            this._cells[i] = new Array(this._height);
            for (let j = 0; j < this._height; ++j) {
                this._cells[i][j] = new Cell(i, j);
            }
        }

        this.initPlayerControls();

        this._isGameOn = true;

        this._enemyMoveSpeed = localStorage.getItem("enemyMoveSpeed");
        this._enemyAttackSpeed = localStorage.getItem("enemyAttackSpeed");
        this._enemySpawnSpeed = localStorage.getItem("enemySpawnSpeed");
        this._numberOfLives = localStorage.getItem("numberOfLives");

        switch (this.enemySpawnSpeed) {
            case 1:
                this._enemySpawnBorder = 11;
                break;

            case 2:
                this._enemySpawnBorder = 8;
                break;

            case 3:
                this._enemySpawnBorder = 5;
                break;
        }
        this.player = new Hero(this, this._cells[0][this._height - 2]);

        this.redrawHitPoints();

        this.updateMap();
    }

    public get height(): number {
        return this._height;
    }

    public get width(): number {
        return this._width;
    }

    public get cellSize(): number {
        return this._cellSize;
    }

    public get htmlObject(): HTMLElement {
        return this._htmlObject;
    }

    public get enemyMoveSpeed(): number {
        return Number(this._enemyMoveSpeed);
    }

    public get enemyAttackSpeed(): number {
        return Number(this._enemyAttackSpeed);
    }

    public get enemySpawnSpeed(): number {
        return Number(this._enemySpawnSpeed);
    }

    public get numberOfLives(): number {
        return Number(this._numberOfLives);
    }

    public endGame(): void {
        //логика пересоздания и результатов
    }

    public redrawHitPoints(): void {
        document.getElementById("hitPoints").innerText = String(this.player.hitPoints);
    }

    public increaseScore(value: number): void {
        this._points += value;
        this.redrawScore();
    }

    public redrawScore(): void {
        document.getElementById("score").innerText = String(this._points);
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
            entity.chooseAction(1);
        });

        this._bullets.forEach(bullet => {
            bullet.chooseAction(2);
        });

        this._enemies.forEach(enemy => {
            enemy.chooseAction(2);
        });

        this._enemySpawnCounter++;
        if (this._enemySpawnCounter == this._enemySpawnBorder) {
            this._enemySpawnCounter = 0;

            let cellForEnemy: Cell = this.findCellToAddEnemy();
            if (cellForEnemy !== null) {
                this.addRandomEnemy(cellForEnemy);
            }
        }

        if(this._isGameOn){
            setTimeout(()=>{
                this.updateMap();
            },100);
        }
    }

    private findCellToAddEnemy(): Cell {
        let possibleCells: Cell[] = [];
        let cellsCounter: number;
        for (let i = 0; i < this._width - 1; i++) {
            cellsCounter = 0;
            for (let x = 0; x < 2; x++) {
                for (let y = 0; y < 2; y++) {
                    if (this.getCell(i + x, y).isContainsEnemy()) {

                        cellsCounter++;
                    }
                }
            }
            if (cellsCounter === 0) {
                possibleCells.push(this.getCell(i, 0));
            }
        }

        // console.log("//", possibleCells);
        if (possibleCells.length === 0) {
            return null;
        }

        return possibleCells[getRandomInt(0, possibleCells.length)];
    }

    private addRandomEnemy(startCell: Cell): void {
        let newEnemy: Enemy;

        let randomInt = getRandomInt(0, 4);
        if (randomInt === 0) {
            newEnemy = new Enemy1(this, startCell);
            this._enemies.push(newEnemy);
            this._entities.push(newEnemy);
            return;
        }

        if (randomInt === 1) {
            newEnemy = new Enemy2(this, startCell);
            this._enemies.push(newEnemy);
            this._entities.push(newEnemy);
            return;
        }

        if (randomInt === 2) {
            newEnemy = new Enemy3(this, startCell);
            this._enemies.push(newEnemy);
            this._entities.push(newEnemy);
            return;
        }

        newEnemy = new Enemy4(this, startCell);
        this._enemies.push(newEnemy);
        this._entities.push(newEnemy);
    }

    public deleteEntity(entity: Entity): void {
        this._entities.splice(this._entities.indexOf(entity), 1);

        if (entity instanceof Enemy) {
            this._enemies.splice(this._enemies.indexOf(entity), 1);
            return;
        }

        if (entity instanceof Bullet) {
            this._bullets.splice(this._bullets.indexOf(entity), 1);
            return;
        }

        if (entity instanceof Bonus) {
            this._bonuses.splice(this._bonuses.indexOf(entity), 1);
            return;
        }

    }

    public addBullet(bullet: Bullet): void {
        this._entities.push(bullet);
        this._bullets.push(bullet);
    }

    private initPlayerControls() {
        document.getElementById("arrow_top").onclick = function () {
            if (battleMap._movingAccess) {
                battleMap.blockMovingAccess();
                battleMap.player.move(0, -1);
                battleMap.unblockMovingAccess();
            }
        };
        document.getElementById("arrow_right").onclick = function () {
            if (battleMap._movingAccess) {
                battleMap.blockMovingAccess();
                battleMap.player.move(1, 0);
                battleMap.unblockMovingAccess();
            }
    
        };
    
        document.getElementById("arrow_down").onclick = function () {
            if (battleMap._movingAccess) {
                battleMap.blockMovingAccess();
                battleMap.player.move(0, 1);
                battleMap.unblockMovingAccess();
            }
        };
    
        document.getElementById("arrow_left").onclick = function () {
            if (battleMap._movingAccess) {
                battleMap.blockMovingAccess();
                battleMap.player.move(-1, 0);
                battleMap.unblockMovingAccess();
            }
        };
    
        document.getElementById("shoot").onclick = function () {
            if (battleMap._attackAccess) {
                battleMap.blockAttackAccess();
                battleMap.player.shot();
                battleMap.unblockAttackAccess();
            }
        };
    
        document.addEventListener('keydown', function (event) {
            if (event.code == 'ArrowUp') {
                if (battleMap._movingAccess) {
                    battleMap.blockMovingAccess();
                    battleMap.player.move(0, -1);
                    battleMap.unblockMovingAccess();
                }
                return;
            }
    
            if (event.code == 'ArrowRight') {
                if (battleMap._movingAccess) {
                    battleMap.blockMovingAccess();
                    battleMap.player.move(1, 0);
                    battleMap.unblockMovingAccess();
                }
                return;
            }
    
            if (event.code == 'ArrowDown') {
                if (battleMap._movingAccess) {
                    battleMap.blockMovingAccess();
                    battleMap.player.move(0, 1);
                    battleMap.unblockMovingAccess();
                }
                return;
            }
    
            if (event.code == 'ArrowLeft') {
                if (battleMap._movingAccess) {
                    battleMap.blockMovingAccess();
                    battleMap.player.move(-1, 0);
                    battleMap.unblockMovingAccess();
                }
                return;
            }
    
            if (event.code == 'Space') {
                if (battleMap._attackAccess) {
                    battleMap.blockAttackAccess();
                    battleMap.player.shot();
                    battleMap.unblockAttackAccess();
                }
                return;
            }
        })
    
    }
}
