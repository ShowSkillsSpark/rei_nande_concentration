import { Application, Container } from "pixi.js";
import { Scene } from "./scene";

export class Navigator {
    private _app: Application;
    private _sceneMap: { [key: string]: Scene } = {};
    private _currentScene: Scene | null = null;
    private _overlayMap: {[key: string]: Container } = {};

    SCENE = {
        LOADING: 'loading',
        TITLE: 'title',
        GAME: 'game',
        CLEAR: 'clear',
    };
    OVERLAY = {
        HANABIRA: 'hanabira',
    }

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
            this._currentScene.onUnnavigated(this);
        }
        const nextScene = this._sceneMap[key]
        this._currentScene = nextScene;
        nextScene.visible = true;
        nextScene.onNavigated(this);
    }

    getScene(key: string) { return this._sceneMap[key]; }

    addOverlay(key: string, overlay: Container) {
        this._overlayMap[key] = overlay;
        overlay.visible = false;
        this._app.stage.addChild(overlay);
    }
    getOverlay(key: string) { return this._overlayMap[key]; }
}