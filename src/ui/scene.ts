import { Container, Renderer, Sprite } from "pixi.js";
import { fitToParent } from "../util";

export class Scene extends Container {
    constructor () {
        super();
        this.addChild(new Sprite({x: 0, y: 0, width: 1200, height: 900})); // 4:3
    }

    _onRender = (renderer: Renderer) => { // responsive UI
        const canvas = renderer.canvas;
        fitToParent(this, canvas.width, canvas.height);
        this.x = (canvas.width - this.width) / 2;
        this.y = (canvas.height - this.height) / 2;
    }

    get left () { return this.x; }
    get horizontal_center () { return this.x + this.width / 2; }
    get right () { return this.x + this.width; }
    get top () { return this.y; }
    get vertical_center () { return this.y + this.height / 2; }
    get bottom () { return this.y + this.height; }
}