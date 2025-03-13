import { Application } from "pixi.js";
import { Scene } from "./scene";

export class Navigator {
    private _app: Application;
    private _sceneMap: { [key: string]: Scene } = {};
    private _currentScene: Scene | null = null;

    SCENE = {
        TITLE: 'title',
        GAME: 'game',
        CLEAR: 'clear',
    };

    constructor(app: Application) {
        this._app = app;
    }

    addScene(key: string, scene: Scene) {
        this._sceneMap[key] = scene;
        scene.visible = false;
        this._app.stage.addChild(scene);
    }

    navScene(key: string) {
        if (this._currentScene) {
            this._currentScene.visible = false;
        }
        const nextScene = this._sceneMap[key]
        nextScene.onNavigated();
        nextScene.visible = true;
        this._currentScene = nextScene;
    }

    getScene(key: string) { return this._sceneMap[key]; }
}