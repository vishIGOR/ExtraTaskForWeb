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

    protected takeCells(): void {
        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).addEntity(this);
            }
        }
    }

    protected leaveCells(): void {
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

    protected abstract die(): void;
    public endGame() {
        this.die();
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
        
        if(this.hitPoints<= 0){
            this._map.endGame();
        }

        document.getElementById("screenForDamagingHero").style.zIndex = "2000";
        document.getElementById("screenForDamagingHero").classList.add("heroIsDamaged");

        setTimeout(() => {
            document.getElementById("screenForDamagingHero").style.zIndex = "-2000";
            document.getElementById("screenForDamagingHero").classList.remove("heroIsDamaged");
        }, 300);

        
    }

    public chooseAction(): void {
        //все люди совершают ошибки архитектуры...

        //?каждый раз, когда эта функция вызывается, где-то плачет одна Барбара Лисков(
    }

    private checkCellsForBonuses(): void {
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                if (this._map.getCell(this._cell.x + i, this._cell.y + j).isContainsBonus()) {
                    this._map.getCell(this._cell.x + i, this._cell.y + j).useBonuses();
                }
            }
        }
    }

    private checkCellsForEnemies():void{
        let flag:boolean = false;
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                if (this._map.getCell(this._cell.x + i, this._cell.y + j).isContainsEnemy()) {
                    flag = true;
                    this._map.getCell(this._cell.x + i, this._cell.y + j).entities.forEach(entity =>{
                        if(entity instanceof Enemy){
                            entity.getDamage(666);
                        }
                    })
                }
            }
        }

        if(flag){
            this.getDamage(1);
        }
    }

    public move(x: number, y: number): void {
        super.move(x, y);
        this.checkCellsForBonuses();
        this.checkCellsForEnemies();
    }
    public shot(): void {
        let newBullet: HeroBullet = new HeroBullet(this._map, this._map.getCell(this._cell.x, this._cell.y - 1));
        this._map.addBullet(newBullet);
    }

    die(): void {
        this._map.endGame();
    }

    public beHealed(value: number) {
        this._hitPoints += value;
        this._maxHitPoints += value;
        this._map.redrawHitPoints();
    }
}

abstract class Enemy extends Spaceship {
    _moveCounter: number = 0;
    _moveBorder: number;
    _reward: number;
    _explosionType = String(getRandomInt(1, 4));



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

    protected die(): void {
        this._htmlObject.classList.add("dying");

        let dyingHtmlObject = this._htmlObject;
        setTimeout(() => {
            dyingHtmlObject.parentElement.removeChild(dyingHtmlObject);
        }, 300)

        // this._htmlObject.parentElement.removeChild(this._htmlObject);
        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }
        this._map.increaseScore(this._reward);
        this._map.deleteEntity(this);
        let explosion: Explosion = new Explosion(this._map, this._cell, this._explosionType);
    }

    public decreaseMoveSpeed(coef: number, duration: number) {
        this._moveBorder *= coef;

        setTimeout(() => {
            this._moveBorder /= coef;
        }, duration);
    }

    public increasePower():void {
        this._reward+=3;
        this._moveBorder--;
    }

    public getDamage(value: number): void {
        super.getDamage(value);

        if (this.hitPoints > 0) {
            this._htmlObject.classList.add("damagedEnemy");
            setTimeout(() => {
                this._htmlObject.classList.remove("damagedEnemy");
            }, 200)
        }
    }

    private checkCellsForEndOfMap():void{
        if(this._cell.y+this._height >=this._map.height){
            this._map.player.getDamage(666);
        }
    }

    private checkCellsForHero():void{
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                if (this._map.getCell(this._cell.x + i, this._cell.y + j).isContainsHero()) {
                    this._map.player.getDamage(1);
                    this.getDamage(666);
                }
            }
        }
    }
    public move(x: number, y: number): void {
        super.move(x,y);

        this.checkCellsForHero();
        this.checkCellsForEndOfMap();
    }
}

abstract class ShootingEnemy extends Enemy implements IShotable {
    _attackCounter: number = 0;
    _attackBorder: number;


