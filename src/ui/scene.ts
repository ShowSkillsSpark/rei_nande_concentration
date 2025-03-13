import { Container, Renderer, Sprite } from "pixi.js";
import { fitToParent } from "../util";
import { Navigator } from "./navigator";

export interface SceneParam { navigator: Navigator, sceneName: string };
export class Scene extends Container {
    constructor ({ navigator, sceneName }: SceneParam) {
        super();
        this.addChild(new Sprite({x: this.sceneX, y: this.sceneY, width: this.sceneWidth, height: this.sceneHeight})); // 16:9
        navigator.addScene(sceneName, this);
    }

    _onRender = (renderer: Renderer) => { // responsive UI
        const canvas = renderer.canvas;
        fitToParent(this, canvas.width, canvas.height);
        this.x = (canvas.width - this.width) / 2;
        this.y = (canvas.height - this.height) / 2;
    }

    get sceneX () { return 0; }
    get sceneY () { return 0; }
    get sceneWidth () { return 1600; }
    get sceneHeight () { return 900; }
    get left () { return this.x; }
    get horizontal_center () { return this.x + this.width / 2; }
    get right () { return this.x + this.width; }
    get top () { return this.y; }
    get vertical_center () { return this.y + this.height / 2; }
    get bottom () { return this.y + this.height; }
}