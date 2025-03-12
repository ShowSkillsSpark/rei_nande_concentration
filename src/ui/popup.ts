import { Container, Graphics, Renderer } from "pixi.js";
import { fitToParent } from "../util";

export class Popup extends Container {
    constructor (visible = false) {
        super();
        const box = new Graphics().roundRect(0, 0, 1000, 1000, 10).fill(0xFFFFFF);
        this.addChild(box);
        this.visible = visible;
    }

    get left () { return this.x; }
    get horizontal_center () { return this.x + this.width / 2; }
    get right () { return this.x + this.width; }
    get top () { return this.y; }
    get vertical_center () { return this.y + this.height / 2; }
    get bottom () { return this.y + this.height; }
}