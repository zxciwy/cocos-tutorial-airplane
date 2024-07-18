
import { _decorator, Component, Node, Collider, ITriggerEvent, AudioSource } from 'cc';
import { Constant } from '../framework/Constant';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SelfPlane
 * DateTime = Mon Nov 15 2021 10:27:19 GMT+0800 (China Standard Time)
 * Author = mywayday
 * FileBasename = SelfPlane.ts
 * FileBasenameNoExtension = SelfPlane
 * URL = db://assets/script/SelfPlane.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */


@ccclass('SelfPlane')
export class SelfPlane extends Component {
    @property(Node)
    public explode: Node = null;
    @property(Node)
    public bloodFace: Node = null;
    @property(Node)
    public blood: Node = null;
    public lifeValue = 5;
    public isDie = false;
    public _selfBulletPower = Constant.BulletPropPower.LEVEL_1;//cece
    public _selfBulletType = Constant.BulletPropType.BULLET_M;//cece: 飞机需要记录之前已有的状态。
    public _goldCount = 0;

    private _isArmored = false;
    private _isEmpowered = false;

    private _currLife = 0;
    private _audioEffect: AudioSource = null;

    start() {
        this._audioEffect = this.getComponent(AudioSource);
    }


    onEnable() {
        const collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }

    onDisable() {
        const collider = this.getComponent(Collider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    public init() {
        this._currLife = this.lifeValue;
        this.isDie = false;
        this.explode.active = false;
        this.bloodFace.setScale(1, 1, 1);
    }

    private _onTriggerEnter(event: ITriggerEvent) {
        //ce：注释掉了下面四行。不然会报错，material为null。
        // // some trick to fix "trigger vs trigger problem" in physx
        // if(event.otherCollider.material.friction == 100){
        //     return;
        // }

        const collisionGroup = event.otherCollider.getGroup();
        if (collisionGroup === Constant.CollisionType.ENEMY_PLANE || collisionGroup === Constant.CollisionType.ENEMY_BULLET) {
            if (this._currLife === this.lifeValue) {
                this.blood.active = true;
            }
            this._currLife--;
            this.bloodFace.setScale(this._currLife / this.lifeValue, 1, 1);
            if (this._currLife <= 0) {
                this.isDie = true;
                this._audioEffect.play();
                this.explode.active = true;
                this.blood.active = false;
                console.log('self plane is die');
            }
        }
        else if (collisionGroup === Constant.CollisionType.BULLET_PROP) 
            { // cece:  upgrade the powerlevel of Bullet;
            console.log('BulletProp!')
            if (event.otherCollider.node.name === 'bulletM') {
                if (this._selfBulletType === Constant.BulletPropType.BULLET_M) {
                    this._selfBulletPower = (this._selfBulletPower < 3) ? this._selfBulletPower+1 : Constant.BulletPropPower.LEVEL_3;
                    // console.log('Congraduations!! level up!')
                }
                else {
                    this._selfBulletPower = Constant.BulletPropPower.LEVEL_1;
                }
                // console.log('Now your POWERUP M is ', this._selfBulletPower);
                this._selfBulletType = Constant.BulletPropType.BULLET_M;
            }
            else if (event.otherCollider.node.name === 'bulletS') {
                if (this._selfBulletType === Constant.BulletPropType.BULLET_S) {
                    this._selfBulletPower = (this._selfBulletPower < 3) ? this._selfBulletPower+1 : Constant.BulletPropPower.LEVEL_3;
                }
                else {
                    this._selfBulletPower = Constant.BulletPropPower.LEVEL_1;
                }
                // console.log('Now your POWERUP S is ', this._selfBulletPower);
                this._selfBulletType = Constant.BulletPropType.BULLET_S;
            }
            else if (event.otherCollider.node.name === 'bulletH') {
                if (this._selfBulletType === Constant.BulletPropType.BULLET_H) {
                    this._selfBulletPower = (this._selfBulletPower < 3) ? this._selfBulletPower+1 : Constant.BulletPropPower.LEVEL_3;
                }
                else {
                    this._selfBulletPower = Constant.BulletPropPower.LEVEL_1;
                }
                this._selfBulletType = Constant.BulletPropType.BULLET_H;
            }
            else
                console.warn('errer BulletType!');
        }
        else //Treasure
        {
            console.log('Treasure!!!');
            switch (event.otherCollider.node.name) {
                case 'itemsGold':
                    {
                        this._goldCount = this._goldCount+5;
                        this.node.emit('GoldCountChange',this._goldCount);
                        console.log('gold count:', this._goldCount);
                        break;
                    }
                case 'itemsArmor':
                    {
                        this._isArmored = true;
                        console.log('Armored!');// to be done;
                        break;
                    }
                case 'itmsWeapon':
                    {
                        this._isEmpowered = true;
                        console.log('Enpowered!');// to be done;
                        break;
                    }
                case 'itemsMedkit':
                    {
                        if( this._currLife < this.lifeValue)
                            {
                                this._currLife ++;
                                console.log('Life + 1, current life is:', this._currLife);
                            }
                        break;
                    }
                default:
                    console.log('not recorded!');
            }            
        }
    }

}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
