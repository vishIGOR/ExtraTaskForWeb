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
    public abstract chooseAction(stage: number): void;

    public takeCells(): void {
        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).addEntity(this);
            }
        }
    }

    public leaveCells(): void {
        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }
    }

    protected redraw() {
        this._htmlObject.style.left = String(this._cell.x * this._map.cellSize) + "px";
        this._htmlObject.style.top = String(this._cell.y * this._map.cellSize) + "px";

    }

    public abstract die(): void;

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
    protected _explosionType: string;

    public get hitPoints(): number {
        return this._hitPoints;
    }

    public isPossibleToMove(x: number, y: number): boolean {

        if ((this._width + this._cell.x + x > this._map.width) || (this._cell.x + x < 0))
            return false;

        if ((this._height + this._cell.y + y > this._map.height) || (this._cell.y + y < 0))
            return false;

        return true;
    }

    public move(x: number, y: number): void {
        if (!this.isPossibleToMove(x, y)) {
            return;
        }

        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }

        this._cell = this._map.getCell(this._cell.x + x, this._cell.y + y);

        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).addEntity(this);
            }
        }

        this._htmlObject.style.left = String(this._cell.x * this._map.cellSize);
        this._htmlObject.style.top = String(this._cell.y * this._map.cellSize);

        this.redraw();
    }

    public getDamage(value: number): void {
        this._hitPoints -= value;
        if (this.hitPoints <= 0) {
            this.die();
        }
    }

}

class Hero extends Spaceship implements IShotable {
    _height = 2;
    _width = 1;
    _explosionType = "3";

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);



        this._maxHitPoints = this._map.numberOfLives;
        this._hitPoints = this._maxHitPoints;

        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("hero");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-two");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();

        this.takeCells();
    }

    public getDamage(value: number): void {
        super.getDamage(value);
        this._map.redrawHitPoints();
    }

    public chooseAction(): void {

    }

    // public move(x: number, y: number): void {
    //     this._cell.deleteEntity(this);
    //     this._cell = this._map.getCell(this._cell.x, this._cell.y);
    //     //нужно ограничение на выход за поля  и столкновение
    //     this._cell.addEntity(this);

    //     this._htmlObject.style.left = String(this._cell.x * this._map.cellSize);
    //     this._htmlObject.style.top = String(this._cell.y * this._map.cellSize);

    //     this.redraw();
    // }

    public shot(): void {
        let newBullet: HeroBullet = new HeroBullet(this._map, this._map.getCell(this._cell.x, this._cell.y - 1));
        this._map.addBullet(newBullet);
    }

    die(): void {

    }
}

abstract class Enemy extends Spaceship {
    _moveCounter: number = 0;
    _moveBorder: number;
    _reward: number;



    public isPossibleToMove(x: number, y: number): boolean {
        if (super.isPossibleToMove(x, y) === false) {
            return false;

        }

        this.leaveCells();
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                if (this._map.getCell(this._cell.x + i + x, this._cell.y + j + y).isContainsEnemy()) {
                    this.takeCells();
                    return false;
                }
            }
        }

        this.takeCells();
        return true;
    }

    public die(): void {
        this._htmlObject.parentElement.removeChild(this._htmlObject);
        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }
        this._map.increaseScore(this._reward);
        this._map.deleteEntity(this);
        let explosion:Explosion = new Explosion(this._map,this._cell,this._explosionType);
    }
}

abstract class ShootingEnemy extends Enemy implements IShotable {
    _attackCounter: number = 0;
    _attackBorder: number;
    _explosionType = "1";


    public chooseAction(stage: number): void {
        if (stage === 1) {
            this._moveCounter++;
            if (this._moveCounter === this._moveBorder) {
                this._moveCounter = 0;

                let possibleCells: Cell[] = [];
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if ((i + j) % 2 === 0) {
                            continue;
                        }
                        if (this.isPossibleToMove(i, j)) {
                            possibleCells.push(this._map.getCell(this._cell.x + i, this._cell.y + j));
                        }
                    }
                }
                if (possibleCells.length !== 0) {
                    let randomCell: Cell = possibleCells[getRandomInt(0, possibleCells.length)];
                    this.move(randomCell.x - this._cell.x, randomCell.y - this._cell.y);
                }
            }
            return;
        }

        //stage === 2
        this._attackCounter++;
        if (this._attackCounter === this._attackBorder) {
            this._attackCounter = 0;
            this.shot();
        }

    }
    shot(): void {
        let newBullet: Enemy1Bullet = new Enemy1Bullet(this._map, this._map.getCell(this._cell.x, this._cell.y + 2));
        this._map.addBullet(newBullet);
    }
}