    public chooseAction(stage: number): void {
        if (stage === 1) {
            this._moveCounter++;
            if (this._moveCounter >= this._moveBorder) {
                this._moveCounter = 0;

                let possibleCells: Cell[] = [];
                for (let i = -1; i < 2; i++) {
                    for (let j = 0; j < 2; j++) {
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
        if (this._attackCounter >= this._attackBorder && this.isPossibleToShot()) {
            this._attackCounter = 0;
            this.shot();
        }

    }

    public increasePower(): void {
        super.increasePower();
        this._attackBorder--;
    }

    public abstract shot(): void;
    protected isPossibleToShot(): boolean {
        if (this._cell.y + this._height >= this._map.height) {
            return false;
        }

        for (let i = this._cell.y + this._height; i < this._map.height; i++) {
            for (let j = 0; j < this._width; j++) {
                if (this._map.getCell(this._cell.x + j, i).isContainsEnemy()) {
                    return false;
                }
            }
        }
        return true;
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
                this._attackBorder = 20;
                break;
            case 3:
                this._attackBorder = 14;
                break;

        }
        this._attackCounter = this._attackBorder;
        this._moveCounter = this._moveBorder;
        this.takeCells();
    }

    shot(): void {
        let newBullet: Enemy1Bullet = new Enemy1Bullet(this._map, this._map.getCell(this._cell.x, this._cell.y + 2));
        this._map.addBullet(newBullet);
    }
}

class Enemy2 extends ShootingEnemy {
    _height = 2;
    _width = 2;
    _maxHitPoints = 3;
    _hitPoints = 3;
    _reward = 30;

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);
        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("enemy2");
        this._htmlObject.classList.add("width-two");
        this._htmlObject.classList.add("height-two");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();

        switch (this._map.enemyMoveSpeed) {
            case 1:
                this._moveBorder = 24;
                break;
            case 2:
                this._moveBorder = 18;
                break;
            case 3:
                this._moveBorder = 11;
                break;
        }

        switch (this._map.enemyAttackSpeed) {
            case 1:
                this._attackBorder = 32;
                break;
            case 2:
                this._attackBorder = 26;
                break;
            case 3:
                this._attackBorder = 18;
                break;

        }
        this._attackCounter = this._attackBorder;
        this._moveCounter = this._moveBorder;
        this.takeCells();
    }

    public shot(): void {
        let newBullet: Enemy2Bullet = new Enemy2Bullet(this._map, this._map.getCell(this._cell.x, this._cell.y + this._height));
        this._map.addBullet(newBullet);
    }
}

class Enemy3 extends ShootingEnemy {
    _height = 1;
    _width = 2;
    _maxHitPoints = 2;
    _hitPoints = 2;
    _reward = 45;

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);
        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("enemy3");
        this._htmlObject.classList.add("width-two");
        this._htmlObject.classList.add("height-one");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();

        switch (this._map.enemyMoveSpeed) {
            case 1:
                this._moveBorder = 16;
                break;
            case 2:
                this._moveBorder = 12;
                break;
            case 3:
                this._moveBorder = 7;
                break;
        }

        switch (this._map.enemyAttackSpeed) {
            case 1:
                this._attackBorder = 32;
                break;
            case 2:
                this._attackBorder = 25;
                break;
            case 3:
                this._attackBorder = 17;
                break;

        }
        this._attackCounter = this._attackBorder;
        this._moveCounter = this._moveBorder;
        this.takeCells();
    }

    shot(): void {
        let newBullet: Enemy3Bullet = new Enemy3Bullet(this._map, this._map.getCell(this._cell.x, this._cell.y + this._height));
        let newBullet2: Enemy3Bullet = new Enemy3Bullet(this._map, this._map.getCell(this._cell.x + 1, this._cell.y + this._height));
        this._map.addBullet(newBullet);
        this._map.addBullet(newBullet2);
    }
}

class Enemy4 extends ShootingEnemy {
    _height = 1;
    _width = 1;
    _maxHitPoints = 1;
    _hitPoints = 1;
    _reward = 15;

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);
        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("enemy4");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-one");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();

        switch (this._map.enemyMoveSpeed) {
            case 1:
                this._moveBorder = 12;
                break;
            case 2:
                this._moveBorder = 8;
                break;
            case 3:
                this._moveBorder = 4;
                break;
        }

        switch (this._map.enemyAttackSpeed) {
            case 1:
                this._attackBorder = 28;
                break;
            case 2:
                this._attackBorder = 23;
                break;
            case 3:
                this._attackBorder = 18;
                break;

        }
        this._attackCounter = this._attackBorder;
        this._moveCounter = this._moveBorder;
        this.takeCells();
    }

    shot(): void {
        let newBullet: Enemy3Bullet = new Enemy4Bullet(this._map, this._map.getCell(this._cell.x, this._cell.y + this._height));
        this._map.addBullet(newBullet);
    }
}

// abstract class KamikazeEnemy extends Enemy {
//     public chooseAction(stage: number): void {
//? я запрещаю вам реализовывать камикадзе
//?                              - Стетхэм
//! ладно, не буду
//     }
// }

