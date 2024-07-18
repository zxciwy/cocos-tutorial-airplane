
import { _decorator, Component, Node, Collider, ITriggerEvent } from 'cc';
import { Constant } from '../framework/Constant';
import { GameManager } from '../framework/GameManager';
import { PoolManager } from '../framework/PoolManager';
const { ccclass, property } = _decorator;

@ccclass('Treasure')
export class Treasure extends Component {
    private _treasureSpeed = 0.2;
    private _treasureXSpeed = 0.2;
    private _gameManager: GameManager = null;

    onEnable () {
        const collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }

    onDisable () {
        const collider = this.getComponent(Collider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    update (deltaTime: number) {
        let pos = this.node.position;
        if (pos.x >= 15) {
            this._treasureXSpeed = this._treasureSpeed;
        } else if (pos.x <= -15) {
            this._treasureXSpeed = -this._treasureSpeed;
        }

        this.node.setPosition(pos.x + this._treasureXSpeed, pos.y, pos.z - this._treasureSpeed);
        pos = this.node.position;
        if(pos.z > 50){
            // this.node.destroy();
            PoolManager.instance().putNode(this.node);
        }
    }

    show(gameManager: GameManager, speed: number){
        this._gameManager = gameManager;
        this._treasureSpeed = speed;
    }

    // private _onTriggerEnter(event: ITriggerEvent){
    //     const name = event.selfCollider.node.name;
    //     if(name === 'bulletH'){
    //         this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_H);
    //     } else if (name === 'bulletS') {
    //         this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_S);
    //     } else {
    //         this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_M);
    //     }

    private _onTriggerEnter(event: ITriggerEvent){ // cece： 只需要selfPlane去计算变化就行。
        const name = event.selfCollider.node.name;
        if(name === 'itemsGold'){
            //this._gameManager.changeBulletType(Constant.TreasureType.ITEMS_GOLD);
            //cece: selfPlane去计算goldCount ++; 
            console.log('Gold +1!!! ');
        } else if (name === 'itemsArmor') {
            //this._gameManager.playAudioEffect('bullet1');
            console.log('Armor');
        } else if (name === 'itemsWeapon') {
            //this._gameManager.playAudioEffect('bullet2');
            console.log('Weapon');
        }else{
            //this._gameManager.playAudioEffect('button');// 
            console.log('Medkit');
        }

        PoolManager.instance().putNode(this.node);
    }
}