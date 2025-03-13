import { BlurFilter, Container, FillInput, Graphics } from "pixi.js";
import { Scene } from "./scene";

export interface PopupParam { x: number, y: number, width: number, height: number, style: FillInput, scene: Scene };
export class Popup extends Container {
    private _background;
    private _blurFilter;
    private _box;

    constructor ({x, y, width, height, style, scene}: PopupParam) {
        super({x, y, width, height});

        this._background = scene.scene;
        this._blurFilter = new BlurFilter();
        this._blurFilter.strength = 10;
        this.eventMode = 'static';

        this.open = false;
        this.zIndex = 100;

        this._box = new Graphics().roundRect(0, 0, width, height, Math.min(width, height) * 0.15).fill(style);

        this.addChild(this._box);
    }

    get boxWidth() { return this._box.width; }
    get boxHeight() { return this._box.height; }
    get left() { return this._box.x; }
    get horizontal_center() { return this._box.x + this._box.width / 2; }
    get right() { return this._box.x + this._box.width; }
    get top() { return this._box.y; }
    get vertical_center() { return this._box.y + this._box.height / 2; }
    get bottom() { return this._box.y + this._box.height; }

    set open(flag: boolean) {
        if (flag) {
            this._background.filters = [this._blurFilter];
            this._background.eventMode = 'none';
            this.visible = true;
        } else {
            this._background.filters = [];
            this._background.eventMode = 'passive';
            this.visible = false;
        }
    }
}