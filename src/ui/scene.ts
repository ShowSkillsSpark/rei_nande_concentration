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
    get left () { return this.sceneX; }
    get horizontal_center () { return this.sceneX + this.sceneWidth / 2; }
    get right () { return this.sceneX + this.sceneWidth; }
    get top () { return this.sceneY; }
    get vertical_center () { return this.sceneY + this.sceneHeight / 2; }
    get bottom () { return this.sceneY + this.sceneHeight; }

    onNavigated() {}
}