class Enemy1 extends ShootingEnemy {
    _height = 2;
    _width = 1;
    _maxHitPoints = 1;
    _hitPoints = 1;
    _reward = 10;

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);
        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("enemy1");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-two");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();

        switch (this._map.enemyMoveSpeed) {
            case 1:
                this._moveBorder = 20;
                break;
            case 2:
                this._moveBorder = 14;
                break;
            case 3:
                this._moveBorder = 8;
                break;
        }

        switch (this._map.enemyAttackSpeed) {
            case 1:
                this._attackBorder = 26;
                break;
            case 2:
                this._attackBorder = 18;
                break;
            case 3:
                this._attackBorder = 12;
                break;

        }
        this.takeCells();
    }
}

abstract class KamikazeEnemy extends Enemy {
    public chooseAction(stage: number): void {

    }
}

abstract class Bullet extends Entity {
    protected damageValue: number;
    protected abstract isHitTarget(): void;
    public die(): void {
        this._htmlObject.parentElement.removeChild(this._htmlObject);
        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }
        this._map.deleteEntity(this);
    }
}

abstract class MovingBullet extends Bullet implements IMovable {
    protected _directionX: number;
    protected _directionY: number;

    protected _moveCounter: number = 0;
    protected _moveBorder: number;



    public isPossibleToMove(x: number, y: number): boolean {

        if ((this._width + this._cell.x + x > this._map.width) || (this._cell.x + x < 0))
            return false;

        if ((this._height + this._cell.y + y > this._map.height) || (this._cell.y + y < 0))
            return false;

        return true;
    }
    public move(x: number, y: number): void {
        if (!this.isPossibleToMove(x, y)) {
            return;
        }

        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }

        this._cell = this._map.getCell(this._cell.x + x, this._cell.y + y);

        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).addEntity(this);
            }
        }

        this._htmlObject.style.left = String(this._cell.x * this._map.cellSize);
        this._htmlObject.style.top = String(this._cell.y * this._map.cellSize);

        this.redraw();
    }

    public chooseAction(stage: number): void {
        if (stage === 1) {
            this._moveCounter++;
            if (this._moveCounter === this._moveBorder) {
                this._moveCounter = 0;
                if (this.isPossibleToMove(this._directionX, this._directionY)) {
                    this.move(this._directionX, this._directionY);
                }
                else {
                    this.die();
                }
            }

            return;
        }

        this.isHitTarget();

    }
}

//! остановились здесь
// abstract class RayBullet extends Bullet{
//     protected _explosionCounter:number = 0;
//     protected _explosionBorder:number;

//     public die(): void {
        
//     }
//     public chooseAction(stage: number): void {
//         if(stage === 1){

//             return;
//         }
//         this._explosionCounter++;
//         if(this._explosionCounter === this._explosionBorder){
//             this.die();
//         }
//         this.isHitTarget();
//     }
// }

class HeroBullet extends MovingBullet {
    _width = 1;
    _height = 1;
    _moveBorder = 1;
    damageValue = 1;
    isHitTarget(): void {
        if (this._cell.isContainsEnemy()) {
            this._cell.entities.forEach(entity => {
                if (entity instanceof Enemy) {
                    entity.getDamage(this.damageValue);
                }
            });
            this.die();
        }
    }

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);


        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("bullet-hero");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-one");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();
        this.takeCells();

        this._directionX = 0;
        this._directionY = -1;
    }
}

abstract class EnemyMovingBullet extends MovingBullet {
    isHitTarget(): void {
        if (this._cell.isContainsHero()) {
            this._map.player.getDamage(this.damageValue);
            this.die();
        }
    }
}

class Enemy1Bullet extends EnemyMovingBullet{
    _width = 1;
    _height = 1;
    _moveBorder = 1;
    damageValue = 1;

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);


        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("bullet-enemy1");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-one");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();
        this.takeCells();

        this._directionX = 0;
        this._directionY = 1;
    }
}



class Explosion {
    _htmlObject: HTMLElement;
    constructor(map: BattleMap, cell: Cell, type: string) {
        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-one");
        this._htmlObject.classList.add("explosion-" + type);

        map.htmlObject.append(this._htmlObject);

        this._htmlObject.style.left = String(cell.x * map.cellSize) + "px";
        this._htmlObject.style.top = String(cell.y * map.cellSize) + "px";

        setTimeout(() => {
            this._htmlObject.parentElement.removeChild(this._htmlObject);
        }, 200)
    }
}