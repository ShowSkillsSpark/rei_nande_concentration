import { Application, Container, Graphics, Ticker } from "pixi.js";

interface PetalParam { app: Application, ticker: Ticker };
class Petal extends Container {
    private _app;
    private _petalTexture;

    private _theta;
    private _drift;
    private _speed;
    private _radius;
    private _spin;

    constructor({app, ticker}: PetalParam) {
        super();
        this._app = app;

        this.x = Math.random() * this.stageWidth;
        this.y = -this.stageHeight * 0.1 - Math.random() * this.stageHeight / 3;

        const petalWidth = Math.random() * 3 + 3;
        const petalHeight = petalWidth + 3;
        this._petalTexture = new Graphics().ellipse(0, 0, petalWidth, petalHeight).fill(0xFFFFFF);
        this._petalTexture.alpha = Math.random() * 0.1 + 0.8;

        this._theta = Math.random() * 100;
        this._drift = Math.random() + 1 - petalWidth / 12 + 0.5;
        this._speed = Math.random() * 3 + petalWidth / 12 + 0.5;
        this._radius = Math.random() * 5 + 5;
        this._spin = Math.random() * 0.05 + 0.05;

        this.addChild(this._petalTexture);

        // 꽃잎 흩날리기
        ticker.add(() => {
            const left = -this.stageWidth * 0.1;
            const right = this.stageWidth * 1.1;
            const top = -this.stageHeight * 0.1;
            const bottom = this.stageHeight;
            if (this.y > bottom * 1.1) this.y = top;
            if (this.y < bottom - this.height) {
                this.x += this._drift ;
                this.y += this._speed;
                this._theta += 0.1;
                this._petalTexture.rotation -= this._spin;
            }

            if (this.x > right) this.x = left;

            this._petalTexture.x = Math.cos(this._theta) * this._radius;
        });

        this.on('pointerenter', () => this.initPosition());
        this.eventMode = 'static';
    }

    initPosition() {
        this.x = Math.random() * this.stageWidth;
        this.y = -this.stageHeight * 0.1 - Math.random() * this.stageHeight / 3;
    }

    get stageWidth() { return this._app.canvas.width; }
    get stageHeight() { return this._app.canvas.height; }
}

interface HanabiraOverlayParam { app: Application };
export class HanabiraOverlay extends Container {
    private _ticker;
    private _maxPetalCount;

    private _petalList: Petal[] = [];

    constructor({app}: HanabiraOverlayParam) {
        super();
        this._ticker = new Ticker();
        this._maxPetalCount = 50;

        this._ticker.autoStart = false;

        // 꽃잎 생성
        for (let i = 0; i < this._maxPetalCount; i++) {
            const petal = new Petal({app: app, ticker: this._ticker});
            this._petalList.push(petal);
            this.addChild(petal);
        }
    }

    start() {
        this._petalList.forEach((petal: Petal) => {
            petal.initPosition();
        });
        this.visible = true;
        this._ticker.start();
    }
    stop() {
        this.visible = false;
        this._ticker.stop();
    }
}