abstract class Bullet extends Entity {
    protected damageValue: number;
    protected abstract isHitTarget(): void;
    protected die(): void {
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
            if (this._moveCounter >= this._moveBorder) {
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

abstract class RayBullet extends Bullet {
    protected _explosionCounter: number = 0;
    protected _explosionBorder: number;
    public chooseAction(stage: number): void {
        if (stage === 1) {

            return;
        }
        this._explosionCounter++;
        if (this._explosionCounter >= this._explosionBorder) {
            this.isHitTarget();
            this.die();
        }
    }

    protected isHitTarget(): void {
        for (let i = this._cell.y; i < this._map.height; i++) {
            for (let j = 0; j < this._width; j++) {
                if (this._map.getCell(this._cell.x + j, i).isContainsHero()) {
                    this._map.player.getDamage(this.damageValue);
                    return;
                }
            }

        }
    }
}


class Enemy2Bullet extends RayBullet {
    _width = 2;
    _explosionBorder = 10;
    damageValue = 2;

    constructor(map: BattleMap, cell: Cell) {
        super(map, cell);

        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("bullet-enemy2");
        this._htmlObject.classList.add("width-two");

        this._htmlObject.classList.add("shot-ray");
        this._height = this._map.height - this._cell.y;
        this._htmlObject.style.height = String(this._height * this._map.cellSize) + "px";

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();
        this.takeCells();
    }
}

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

class Enemy1Bullet extends EnemyMovingBullet {
    _width = 1;
    _height = 1;
    _moveBorder = 3;
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

class Enemy4Bullet extends EnemyMovingBullet {
    _width = 1;
    _height = 1;
    _moveBorder = 2;
    damageValue = 1;

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);


        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("bullet-enemy4");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-one");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();
        this.takeCells();

        this._directionX = 0;
        this._directionY = 1;
    }
}

class Enemy3Bullet extends EnemyMovingBullet {
    _width = 1;
    _height = 1;
    _moveBorder = 1;
    damageValue = 1;

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);


        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("bullet-enemy3");
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

abstract class Bonus extends Entity {
    protected _dyingCounter: number = 0;
    protected _dyingBorder: number;

    public abstract bePickedUp(): void;

    public chooseAction(stage: number): void {
        if (stage === 1) {
            this._dyingCounter++;
            if (this._dyingCounter >= this._dyingBorder) {
                this.die();
            }
        }
    }

    protected die(): void {
        this._htmlObject.parentElement.removeChild(this._htmlObject);

        for (let i = 0; i < this._width; ++i) {
            for (let j = 0; j < this._height; ++j) {
                this._map.getCell(this._cell.x + i, this._cell.y + j).deleteEntity(this);
            }
        }

        this._map.deleteEntity(this);
    }
}

class HealthBonus extends Bonus {
    _width = 1;
    _height = 1;

    private _healValue: number = 2;
    _dyingBorder = 75;
    public bePickedUp(): void {
        this._map.redrawBonus("heal",150);
        this._map.player.beHealed(this._healValue);
        this.die();
    }

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);

        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("bonus-heal");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-one");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();

        this.takeCells();
    }
}

class AttackSpeedBonus extends Bonus {
    _width = 1;
    _height = 1;

    private _newAttackSpeed: number = 150;
    private _duration: number = 5000;
    _dyingBorder = 70;
    public bePickedUp(): void {
        this._map.redrawBonus("Attack Speed Increased!",this._duration);
        this._map.increasePlayerAttackSpeed(this._newAttackSpeed, this._duration);
        this.die();
    }

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);

        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("bonus-heroAttackSpeed");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-one");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();

        this.takeCells();
    }
}

class MoveSpeedBonus extends Bonus {
    _width = 1;
    _height = 1;

    private _newMoveSpeed: number = 100;
    private _duration: number = 5000;
    _dyingBorder = 70;
    public bePickedUp(): void {
        this._map.redrawBonus("Move Speed Increased!",this._duration);
        this._map.increasePlayerAttackSpeed(this._newMoveSpeed, this._duration);
        this.die();
    }

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);

        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("bonus-heroMoveSpeed");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-one");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();

        this.takeCells();
    }
}

class enemyMoveSpeedDebuffBonus extends Bonus {
    _width = 1;
    _height = 1;

    private _debuffCoef: number = 2;
    private _duration: number = 5000;
    _dyingBorder = 70;
    public bePickedUp(): void {
        this._map.redrawBonus("Enemies are slowed down!",this._duration);
        this._map.decreaseEnemyMoveSpeed(this._debuffCoef, this._duration);
        this.die();
    }

    constructor(map: BattleMap, startCell: Cell) {
        super(map, startCell);

        this._htmlObject = document.createElement("div");
        this._htmlObject.classList.add("entity");
        this._htmlObject.classList.add("bonus-enemyMoveSpeedDebuff");
        this._htmlObject.classList.add("width-one");
        this._htmlObject.classList.add("height-one");

        this._map.htmlObject.append(this._htmlObject);
        this.redraw();

        this.takeCells();
    }
}